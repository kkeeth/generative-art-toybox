// Geometric Abstract Collage — red / black / gray on white
// inspired by NahoGraphics-style diagonal geometric compositions
// Motifs: striped triangles, triangle grids, concentric arc fans,
//         striped/halftone circles, long pin lines along a diagonal axis

let W;
let blobs = [];
let linesUnder = [];
let linesOver = [];
let shapes = [];
let dots = [];

// ---- Color Palette ----
const RED = "#E60021";
const BLACK = "#141414";
const GRAY = "#9A9A9A";
const LGRAY = "#C9C9C9";
const BLOB_GRAY = "#EFEFEF";
const WHITE = "#FFFFFF";

// Diagonal band axis: everything aligns to this angle
let BAND_ANGLE;
let CX, CY;

function setup() {
  W = min(windowWidth, windowHeight) - 50;
  createCanvas(W, W);
  noLoop();

  BAND_ANGLE = -PI / 9; // ~ -20 degrees, bottom-left to top-right
  CX = W / 2;
  CY = W / 2;

  generateComposition();
}

function draw() {
  background(255);

  drawBlobs();
  for (const l of linesUnder) drawPinLine(l);
  for (const sh of shapes) drawShape(sh);
  for (const l of linesOver) drawPinLine(l);
  drawScatteredDots();
}

// ---- Band coordinate helper ----
// u: along the diagonal axis, v: across it
function bandToXY(u, v) {
  return {
    x: CX + u * cos(BAND_ANGLE) - v * sin(BAND_ANGLE),
    y: CY + u * sin(BAND_ANGLE) + v * cos(BAND_ANGLE),
  };
}

// Triangular distribution: dense in the middle, sparse at both ends
function alongBand() {
  return ((random(-1, 1) + random(-1, 1)) / 2) * W * 0.62;
}

function acrossBand(sd) {
  return constrain(randomGaussian(0, sd * W), -W * 0.26, W * 0.26);
}

// ---- Composition ----
function generateComposition() {
  generateBlobs();
  generatePinLines();
  generateShapes();
  generateDots();
}

function generateBlobs() {
  blobs = [];
  // Large soft gray circles behind the cluster
  const spots = [
    { u: -W * 0.03, v: -W * 0.18, r: W * 0.16 },
    { u: W * 0.1, v: W * 0.16, r: W * 0.12 },
  ];
  for (const s of spots) {
    const p = bandToXY(s.u, s.v);
    // pair of overlapping circles for a blobby silhouette
    blobs.push({ x: p.x, y: p.y, r: s.r });
    blobs.push({
      x: p.x + random(-s.r, s.r) * 0.5,
      y: p.y + random(-s.r, s.r) * 0.5,
      r: s.r * random(0.55, 0.8),
    });
  }
}

function generatePinLines() {
  linesUnder = [];
  linesOver = [];
  const num = floor(random(7, 10));
  for (let i = 0; i < num; i++) {
    const dir = i % 2 === 0 ? 1 : -1; // extend up-right or down-left
    const u0 = dir * random(W * 0.05, W * 0.3);
    const v = acrossBand(0.1);
    const p = bandToXY(u0, v);
    const angle = BAND_ANGLE + random(-0.04, 0.04) + (dir < 0 ? PI : 0);
    const len = random(W * 0.35, W * 0.65);
    const l = {
      x: p.x,
      y: p.y,
      angle,
      len,
      c: random([RED, BLACK, BLACK, GRAY]),
      sw: random(1, 2.5),
      dotR: random() < 0.6 ? random(3, 8) : 0,
    };
    (random() < 0.5 ? linesUnder : linesOver).push(l);
  }
}

const SHAPE_TYPES = [
  ["stripedTriangle", 5],
  ["triGrid", 3],
  ["arcFan", 3],
  ["stripedCircle", 3],
  ["halftone", 2],
  ["target", 2],
  ["solidCircle", 2],
  ["solidTriangle", 2],
  ["dottedRing", 1],
];

function pickType() {
  let total = 0;
  for (const [, w] of SHAPE_TYPES) total += w;
  let r = random(total);
  for (const [t, w] of SHAPE_TYPES) {
    if (r < w) return t;
    r -= w;
  }
  return SHAPE_TYPES[0][0];
}

function pickInk() {
  return random([RED, RED, RED, RED, BLACK, BLACK, BLACK, BLACK, GRAY, GRAY]);
}

function generateShapes() {
  shapes = [];
  const num = floor(random(44, 54));

  for (let i = 0; i < num; i++) {
    const type = pickType();
    const u = alongBand();
    const v = acrossBand(0.1);
    const p = bandToXY(u, v);

    // shapes shrink toward both ends of the band
    const falloff = map(abs(u), 0, W * 0.62, 1, 0.4);
    let size = W * random(0.08, 0.22) * falloff;
    if (type === "solidTriangle" || type === "solidCircle") size *= 0.55;
    if (type === "arcFan") size *= 1.5;
    if (type === "stripedTriangle") size *= random(1, 1.4);

    const c1 = pickInk();
    let c2 = pickInk();
    while (c2 === c1) c2 = pickInk();

    // rotation snaps to the band axis — this is what keeps the
    // composition coherent instead of chaotic
    let rot = BAND_ANGLE;
    if (type.includes("Triangle") || type === "triGrid") {
      rot += random([0, 0, PI]); // point "up" or "down" along the band
    } else {
      rot += random([0, HALF_PI, PI / 4, -PI / 4]);
    }

    shapes.push({
      type, x: p.x, y: p.y, size, rot, c1, c2,
      p: makeParams(type, size),
    });
  }

  // draw big shapes first so small ones layer on top
  shapes.sort((a, b) => b.size - a.size);
}

// All randomness resolved here, never inside draw
function makeParams(type, size) {
  switch (type) {
    case "stripedTriangle":
    case "stripedCircle": {
      const n = floor(random(7, 14));
      const gap = max(3, size / n);
      return { gap, sw: gap * random(0.4, 0.6), dir: random([0, HALF_PI]) };
    }
    case "triGrid":
      return { rows: floor(random(3, 6)), skip: random(0.1, 0.35) };
    case "arcFan": {
      const rings = floor(random(5, 9));
      return {
        rings,
        innerRatio: random(0.15, 0.35),
        a0: random([PI, PI * 0.75, PI * 1.25]),
        span: random(PI * 0.9, PI * 1.3),
        twoTone: random() < 0.4,
      };
    }
    case "halftone": {
      const n = floor(random(6, 11));
      return { spacing: size / n, stagger: random() < 0.5 };
    }
    case "target":
      return { rings: floor(random(2, 5)) };
    case "dottedRing":
      return { n: floor(random(10, 22)) };
    default:
      return {};
  }
}

function generateDots() {
  dots = [];
  const num = floor(random(40, 60));
  for (let i = 0; i < num; i++) {
    const p = bandToXY(alongBand() * 1.15, acrossBand(0.14));
    dots.push({
      x: p.x,
      y: p.y,
      r: random(W * 0.003, W * 0.012),
      c: pickInk(),
      ring: random() < 0.25,
    });
  }
}

// ---- Drawing ----

function drawBlobs() {
  noStroke();
  fill(BLOB_GRAY);
  for (const b of blobs) circle(b.x, b.y, b.r * 2);
}

function drawPinLine(l) {
  push();
  stroke(l.c);
  strokeWeight(l.sw);
  const x2 = l.x + cos(l.angle) * l.len;
  const y2 = l.y + sin(l.angle) * l.len;
  line(l.x, l.y, x2, y2);
  if (l.dotR > 0) {
    noStroke();
    fill(l.c);
    circle(x2, y2, l.dotR * 2);
  }
  pop();
}

function drawShape(sh) {
  push();
  translate(sh.x, sh.y);
  rotate(sh.rot);
  switch (sh.type) {
    case "stripedTriangle": drawStripedTriangle(sh); break;
    case "triGrid": drawTriGrid(sh); break;
    case "arcFan": drawArcFan(sh); break;
    case "stripedCircle": drawStripedCircle(sh); break;
    case "halftone": drawHalftoneCircle(sh); break;
    case "target": drawTarget(sh); break;
    case "solidCircle": drawSolidCircle(sh); break;
    case "solidTriangle": drawSolidTriangle(sh); break;
    case "dottedRing": drawDottedRing(sh); break;
  }
  pop();
}

function clipTrianglePath(r) {
  const ctx = drawingContext;
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.lineTo(-r * 1.05, r * 0.75);
  ctx.lineTo(r * 1.05, r * 0.75);
  ctx.closePath();
  ctx.clip();
}

function clipCirclePath(r) {
  const ctx = drawingContext;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, TWO_PI);
  ctx.clip();
}

function drawStripes(r, gap, sw, dir, c) {
  push();
  rotate(dir);
  stroke(c);
  strokeWeight(sw);
  const ext = r * 1.6;
  for (let y = -ext; y <= ext; y += gap) line(-ext, y, ext, y);
  pop();
}

function drawStripedTriangle(sh) {
  const r = sh.size / 2;
  push();
  clipTrianglePath(r);
  drawStripes(r, sh.p.gap, sh.p.sw, sh.p.dir, sh.c1);
  pop();
}

function drawStripedCircle(sh) {
  const r = sh.size / 2;
  push();
  clipCirclePath(r);
  drawStripes(r, sh.p.gap, sh.p.sw, sh.p.dir, sh.c1);
  pop();
}

// Big triangle subdivided into rows of small triangles (triforce grid)
function drawTriGrid(sh) {
  const n = sh.p.rows;
  const s = sh.size / n; // cell base width
  const h = s * 0.87; // cell height
  const H = n * h;
  noStroke();
  for (let row = 0; row < n; row++) {
    const yTop = -H / 2 + row * h;
    for (let j = 0; j <= row; j++) {
      const x = (j - row / 2) * s;
      // upward cells alternate colors, downward cells stay white
      fill((row + j) % 2 === 0 ? sh.c1 : sh.c2);
      triangle(x, yTop, x - s / 2, yTop + h, x + s / 2, yTop + h);
    }
  }
}

// Concentric striped arcs — the fan / rainbow motif
function drawArcFan(sh) {
  const r = sh.size / 2;
  const inner = r * sh.p.innerRatio;
  const gap = (r - inner) / sh.p.rings;
  noFill();
  strokeWeight(gap * 0.55);
  for (let i = 0; i < sh.p.rings; i++) {
    stroke(sh.p.twoTone && i < sh.p.rings / 2 ? sh.c2 : sh.c1);
    const rr = inner + i * gap;
    arc(0, 0, rr * 2, rr * 2, sh.p.a0, sh.p.a0 + sh.p.span);
  }
}

function drawHalftoneCircle(sh) {
  const r = sh.size / 2;
  const sp = sh.p.spacing;
  const dotR = sp * 0.32;
  noStroke();
  fill(sh.c1);
  let row = 0;
  for (let y = -r; y <= r; y += sp, row++) {
    const off = sh.p.stagger && row % 2 === 1 ? sp / 2 : 0;
    for (let x = -r; x <= r; x += sp) {
      if (dist(0, 0, x + off, y) <= r - dotR) circle(x + off, y, dotR * 2);
    }
  }
}

function drawTarget(sh) {
  noStroke();
  const rings = sh.p.rings;
  for (let i = rings; i >= 1; i--) {
    fill(i % 2 === 0 ? sh.c2 : sh.c1);
    circle(0, 0, (sh.size / rings) * i);
  }
  // punch a white hole sometimes to make it a donut
  if (rings === 2) {
    fill(WHITE);
    circle(0, 0, sh.size * 0.3);
  }
}

function drawSolidCircle(sh) {
  noStroke();
  fill(sh.c1);
  circle(0, 0, sh.size);
}

function drawSolidTriangle(sh) {
  noStroke();
  fill(sh.c1);
  const r = sh.size / 2;
  triangle(0, -r, -r * 1.05, r * 0.75, r * 1.05, r * 0.75);
}

function drawDottedRing(sh) {
  noStroke();
  fill(sh.c1);
  const r = sh.size / 2;
  const d = max(2, r * 0.16);
  for (let i = 0; i < sh.p.n; i++) {
    const a = (TWO_PI * i) / sh.p.n;
    circle(cos(a) * r, sin(a) * r, d);
  }
}

function drawScatteredDots() {
  for (const d of dots) {
    if (d.ring) {
      noFill();
      stroke(d.c);
      strokeWeight(max(1, d.r * 0.5));
      circle(d.x, d.y, d.r * 2.5);
    } else {
      noStroke();
      fill(d.c);
      circle(d.x, d.y, d.r * 2);
    }
  }
}

// ---- Keyboard interactions ----
function keyPressed() {
  if (key === "r" || key === "R") {
    generateComposition();
    redraw();
  }
  if (key === "s" || key === "S") {
    const ts = year() + nf(month(), 2) + nf(day(), 2) + nf(hour(), 2) + nf(minute(), 2);
    saveGif(`abstract-geo-${ts}`, 5);
  }
  if (key === "c" || key === "C") {
    const ts = year() + nf(month(), 2) + nf(day(), 2) + nf(hour(), 2) + nf(minute(), 2);
    saveCanvas(`abstract-geo-${ts}`, "jpg");
  }
}
