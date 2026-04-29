"use strict";

// ── 参照画像設定 ─────────────────────────────────────────────────────────
// このフォルダに 'reference.jpg'（または .png）を置くと
// 半透明の参照画像として背景に表示されます
// キー操作: r = 表示切替 / ↑↓ = 不透明度調整

let W;
let refImg = null;
let showRef = true;
let refAlpha = 55; // 参照画像の不透明度 (0-255)

// PS1アート風カラーパレット（パーツごとに色を変える）
const C = {
  wing:  [220,  88,  88],   // 翼: 赤
  body:  [ 88, 140, 220],   // 体: 青
  head:  [220, 155,  55],   // 頭: オレンジ
  spine: [ 70, 185, 125],   // 背中トゲ: 緑
  tail:  [168,  82, 210],   // 尻尾: 紫
  beak:  [155, 170, 205],   // くちばし: グレー青
  eye:   [ 88, 142, 218],   // 目リング: 青
};

// ─────────────────────────────────────────────────────────────────────────
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

  // 参照画像を半透明で表示
  if (refImg && showRef) {
    push();
    tint(255, refAlpha);
    imageMode(CORNER);
    // アスペクト比を保ちつつ中央配置
    let rw = refImg.width, rh = refImg.height;
    let scale = min(W / rw, W / rh);
    let ox = (W - rw * scale) / 2;
    let oy = (W - rh * scale) / 2;
    image(refImg, ox, oy, rw * scale, rh * scale);
    pop();

    // 不透明度のインジケーター（右上に小さく）
    push();
    noStroke();
    fill(80, 80, 120, 180);
    textSize(12);
    textAlign(RIGHT);
    text(`ref: ${round(refAlpha / 255 * 100)}%  [r: 切替 ↑↓: 濃淡]`, W - 8, 18);
    pop();
  } else if (!refImg) {
    // 参照画像がない場合のガイドメッセージ
    push();
    noStroke();
    fill(180, 180, 200);
    textSize(13);
    textAlign(CENTER);
    text("reference.jpg をこのフォルダに置くと参照画像が表示されます", W / 2, 22);
    pop();
  }

  // ルギア線画を描く
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
function drawBody() {
  fill(248, 251, 255);
  stroke(...C.body);
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
  fill(248, 251, 255);
  stroke(...C.head);
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
function drawHead() {
  fill(248, 251, 255);
  stroke(...C.head);
  strokeWeight(6);

  beginShape();
  curveVertex(-22, -95);
  curveVertex(-22, -95);
  curveVertex(-58, -112);
  curveVertex(-68, -142);
  curveVertex(-55, -170);
  curveVertex(-28, -185);
  curveVertex(  5, -175);
  curveVertex( 15, -148);
  curveVertex(  5, -120);
  curveVertex(-15,  -95);
  curveVertex(-22, -95);
  curveVertex(-22, -95);
  endShape(CLOSE);
}

// ── BEAK ─────────────────────────────────────────────────────────────────
function drawBeak() {
  fill(212, 222, 240);
  stroke(...C.beak);
  strokeWeight(5);

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
function drawBackSpines() {
  fill(150, 220, 190);
  stroke(...C.spine);
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
function drawLeftWing() {
  fill(248, 251, 255);
  stroke(...C.wing);
  strokeWeight(6);

  beginShape();
  curveVertex(-65, -15);
  curveVertex(-65, -15);
  curveVertex(-115, -65);
  curveVertex(-180, -122);
  curveVertex(-228, -165);
  curveVertex(-192,  -88);
  curveVertex(-135,  -30);
  curveVertex( -80,  42);
  curveVertex(-65, -15);
  curveVertex(-65, -15);
  endShape(CLOSE);

  // 翼膜の構造線
  strokeWeight(2);
  line( -82, 38, -205, -115);
  line( -90, 22, -215, -132);
  line(-100,  8, -222, -148);

  // 翼端の指
  strokeWeight(4);
  let fingers = [
    [[-198, -128], [-228, -162], [-212, -148]],
    [[-210, -145], [-242, -182], [-226, -162]],
    [[-220, -158], [-252, -200], [-236, -178]],
  ];
  for (let [[lx, ly], [tx, ty], [rx, ry]] of fingers) {
    fill(248, 251, 255);
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

  strokeWeight(2);
  line( 80, 38, 198, -108);
  line( 88, 22, 210, -125);
  line( 98,  8, 218, -140);

  strokeWeight(4);
  let fingers = [
    [[192, -122], [222, -155], [208, -142]],
    [[205, -138], [238, -175], [222, -158]],
    [[215, -150], [248, -192], [232, -170]],
  ];
  for (let [[lx, ly], [tx, ty], [rx, ry]] of fingers) {
    fill(248, 251, 255);
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
