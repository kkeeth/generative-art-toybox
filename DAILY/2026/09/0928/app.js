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
//  Crown Clown — mask and mantle read as one piece
// ═══════════════════════════════════════════════════════════════════

function drawCrownClown() {
  const pal = random(PALETTES);
  background(pal.ink);

  push();
  translate(width / 2, height / 2 + 40);

  const cloth = "#F2EEE4";
  const shade = "#BFB9AC";
  const scar = random(pal.a);
  const side = random([1, -1]); // which eye the scar crosses

  strokeJoin(ROUND);
  strokeCap(ROUND);

  drawMantle(cloth, shade, pal.ink);
  drawCrownSpikes(cloth, pal.ink, scar);
  drawHoodOpening(shade, pal.ink);
  drawCrownMask(cloth, pal.ink, scar, side);
  drawRibbons(cloth, pal.ink);

  pop();
}

// The cloak: shoulders flaring into a hem torn into uneven teeth.
function drawMantle(cloth, shade, ink) {
  const teeth = 11;
  const pts = [];

  pts.push([0, -300], [150, -236], [212, -110], [246, 40]);
  for (let i = 0; i <= teeth; i++) {
    const t = i / teeth;
    const x = lerp(246, -246, t);
    const deep = i % 2 === 0;
    pts.push([x, deep ? 300 + random(-24, 24) : 212 + random(-18, 18)]);
  }
  pts.push([-246, 40], [-212, -110], [-150, -236]);

  push();
  stroke(ink);
  strokeWeight(6);
  fill(cloth);
  blob(pts);

  // a fold down each side, so the cloth has a front and a flank
  stroke(shade);
  strokeWeight(5);
  noFill();
  for (const s of [1, -1]) {
    beginShape();
    curveVertex(s * 150, -30);
    curveVertex(s * 162, 60);
    curveVertex(s * 158, 150);
    curveVertex(s * 146, 226);
    endShape();
  }
  pop();
}

// The crown the mask is named for: blades rising out of the hood.
function drawCrownSpikes(cloth, ink, accent) {
  const n = floor(random(3, 6));
  push();
  stroke(ink);
  strokeWeight(6);
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const x = lerp(-104, 104, t);
    const h = 96 + 70 * (1 - abs(t - 0.5) * 2) + random(-14, 14);
    fill(i % 2 ? accent : cloth);
    triangle(x - 30, -244, x + 30, -244, x, -244 - h);
  }
  pop();
}

function drawHoodOpening(shade, ink) {
  push();
  stroke(ink);
  strokeWeight(6);
  fill(shade);
  blob([
    [0, -262],
    [124, -176],
    [136, -30],
    [70, 96],
    [0, 130],
    [-70, 96],
    [-136, -30],
    [-124, -176],
  ]);
  pop();
}

// The mask: an angular plate, seamed down the middle, with a scar
// running the full height of one side.
function drawCrownMask(cloth, ink, scar, side) {
  push();
  stroke(ink);
  strokeWeight(6);
  fill(cloth);
  blob([
    [0, -244],
    [112, -162],
    [122, -24],
    [62, 86],
    [0, 118],
    [-62, 86],
    [-122, -24],
    [-112, -162],
  ]);

  // eye slits
  fill(ink);
  noStroke();
  for (const s of [1, -1]) {
    beginShape();
    vertex(s * 26, -78);
    vertex(s * 88, -60);
    vertex(s * 84, -22);
    vertex(s * 30, -40);
    endShape(CLOSE);
  }

  // centre seam and cheek plates
  stroke(ink);
  strokeWeight(5);
  noFill();
  line(0, -206, 0, 92);
  for (const s of [1, -1]) {
    line(s * 34, 6, s * 84, -8);
    line(s * 30, 44, s * 66, 30);
  }

  // the scar: a vertical run with a cross bar, over one eye
  stroke(scar);
  strokeWeight(7);
  line(side * 56, -196, side * 56, 60);
  line(side * 24, -140, side * 92, -140);
  pop();
}

// Torn ribbons trailing off the hem.
function drawRibbons(cloth, ink) {
  push();
  stroke(ink);
  strokeWeight(5);
  fill(cloth);
  for (let i = 0; i < 4; i++) {
    const x = random(-220, 220);
    const w = random(16, 30);
    const h = random(70, 150);
    const y = random(240, 300);
    blob([
      [x, y],
      [x + w, y + h * 0.4],
      [x + w * 0.4, y + h],
      [x - w * 0.5, y + h * 0.55],
    ]);
  }
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
