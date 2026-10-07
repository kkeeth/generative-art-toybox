// ═══════════════════════════════════════════════════════════════════
//  Ripple Cube
//  A slowly tumbling cube whose faces catch falling drops. Each drop
//  spreads as rings measured *along the surface* — distances that leave a
//  face are taken in the cube unfolded flat across the edge — so a ring
//  runs over an edge, and round a corner, without a break or a kink.
//
//  R … new rotation and palette   S … save PNG
// ═══════════════════════════════════════════════════════════════════

const CANVAS_SIZE = 1080;
const CUBE = 430; // edge length on screen

const MAX_DROPS = 24; // must match MAXD in the shader
const RING_SPEED = 0.17; // in cube edges per second
const RING_LIFE = 4.6; // seconds — keeps rings short of the far face
const RING_WIDTH = 0.011;
const RING_GAP = 0.055; // between the rings that follow the leading one

const PALETTES = [
  { bg: "#0D1624", face: "#14233A", ink: "#A6ECF7", edge: "#3E5C7E" },
  { bg: "#F3EEE4", face: "#FBF8F1", ink: "#2B5C8A", edge: "#B9AE9A" },
  { bg: "#141018", face: "#1E1824", ink: "#F2B8C6", edge: "#5A4660" },
  { bg: "#0F1A17", face: "#16261F", ink: "#C8F0A8", edge: "#3D5C4C" },
];

let rippleShader;
let pal;
let spin; // radians per second on x, y, z — two or three of them non-zero
let angle;
let drops = [];
let nextBurst = 0.4;

// ═══════════════════════════════════════════════════════════════════
//  Shader — the rings are computed per pixel on the cube's surface
// ═══════════════════════════════════════════════════════════════════

const VERT = `
precision highp float;
attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
varying vec3 vPos;     // cube-local, each axis in [-0.5, 0.5]
varying vec3 vNormal;  // cube-local face normal
varying float vFacing; // how squarely the face looks at the camera
void main() {
  vPos = aPosition;
  vNormal = aNormal;
  vFacing = abs(normalize(uNormalMatrix * aNormal).z);
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}
`;

const FRAG = `
precision highp float;
#define MAXD ${MAX_DROPS}
const float H = 0.5; // half an edge

uniform vec4 uDrops[MAXD]; // xyz: where it landed (cube-local), w: age in s, <0 = idle
uniform vec3 uFace;
uniform vec3 uInk;
uniform float uSpeed;
uniform float uLife;
uniform float uWidth;
uniform float uGap;

varying vec3 vPos;
varying vec3 vNormal;
varying float vFacing;

vec3 faceOf(vec3 c) {
  vec3 a = abs(c);
  if (a.x >= a.y && a.x >= a.z) return vec3(sign(c.x), 0.0, 0.0);
  if (a.y >= a.z) return vec3(0.0, sign(c.y), 0.0);
  return vec3(0.0, 0.0, sign(c.z));
}

// Fold a point lying in face nFrom's plane down into the plane of the
// neighbouring face nTo, hinged on their shared edge — one step of
// unfolding the cube flat.
vec3 unfold(vec3 c, vec3 nFrom, vec3 nTo) {
  return c + (H - dot(c, nTo)) * (nTo + nFrom);
}

// Distance from p (on face nF) to a drop c, travelling over the surface.
// Same face: straight across. Neighbouring face: straight across the
// unfolded pair, or the way round through either face that shares a corner
// with both — whichever is shorter. Every candidate agrees with its
// neighbour's along their shared edge, which is what keeps rings unbroken.
float surfaceDist(vec3 p, vec3 nF, vec3 c) {
  vec3 nD = faceOf(c);
  float d = dot(nF, nD);
  if (d > 0.5) return length(p - c);
  if (d < -0.5) return 1e3; // the far face is never reached within uLife
  vec3 g = cross(nD, nF);
  float best = length(p - unfold(c, nD, nF));
  best = min(best, length(p - unfold(unfold(c, nD, g), g, nF)));
  best = min(best, length(p - unfold(unfold(c, nD, -g), -g, nF)));
  return best;
}

void main() {
  vec3 nF = faceOf(vNormal);
  float v = 0.0;

  for (int i = 0; i < MAXD; i++) {
    vec4 drop = uDrops[i];
    float t = drop.w;
    if (t < 0.0 || t > uLife) continue;

    float g = surfaceDist(vPos, nF, drop.xyz);
    float fade = 1.0 - t / uLife;
    fade *= fade;
    float lead = uSpeed * t;

    // a leading ring and two that follow it, each a little fainter
    for (int k = 0; k < 3; k++) {
      float r = lead - float(k) * uGap;
      if (r <= 0.0) break;
      float x = (g - r) / uWidth;
      v += fade * exp(-x * x) * (1.0 - float(k) * 0.32);
    }

    // the moment of impact: a bright point that dies away fast
    float hit = clamp(1.0 - t / 0.35, 0.0, 1.0);
    float y = g / (uWidth * 1.8);
    v += hit * exp(-y * y);
  }

  vec3 base = uFace * (0.62 + 0.38 * vFacing);
  gl_FragColor = vec4(mix(base, uInk, clamp(v, 0.0, 1.0)), 1.0);
}
`;

// ═══════════════════════════════════════════════════════════════════
//  Setup / draw
// ═══════════════════════════════════════════════════════════════════

function setup() {
  createCanvas(CANVAS_SIZE, CANVAS_SIZE, WEBGL);
  rippleShader = createShader(VERT, FRAG);
  for (let i = 0; i < MAX_DROPS; i++) drops.push({ p: [0, 0, 0.5], age: -1 });
  reset();
}

function reset() {
  pal = random(PALETTES);
  angle = [random(TWO_PI), random(TWO_PI), random(TWO_PI)];

  // two or three axes, each turning slowly at its own rate and direction
  const axes = shuffle([0, 1, 2]);
  const n = random() < 0.5 ? 2 : 3;
  spin = [0, 0, 0];
  for (let i = 0; i < n; i++) {
    spin[axes[i]] = random(0.1, 0.28) * random([-1, 1]);
  }
}

function draw() {
  const dt = min(deltaTime / 1000, 0.05);
  for (let i = 0; i < 3; i++) angle[i] += spin[i] * dt;
  updateDrops(dt);

  background(pal.bg);
  rotateX(angle[0]);
  rotateY(angle[1]);
  rotateZ(angle[2]);
  scale(CUBE); // the shader works in a unit cube

  shader(rippleShader);
  rippleShader.setUniform("uDrops", packDrops());
  rippleShader.setUniform("uFace", hexToVec(pal.face));
  rippleShader.setUniform("uInk", hexToVec(pal.ink));
  rippleShader.setUniform("uSpeed", RING_SPEED);
  rippleShader.setUniform("uLife", RING_LIFE);
  rippleShader.setUniform("uWidth", RING_WIDTH);
  rippleShader.setUniform("uGap", RING_GAP);
  fill(255); // the edge pass below leaves noFill() set into the next frame
  noStroke();
  box(1);

  resetShader();
  noFill();
  stroke(pal.edge);
  strokeWeight(2);
  box(1.002);
}

// ═══════════════════════════════════════════════════════════════════
//  Drops
// ═══════════════════════════════════════════════════════════════════

function updateDrops(dt) {
  for (const d of drops) {
    if (d.age < 0) continue;
    d.age += dt;
    if (d.age > RING_LIFE) d.age = -1;
  }

  nextBurst -= dt;
  if (nextBurst <= 0) {
    const n = floor(random(2, 5)); // a few at a time
    for (let i = 0; i < n; i++) dropOne();
    nextBurst = random(0.7, 1.6);
  }
}

// Land a drop somewhere on a random face, reusing the slot of whichever
// drop is idle or oldest.
function dropOne() {
  const axis = floor(random(3));
  const p = [random(-0.45, 0.45), random(-0.45, 0.45), random(-0.45, 0.45)];
  p[axis] = 0.5 * random([-1, 1]);

  let slot = drops[0];
  for (const d of drops) {
    if (d.age < 0) {
      slot = d;
      break;
    }
    if (d.age > slot.age) slot = d;
  }
  slot.p = p;
  slot.age = random(0, 0.15); // so a burst doesn't land in lockstep
}

function packDrops() {
  const out = [];
  for (const d of drops) out.push(d.p[0], d.p[1], d.p[2], d.age);
  return out;
}

function hexToVec(hex) {
  const c = color(hex);
  return [red(c) / 255, green(c) / 255, blue(c) / 255];
}

// ═══════════════════════════════════════════════════════════════════
//  Interaction
// ═══════════════════════════════════════════════════════════════════

function keyPressed() {
  if (key === "r" || key === "R") reset();
  if (key === "s" || key === "S") saveCanvas("ripple-cube", "png");
}
