"use strict";

let W;

function setup() {
  createCanvas((W = min(windowWidth, windowHeight) - 50), W);
  noLoop();
}

function draw() {
  background(248, 250, 255);
  translate(W / 2, W / 2);
  scale(W / 600);
  strokeJoin(ROUND);
  strokeCap(ROUND);
  drawLugia();
}

function drawLugia() {
  // Draw order: back → body → front details
  drawRightWing();
  drawLeftWing();
  drawTail();
  drawBody();
  drawBellyPlate();
  drawNeck();
  drawBackSpines();
  drawHead();
  drawBeak();
  drawEye();
  drawFeet();
}

// ── BODY ─────────────────────────────────────────────────────────────────
// Upright barrel shape (wider than previous, more "bird chest" feeling)
function drawBody() {
  fill(245, 249, 255);
  stroke(25, 30, 65);
  strokeWeight(6);

  beginShape();
  curveVertex(-32, -58);
  curveVertex(-32, -58);
  curveVertex(-85,   2);
  curveVertex(-80,  75);
  curveVertex(-42, 125);
  curveVertex( 15, 138);
  curveVertex( 72, 118);
  curveVertex( 90,  48);
  curveVertex( 78, -22);
  curveVertex( 22, -60);
  curveVertex(-32, -58);
  curveVertex(-32, -58);
  endShape(CLOSE);
}

function drawBellyPlate() {
  fill(168, 206, 248);
  noStroke();

  beginShape();
  curveVertex(-15, -22);
  curveVertex(-15, -22);
  curveVertex(-45,  22);
  curveVertex(-40,  78);
  curveVertex(  2, 115);
  curveVertex( 48, 110);
  curveVertex( 70,  68);
  curveVertex( 58,  18);
  curveVertex( 18, -20);
  curveVertex(-15, -22);
  curveVertex(-15, -22);
  endShape(CLOSE);
}

// ── NECK ─────────────────────────────────────────────────────────────────
function drawNeck() {
  fill(245, 249, 255);
  stroke(25, 30, 65);
  strokeWeight(6);

  beginShape();
  curveVertex(-32, -58);
  curveVertex(-32, -58);
  curveVertex(-50, -75);
  curveVertex(-48, -95);
  curveVertex(-22, -98);
  curveVertex( -2, -82);
  curveVertex(  0, -60);
  curveVertex(-10, -58);
  curveVertex(-32, -58);
  curveVertex(-32, -58);
  endShape(CLOSE);
}

// ── HEAD ─────────────────────────────────────────────────────────────────
// Large chibi head, facing left. Crest at top.
function drawHead() {
  fill(245, 249, 255);
  stroke(25, 30, 65);
  strokeWeight(6);

  beginShape();
  curveVertex(-22, -95);
  curveVertex(-22, -95);
  curveVertex(-58, -112);  // lower-left (beak junction)
  curveVertex(-68, -142);  // left
  curveVertex(-55, -170);  // upper-left
  curveVertex(-28, -185);  // crest (top)
  curveVertex(  5, -175);  // upper-right
  curveVertex( 15, -148);  // right
  curveVertex(  5, -120);  // lower-right
  curveVertex(-15,  -95);  // neck junction
  curveVertex(-22, -95);
  curveVertex(-22, -95);
  endShape(CLOSE);
}

// ── BEAK ─────────────────────────────────────────────────────────────────
function drawBeak() {
  fill(205, 218, 238);
  stroke(25, 30, 65);
  strokeWeight(5);

  // upper beak (points left)
  beginShape();
  curveVertex(-58, -118);
  curveVertex(-58, -118);
  curveVertex(-102, -118);
  curveVertex(-128, -110);
  curveVertex(-108,  -99);
  curveVertex( -62,  -99);
  curveVertex(-58, -118);
  curveVertex(-58, -118);
  endShape(CLOSE);

  // lower beak
  beginShape();
  curveVertex( -58,  -99);
  curveVertex( -58,  -99);
  curveVertex( -98,  -99);
  curveVertex(-114,  -92);
  curveVertex( -94,  -84);
  curveVertex( -60,  -86);
  curveVertex( -58,  -99);
  curveVertex( -58,  -99);
  endShape(CLOSE);
}

// ── EYE ──────────────────────────────────────────────────────────────────
function drawEye() {
  let ex = -22, ey = -148;

  // blue brow ridge marking
  fill(105, 158, 225);
  stroke(25, 30, 65);
  strokeWeight(3);
  beginShape();
  curveVertex(-42, -164);
  curveVertex(-42, -164);
  curveVertex(-22, -172);
  curveVertex( -2, -164);
  curveVertex( -8, -155);
  curveVertex(-36, -155);
  curveVertex(-42, -164);
  curveVertex(-42, -164);
  endShape(CLOSE);

  // outer ring (blue)
  fill(88, 142, 218);
  stroke(25, 30, 65);
  strokeWeight(3);
  ellipse(ex, ey, 36, 28);

  // white sclera
  fill(238, 244, 255);
  noStroke();
  ellipse(ex, ey, 24, 18);

  // red iris
  fill(218, 48, 48);
  ellipse(ex, ey, 14, 14);

  // dark pupil
  fill(15, 15, 35);
  ellipse(ex, ey, 6, 6);

  // specular highlight
  fill(255, 255, 255, 230);
  ellipse(ex + 4, ey - 3, 4, 3);
}

// ── BACK SPINES ───────────────────────────────────────────────────────────
// 4 triangular spines, visible on the right/back side
function drawBackSpines() {
  fill(150, 192, 238);
  stroke(25, 30, 65);
  strokeWeight(4);

  let spines = [
    [[ 55, -58], [ 72, -58], [ 63, -92]],
    [[ 65, -22], [ 82, -22], [ 74, -58]],
    [[ 72,  15], [ 90,  15], [ 81, -20]],
    [[ 75,  50], [ 92,  50], [ 84,  15]],
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
// Wings sweep UPWARD and outward — this is the key fix from previous version
function drawLeftWing() {
  fill(245, 249, 255);
  stroke(25, 30, 65);
  strokeWeight(6);

  // Main wing body: sweeps from body-left UP and to the left
  beginShape();
  curveVertex(-65, -15);
  curveVertex(-65, -15);
  curveVertex(-115, -65);   // leading up
  curveVertex(-180, -122);  // leading mid
  curveVertex(-228, -165);  // wing tip
  curveVertex(-192,  -88);  // trailing upper
  curveVertex(-135,  -30);  // trailing lower
  curveVertex( -80,  42);   // trailing root
  curveVertex(-65, -15);
  curveVertex(-65, -15);
  endShape(CLOSE);

  // Interior structure lines (wing membrane look)
  stroke(25, 30, 65);
  strokeWeight(2);
  line( -82, 38, -205, -115);
  line( -90, 22, -215, -132);
  line(-100,  8, -222, -148);

  // 3 wing-tip fingers
  fill(245, 249, 255);
  strokeWeight(4);
  let fingers = [
    [[-198, -128], [-228, -162], [-212, -148]],
    [[-210, -145], [-242, -182], [-226, -162]],
    [[-220, -158], [-252, -200], [-236, -178]],
  ];
  for (let [[lx, ly], [tx, ty], [rx, ry]] of fingers) {
    beginShape();
    vertex(lx, ly);
    vertex(tx, ty);
    vertex(rx, ry);
    endShape(CLOSE);
  }
}

function drawRightWing() {
  fill(245, 249, 255);
  stroke(25, 30, 65);
  strokeWeight(6);

  // Mirror of left wing, slightly different angle
  beginShape();
  curveVertex( 65, -15);
  curveVertex( 65, -15);
  curveVertex(112, -62);
  curveVertex(175, -118);
  curveVertex(222, -158);
  curveVertex(188,  -82);
  curveVertex(132,  -28);
  curveVertex( 78,  42);
  curveVertex( 65, -15);
  curveVertex( 65, -15);
  endShape(CLOSE);

  // Interior structure lines
  stroke(25, 30, 65);
  strokeWeight(2);
  line( 80, 38, 198, -108);
  line( 88, 22, 210, -125);
  line( 98,  8, 218, -140);

  // 3 wing-tip fingers
  fill(245, 249, 255);
  strokeWeight(4);
  let fingers = [
    [[192, -122], [222, -155], [208, -142]],
    [[205, -138], [238, -175], [222, -158]],
    [[215, -150], [248, -192], [232, -170]],
  ];
  for (let [[lx, ly], [tx, ty], [rx, ry]] of fingers) {
    beginShape();
    vertex(lx, ly);
    vertex(tx, ty);
    vertex(rx, ry);
    endShape(CLOSE);
  }
}

// ── TAIL ─────────────────────────────────────────────────────────────────
function drawTail() {
  fill(245, 249, 255);
  stroke(25, 30, 65);
  strokeWeight(5);

  // Long sweeping tail — C-curve going down from body bottom-right
  beginShape();
  curveVertex( 28, 130);
  curveVertex( 28, 130);
  curveVertex( 68, 155);
  curveVertex(105, 185);
  curveVertex(122, 215);
  curveVertex(108, 232);
  curveVertex( 82, 225);
  curveVertex( 48, 198);
  curveVertex( 15, 162);
  curveVertex(  8, 138);
  curveVertex( 28, 130);
  curveVertex( 28, 130);
  endShape(CLOSE);

  // 3 tail-end spike fins
  strokeWeight(3);
  let fins = [
    [[ 90, 215], [115, 238], [105, 250], [ 80, 230]],
    [[ 68, 222], [ 88, 250], [ 68, 255], [ 50, 232]],
    [[ 48, 218], [ 58, 245], [ 38, 248], [ 25, 224]],
  ];
  for (let pts of fins) {
    beginShape();
    for (let [px, py] of pts) vertex(px, py);
    endShape(CLOSE);
  }
}

// ── FEET ─────────────────────────────────────────────────────────────────
function drawFeet() {
  drawFoot(-40, 130);
  drawFoot( 20, 138);
}

function drawFoot(fx, fy) {
  fill(245, 249, 255);
  stroke(25, 30, 65);
  strokeWeight(5);

  // 3 toes with small claw tips
  let toes = [
    [fx - 5, fy, fx - 22, fy + 30, fx - 16, fy + 40],
    [fx,     fy, fx,      fy + 34, fx +  6, fy + 43],
    [fx + 5, fy, fx + 20, fy + 30, fx + 26, fy + 40],
  ];

  for (let [x1, y1, x2, y2, cx, cy] of toes) {
    line(x1, y1, x2, y2);
    strokeWeight(3);
    fill(245, 249, 255);
    beginShape();
    vertex(x2 - 4, y2 - 2);
    vertex(cx, cy);
    vertex(x2 + 4, y2 - 2);
    endShape(CLOSE);
    strokeWeight(5);
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
