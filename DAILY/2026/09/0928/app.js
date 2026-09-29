// ═══════════════════════════════════════════════════════════════════
//  Generative Clown
//  Flat, symmetric clown masks assembled from swappable parts — the
//  cross-eyed gatekeeper lineage, laid out like a sheet of masks.
//  Mode 3 is a different animal: mask and mantle drawn as one piece.
//
//  1 / 2 / 3 … grid · single · Crown Clown
//  R … new seed      S … save PNG
// ═══════════════════════════════════════════════════════════════════

const CANVAS_SIZE = 1080;
const BOX = 392; // every mask is drawn inside this square
const BOX_Y = 30; // masks sit high in that box once a hat is on

let mode = 1;
let seed = 1;

// ── Palettes ───────────────────────────────────────────────────────
const PALETTES = [
  {
    name: "harlequin",
    bg: "#EFE7D8",
    face: "#FBF6EC",
    ink: "#1B1820",
    a: ["#D3303C", "#2E6C96", "#E8B23C", "#3E8C68", "#8C4A8E"],
  },
  {
    name: "gatekeeper",
    bg: "#16141A",
    face: "#ECE4D6",
    ink: "#16141A",
    a: ["#C22C36", "#7E8398", "#D9C88F", "#5B2330", "#3C6E80"],
  },
  {
    name: "sherbet",
    bg: "#F6EFE6",
    face: "#FFFCF6",
    ink: "#2A2430",
    a: ["#EE7C8C", "#6FC0C6", "#F4C55C", "#A58ACF", "#7FC08A"],
  },
  {
    name: "ashen",
    bg: "#E6E4DE",
    face: "#F7F6F2",
    ink: "#23242A",
    a: ["#7C8189", "#B4453E", "#4F5B6B", "#C9A96A", "#3E4A46"],
  },
  {
    name: "circus",
    bg: "#F2E3CE",
    face: "#FFF8EA",
    ink: "#241C18",
    a: ["#CE2B37", "#1F5FA8", "#F0A430", "#2C7E5A", "#111111"],
  },
];

// ── Trait pools ────────────────────────────────────────────────────
const FACES = ["circle", "egg", "oval", "shield", "gem"];
const EYES = [
  "cross",
  "cross",
  "plus",
  "star",
  "disc",
  "ring",
  "diamond",
  "crescent",
  "slit",
];
const NOSES = ["ball", "ball", "triangle", "diamond", "none"];
const MOUTHS = ["grin", "teeth", "o", "zigzag", "line", "tongue"];
const CHEEKS = ["circle", "diamond", "triangle", "none", "none"];
const HATS = ["cone", "jester", "tricorn", "brim", "none"];
const RUFFS = ["frill", "points", "none"];

// ═══════════════════════════════════════════════════════════════════
//  Setup / draw
// ═══════════════════════════════════════════════════════════════════

function setup() {
  createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  noLoop();
  seed = floor(random(1e6));
}

function draw() {
  randomSeed(seed);
  noiseSeed(seed);

  if (mode === 3) {
    drawCrownClown();
    return;
  }

  const grid = mode === 1 ? 3 : 1;
  const cell = width / grid;
  const base = random(PALETTES);
  background(base.bg);

  for (let gy = 0; gy < grid; gy++) {
    for (let gx = 0; gx < grid; gx++) {
      push();
      translate(cell * (gx + 0.5), cell * (gy + 0.5));
      scale((cell * 0.96) / BOX);
      translate(0, BOX_Y);
      drawClown(makeClown(base));
      pop();
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  Traits
// ═══════════════════════════════════════════════════════════════════

// Everything random is resolved here, so drawing stays a pure function
// of the trait set — that is what makes a mask reproducible from a seed.
function makeClown(pal) {
  const acc = () => random(pal.a);
  return {
    pal,
    face: random(FACES),
    faceCol: random() < 0.75 ? pal.face : acc(),
    eye: random(EYES),
    eyeGap: random(36, 46),
    eyeSize: random(16, 23),
    brow: random() < 0.45,
    tear: random() < 0.45,
    tearCol: acc(),
    nose: random(NOSES),
    noseCol: acc(),
    mouth: random(MOUTHS),
    mouthCol: acc(),
    cheek: random(CHEEKS),
    cheekCol: acc(),
    hat: random(HATS),
    hatCol: acc(),
    hatCol2: acc(),
    ruff: random(RUFFS),
    ruffCol: acc(),
    stripe: random() < 0.25 ? acc() : null,
  };
}

// ═══════════════════════════════════════════════════════════════════
//  One mask
// ═══════════════════════════════════════════════════════════════════

function drawClown(c) {
  const ink = c.pal.ink;
  strokeJoin(ROUND);
  strokeCap(ROUND);

  // back to front: ruff, hat, face, then everything painted on the face
  if (c.ruff !== "none") drawRuff(c, ink);
  if (c.hat !== "none") drawHat(c, ink);

  stroke(ink);
  strokeWeight(5);
  fill(c.faceCol);
  faceOutline(c.face);

  if (c.stripe) drawStripe(c, ink);
  if (c.cheek !== "none") mirrored(() => drawCheek(c, ink));
  mirrored(() => drawEyeGroup(c, ink));
  if (c.nose !== "none") drawNose(c, ink);
  drawMouth(c, ink);
}

// Draw once at +x, then again mirrored — keeps every mask symmetric.
function mirrored(fn) {
  for (const s of [1, -1]) {
    push();
    scale(s, 1);
    fn();
    pop();
  }
}

// ── Face ───────────────────────────────────────────────────────────

function faceOutline(kind) {
  switch (kind) {
    case "circle":
      ellipse(0, 0, 200, 206);
      break;
    case "egg":
      ellipse(0, 8, 186, 222);
      break;
    case "oval":
      ellipse(0, 0, 172, 218);
      break;
    case "shield": // rounded brow, tapered chin
      blob([
        [0, -106],
        [86, -70],
        [92, 10],
        [46, 92],
        [0, 112],
        [-46, 92],
        [-92, 10],
        [-86, -70],
      ]);
      break;
    case "gem": // faceted, wide cheekbones
      blob([
        [0, -104],
        [74, -74],
        [96, 4],
        [58, 84],
        [0, 108],
        [-58, 84],
        [-96, 4],
        [-74, -74],
      ]);
      break;
  }
}

function blob(pts) {
  beginShape();
  curveVertex(...pts[pts.length - 1]);
  for (const p of pts) curveVertex(...p);
  curveVertex(...pts[0]);
  curveVertex(...pts[1]);
  endShape(CLOSE);
}

function drawStripe(c, ink) {
  push();
  noStroke();
  fill(c.stripe);
  rectMode(CENTER);
  rect(0, 0, 22, 210);
  pop();
}

// ── Eyes ───────────────────────────────────────────────────────────

function drawEyeGroup(c, ink) {
  const x = c.eyeGap;
  const y = -22;
  const s = c.eyeSize;

  if (c.brow) {
    push();
    stroke(ink);
    strokeWeight(6);
    noFill();
    line(x - s * 0.8, y - s - 10, x + s * 0.9, y - s - 17);
    pop();
  }

  push();
  translate(x, y);
  stroke(ink);
  strokeWeight(6);
  noFill();
  drawEye(c.eye, s, ink);
  pop();

  if (c.tear) {
    push();
    noStroke();
    fill(c.tearCol);
    teardrop(x, y + s + 22, 11, 20);
    pop();
  }
}

function drawEye(kind, s, ink) {
  switch (kind) {
    case "cross":
      line(-s, -s, s, s);
      line(-s, s, s, -s);
      break;
    case "plus":
      line(-s, 0, s, 0);
      line(0, -s, 0, s);
      break;
    case "star":
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * PI + HALF_PI;
        line(-s * cos(a), -s * sin(a), s * cos(a), s * sin(a));
      }
      break;
    case "disc":
      fill(ink);
      circle(0, 0, s * 1.7);
      break;
    case "ring":
      circle(0, 0, s * 1.9);
      circle(0, 0, s * 0.7);
      break;
    case "diamond":
      fill(ink);
      quad(0, -s, s * 0.8, 0, 0, s, -s * 0.8, 0);
      break;
    case "crescent":
      arc(0, 0, s * 2, s * 2, PI, TWO_PI);
      break;
    case "slit":
      line(-s, 0, s, 0);
      break;
  }
}

function teardrop(x, y, w, h) {
  beginShape();
  vertex(x, y - h);
  bezierVertex(x + w, y - h * 0.1, x + w, y + h * 0.5, x, y + h * 0.6);
  bezierVertex(x - w, y + h * 0.5, x - w, y - h * 0.1, x, y - h);
  endShape(CLOSE);
}

// ── Cheeks, nose, mouth ────────────────────────────────────────────

function drawCheek(c, ink) {
  push();
  translate(66, 26);
  stroke(ink);
  strokeWeight(4);
  fill(c.cheekCol);
  if (c.cheek === "circle") circle(0, 0, 30);
  if (c.cheek === "diamond") quad(0, -18, 15, 0, 0, 18, -15, 0);
  if (c.cheek === "triangle") triangle(0, -17, 16, 14, -16, 14);
  pop();
}

function drawNose(c, ink) {
  push();
  stroke(ink);
  strokeWeight(5);
  fill(c.noseCol);
  if (c.nose === "ball") circle(0, 16, 40);
  if (c.nose === "triangle") triangle(0, -6, 20, 30, -20, 30);
  if (c.nose === "diamond") quad(0, -6, 18, 16, 0, 38, -18, 16);
  pop();
}

function drawMouth(c, ink) {
  push();
  translate(0, 66);
  stroke(ink);
  strokeWeight(5);

  switch (c.mouth) {
    case "grin":
      noFill();
      arc(0, -16, 110, 74, 0.15 * PI, 0.85 * PI);
      break;
    case "teeth":
      fill(c.mouthCol);
      arc(0, -16, 110, 74, 0.1 * PI, 0.9 * PI, CHORD);
      for (let x = -34; x <= 34; x += 17) line(x, 6, x, 20);
      break;
    case "o":
      fill(c.mouthCol);
      ellipse(0, 4, 42, 50);
      break;
    case "zigzag": {
      noFill();
      beginShape();
      for (let i = 0; i <= 8; i++) vertex(-48 + i * 12, i % 2 ? 12 : -6);
      endShape();
      break;
    }
    case "line":
      noFill();
      line(-46, 2, 46, 2);
      break;
    case "tongue":
      fill(c.mouthCol);
      arc(0, -16, 106, 78, 0.1 * PI, 0.9 * PI, CHORD);
      fill(c.pal.face);
      arc(0, 14, 44, 52, 0, PI, CHORD);
      break;
  }
  pop();
}

// ── Hat ────────────────────────────────────────────────────────────

function drawHat(c, ink) {
  push();
  stroke(ink);
  strokeWeight(5);
  strokeJoin(ROUND);

  switch (c.hat) {
    case "cone":
      fill(c.hatCol);
      triangle(-62, -92, 62, -92, 0, -186);
      fill(c.hatCol2);
      circle(0, -192, 30);
      break;

    case "jester":
      for (const [tipX, tipY, baseX] of [
        [-98, -152, -46],
        [0, -198, 0],
        [98, -152, 46],
      ]) {
        fill(c.hatCol);
        beginShape();
        vertex(baseX - 28, -80);
        bezierVertex(baseX - 34, -132, tipX - 16, tipY + 26, tipX, tipY);
        bezierVertex(tipX + 16, tipY + 26, baseX + 34, -132, baseX + 28, -80);
        endShape(CLOSE);
        fill(c.hatCol2);
        circle(tipX, tipY - 10, 26);
      }
      break;

    case "tricorn":
      fill(c.hatCol);
      blob([
        [0, -188],
        [72, -142],
        [124, -94],
        [60, -104],
        [0, -94],
        [-60, -104],
        [-124, -94],
        [-72, -142],
      ]);
      break;

    case "brim":
      fill(c.hatCol);
      rectMode(CENTER);
      rect(0, -140, 104, 78, 6);
      fill(c.hatCol2);
      rect(0, -98, 152, 20, 10);
      break;
  }
  pop();
}

// ── Ruff ───────────────────────────────────────────────────────────

function drawRuff(c, ink) {
  push();
  stroke(ink);
  strokeWeight(5);
  fill(c.ruffCol);

  if (c.ruff === "frill") {
    for (let i = 0; i <= 8; i++) {
      const a = lerp(PI * 0.12, PI * 0.88, i / 8);
      circle(cos(a) * 118, 82 + sin(a) * 42, 46);
    }
  } else {
    beginShape();
    vertex(-132, 74);
    for (let i = 0; i <= 8; i++) {
      const x = -132 + (264 / 8) * i;
      vertex(x, i % 2 ? 148 : 92);
    }
    vertex(132, 74);
    endShape(CLOSE);
  }
  pop();
}

// ═══════════════════════════════════════════════════════════════════
//  Crown Clown — a bell of cloth under a crown of blades
//  The whole figure is one teardrop: a narrow masked head ringed by torn
//  frills, swelling into a skirt that spreads out on the ground. Almost
//  all of the drawing is that silhouette; the face is a small part of it.
// ═══════════════════════════════════════════════════════════════════

const NECK_Y = -44;
const HEM_Y = 330;

// Half-width of the skirt down its height, 0 at the neck, 1 at the hem.
// The swell low down is what gives the figure its pear.
const CLOAK = [
  [0.0, 48],
  [0.08, 130],
  [0.2, 184],
  [0.38, 226],
  [0.58, 256],
  [0.78, 284],
  [0.92, 300],
  [1.0, 304],
];

function cloakHW(t) {
  t = constrain(t, 0, 1);
  for (let i = 1; i < CLOAK.length; i++) {
    if (t <= CLOAK[i][0]) {
      const [t0, w0] = CLOAK[i - 1];
      const [t1, w1] = CLOAK[i];
      return lerp(w0, w1, (t - t0) / (t1 - t0));
    }
  }
  return CLOAK[CLOAK.length - 1][1];
}

function cloakY(t) {
  return lerp(NECK_Y, HEM_Y, t);
}

function drawCrownClown() {
  const pal = random(PALETTES);
  const cloth = "#FBF8F2";
  const ink = pal.ink;
  const accent = random(pal.a);

  background(pal.bg);
  push();
  translate(width / 2, height / 2 + 62);
  scale(1.18);
  strokeJoin(ROUND);
  strokeCap(ROUND);

  drawCrownBlades(floor(random(5, 8)), cloth, ink);
  drawSkirt(cloth, ink);
  drawFolds(floor(random(6, 9)), ink);
  drawClaws(floor(random(4, 7)), cloth, ink);
  drawFrill(floor(random(12, 16)), cloth, ink);
  drawMask(cloth, ink, accent);
  drawScythe(random([1, -1]), cloth, ink);

  pop();
}

// The crown: thin blades fanning up out of the head, tallest at the centre.
function drawCrownBlades(n, cloth, ink) {
  push();
  stroke(ink);
  strokeWeight(5);
  fill(cloth);
  for (let i = 0; i < n; i++) {
    const spread = n === 1 ? 0 : (i / (n - 1) - 0.5) * 2; // -1 … 1
    const baseX = spread * 58;
    const tipX = spread * 104;
    const h = 252 * (1 - abs(spread) * 0.44) * random(0.86, 1.14);
    const w = 15 - abs(spread) * 4;
    triangle(baseX - w, -142, baseX + w, -142, tipX, -142 - h);
  }
  pop();
}

// The skirt: the profile mirrored either side, closed off by a hem that
// crumples where it meets the ground.
function drawSkirt(cloth, ink) {
  const steps = 26;
  const hem = 9;
  const pts = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    pts.push([cloakHW(t), cloakY(t)]);
  }
  for (let i = 0; i <= hem; i++) {
    const x = lerp(cloakHW(1), -cloakHW(1), i / hem);
    pts.push([x, HEM_Y + (i % 2 ? 30 : -2) + random(-7, 7)]);
  }
  for (let i = steps; i >= 0; i--) {
    const t = i / steps;
    pts.push([-cloakHW(t), cloakY(t)]);
  }

  push();
  stroke(ink);
  strokeWeight(6);
  fill(cloth);
  blob(pts);
  pop();
}

// Folds run the height of the skirt, spreading with it — that is what
// stops the silhouette reading as a flat blob.
function drawFolds(n, ink) {
  push();
  noFill();
  stroke(ink);
  strokeWeight(4);
  for (let i = 0; i < n; i++) {
    const u = random(-0.84, 0.84);
    const k = random(0.86, 1.04);
    const top = random(0.05, 0.22);
    const pts = [];
    for (let j = 0; j <= 12; j++) {
      const t = lerp(top, 0.96, j / 12);
      pts.push([u * cloakHW(t) * k, cloakY(t)]);
    }
    curvePath(pts);
  }
  pop();
}

function curvePath(pts) {
  beginShape();
  curveVertex(...pts[0]);
  for (const p of pts) curveVertex(...p);
  curveVertex(...pts[pts.length - 1]);
  endShape();
}

// Blades pushing out through the cloth.
function drawClaws(n, cloth, ink) {
  push();
  stroke(ink);
  strokeWeight(4);
  fill(cloth);
  for (let i = 0; i < n; i++) {
    const t = random(0.36, 0.8);
    const u = random(-0.74, 0.74);
    const len = random(96, 168);
    push();
    translate(u * cloakHW(t), cloakY(t));
    rotate(u * 0.55 + random(-0.14, 0.14));
    beginShape();
    vertex(0, 0);
    vertex(11, -len * 0.34);
    vertex(0, -len);
    vertex(-11, -len * 0.34);
    endShape(CLOSE);
    noStroke();
    fill(ink);
    triangle(0, 0, 10, -len * 0.34, -10, -len * 0.34);
    stroke(ink);
    fill(cloth);
    pop();
  }
  pop();
}

// The ruff: torn petals fanned round the head, each one a different
// length so the ring never closes into a tidy flower.
function drawFrill(n, cloth, ink) {
  push();
  translate(0, -40);
  stroke(ink);
  strokeWeight(5);
  fill(cloth);
  for (let i = 0; i < n; i++) {
    const a = lerp(PI * 0.99, PI * 0.01, i / (n - 1));
    const r = random(118, 176);
    const w = random(0.15, 0.24);
    const squash = 0.78; // wider than it is tall, so it frames the face
    const inner = 44;
    const P = (ang, rad) => [cos(ang) * rad, -sin(ang) * rad * squash];

    beginShape();
    vertex(...P(a + w, inner));
    bezierVertex(
      ...P(a + w * 1.5, r * 0.66),
      ...P(a + w * 0.7, r * 0.95),
      ...P(a, r),
    );
    bezierVertex(
      ...P(a - w * 0.7, r * 0.95),
      ...P(a - w * 1.5, r * 0.66),
      ...P(a - w, inner),
    );
    endShape(CLOSE);
  }
  pop();
}

// The face is small: a narrow plate with a banded visor across the eyes.
function drawMask(cloth, ink, accent) {
  push();
  stroke(ink);
  strokeWeight(5);
  fill(cloth);
  blob([
    [0, -146],
    [42, -112],
    [46, -34],
    [24, 26],
    [0, 44],
    [-24, 26],
    [-46, -34],
    [-42, -112],
  ]);

  noStroke();
  fill(ink);
  rectMode(CENTER);
  rect(0, -88, 86, 30, 4);
  stroke(cloth);
  strokeWeight(3);
  for (let x = -30; x <= 30; x += 12) line(x, -100, x, -76);

  stroke(accent);
  strokeWeight(5);
  line(18, -58, 18, 24);
  pop();
}

// One arm out of the cloth, gripping a banded haft with a clawed head.
function drawScythe(side, cloth, ink) {
  const a = { x: 132, y: -96 };
  const b = { x: -286, y: 126 };
  const ang = atan2(b.y - a.y, b.x - a.x);
  const len = dist(a.x, a.y, b.x, b.y);

  push();
  scale(side, 1);
  strokeJoin(ROUND);

  // haft: a light band with alternating dark segments
  push();
  translate(a.x, a.y);
  rotate(ang);
  rectMode(CORNER);
  stroke(ink);
  strokeWeight(5);
  fill(cloth);
  rect(0, -9, len, 18, 9);
  noStroke();
  fill(ink);
  const segs = 16;
  for (let i = 1; i < segs; i += 2) rect((len / segs) * i, -9, len / segs, 18);
  pop();

  // clawed head
  push();
  translate(b.x, b.y);
  rotate(ang);
  stroke(ink);
  strokeWeight(5);
  fill(cloth);
  for (let i = 0; i < 4; i++) {
    const s = 1 - i * 0.13;
    push();
    rotate(-0.78 + i * 0.36);
    beginShape();
    vertex(0, 0);
    bezierVertex(40 * s, -12 * s, 86 * s, -20 * s, 128 * s, -4 * s);
    bezierVertex(84 * s, 10 * s, 40 * s, 18 * s, 0, 22 * s);
    endShape(CLOSE);
    pop();
  }
  pop();

  // gloved hand on the haft
  push();
  translate(lerp(a.x, b.x, 0.44), lerp(a.y, b.y, 0.44));
  stroke(ink);
  strokeWeight(5);
  fill(cloth);
  ellipse(0, 0, 56, 46);
  for (let i = 0; i < 4; i++) {
    const t = -0.55 + i * 0.34;
    line(cos(t) * 20, sin(t) * 16, cos(t) * 44, sin(t) * 36);
  }
  pop();

  pop();
}

// ═══════════════════════════════════════════════════════════════════
//  Interaction
// ═══════════════════════════════════════════════════════════════════

function keyPressed() {
  if (key === "1" || key === "2" || key === "3") {
    mode = int(key);
    redraw();
  }
  if (key === "r" || key === "R") {
    seed = floor(random(1e6));
    redraw();
  }
  if (key === "s" || key === "S") {
    saveCanvas(`clown-${mode}-${seed}`, "png");
  }
}
