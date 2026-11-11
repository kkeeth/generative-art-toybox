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
//  Crown Clown — a bell of cloth under a crown
//  The whole figure is one teardrop: a small masked face ringed by a
//  ruff, a crown rising out of it, and a skirt that swells to the ground.
//  An arm crosses the body and ends in the great clawed hand.
// ═══════════════════════════════════════════════════════════════════

const NECK_Y = -24;
const HEM_Y = 410;
const HEAD = { x: 0, y: -88 };
const SHADE = "#D8D2C5";

// Half-width of the skirt down its height, 0 at the neck, 1 at the hem.
// The width arrives early and the belly stays full almost to the floor,
// then tucks back in — a bulb, not a cone.
const CLOAK = [
  [0.0, 50],
  [0.07, 96],
  [0.17, 150],
  [0.32, 208],
  [0.52, 256],
  [0.72, 282],
  [0.86, 286],
  [0.95, 272],
  [1.0, 246],
];

function curvePath(pts) {
  beginShape();
  curveVertex(...pts[0]);
  for (const p of pts) curveVertex(...p);
  curveVertex(...pts[pts.length - 1]);
  endShape();
}

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

// a point on the skirt: u runs -1 (left edge) … 1 (right edge)
function onCloak(u, t) {
  return [u * cloakHW(t), cloakY(t)];
}

function drawCrownClown() {
  const pal = random(PALETTES);
  const cloth = "#FBF8F2";
  const ink = pal.ink;
  const accent = random(pal.a);
  const side = random([1, -1]);

  background(pal.bg);
  push();
  translate(width / 2, height / 2 + 20);
  scale(1.1);
  strokeJoin(ROUND);
  strokeCap(ROUND);

  drawSkirt(cloth, ink);
  drawHemStrokes(floor(random(4, 7)), ink);
  drawArm(side, cloth, ink);
  drawCrownRuff(makeCrownRuff(), cloth, ink);
  drawCrown(cloth, ink, accent);
  drawFace(cloth, ink, accent);

  pop();
}

// ── Skirt ──────────────────────────────────────────────────────────

// One smooth teardrop, closed along the floor by a shallow curve, with a
// few tucks where the cloth folds under.
function drawSkirt(cloth, ink) {
  const steps = 28;
  const pts = [];
  for (let i = 0; i <= steps; i++) pts.push(onCloak(1, i / steps));
  for (let i = 1; i < 10; i++) {
    const u = i / 10;
    pts.push([lerp(cloakHW(1), -cloakHW(1), u), HEM_Y + 16 * sin(PI * u)]);
  }
  for (let i = steps; i >= 0; i--) pts.push(onCloak(-1, i / steps));

  push();
  stroke(ink);
  strokeWeight(6);
  fill(cloth);
  blob(pts);

  noFill();
  strokeWeight(4);
  for (let i = 0; i < 3; i++) {
    const u = random(-0.6, 0.6);
    const [x0, y0] = onCloak(u, 0.9);
    curvePath([
      [x0, y0],
      [x0 - 14, y0 + 20],
      [x0 - 20, HEM_Y + 12 * sin(PI * (0.5 - u / 2))],
    ]);
  }
  pop();
}

// Sweeping strokes on the lower skirt only, each led by a dark flick,
// running down and across with the swell of the cloth.
function drawHemStrokes(n, ink) {
  push();
  for (let i = 0; i < n; i++) {
    const t0 = random(0.46, 0.76);
    const t1 = min(0.95, t0 + random(0.13, 0.2));
    const u0 = random(-0.25, 0.8);
    const u1 = u0 - random(0.35, 0.6);

    const pts = [];
    for (let j = 0; j <= 10; j++) {
      const s = j / 10;
      pts.push(onCloak(lerp(u0, u1, s) - 0.07 * sin(PI * s), lerp(t0, t1, s)));
    }
    noFill();
    stroke(ink);
    strokeWeight(4);
    curvePath(pts);

    // a brush dab at the head of the stroke: blunt end, tapering into the
    // line — pointing it away from the line made every stroke an arrow
    const [ax, ay] = pts[0];
    const [bx, by] = pts[1];
    const d = createVector(bx - ax, by - ay).normalize();
    noStroke();
    fill(ink);
    circle(ax, ay, 12);
    triangle(
      ax - d.y * 6,
      ay + d.x * 6,
      ax + d.y * 6,
      ay - d.x * 6,
      ax + d.x * 30,
      ay + d.y * 30,
    );
  }
  pop();
}

// ── Ruff ───────────────────────────────────────────────────────────
// Built like the clown ruff in view 1 — shapes laid round an arc — but
// every lobe has its own shape, set by three numbers:
//   round  0 pointed … 1 blunt       (leaf ↔ ruffle)
//   lean   sideways drift of the tip  (a curl, like a flame)
//   rise   pull of the tip upward     (fire climbs)
// One style is rolled per figure, and each lobe wanders around it.

function makeCrownRuff() {
  const style = {
    round: random(),
    lean: random(0.1, 1),
    rise: random() < 0.5 ? random(0.3, 0.9) : 0,
  };
  const lobes = [];
  for (const layer of [0, 1]) {
    const n = floor(random(12, 17));
    const a0 = radians(-38);
    const a1 = radians(218);
    for (let i = 0; i < n; i++) {
      const f = (i + (layer ? 0.5 : 0)) / (n - (layer ? 0 : 1));
      if (f > 1) continue;
      const a = lerp(a0, a1, f) + random(-0.05, 0.05);
      lobes.push({
        layer,
        a,
        len: layer ? random(42, 78) : random(72, 128),
        hw: (layer ? 0.55 : 0.7) * ((a1 - a0) / n) * 88,
        round: constrain(style.round + random(-0.3, 0.3), 0, 1),
        lean: random(-1, 1) * style.lean,
        rise: style.rise * random(0.6, 1.2),
      });
    }
  }
  return lobes;
}

function drawCrownRuff(lobes, cloth, ink) {
  push();
  stroke(ink);
  strokeWeight(5);
  fill(cloth);
  circle(HEAD.x, HEAD.y, 124); // backing, so the face never sits in a hole
  for (const layer of [0, 1]) {
    for (const L of lobes) if (L.layer === layer) drawLobe(L, cloth, ink);
  }
  pop();
}

function drawLobe(L, cloth, ink) {
  const rIn = 56;
  const dx = cos(L.a);
  const dy = -sin(L.a);
  const px = -dy; // perpendicular to the lobe
  const py = dx;

  const bx = HEAD.x + dx * rIn;
  const by = HEAD.y + dy * rIn;
  const tx = HEAD.x + dx * (rIn + L.len) + px * L.lean * L.hw * 1.3;
  const ty = HEAD.y + dy * (rIn + L.len) + py * L.lean * L.hw * 1.3 - L.rise * L.len * 0.35;

  const bulge = lerp(0.95, 1.6, L.round) * L.hw;
  const tipW = lerp(0.04, 0.95, L.round) * L.hw;
  const mid = L.len * 0.45;

  fill(cloth);
  beginShape();
  vertex(bx + px * L.hw, by + py * L.hw);
  bezierVertex(
    bx + dx * mid + px * bulge,
    by + dy * mid + py * bulge,
    tx - dx * L.len * 0.08 + px * tipW,
    ty - dy * L.len * 0.08 + py * tipW,
    tx,
    ty,
  );
  bezierVertex(
    tx - dx * L.len * 0.08 - px * tipW,
    ty - dy * L.len * 0.08 - py * tipW,
    bx + dx * mid - px * bulge,
    by + dy * mid - py * bulge,
    bx - px * L.hw,
    by - py * L.hw,
  );
  endShape(CLOSE);

  // a crease from the root toward the tip, as in a pleated ruff
  line(bx, by, lerp(bx, tx, 0.55), lerp(by, ty, 0.55));
}

// ── Crown ──────────────────────────────────────────────────────────
// One piece: a band round the head whose top edge runs up into the
// spikes, so every spike grows out of the same crown. Each spike is split
// down a ridge and one face is shaded, which is what turns the flat
// zigzag into something that stands in space.

function drawCrown(cloth, ink, accent) {
  const n = random([5, 5, 7]);
  const bandTop = -186;
  const baseY = -146;
  const spikes = [];

  for (let i = 0; i < n; i++) {
    const s = (i / (n - 1) - 0.5) * 2; // -1 … 1
    const h = 230 * (1 - abs(s) * 0.4) * random(0.88, 1.1);
    spikes.push({
      tip: [s * 118 + random(-6, 6), bandTop - h],
      left: [(s - 1 / (n - 1)) * 70, bandTop + abs(s) * 6],
      right: [(s + 1 / (n - 1)) * 70, bandTop + abs(s) * 6],
    });
  }

  const outline = [[64, baseY]];
  for (let i = n - 1; i >= 0; i--) {
    outline.push(spikes[i].right, spikes[i].tip);
  }
  outline.push(spikes[0].left, [-64, baseY], [0, baseY + 30]);

  push();
  stroke(ink);
  strokeWeight(5);
  fill(cloth);
  beginShape();
  for (const p of outline) vertex(...p);
  endShape(CLOSE);

  // shaded face and ridge on every spike
  for (const S of spikes) {
    const root = [lerp(S.left[0], S.right[0], 0.5), bandTop + 16];
    noStroke();
    fill(SHADE);
    triangle(...S.left, ...S.tip, ...root);
    stroke(ink);
    strokeWeight(3);
    line(...root, ...S.tip);
  }

  // the band, curving round the front of the head
  noFill();
  strokeWeight(4);
  curvePath([
    [-68, bandTop + 10],
    [0, bandTop + 22],
    [68, bandTop + 10],
  ]);
  curvePath([
    [-66, baseY - 8],
    [0, baseY + 6],
    [66, baseY - 8],
  ]);

  // stones on the band
  fill(accent);
  strokeWeight(3);
  for (const x of [-40, 0, 40]) {
    const y = bandTop + 17 + (x === 0 ? 6 : 1);
    quad(x, y - 8, x + 6, y, x, y + 8, x - 6, y);
  }
  pop();
}

// ── Face ───────────────────────────────────────────────────────────
// A narrow face under a half-mask. The mask covers brow and eyes and
// drops to a point over the nose; the eyes look out through it.

function drawFace(cloth, ink, accent) {
  push();
  translate(HEAD.x, HEAD.y);
  stroke(ink);
  strokeWeight(5);

  // face
  fill(cloth);
  blob([
    [0, -62],
    [34, -50],
    [42, -8],
    [34, 36],
    [16, 60],
    [0, 66],
    [-16, 60],
    [-34, 36],
    [-42, -8],
    [-34, -50],
  ]);

  // half-mask
  fill(SHADE);
  blob([
    [0, -58],
    [38, -44],
    [50, -10],
    [40, 12],
    [16, 20],
    [0, 40],
    [-16, 20],
    [-40, 12],
    [-50, -10],
    [-38, -44],
  ]);

  // band of studs across the brow
  fill(ink);
  noStroke();
  for (let i = -3; i <= 3; i++) circle(i * 9, -34 + abs(i) * 1.5, 5);

  // eyes: almond, outer corners lifted, pupils set in
  stroke(ink);
  strokeWeight(4);
  for (const s of [1, -1]) {
    fill(cloth);
    beginShape();
    vertex(s * 8, -8);
    bezierVertex(s * 14, -18, s * 28, -20, s * 36, -16);
    bezierVertex(s * 28, -4, s * 16, -2, s * 8, -8);
    endShape(CLOSE);
    fill(ink);
    noStroke();
    circle(s * 22, -11, 7);
    stroke(ink);
  }

  // nose: the mask's ridge running down to its point
  strokeWeight(4);
  line(0, -14, 0, 32);
  line(-6, 30, 0, 38);
  line(6, 30, 0, 38);

  // mouth, and a single mark of colour down one cheek
  line(-9, 52, 9, 52);
  stroke(accent);
  strokeWeight(4);
  line(30, 16, 26, 42);
  pop();
}

// ── Arm and the clawed hand ────────────────────────────────────────
// The banded arm crosses the body from the far shoulder; at the wrist it
// opens into the great hand, fingers drawn out into long blades.

function drawArm(side, cloth, ink) {
  const a = { x: 108, y: -28 };
  const b = { x: -196, y: 150 };
  const ang = atan2(b.y - a.y, b.x - a.x);
  const len = dist(a.x, a.y, b.x, b.y);

  push();
  scale(side, 1);

  // banded sleeve
  push();
  translate(a.x, a.y);
  rotate(ang);
  rectMode(CORNER);
  stroke(ink);
  strokeWeight(5);
  fill(cloth);
  rect(0, -11, len, 22, 11);
  noStroke();
  fill(ink);
  const segs = 14;
  for (let i = 1; i < segs; i += 2) rect((len / segs) * i, -11, len / segs, 22);
  pop();

  // the smaller hand, holding the arm where it crosses the chest
  push();
  translate(lerp(a.x, b.x, 0.36), lerp(a.y, b.y, 0.36) + 6);
  stroke(ink);
  strokeWeight(5);
  fill(cloth);
  ellipse(0, 0, 38, 30);
  strokeWeight(7);
  for (let i = 0; i < 4; i++) {
    const t = 0.35 + i * 0.3;
    line(cos(t) * 12, sin(t) * 10, cos(t) * 30, sin(t) * 26);
  }
  pop();

  // clawed hand at the wrist
  push();
  translate(b.x, b.y);
  rotate(ang);
  stroke(ink);
  strokeWeight(5);
  fill(cloth);

  // cuff and palm
  rect(-6, -16, 16, 32, 4);
  ellipse(30, 0, 50, 44);

  const fingers = [
    { a: -0.62, l: random(96, 128) },
    { a: -0.22, l: random(120, 150) },
    { a: 0.16, l: random(118, 148) },
    { a: 0.54, l: random(96, 126) },
    { a: -1.3, l: random(56, 72) }, // thumb
  ];
  for (const F of fingers) {
    push();
    translate(40, 0);
    rotate(F.a);
    fill(cloth);
    beginShape();
    vertex(0, -8);
    bezierVertex(F.l * 0.4, -12, F.l * 0.8, -8, F.l, 4);
    bezierVertex(F.l * 0.78, 4, F.l * 0.4, 10, 0, 8);
    endShape(CLOSE);
    strokeWeight(3);
    line(4, 0, F.l * 0.72, 1);
    pop();
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
