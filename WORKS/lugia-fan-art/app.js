"use strict";

let W;

function setup() {
  createCanvas((W = min(windowWidth, windowHeight) - 50), W);
  noLoop();
}

function draw() {
  background(208, 228, 252);
  translate(W / 2, W / 2);
  scale(W / 600);
  strokeJoin(ROUND);
  strokeCap(ROUND);
  translate(0, 10);
  drawLugia();
}

function drawLugia() {
  // Back layer: wings and tail
  drawRightWing();
  drawLeftWing();
  drawTail();
  // Mid layer: body
  drawBody();
  drawBellyPlate();
  // Top layer: spines, head, details
  drawBackSpines();
  drawHead();
  drawBeak();
  drawEye();
}

// ── BODY ─────────────────────────────────────────────────────────────────
function drawBody() {
  fill(245, 249, 255);
  stroke(25, 30, 65);
  strokeWeight(6);

  beginShape();
  curveVertex(-50, -42);
  curveVertex(-50, -42);
  curveVertex(-88, 18);
  curveVertex(-74, 92);
  curveVertex(-18, 132);
  curveVertex(48, 130);
  curveVertex(98, 88);
  curveVertex(102, 14);
  curveVertex(62, -42);
  curveVertex(-50, -42);
  curveVertex(-50, -42);
  endShape(CLOSE);
}

function drawBellyPlate() {
  fill(168, 206, 248);
  noStroke();

  beginShape();
  curveVertex(-22, -5);
  curveVertex(-22, -5);
  curveVertex(-48, 38);
  curveVertex(-34, 88);
  curveVertex(5, 114);
  curveVertex(50, 110);
  curveVertex(74, 70);
  curveVertex(58, 20);
  curveVertex(20, -3);
  curveVertex(-22, -5);
  curveVertex(-22, -5);
  endShape(CLOSE);
}

// ── HEAD ─────────────────────────────────────────────────────────────────
function drawHead() {
  fill(245, 249, 255);
  stroke(25, 30, 65);
  strokeWeight(6);

  beginShape();
  curveVertex(-18, -52);
  curveVertex(-18, -52);
  curveVertex(-5,  -108);
  curveVertex(12,  -158);
  curveVertex(-16, -180);
  curveVertex(-58, -168);
  curveVertex(-86, -126);
  curveVertex(-82, -78);
  curveVertex(-58, -52);
  curveVertex(-18, -52);
  curveVertex(-18, -52);
  endShape(CLOSE);
}

// ── BEAK ─────────────────────────────────────────────────────────────────
function drawBeak() {
  fill(205, 218, 238);
  stroke(25, 30, 65);
  strokeWeight(5);

  // upper beak
  beginShape();
  curveVertex(-68, -92);
  curveVertex(-68, -92);
  curveVertex(-115, -92);
  curveVertex(-142, -86);
  curveVertex(-120, -76);
  curveVertex(-72, -76);
  curveVertex(-68, -92);
  curveVertex(-68, -92);
  endShape(CLOSE);

  // lower beak
  beginShape();
  curveVertex(-68, -76);
  curveVertex(-68, -76);
  curveVertex(-110, -76);
  curveVertex(-126, -69);
  curveVertex(-104, -62);
  curveVertex(-70, -64);
  curveVertex(-68, -76);
  curveVertex(-68, -76);
  endShape(CLOSE);
}

// ── EYE ──────────────────────────────────────────────────────────────────
function drawEye() {
  let ex = -34, ey = -120;

  // blue brow ridge (iconic Lugia marking)
  fill(105, 158, 225);
  stroke(25, 30, 65);
  strokeWeight(3);
  beginShape();
  curveVertex(-55, -140);
  curveVertex(-55, -140);
  curveVertex(-34, -148);
  curveVertex(-12, -140);
  curveVertex(-18, -130);
  curveVertex(-48, -130);
  curveVertex(-55, -140);
  curveVertex(-55, -140);
  endShape(CLOSE);

  // outer ring (blue)
  fill(88, 142, 218);
  stroke(25, 30, 65);
  strokeWeight(3);
  ellipse(ex, ey, 40, 30);

  // white sclera
  fill(238, 244, 255);
  noStroke();
  ellipse(ex, ey, 27, 20);

  // red iris
  fill(218, 48, 48);
  ellipse(ex, ey, 16, 16);

  // dark pupil
  fill(15, 15, 35);
  ellipse(ex, ey, 7, 7);

  // specular highlight
  fill(255, 255, 255, 230);
  ellipse(ex + 4, ey - 3, 5, 4);
}

// ── BACK SPINES ───────────────────────────────────────────────────────────
function drawBackSpines() {
  fill(150, 192, 238);
  stroke(25, 30, 65);
  strokeWeight(4);

  // 4 triangular spines along the upper back
  let spines = [
    [[-48, -42], [-26, -42], [-37, -90]],
    [[-14, -42], [ 10, -42], [ -2, -88]],
    [[ 20, -42], [ 44, -42], [ 32, -84]],
    [[ 52, -42], [ 72, -42], [ 62, -78]],
  ];

  for (let [[lx, ly], [rx, ry], [tx, ty]] of spines) {
    beginShape();
    vertex(lx, ly);
    vertex(tx, ty);
    vertex(rx, ry);
    endShape(CLOSE);
  }
}

// ── WINGS ────────────────────────────────────────────────────────────────
function drawRightWing() {
  fill(245, 249, 255);
  stroke(25, 30, 65);
  strokeWeight(6);

  beginShape();
  curveVertex(55, 2);
  curveVertex(55, 2);
  curveVertex(115, -38);
  curveVertex(195, -78);
  curveVertex(240, -48);
  curveVertex(222, 28);
  curveVertex(150, 68);
  curveVertex(72, 62);
  curveVertex(55, 2);
  curveVertex(55, 2);
  endShape(CLOSE);

  drawWingFingers(1);
}

function drawLeftWing() {
  fill(245, 249, 255);
  stroke(25, 30, 65);
  strokeWeight(6);

  beginShape();
  curveVertex(-55, 2);
  curveVertex(-55, 2);
  curveVertex(-115, -38);
  curveVertex(-195, -78);
  curveVertex(-240, -48);
  curveVertex(-222, 28);
  curveVertex(-150, 68);
  curveVertex(-72, 62);
  curveVertex(-55, 2);
  curveVertex(-55, 2);
  endShape(CLOSE);

  drawWingFingers(-1);
}

// dir: 1 = right wing, -1 = left wing
function drawWingFingers(dir) {
  fill(245, 249, 255);
  stroke(25, 30, 65);
  strokeWeight(4);

  // 3 pointed finger tips at the wing's leading edge
  let fingers = [
    [dir * 182, -74, dir * 218, -112, dir * 205, -80],
    [dir * 228, -50, dir * 262, -70,  dir * 248, -38],
    [dir * 232, -12, dir * 268,  -8,  dir * 250,  14],
  ];

  for (let [bx, by, tx, ty, ex, ey] of fingers) {
    beginShape();
    vertex(bx, by);
    vertex(tx, ty);
    vertex(ex, ey);
    endShape(CLOSE);
  }
}

// ── TAIL ─────────────────────────────────────────────────────────────────
function drawTail() {
  fill(245, 249, 255);
  stroke(25, 30, 65);
  strokeWeight(5);

  // tail body
  beginShape();
  curveVertex(58, 102);
  curveVertex(58, 102);
  curveVertex(75, 142);
  curveVertex(90, 178);
  curveVertex(80, 202);
  curveVertex(60, 196);
  curveVertex(44, 162);
  curveVertex(40, 120);
  curveVertex(58, 102);
  curveVertex(58, 102);
  endShape(CLOSE);

  // 3 tail fin protrusions
  strokeWeight(3);

  let fins = [
    [[64, 150], [98, 158],  [94, 174],  [66, 170]],
    [[72, 172], [108, 174], [110, 188], [75, 190]],
    [[56, 190], [80, 202],  [74, 215],  [50, 208]],
  ];

  for (let pts of fins) {
    beginShape();
    for (let [px, py] of pts) vertex(px, py);
    endShape(CLOSE);
  }
}

// ── KEY HANDLERS ─────────────────────────────────────────────────────────
function keyPressed() {
  if (key === 's') {
    saveGif(`lugia-${round(new Date().getTime() / 100000)}`, 5);
  }
  if (key === 'c') {
    saveCanvas(`lugia-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
