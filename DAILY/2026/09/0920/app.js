// ═══════════════════════════════════════════════════════════════════
//  SHURE SM7B — line art
//  Every part is one open stroke in its own colour, and every stroke is
//  trimmed back at both ends so parts never run into each other: the gap
//  at each junction is the drawing, not an accident.
// ═══════════════════════════════════════════════════════════════════

// ── Tunables ───────────────────────────────────────────────────────
const CANVAS_SIZE = 1080;

let STROKE_W = 8; // one weight for every stroke in the piece
let GAP = 14; // trimmed off both ends of every stroke
let BG_COLOR = "#FDFCF8";
let LINE_COLOR = "#141414"; // used for the whole piece when MONO is on
let MONO = false;
let SCALE = 1.3; // overall zoom
let JITTER = 0; // 0 = ruler-straight; 2–6 = hand-drawn

// ── Palette ────────────────────────────────────────────────────────
const C = {
  teal: "#2FB3A6",
  blue: "#4A7FD4",
  coral: "#EC6A4F",
  olive: "#93A93E",
  pink: "#E466A8",
  orange: "#F2913A",
  purple: "#8A6FD2",
  green: "#4CB36C",
  red: "#DB4640",
  yellow: "#E4BE38",
};

// ── Pose ───────────────────────────────────────────────────────────
// Design space is centred on the canvas and spans roughly ±540. The view
// stays shallow enough that no part ever has to cross another, but open
// enough that the cross-section rings have room to read at this weight.
const MIC = { cx: 30, cy: 70, tilt: 14 };
const FS = 0.5; // cross-section foreshortening: 0 = side-on, 1 = head-on

// Barrel profile: distance along the mic axis → radius. Two runs, so the
// step between them stays a hard shoulder — that shoulder is what makes
// the silhouette read as an SM7B.
const BODY_PROFILE = [
  { x: -215, r: 47 },
  { x: -201, r: 50 },
  { x: -150, r: 52 },
  { x: -20, r: 55 },
  { x: 8, r: 57 },
];
const FOAM_PROFILE = [
  { x: 20, r: 80 },
  { x: 150, r: 82 },
  { x: 186, r: 78 },
  { x: 200, r: 66 },
];

const MOUNT = { x: -45, y: -195, w: 34, h: 36 };

let exportTransparent = false;
let jSeed = 0;

// ═══════════════════════════════════════════════════════════════════
//  Setup / draw
// ═══════════════════════════════════════════════════════════════════

function setup() {
  createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  noLoop();
}

function draw() {
  if (exportTransparent) clear();
  else background(BG_COLOR);

  push();
  translate(width / 2, height / 2);
  scale(SCALE);

  noFill();
  strokeWeight(STROKE_W / SCALE); // keeps the on-screen weight at STROKE_W
  strokeCap(ROUND);
  strokeJoin(ROUND);

  jSeed = 0;

  drawArm();
  drawMount();
  drawYoke();
  drawMicBody();
  drawGrille();
  drawSwitches();
  drawCable();

  pop();
}

// ═══════════════════════════════════════════════════════════════════
//  Parts
// ═══════════════════════════════════════════════════════════════════

// Boom arm: two tubes and a pivot disc, each a separate colour, none of
// them touching — the disc floats in the gap the two tubes leave.
function drawArm() {
  const elbow = { x: -300, y: -335 };

  tube([{ x: -540, y: -250 }, elbow], 19, C.teal);
  tube([elbow, { x: MOUNT.x, y: MOUNT.y - MOUNT.h }], 17, C.blue);
  circlePart(elbow.x, elbow.y, 34, C.orange);
  circlePart(elbow.x, elbow.y, 12, C.red);
}

// Mount collar: four sides drawn as four separate strokes, so the corners
// open up instead of closing into a box.
function drawMount() {
  const { x, y, w, h } = MOUNT;
  part([{ x: x - w, y: y - h }, { x: x + w, y: y - h }], C.purple);
  part([{ x: x + w, y: y - h }, { x: x + w, y: y + h }], C.purple);
  part([{ x: x + w, y: y + h }, { x: x - w, y: y + h }], C.purple);
  part([{ x: x - w, y: y + h }, { x: x - w, y: y - h }], C.purple);

  for (let i = 1; i <= 2; i++) {
    const t = y - h + ((2 * h) / 3) * i;
    part([{ x: x - w, y: t }, { x: x + w, y: t }], C.yellow);
  }
}

// Yoke: two arms bowing out of the mount and stopping just short of the
// barrel. The clamp screw sits on the barrel in the gap they leave.
function drawYoke() {
  const bottom = MOUNT.y + MOUNT.h;
  const nearStem = { x: MOUNT.x + 13, y: bottom };
  const farStem = { x: MOUNT.x - 13, y: bottom };
  const nearEnd = micToWorld(-5, -56);
  const farEnd = micToWorld(-75, -54);

  part(
    smoothPath(
      [
        nearStem,
        { x: nearStem.x + 56, y: nearStem.y + 58 },
        { x: nearEnd.x + 26, y: nearEnd.y - 40 },
        nearEnd,
      ],
      44,
    ),
    C.coral,
  );

  part(
    smoothPath(
      [farStem, { x: farStem.x - 40, y: farStem.y + 40 }, farEnd],
      32,
    ),
    C.pink,
  );

  const screw = micToWorld(-40, 0);
  circlePart(screw.x, screw.y, 19, C.orange);
  circlePart(screw.x, screw.y, 7, C.red);
}

// Barrel: top and bottom contours of each profile run, the shoulder where
// the windscreen steps out, the tail rim, and the seam rings.
function drawMicBody() {
  push();
  translate(MIC.cx, MIC.cy);
  rotate(radians(MIC.tilt));

  silhouette(BODY_PROFILE, C.blue, C.teal);
  silhouette(FOAM_PROFILE, C.coral, C.pink);

  // the shoulder where the windscreen steps out past the body
  part([{ x: 8, y: -57 }, { x: 20, y: -80 }], C.yellow);
  part([{ x: 8, y: 57 }, { x: 20, y: 80 }], C.yellow);

  // tail rim — only the far arc clears the barrel
  ringPart(-215, 47, HALF_PI, PI + HALF_PI, C.purple, GAP * 0.5);

  // seam rings — near arc only, bulging toward the nose
  ringPart(-201, 50, -HALF_PI, HALF_PI, C.olive);
  ringPart(8, 57, -HALF_PI, HALF_PI, C.olive);
  ringPart(20, 80, -HALF_PI, HALF_PI, C.green);

  // logo band on the body
  ringPart(-104, 52, -HALF_PI, HALF_PI, C.pink);

  pop();
}

// Windscreen face: the foam edge rolls in, then concentric rings, each
// left open so no ring closes on itself.
function drawGrille() {
  push();
  translate(MIC.cx, MIC.cy);
  rotate(radians(MIC.tilt));

  ringPart(186, 78, -HALF_PI, HALF_PI, C.red);
  openRing(198, 66, 0.15, C.orange);
  openRing(201, 42, 0.62, C.green);
  openRing(203, 19, 0.35, C.blue);

  pop();
}

// Rear switch panel: cover seam plus two slide switches.
function drawSwitches() {
  push();
  translate(MIC.cx, MIC.cy);
  rotate(radians(MIC.tilt));

  part([{ x: -188, y: -34 }, { x: -188, y: 34 }], C.green);
  part([{ x: -172, y: -26 }, { x: -140, y: -26 }], C.teal);
  part([{ x: -172, y: 6 }, { x: -140, y: 6 }], C.teal);

  pop();
}

// XLR lead: two single strokes running off the bottom edge, with a gap
// between them — drawn as lines, not tubes, so it stays a cable.
function drawCable() {
  const tail = micToWorld(-224, 10);
  const pts = smoothPath(
    [
      tail,
      { x: tail.x - 55, y: tail.y + 120 },
      { x: tail.x - 75, y: tail.y + 260 },
      { x: tail.x + 20, y: tail.y + 375 },
      { x: tail.x - 10, y: tail.y + 500 },
    ],
    60,
  );
  part(pts.slice(0, 30), C.olive);
  part(pts.slice(30), C.green);
}

// ═══════════════════════════════════════════════════════════════════
//  Part primitives — every one of these trims its ends
// ═══════════════════════════════════════════════════════════════════

// One open stroke in one colour.
function part(pts, col, head = GAP, tail = GAP) {
  ink(col);
  render(trimPath(pts, head, tail), false);
}

// A profile run mirrored above and below the mic axis, one colour each.
function silhouette(profile, topCol, botCol) {
  for (const [s, col] of [
    [-1, topCol],
    [1, botCol],
  ]) {
    part(
      smoothPath(
        profile.map((p) => ({ x: p.x, y: s * p.r })),
        48,
      ),
      col,
    );
  }
}

// A cross-section of the barrel at distance x along the axis, radius r,
// drawn between angles a0..a1 (0 points toward the nose).
function ringPart(x, r, a0, a1, col, g = GAP) {
  part(ringPoints(x, r, a0, a1), col, g, g);
}

// A full cross-section left open at `cut` (0..1 around the ring), so it
// reads as a drawn ring rather than a closed outline.
function openRing(x, r, cut, col) {
  const a0 = cut * TWO_PI;
  part(ringPoints(x, r, a0, a0 + TWO_PI), col, GAP * 0.7, GAP * 0.7);
}

function ringPoints(x, r, a0, a1) {
  const steps = max(12, ceil(abs(a1 - a0) / (PI / 16)));
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const a = lerp(a0, a1, i / steps);
    pts.push({ x: x + r * FS * cos(a), y: r * sin(a) });
  }
  return pts;
}

// A face-on circle (bolts, discs — no foreshortening), left open.
function circlePart(cx, cy, r, col) {
  const pts = [];
  for (let i = 0; i <= 32; i++) {
    const a = (i / 32) * TWO_PI;
    pts.push({ x: cx + r * cos(a), y: cy + r * sin(a) });
  }
  part(pts, col, GAP * 0.5, GAP * 0.5);
}

// A rounded slot: two runs plus two end arcs, each trimmed.
function slot(x, y, w, h, col) {
  const r = h / 2;
  const g = GAP * 0.45;
  part([{ x: x + r, y }, { x: x + w - r, y }], col, g, g);
  part([{ x: x + r, y: y + h }, { x: x + w - r, y: y + h }], col, g, g);
  part(arcPoints(x + r, y + r, r, HALF_PI, PI + HALF_PI), col, g, g);
  part(arcPoints(x + w - r, y + r, r, -HALF_PI, HALF_PI), col, g, g);
}

function arcPoints(cx, cy, r, a0, a1) {
  const pts = [];
  for (let i = 0; i <= 14; i++) {
    const a = lerp(a0, a1, i / 14);
    pts.push({ x: cx + r * cos(a), y: cy + r * sin(a) });
  }
  return pts;
}

// Two parallel contours plus end caps — how a tube or a flat bracket reads
// when you only have outlines. The centreline is trimmed first, so the caps
// land inside the gap rather than on top of the neighbouring part.
function tube(ctrl, hw, col) {
  const pts = trimPath(ctrl.length > 2 ? ctrl : smoothPath(ctrl, 24), GAP, GAP);
  const a = [];
  const b = [];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const prev = pts[max(0, i - 1)];
    const next = pts[min(pts.length - 1, i + 1)];
    let nx = -(next.y - prev.y);
    let ny = next.x - prev.x;
    const m = sqrt(nx * nx + ny * ny) || 1;
    nx /= m;
    ny /= m;
    a.push({ x: p.x + nx * hw, y: p.y + ny * hw });
    b.push({ x: p.x - nx * hw, y: p.y - ny * hw });
  }
  ink(col);
  render(a, false);
  render(b, false);
  const n = pts.length - 1;
  render([a[0], b[0]], false);
  render([a[n], b[n]], false);
}

function ink(col) {
  stroke(MONO ? LINE_COLOR : col);
}

// ═══════════════════════════════════════════════════════════════════
//  Trimming — the mechanic that keeps parts apart
// ═══════════════════════════════════════════════════════════════════

// Shorten a polyline by arc length at each end. Every junction in the
// piece is a pair of these gaps facing each other.
function trimPath(pts, head, tail) {
  const acc = [0];
  for (let i = 1; i < pts.length; i++) {
    acc.push(acc[i - 1] + dist(pts[i - 1].x, pts[i - 1].y, pts[i].x, pts[i].y));
  }
  const total = acc[acc.length - 1];
  if (total <= head + tail + 8) return pts;

  const s1 = total - tail;
  const out = [pointAt(pts, acc, head)];
  for (let i = 0; i < pts.length; i++) {
    if (acc[i] > head && acc[i] < s1) out.push(pts[i]);
  }
  out.push(pointAt(pts, acc, s1));
  return out;
}

function pointAt(pts, acc, s) {
  for (let i = 1; i < pts.length; i++) {
    if (acc[i] >= s) {
      const t = (s - acc[i - 1]) / (acc[i] - acc[i - 1] || 1);
      return {
        x: lerp(pts[i - 1].x, pts[i].x, t),
        y: lerp(pts[i - 1].y, pts[i].y, t),
      };
    }
  }
  return pts[pts.length - 1];
}

// ═══════════════════════════════════════════════════════════════════
//  Rendering + jitter
// ═══════════════════════════════════════════════════════════════════

// Every contour funnels through here: displace each sample along its
// normal by a noise field, then smooth it with curveVertex.
function render(pts, closed) {
  if (pts.length < 2) return;
  const p = JITTER > 0 ? displace(pts) : pts;
  const n = p.length;

  beginShape();
  curveVertex(p[0].x, p[0].y);
  for (const q of p) curveVertex(q.x, q.y);
  curveVertex(p[n - 1].x, p[n - 1].y);
  endShape(closed ? CLOSE : undefined);
}

// Tapers to zero at both ends so the trimmed gaps stay exactly as wide
// as GAP however hard the line wobbles in the middle.
function displace(pts) {
  jSeed += 11.37;
  const n = pts.length;
  return pts.map((p, i) => {
    const t = i / (n - 1);
    const prev = pts[max(0, i - 1)];
    const next = pts[min(n - 1, i + 1)];
    let nx = -(next.y - prev.y);
    let ny = next.x - prev.x;
    const m = sqrt(nx * nx + ny * ny) || 1;
    nx /= m;
    ny /= m;
    const off = (noise(t * 2.4, jSeed) - 0.5) * 2 * JITTER * pow(sin(t * PI), 0.45);
    return { x: p.x + nx * off, y: p.y + ny * off };
  });
}

// ═══════════════════════════════════════════════════════════════════
//  Helpers
// ═══════════════════════════════════════════════════════════════════

function micToWorld(x, y) {
  const a = radians(MIC.tilt);
  return {
    x: MIC.cx + x * cos(a) - y * sin(a),
    y: MIC.cy + x * sin(a) + y * cos(a),
  };
}

function smoothPath(ctrl, n) {
  const ext = [ctrl[0], ...ctrl, ctrl[ctrl.length - 1]];
  const out = [];
  for (let i = 0; i < n; i++) {
    const u = (i / (n - 1)) * (ctrl.length - 1);
    const k = min(floor(u), ctrl.length - 2);
    const f = u - k;
    out.push({
      x: catmull(ext[k].x, ext[k + 1].x, ext[k + 2].x, ext[k + 3].x, f),
      y: catmull(ext[k].y, ext[k + 1].y, ext[k + 2].y, ext[k + 3].y, f),
    });
  }
  return out;
}

function catmull(a, b, c, d, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    0.5 *
    (2 * b +
      (-a + c) * t +
      (2 * a - 5 * b + 4 * c - d) * t2 +
      (-a + 3 * b - 3 * c + d) * t3)
  );
}

// ═══════════════════════════════════════════════════════════════════
//  Interaction
// ═══════════════════════════════════════════════════════════════════

function keyPressed() {
  if (key === "r" || key === "R") {
    noiseSeed(floor(random(100000)));
    redraw();
  }
  if (key === "m" || key === "M") {
    MONO = !MONO;
    redraw();
  }
  if (key === "s" || key === "S") {
    exportTransparent = true;
    redraw();
    saveCanvas(`sm7b-lineart-${stamp()}`, "png");
    exportTransparent = false;
    redraw();
  }
}

function stamp() {
  return (
    year() +
    nf(month(), 2) +
    nf(day(), 2) +
    nf(hour(), 2) +
    nf(minute(), 2) +
    nf(second(), 2)
  );
}
