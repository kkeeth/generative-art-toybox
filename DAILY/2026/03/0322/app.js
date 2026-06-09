// Geometric Abstract Art - inspired by bold graphic/Memphis design style
// Color palette: red, black, white, gray
// Features: triangles, concentric circles, stripes, halftone dots, diagonal composition

let W;
let shapes = [];
let bgGradientColors;

// ---- Color Palette ----
const RED = "#E8002A";
const BLACK = "#1A1A1A";
const WHITE = "#FFFFFF";
const GRAY1 = "#888888";
const GRAY2 = "#CCCCCC";
const GRAY3 = "#444444";
const PALETTE = [RED, BLACK, WHITE, GRAY1, GRAY2];

// Diagonal band parameters (shapes cluster along this axis)
// Band runs from bottom-left to top-right
let BAND_ANGLE;  // radians
let BAND_CENTER; // y center at x=W/2

function setup() {
  W = min(windowWidth, windowHeight) - 50;
  createCanvas(W, W);
  noLoop();

  BAND_ANGLE = -PI / 6; // ~-30 degrees (left-down to right-up)
  BAND_CENTER = W * 0.55;

  generateShapes();
}

function draw() {
  // White background
  background(255);

  // Draw a subtle gradient bar (the purple/blue band at top of reference image)
  drawGradientBar();

  // Draw all shapes back to front
  for (let sh of shapes) {
    drawShape(sh);
  }

  // Scatter small dots over the composition for texture
  drawScatteredDots();
}

// ---- Gradient decorative bar ----
function drawGradientBar() {
  push();
  noStroke();
  let barH = W * 0.07;
  let barY = W * 0.28;
  for (let x = 0; x < W; x++) {
    let t = x / W;
    let r = lerp(180, 255, t);
    let g = lerp(180, 100, t);
    let b = lerp(255, 200, t);
    stroke(r, g, b, 180);
    line(x, barY, x, barY + barH);
  }
  pop();
}

// ---- Generate a collection of shape descriptors ----
function generateShapes() {
  shapes = [];
  let numShapes = floor(random(60, 90));

  for (let i = 0; i < numShapes; i++) {
    // Place shapes along a diagonal band
    let t = random(0, 1);
    // x spread across most of canvas
    let x = random(-W * 0.05, W * 1.05);
    // y follows diagonal band with some scatter
    let bandY = BAND_CENTER + (x - W / 2) * tan(BAND_ANGLE);
    let scatter = random(-W * 0.22, W * 0.22);
    let y = bandY + scatter;

    let size = random(W * 0.04, W * 0.18);
    let color1 = random(PALETTE);
    let color2 = random(PALETTE);
    // avoid same color for fill/stroke
    while (color2 === color1) color2 = random(PALETTE);

    let shapeType = floor(random(7));
    // Types:
    // 0 = filled triangle
    // 1 = outlined triangle
    // 2 = concentric circles (target)
    // 3 = solid circle
    // 4 = outlined circle
    // 5 = striped circle
    // 6 = halftone dot-filled circle

    shapes.push({
      x, y, size, color1, color2,
      type: shapeType,
      rotation: random(TWO_PI),
      strokeW: random(1, 4),
    });
  }
}

// ---- Draw a single shape ----
function drawShape(sh) {
  push();
  translate(sh.x, sh.y);
  rotate(sh.rotation);
  strokeWeight(sh.strokeW);

  switch (sh.type) {
    case 0: drawFilledTriangle(sh); break;
    case 1: drawOutlinedTriangle(sh); break;
    case 2: drawConcentricCircles(sh); break;
    case 3: drawSolidCircle(sh); break;
    case 4: drawOutlinedCircle(sh); break;
    case 5: drawStripedCircle(sh); break;
    case 6: drawHalftoneCircle(sh); break;
  }
  pop();
}

// ---- Shape drawing functions ----

function drawFilledTriangle(sh) {
  fill(sh.color1);
  stroke(sh.color2);
  let r = sh.size / 2;
  triangle(0, -r, -r * 0.9, r * 0.7, r * 0.9, r * 0.7);
}

function drawOutlinedTriangle(sh) {
  noFill();
  stroke(sh.color1);
  strokeWeight(sh.strokeW * 1.5);
  let r = sh.size / 2;
  triangle(0, -r, -r * 0.9, r * 0.7, r * 0.9, r * 0.7);
}

function drawConcentricCircles(sh) {
  noFill();
  let rings = floor(random(3, 7));
  for (let i = rings; i >= 1; i--) {
    // alternate colors
    if (i % 2 === 0) {
      fill(sh.color1);
    } else {
      fill(sh.color2);
    }
    noStroke();
    let r = (sh.size / rings) * i;
    ellipse(0, 0, r, r);
  }
}

function drawSolidCircle(sh) {
  fill(sh.color1);
  noStroke();
  ellipse(0, 0, sh.size, sh.size);
}

function drawOutlinedCircle(sh) {
  noFill();
  stroke(sh.color1);
  strokeWeight(sh.strokeW * 1.5);
  ellipse(0, 0, sh.size, sh.size);
}

function drawStripedCircle(sh) {
  // Draw circle clipped with vertical stripes inside
  let r = sh.size / 2;

  // Background fill
  fill(sh.color2);
  noStroke();
  ellipse(0, 0, sh.size, sh.size);

  // Draw stripes using many thin vertical rects clipped to circle
  let stripeW = sh.size / 12;
  fill(sh.color1);
  noStroke();
  for (let sx = -r; sx < r; sx += stripeW * 2) {
    // Clip-like: only draw within circle boundary
    // Sample at multiple y points to draw a stripe segment
    beginShape();
    let steps = 20;
    // Left edge of stripe, top to bottom inside circle
    for (let j = 0; j <= steps; j++) {
      let py = -r + (2 * r * j) / steps;
      let halfChord = sqrt(max(0, r * r - py * py));
      let lx = constrain(sx, -halfChord, halfChord);
      vertex(lx, py);
    }
    // Right edge, bottom to top
    for (let j = steps; j >= 0; j--) {
      let py = -r + (2 * r * j) / steps;
      let halfChord = sqrt(max(0, r * r - py * py));
      let rx2 = constrain(sx + stripeW, -halfChord, halfChord);
      vertex(rx2, py);
    }
    endShape(CLOSE);
  }

  // Outline
  noFill();
  stroke(sh.color1);
  strokeWeight(sh.strokeW);
  ellipse(0, 0, sh.size, sh.size);
}

function drawHalftoneCircle(sh) {
  // Fill a circle area with a grid of small dots
  let r = sh.size / 2;
  let dotSpacing = sh.size / 9;
  let dotR = dotSpacing * 0.4;

  // Circle outline background
  fill(sh.color2);
  noStroke();
  ellipse(0, 0, sh.size, sh.size);

  fill(sh.color1);
  noStroke();
  for (let dx = -r; dx <= r; dx += dotSpacing) {
    for (let dy = -r; dy <= r; dy += dotSpacing) {
      if (dist(0, 0, dx, dy) <= r - dotR) {
        ellipse(dx, dy, dotR * 2, dotR * 2);
      }
    }
  }

  // Outline
  noFill();
  stroke(sh.color1);
  strokeWeight(sh.strokeW);
  ellipse(0, 0, sh.size, sh.size);
}

// ---- Scattered small decorative dots ----
function drawScatteredDots() {
  let numDots = 80;
  for (let i = 0; i < numDots; i++) {
    let x = random(-W * 0.05, W * 1.05);
    let bandY = BAND_CENTER + (x - W / 2) * tan(BAND_ANGLE);
    let scatter = random(-W * 0.28, W * 0.28);
    let y = bandY + scatter;

    let dotSize = random(W * 0.005, W * 0.025);
    let c = random(PALETTE);

    fill(c);
    noStroke();
    ellipse(x, y, dotSize, dotSize);
  }
}

// ---- Diagonal accent lines ----
function drawDiagonalLines() {
  push();
  stroke(RED);
  strokeWeight(1.5);
  let num = 3;
  for (let i = 0; i < num; i++) {
    let y0 = random(W * 0.2, W * 0.8);
    line(0, y0, W, y0 + W * tan(BAND_ANGLE));
  }
  pop();
}

// ---- Keyboard interactions ----
function keyPressed() {
  if (key === "r" || key === "R") {
    // Regenerate
    generateShapes();
    redraw();
  }
  if (key === "s" || key === "S") {
    let ts = year() + nf(month(), 2) + nf(day(), 2) + nf(hour(), 2) + nf(minute(), 2);
    saveGif(`abstract-geo-${ts}`, 5);
  }
  if (key === "c" || key === "C") {
    let ts = year() + nf(month(), 2) + nf(day(), 2) + nf(hour(), 2) + nf(minute(), 2);
    saveCanvas(`abstract-geo-${ts}`, "jpg");
  }
}
