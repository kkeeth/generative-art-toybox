"use strict";

// ── 参照画像設定 ─────────────────────────────────────────────────────────
// このフォルダに 'reference.jpg'（または .png）を置くと
// 半透明の参照画像として背景に表示されます
// キー操作: r = 表示切替 / ↑↓ = 不透明度調整

let W;
let refImg = null;
let showRef = true;
let refAlpha = 55;

// PS1アート風カラーパレット
const C = {
  wing:  [220,  88,  88],
  body:  [ 88, 140, 220],
  head:  [220, 155,  55],
  spine: [ 70, 185, 125],
  tail:  [168,  82, 210],
  beak:  [155, 170, 205],
};

function preload() {
  loadImage(
    'reference.jpg',
    (img) => { refImg = img; },
    ()    => {
      loadImage(
        'reference.png',
        (img) => { refImg = img; },
        ()    => { refImg = null; }
      );
    }
  );
}

function setup() {
  createCanvas((W = min(windowWidth, windowHeight) - 50), W);
  noLoop();
}

function draw() {
  background(248, 250, 255);

  if (refImg && showRef) {
    push();
    tint(255, refAlpha);
    imageMode(CORNER);
    let sc = min(W / refImg.width, W / refImg.height);
    let ox = (W - refImg.width  * sc) / 2;
    let oy = (W - refImg.height * sc) / 2;
    image(refImg, ox, oy, refImg.width * sc, refImg.height * sc);
    pop();

    push();
    noStroke();
    fill(80, 80, 120, 180);
    textSize(12);
    textAlign(RIGHT);
    text(`ref: ${round(refAlpha / 255 * 100)}%  [r: 切替 ↑↓: 濃淡]`, W - 8, 18);
    pop();
  }

  push();
  translate(W / 2, W / 2);
  scale(W / 600);
  strokeJoin(ROUND);
  strokeCap(ROUND);
  drawLugia();
  pop();
}

// ─────────────────────────────────────────────────────────────────────────
function drawLugia() {
  // 正面視点：翼が横に広がり、胴体が手前に大きく見えるポーズ
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
// 正面から見た丸い胴体
function drawBody() {
  fill(248, 251, 255);
  stroke(...C.body);
  strokeWeight(6);

  beginShape();
  curveVertex(-30, -78);
  curveVertex(-30, -78);
  curveVertex(-98, -18);
  curveVertex(-102, 55);
  curveVertex(-65, 130);
  curveVertex(  0, 142);
  curveVertex( 65, 130);
  curveVertex(102, 55);
  curveVertex( 98, -18);
  curveVertex( 30, -78);
  curveVertex(-30, -78);
  curveVertex(-30, -78);
  endShape(CLOSE);
}

function drawBellyPlate() {
  fill(168, 206, 248);
  noStroke();

  beginShape();
  curveVertex(-18, -50);
  curveVertex(-18, -50);
  curveVertex(-68, -8);
  curveVertex(-70, 58);
  curveVertex(-40, 112);
  curveVertex(  0, 122);
  curveVertex( 40, 112);
  curveVertex( 70, 58);
  curveVertex( 68, -8);
  curveVertex( 18, -50);
  curveVertex(-18, -50);
  curveVertex(-18, -50);
  endShape(CLOSE);
}

// ── NECK ─────────────────────────────────────────────────────────────────
function drawNeck() {
  fill(248, 251, 255);
  stroke(...C.head);
  strokeWeight(6);

  beginShape();
  curveVertex(-28, -78);
  curveVertex(-28, -78);
  curveVertex(-38, -98);
  curveVertex(-28, -115);
  curveVertex( 12, -115);
  curveVertex( 22, -98);
  curveVertex( 12, -78);
  curveVertex(-28, -78);
  curveVertex(-28, -78);
  endShape(CLOSE);
}

// ── HEAD ─────────────────────────────────────────────────────────────────
// 正面向き、やや左向きのデフォルメ頭部
function drawHead() {
  fill(248, 251, 255);
  stroke(...C.head);
  strokeWeight(6);

  beginShape();
  curveVertex(-18, -112);
  curveVertex(-18, -112);
  curveVertex(-55, -128);
  curveVertex(-65, -158);
  curveVertex(-48, -182);
  curveVertex(-12, -192);
  curveVertex( 22, -182);
  curveVertex( 35, -158);
  curveVertex( 22, -128);
  curveVertex(  8, -112);
  curveVertex(-18, -112);
  curveVertex(-18, -112);
  endShape(CLOSE);
}

// ── BEAK ─────────────────────────────────────────────────────────────────
function drawBeak() {
  fill(212, 222, 240);
  stroke(...C.beak);
  strokeWeight(5);

  // upper beak
  beginShape();
  curveVertex(-42, -130);
  curveVertex(-42, -130);
  curveVertex(-82, -128);
  curveVertex(-102, -120);
  curveVertex( -82, -110);
  curveVertex( -45, -110);
  curveVertex(-42, -130);
  curveVertex(-42, -130);
  endShape(CLOSE);

  // lower beak
  beginShape();
  curveVertex( -42, -110);
  curveVertex( -42, -110);
  curveVertex( -78, -110);
  curveVertex( -94, -103);
  curveVertex( -75,  -95);
  curveVertex( -44,  -97);
  curveVertex( -42, -110);
  curveVertex( -42, -110);
  endShape(CLOSE);
}

// ── EYE ──────────────────────────────────────────────────────────────────
function drawEye() {
  let ex = -15, ey = -158;

  // brow ridge
  fill(105, 158, 225);
  stroke(25, 30, 65);
  strokeWeight(3);
  beginShape();
  curveVertex(-35, -174);
  curveVertex(-35, -174);
  curveVertex(-15, -182);
  curveVertex(  5, -174);
  curveVertex( -2, -165);
  curveVertex(-28, -165);
  curveVertex(-35, -174);
  curveVertex(-35, -174);
  endShape(CLOSE);

  fill(88, 142, 218);
  stroke(25, 30, 65);
  strokeWeight(3);
  ellipse(ex, ey, 36, 28);

  fill(238, 244, 255);
  noStroke();
  ellipse(ex, ey, 24, 18);

  fill(218, 48, 48);
  ellipse(ex, ey, 14, 14);

  fill(15, 15, 35);
  ellipse(ex, ey, 6, 6);

  fill(255, 255, 255, 230);
  ellipse(ex + 4, ey - 3, 4, 3);
}

// ── BACK SPINES ───────────────────────────────────────────────────────────
// 正面視点では右肩の後ろ側に見える
function drawBackSpines() {
  fill(150, 220, 190);
  stroke(...C.spine);
  strokeWeight(4);

  let spines = [
    [[ 35, -78], [ 52, -78], [ 43, -115]],
    [[ 52, -70], [ 68, -70], [ 60, -106]],
    [[ 65, -58], [ 80, -58], [ 72,  -95]],
    [[ 75, -42], [ 90, -42], [ 82,  -80]],
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
// 正面から横に大きく広がる翼（参照画像に合わせた水平展開）
function drawLeftWing() {
  fill(248, 251, 255);
  stroke(...C.wing);
  strokeWeight(6);

  beginShape();
  curveVertex( -90, -15);
  curveVertex( -90, -15);
  curveVertex(-148, -45);
  curveVertex(-210, -62);
  curveVertex(-255, -45);
  curveVertex(-238,   8);
  curveVertex(-172,  32);
  curveVertex( -92,  30);
  curveVertex( -90, -15);
  curveVertex( -90, -15);
  endShape(CLOSE);

  // 翼膜ライン
  stroke(...C.wing);
  strokeWeight(2);
  line(-96,  28, -242, -28);
  line(-100, 14, -250, -14);
  line(-105,  0, -255,  -2);

  // 翼端の指
  fill(248, 251, 255);
  stroke(...C.wing);
  strokeWeight(4);
  let fingers = [
    [[-208, -60], [-248, -72], [-230, -48]],
    [[-230, -48], [-268, -55], [-252, -30]],
    [[-240, -28], [-278, -28], [-262,  -8]],
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
  fill(248, 251, 255);
  stroke(...C.wing);
  strokeWeight(6);

  beginShape();
  curveVertex(  90, -15);
  curveVertex(  90, -15);
  curveVertex( 148, -45);
  curveVertex( 210, -62);
  curveVertex( 255, -45);
  curveVertex( 238,   8);
  curveVertex( 172,  32);
  curveVertex(  92,  30);
  curveVertex(  90, -15);
  curveVertex(  90, -15);
  endShape(CLOSE);

  stroke(...C.wing);
  strokeWeight(2);
  line( 96,  28, 242, -28);
  line(100,  14, 250, -14);
  line(105,   0, 255,  -2);

  fill(248, 251, 255);
  stroke(...C.wing);
  strokeWeight(4);
  let fingers = [
    [[208, -60], [248, -72], [230, -48]],
    [[230, -48], [268, -55], [252, -30]],
    [[240, -28], [278, -28], [262,  -8]],
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
  fill(248, 251, 255);
  stroke(...C.tail);
  strokeWeight(5);

  beginShape();
  curveVertex( 22, 140);
  curveVertex( 22, 140);
  curveVertex( 60, 165);
  curveVertex( 92, 198);
  curveVertex( 98, 230);
  curveVertex( 75, 242);
  curveVertex( 48, 235);
  curveVertex( 20, 208);
  curveVertex(  5, 172);
  curveVertex(  5, 145);
  curveVertex( 22, 140);
  curveVertex( 22, 140);
  endShape(CLOSE);

  strokeWeight(3);
  let fins = [
    [[ 78, 220], [105, 240], [ 95, 252], [ 70, 235]],
    [[ 55, 228], [ 78, 252], [ 60, 258], [ 40, 238]],
    [[ 35, 225], [ 48, 250], [ 30, 255], [ 15, 232]],
  ];
  for (let pts of fins) {
    beginShape();
    for (let [px, py] of pts) vertex(px, py);
    endShape(CLOSE);
  }
}

// ── FEET ─────────────────────────────────────────────────────────────────
function drawFeet() {
  drawFoot(-35, 140);
  drawFoot( 18, 144);
}

function drawFoot(fx, fy) {
  fill(248, 251, 255);
  stroke(...C.body);
  strokeWeight(5);

  let toes = [
    [fx - 5, fy, fx - 22, fy + 30, fx - 16, fy + 40],
    [fx,     fy, fx,      fy + 34, fx +  6, fy + 43],
    [fx + 5, fy, fx + 20, fy + 30, fx + 26, fy + 40],
  ];

  for (let [x1, y1, x2, y2, cx, cy] of toes) {
    line(x1, y1, x2, y2);
    strokeWeight(3);
    fill(248, 251, 255);
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
  if (key === 'r') {
    showRef = !showRef;
    redraw();
  }
  if (keyCode === UP_ARROW && refImg) {
    refAlpha = min(255, refAlpha + 25);
    redraw();
  }
  if (keyCode === DOWN_ARROW && refImg) {
    refAlpha = max(0, refAlpha - 25);
    redraw();
  }
  if (key === 's') {
    saveGif(`lugia-${round(new Date().getTime() / 100000)}`, 5);
  }
  if (key === 'c') {
    saveCanvas(`lugia-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
