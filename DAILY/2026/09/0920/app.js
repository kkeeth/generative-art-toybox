// ═══════════════════════════════════════════════════════════════════
//  SHURE SM7B — line art
//  Single-weight contour drawing. No fills, no shading, no gradients.
//  Depth is carried entirely by concentric rings, overlapping contours
//  and the foreshortening of the barrel's circular cross-sections.
// ═══════════════════════════════════════════════════════════════════

// ── Tunables ───────────────────────────────────────────────────────
let STROKE_W = 5; // one weight for every stroke in the piece
let BG_COLOR = "#F2EFE6";
let LINE_COLOR = "#141414";
let ACCENT = "#D2472E"; // used exactly once: the innermost grille ring
let SCALE = 1.0; // overall zoom
let JITTER = 0; // 0 = ruler-straight; 2–6 = hand-drawn

// ── Pose ───────────────────────────────────────────────────────────
// Design space is centred on the canvas and spans roughly ±540.
const MIC = { cx: 70, cy: 150, tilt: 22 }; // tilt in degrees, nose down-right
const FS = 0.36; // cross-section foreshortening: 0 = side-on, 1 = head-on

// Barrel profile: distance along the mic axis → radius. Kept as two runs so
// the step between them stays a hard shoulder instead of a smoothed bulge —
// that shoulder is what makes the silhouette read as an SM7B.
const BODY_PROFILE = [
  { x: -215, r: 40 },
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

const YOKE_GRIP = -70; // where along the mic axis the yoke clamps
const YOKE_SPLAY = 70; // projected gap between the two arms
const YOKE_W = 16; // half-width of the bracket strap
const MOUNT = { x: -5, y: -55 }; // design space, where yoke meets boom

let exportTransparent = false;
let jSeed = 0;

// ═══════════════════════════════════════════════════════════════════
//  Setup / draw
// ═══════════════════════════════════════════════════════════════════

function setup() {
  createCanvas(w = windowHeight - 50, w);
  noLoop();
}

function draw() {
  if (exportTransparent) clear();
  else background(BG_COLOR);

  push();
  translate(width / 2, height / 2);
  scale(SCALE);

  noFill();
  stroke(LINE_COLOR);
  strokeWeight(STROKE_W / SCALE); // keeps the on-screen weight at STROKE_W
  strokeCap(ROUND);
  strokeJoin(ROUND);

  jSeed = 0;

  drawArm();
  drawCable();
  drawMicBody();
  drawGrille();
  drawSwitches();
  drawYoke();
  drawMount();

  pop();
}

// ═══════════════════════════════════════════════════════════════════
//  Parts
// ═══════════════════════════════════════════════════════════════════

// Boom arm: two straight tubes meeting at a pivot disc, entering top-left.
function drawArm() {
  const elbow = { x: -400, y: -345 };
  const off = { x: -640, y: -215 };
  const head = { x: MOUNT.x, y: MOUNT.y - 40 };

  strap([off, elbow], 15, false, false);
  strap([elbow, head], 13, false, false);

  // pivot disc at the elbow closes both tubes, plus its bolt
  ring2d(elbow.x, elbow.y, 30, 30);
  ring2d(elbow.x, elbow.y, 11, 11);
}

// XLR lead: one tapered tube sweeping out of the tail and off the bottom edge.
function drawCable() {
  const tail = micToWorld(-222, 6);
  const pts = smoothPath(
    [
      tail,
      { x: tail.x - 105, y: tail.y + 95 },
      { x: tail.x - 130, y: tail.y + 250 },
      { x: tail.x - 40, y: tail.y + 355 },
      { x: tail.x - 60, y: tail.y + 470 },
    ],
    46,
  );
  strap(pts, 8, true, false);
}

// Barrel: top + bottom silhouette swept from the profile table, far-side tail
// rim, and near-side seam rings where the diameter steps.
function drawMicBody() {
  push();
  translate(MIC.cx, MIC.cy);
  rotate(radians(MIC.tilt));

  // silhouette: each profile run mirrored above and below the axis
  silhouette(BODY_PROFILE);
  silhouette(FOAM_PROFILE);

  // the shoulder where the windscreen steps out past the body
  wobblyLine(8, -57, 20, -80);
  wobblyLine(8, 57, 20, 80);

  // tail rim — only the far arc clears the barrel
  ring(-215, 40, HALF_PI, PI + HALF_PI);

  // seam rings — near arc only, bulging toward the nose
  ring(-201, 50, -HALF_PI, HALF_PI);
  ring(8, 57, -HALF_PI, HALF_PI);
  ring(20, 80, -HALF_PI, HALF_PI);

  // logo band on the body
  ring(-112, 52, -HALF_PI, HALF_PI);
  ring(-96, 52, -HALF_PI, HALF_PI);

  pop();
}

// Windscreen face: the foam edge rolls in, then flat concentric rings.
function drawGrille() {
  push();
  translate(MIC.cx, MIC.cy);
  rotate(radians(MIC.tilt));

  ring(186, 78, -HALF_PI, HALF_PI); // roll-in, meets the silhouette
  ring(198, 68, 0, TWO_PI);
  ring(200, 54, 0, TWO_PI);
  ring(201, 38, 0, TWO_PI);

  stroke(ACCENT);
  ring(202, 21, 0, TWO_PI); // the one accent in the piece
  stroke(LINE_COLOR);

  pop();
}

// Rear switch panel: cover plate plus two slide switches, on the tail.
function drawSwitches() {
  push();
  translate(MIC.cx, MIC.cy);
  rotate(radians(MIC.tilt));

  wobblyLine(-186, -40, -186, 40); // plate seam
  slot(-176, -26, 44, 18);
  slot(-176, 6, 44, 18);

  pop();
}

// Yoke: a U straddling the barrel. Both arms grip the same point on the mic
// axis, so in projection they sit YOKE_SPLAY apart along it. The near arm
// crosses the body to its thumb screw; the far one stops at the top contour,
// where the barrel takes over.
function drawYoke() {
  // the arms leave the underside of the mount as two separate legs, so
  // nothing crosses where they meet
  const bottom = MOUNT.y + 36;
  const nearStem = { x: MOUNT.x + 12, y: bottom };
  const farStem = { x: MOUNT.x - 12, y: bottom };
  const nearGrip = micToWorld(YOKE_GRIP + YOKE_SPLAY / 2, 0);
  const farCut = micToWorld(-150, -50); // where the far arm meets the contour

  // both arms bow away from the barrel before turning in — that bow is what
  // makes the bracket read as a U rather than two straps
  const near = smoothPath(
    [
      nearStem,
      { x: nearStem.x + 58, y: nearStem.y + 54 },
      { x: nearGrip.x + 30, y: nearGrip.y - 32 },
      nearGrip,
    ],
    44,
  );
  strap(near, YOKE_W, false, true);

  const far = smoothPath(
    [farStem, { x: farStem.x - 34, y: farStem.y + 24 }, farCut],
    28,
  );
  strap(far, YOKE_W, false, false);

  // thumb screw on the near face
  ring2d(nearGrip.x, nearGrip.y, 18, 18);
  ring2d(nearGrip.x, nearGrip.y, 7, 7);
}

// Mount: knurled collar between yoke and boom — a block plus ruled lines.
function drawMount() {
  const w = 32;
  const h = 40;
  const x = MOUNT.x;
  const y = MOUNT.y;

  wobblyLine(x - w, y - h, x - w, y + h);
  wobblyLine(x + w, y - h, x + w, y + h);
  wobblyLine(x - w, y - h, x + w, y - h);
  wobblyLine(x - w, y + h, x + w, y + h);

  for (let i = 1; i <= 3; i++) {
    const t = y - h + ((2 * h) / 4) * i;
    wobblyLine(x - w, t, x + w, t);
  }
}

// ═══════════════════════════════════════════════════════════════════
//  Primitives
// ═══════════════════════════════════════════════════════════════════

// A straight run, broken into noise-displaced samples when JITTER > 0.
function wobblyLine(x1, y1, x2, y2) {
  const d = dist(x1, y1, x2, y2);
  if (JITTER <= 0 || d < 1) {
    line(x1, y1, x2, y2);
    return;
  }
  const steps = max(3, ceil(d / 16));
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    pts.push({ x: lerp(x1, x2, t), y: lerp(y1, y2, t) });
  }
  path(pts, false);
}

// A profile run mirrored above and below the mic axis.
function silhouette(profile) {
  for (const s of [-1, 1]) {
    path(
      smoothPath(
        profile.map((p) => ({ x: p.x, y: s * p.r })),
        48,
      ),
      false,
    );
  }
}

// A cross-section of the barrel at distance x along the axis, radius r,
// drawn between angles a0..a1 (0 points toward the nose).
function ring(x, r, a0, a1) {
  const span = abs(a1 - a0);
  const steps = max(10, ceil(span / (PI / 14)));
  const closed = span > TWO_PI - 0.001;
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const a = lerp(a0, a1, i / steps);
    pts.push({ x: x + r * FS * cos(a), y: r * sin(a) });
  }
  path(pts, closed);
}

// A face-on ellipse in design space (bolts, discs — no foreshortening).
function ring2d(cx, cy, rx, ry) {
  const pts = [];
  for (let i = 0; i <= 28; i++) {
    const a = (i / 28) * TWO_PI;
    pts.push({ x: cx + rx * cos(a), y: cy + ry * sin(a) });
  }
  path(pts, true);
}

// A rounded slot, drawn as two runs plus two end arcs.
function slot(x, y, w, h) {
  const r = h / 2;
  wobblyLine(x + r, y, x + w - r, y);
  wobblyLine(x + r, y + h, x + w - r, y + h);
  arcPath(x + r, y + r, r, HALF_PI, PI + HALF_PI);
  arcPath(x + w - r, y + r, r, -HALF_PI, HALF_PI);
}

function arcPath(cx, cy, r, a0, a1) {
  const pts = [];
  for (let i = 0; i <= 12; i++) {
    const a = lerp(a0, a1, i / 12);
    pts.push({ x: cx + r * cos(a), y: cy + r * sin(a) });
  }
  path(pts, false);
}

// Two parallel contours plus optional end caps — how a flat metal bracket
// or a tube reads when you only have outlines.
function strap(ctrl, hw, capStart = true, capEnd = true) {
  const pts = ctrl.length > 2 ? ctrl : smoothPath(ctrl, 24);
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
  path(a, false);
  path(b, false);
  const n = pts.length - 1;
  if (capStart) wobblyLine(a[0].x, a[0].y, b[0].x, b[0].y);
  if (capEnd) wobblyLine(a[n].x, a[n].y, b[n].x, b[n].y);
}

// ═══════════════════════════════════════════════════════════════════
//  Path rendering + jitter
// ═══════════════════════════════════════════════════════════════════

// Every contour in the piece funnels through here: displace each sample
// along its normal by a noise field, then smooth it with curveVertex.
function path(pts, closed) {
  const p = JITTER > 0 ? displace(pts, closed) : pts;
  const n = p.length;

  beginShape();
  if (closed) {
    curveVertex(p[n - 1].x, p[n - 1].y);
    for (const q of p) curveVertex(q.x, q.y);
    curveVertex(p[0].x, p[0].y);
    curveVertex(p[1].x, p[1].y);
  } else {
    curveVertex(p[0].x, p[0].y);
    for (const q of p) curveVertex(q.x, q.y);
    curveVertex(p[n - 1].x, p[n - 1].y);
  }
  endShape();
}

// Closed paths sample noise around a loop so the seam does not kink;
// open paths taper to zero at both ends so joints stay tight.
function displace(pts, closed) {
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

    let v;
    if (closed) {
      const a = t * TWO_PI;
      v = noise(2 + cos(a) * 0.85, 2 + sin(a) * 0.85, jSeed);
    } else {
      v = noise(t * 2.4, jSeed);
    }
    const env = closed ? 1 : pow(sin(t * PI), 0.45);
    const off = (v - 0.5) * 2 * JITTER * env;
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
