// ═══════════════════════════════════════════════════════════════════
//  SHURE SM7B — line art
//  Every part is one open stroke in its own colour, and every stroke is
//  trimmed back at both ends so parts never run into each other: the gap
//  at each junction is the drawing, not an accident.
//  Colours come from one palette picked at random per render.
// ═══════════════════════════════════════════════════════════════════

// ── Tunables ───────────────────────────────────────────────────────
const CANVAS_SIZE = 1080;

let STROKE_W = 8; // one weight for every stroke in the piece
let GAP = 14; // trimmed off both ends of every stroke
let BG_COLOR = "#FDFCF8";
let SCALE = 1.3; // overall zoom
let JITTER = 0; // 0 = ruler-straight; 2–6 = hand-drawn

// ── Palettes ───────────────────────────────────────────────────────
// One of these is picked per render; parts index into it, so a palette
// swap re-colours the whole piece coherently.
const PALETTES = [
  {
    name: "arcade",
    colors: [
      "#2FB3A6", "#4A7FD4", "#EC6A4F", "#93A93E", "#E466A8",
      "#F2913A", "#8A6FD2", "#4CB36C", "#DB4640", "#E4BE38",
    ],
  },
  {
    name: "citrus",
    colors: [
      "#F2A93B", "#E8622C", "#C9D14A", "#5BA85A", "#E4C93F",
      "#D94F3D", "#8CBF3F", "#F07B3F", "#B8CC3C",
    ],
  },
  {
    name: "neon",
    colors: [
      "#FF2E88", "#00CBD6", "#9EE637", "#8B4DFF", "#FF7A00",
      "#00D98A", "#FF3B5C", "#3E9BFF", "#C13BFF",
    ],
  },
  {
    name: "pastel",
    colors: [
      "#8FBBDC", "#EE9CB8", "#B2CE93", "#EFC378", "#B8A3D6",
      "#83CBBE", "#E89A80", "#CBB6E2", "#9FD0C4",
    ],
  },
  {
    name: "clay",
    colors: [
      "#C56B4E", "#7B9A6D", "#D9A441", "#5F7A8A", "#B04A3E",
      "#A8896B", "#6E8C7A", "#D08C60", "#8C6F52",
    ],
  },
  {
    name: "ink",
    colors: [
      "#22303C", "#3E4C59", "#EC6A4F", "#52606D", "#7B8794",
      "#F2913A", "#2D3A45", "#9AA5B1", "#5A6B78",
    ],
  },
];

let paletteIndex = 0;
let PAL = PALETTES[0].colors;

// ── Pose ───────────────────────────────────────────────────────────
// Design space is centred on the canvas and spans roughly ±540. The view
// stays shallow so no part ever has to cross another.
const MIC = { cx: 20, cy: 70, tilt: 14 };
const FS = 0.32; // cross-section foreshortening: 0 = side-on, 1 = head-on

// Barrel profile: distance along the mic axis → radius. Two runs, so the
// seam between them stays a hard edge. On a real SM7B the windscreen and
// the body run at nearly the same diameter and nearly the same length —
// the foam is not a fat guard bolted on the front.
// The body runs at one diameter straight into the windscreen — there is no
// waist pinched in between them.
const BODY_PROFILE = [
  { x: -205, r: 58 }, // flat closed back — no connector here
  { x: -196, r: 66 },
  { x: -50, r: 67 },
  { x: -6, r: 68 },
];
// The windscreen tapers gently all the way to the tip — it never bulges.
const FOAM_PROFILE = [
  { x: 2, r: 72 },
  { x: 90, r: 69 },
  { x: 170, r: 62 },
  { x: 205, r: 46 }, // plain rounded nose
];

// The boom is three pivots, all round, linked by bare rails. The last one
// is the hub the yoke hangs from.
const JOINTS = [
  { x: -330, y: -300, r: 30 },
  { x: -185, y: -255, r: 26 },
  { x: -60, y: -205, r: 28 },
];
const ARM_ENTRY = { x: -480, y: -120 };
const HUB = JOINTS[2];

const CLAMP_X = -85; // where the yoke grips, along the mic axis
const YOKE_SPLAY = 75; // projected gap between the two arms
const JACK_X = -110; // where the XLR spigot leaves the underside

let exportTransparent = false;
let jSeed = 0;

// ═══════════════════════════════════════════════════════════════════
//  Setup / draw
// ═══════════════════════════════════════════════════════════════════

function setup() {
  createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  noLoop();
  pickPalette(floor(random(PALETTES.length)));
}

function pickPalette(i) {
  paletteIndex = (i + PALETTES.length) % PALETTES.length;
  PAL = PALETTES[paletteIndex].colors;
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
  drawYoke();
  drawMicBody();
  drawSwitches();
  drawJack();
  drawCable();

  pop();
}

// ═══════════════════════════════════════════════════════════════════
//  Parts
// ═══════════════════════════════════════════════════════════════════

// Boom arm: two tubes and a pivot disc, each a separate colour, none of
// them touching — the disc floats in the gap the two tubes leave.
function drawArm() {
  const nodes = [ARM_ENTRY, ...JOINTS];
  const width = [19, 17, 15];

  // segments are bare rails — no end caps, and each one stops clear of the
  // pivot's radius rather than of its centre
  for (let i = 0; i < 3; i++) {
    const a = nodes[i];
    const b = nodes[i + 1];
    const head = i === 0 ? GAP : JOINTS[i - 1].r + GAP;
    rails([a, b], width[i], pal(i), head, JOINTS[i].r + GAP);
  }

  // every pivot is a pair of rings, their openings set apart so the two
  // never line up into a letter
  JOINTS.forEach((j, i) => {
    circlePart(j.x, j.y, j.r, pal(5 + i), PI * 0.15);
    circlePart(j.x, j.y, j.r * 0.38, pal(8 + i), PI * 1.1, j.r * 0.1);
  });
}

// Yoke: two arms bowing out of the mount and stopping just short of the
// barrel. The clamp screw sits on the barrel in the gap they leave.
function drawYoke() {
  const bottom = HUB.y + HUB.r + GAP;
  const nearStem = { x: HUB.x + 15, y: bottom };
  const farStem = { x: HUB.x - 15, y: bottom };
  const nearEnd = micToWorld(CLAMP_X + YOKE_SPLAY / 2, -70);
  const farEnd = micToWorld(CLAMP_X - YOKE_SPLAY / 2, -70);

  // the arms drop almost straight and only bow out on the way, so they
  // read as a bracket straddling the barrel rather than a loop
  const toe = GAP * 0.55; // tighter gap where an arm meets the barrel

  // drawn as brackets with real width, not single lines — this is a part
  // the mic is clamped inside, not a wire pinching it
  rails(
    smoothPath(
      [
        nearStem,
        { x: nearStem.x + 17, y: nearStem.y + 64 },
        { x: nearEnd.x + 4, y: nearEnd.y - 50 },
        nearEnd,
      ],
      44,
    ),
    10,
    pal(2),
    0,
    toe,
    true,
    true,
  );

  rails(
    smoothPath(
      [
        farStem,
        { x: farStem.x - 15, y: farStem.y + 64 },
        { x: farEnd.x - 8, y: farEnd.y - 46 },
        farEnd,
      ],
      44,
    ),
    10,
    pal(4),
    0,
    toe,
    true,
    true,
  );

  // clamp screw, sitting on the barrel right under the near arm
  const screw = micToWorld(CLAMP_X + YOKE_SPLAY / 2, -34);
  circlePart(screw.x, screw.y, 20, pal(5));
  circlePart(screw.x, screw.y, 7, pal(8));
}

// Barrel: top and bottom contours of each profile run, the seam where the
// windscreen meets the body, the flat back rim, and the nose cap.
function drawMicBody() {
  push();
  translate(MIC.cx, MIC.cy);
  rotate(radians(MIC.tilt));

  silhouette(BODY_PROFILE, pal(1), pal(0));
  silhouette(FOAM_PROFILE, pal(2), pal(4));

  // the small step from the body waist out to the windscreen
  part([{ x: -6, y: -56 }, { x: 2, y: -70 }], pal(9));
  part([{ x: -6, y: 56 }, { x: 2, y: 70 }], pal(9));

  // back rim — only the far arc clears the barrel
  ringPart(-205, 58, HALF_PI, PI + HALF_PI, pal(6), GAP * 0.5);

  // nose cap — near arc only, a plain rounded end
  ringPart(205, 50, -HALF_PI, HALF_PI, pal(8), GAP * 0.5);

  // seam rings — near arc only, bulging toward the nose
  ringPart(-196, 66, -HALF_PI, HALF_PI, pal(3), GAP * 0.6);
  ringPart(-50, 66, -HALF_PI, HALF_PI, pal(7), GAP * 0.6);
  ringPart(2, 70, -HALF_PI, HALF_PI, pal(7), GAP * 0.6);

  // label band around the waist
  ringPart(-17, 56, -HALF_PI, HALF_PI, pal(4), GAP * 0.6);

  pop();
}

// Rear switch panel: cover seam plus two slide switches.
function drawSwitches() {
  push();
  translate(MIC.cx, MIC.cy);
  rotate(radians(MIC.tilt));

  part([{ x: -178, y: -40 }, { x: -178, y: 30 }], pal(7));
  part([{ x: -164, y: -28 }, { x: -130, y: -28 }], pal(0));
  part([{ x: -164, y: 2 }, { x: -130, y: 2 }], pal(0));

  pop();
}

// XLR jack: the SM7B takes its cable on the underside of the rear body,
// not out of the back — a short spigot dropping off the bottom contour.
function drawJack() {
  push();
  translate(MIC.cx, MIC.cy);
  rotate(radians(MIC.tilt));

  const g = GAP * 0.5;
  part([{ x: JACK_X - 20, y: 62 }, { x: JACK_X - 20, y: 96 }], pal(3), g, g);
  part([{ x: JACK_X + 20, y: 62 }, { x: JACK_X + 20, y: 96 }], pal(3), g, g);
  part([{ x: JACK_X - 20, y: 96 }, { x: JACK_X + 20, y: 96 }], pal(5), g, g);

  pop();
}

// XLR lead: drops out of the jack, sags into a loop, then climbs and runs
// alongside the boom off the top-left. Drawn as single strokes, not tubes,
// so it stays a cable, and broken into runs so the gaps keep reading.
function drawCable() {
  const jack = micToWorld(JACK_X, 100);
  const pts = smoothPath(
    [
      jack,
      { x: -158, y: 180 }, // short sag
      { x: -228, y: 80 }, // climbs just clear of the tail
      { x: -252, y: -85 },
      { x: -268, y: -218 }, // picks up the arm below the middle pivot
      { x: -358, y: -210 },
      { x: -505, y: -20 }, // runs out clear of the last rail
    ],
    90,
  );
  part(pts.slice(0, 30), pal(3));
  part(pts.slice(30, 60), pal(7));
  part(pts.slice(60), pal(3));
}

// ═══════════════════════════════════════════════════════════════════
//  Part primitives — every one of these trims its ends
// ═══════════════════════════════════════════════════════════════════

function pal(i) {
  return PAL[i % PAL.length];
}

// One open stroke in one colour.
function part(pts, col, head = GAP, tail = GAP) {
  stroke(col);
  render(trimPath(pts, head, tail));
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

function ringPoints(x, r, a0, a1) {
  const steps = max(12, ceil(abs(a1 - a0) / (PI / 16)));
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const a = lerp(a0, a1, i / steps);
    pts.push({ x: x + r * FS * cos(a), y: r * sin(a) });
  }
  return pts;
}

// A face-on circle (pivots, screws — no foreshortening), left open. `phase`
// moves where the opening sits so concentric rings don't share one.
function circlePart(cx, cy, r, col, phase = 0, g = GAP * 0.5) {
  const pts = [];
  for (let i = 0; i <= 40; i++) {
    const a = phase + (i / 40) * TWO_PI;
    pts.push({ x: cx + r * cos(a), y: cy + r * sin(a) });
  }
  part(pts, col, g, g);
}

// Two parallel contours. Caps are optional: an arm segment is just its two
// rails, a bracket is closed off at the ends. The centreline is trimmed
// first, so anything drawn lands inside the gap, never on a neighbour.
function rails(
  ctrl,
  hw,
  col,
  head = GAP,
  tail = GAP,
  capHead = false,
  capTail = false,
) {
  const pts = trimPath(
    ctrl.length > 2 ? ctrl : smoothPath(ctrl, 24),
    head,
    tail,
  );
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
  stroke(col);
  render(a);
  render(b);
  const n = pts.length - 1;
  if (capHead) render([a[0], b[0]]);
  if (capTail) render([a[n], b[n]]);
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
function render(pts) {
  if (pts.length < 2) return;
  const p = JITTER > 0 ? displace(pts) : pts;
  const n = p.length;

  beginShape();
  curveVertex(p[0].x, p[0].y);
  for (const q of p) curveVertex(q.x, q.y);
  curveVertex(p[n - 1].x, p[n - 1].y);
  endShape();
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
    const off =
      (noise(t * 2.4, jSeed) - 0.5) * 2 * JITTER * pow(sin(t * PI), 0.45);
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
    pickPalette(floor(random(PALETTES.length)));
    noiseSeed(floor(random(100000)));
    redraw();
  }
  if (key === "p" || key === "P") {
    pickPalette(paletteIndex + 1); // step through palettes in order
    redraw();
  }
  if (key === "s" || key === "S") {
    exportTransparent = true;
    redraw();
    saveCanvas(`sm7b-${PALETTES[paletteIndex].name}-${stamp()}`, "png");
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
