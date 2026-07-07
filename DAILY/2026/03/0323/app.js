// "Crystal Prism" - 10枚の正方形スライスが重なって一つの3D宝石を描く
//
// アイデア:
//   正方形 = 3D空間の奥行きスライス（断面）
//   各スライスに六角形の断面を描く
//   断面はベル曲線で大小が変化（奥:小 → 中間:大 → 手前:小）
//   各層を少しずつ回転させることで"ねじれた宝石"の立体感を演出
//   正方形の四隅を線でつなぐとトンネル状の奥行きが生まれる

let W;
let baseHue;

const N = 10; // スライス枚数

function setup() {
  W = min(windowWidth, windowHeight) - 50;
  createCanvas(W, W);
  colorMode(HSB, 360, 100, 100, 100);
  baseHue = random(360);
}

function draw() {
  background(230, 30, 8);
  translate(W / 2, W / 2);

  let t = frameCount * 0.006;

  // 奥(i=0)から手前(i=N-1)へ描画
  for (let i = 0; i < N; i++) {
    let frameS = getFrameSize(i);   // 正方形の一辺半分
    let crossR  = getCrossRadius(i); // このスライスの宝石断面の半径
    let hue     = (baseHue + i * 26) % 360;

    // 隣のスライスとの間をトンネル壁で埋める
    if (i > 0) {
      let prevS = getFrameSize(i - 1);
      drawTunnelWalls(prevS, frameS, hue, t);
    }

    // 正方形フレーム
    push();
    noFill();
    stroke(hue, 40, 95, 75);
    strokeWeight(1.4);
    rectMode(CENTER);
    rect(0, 0, frameS * 2, frameS * 2);
    pop();

    // このスライスの宝石断面
    if (crossR > 4) {
      let twist = i * 12 + t * (20 + i * 3); // 層ごとに異なる速さで回転
      drawCrystalSlice(crossR, hue, 68, radians(twist), i);
    }
  }
}

// ---- 正方形フレームのサイズ（奥=小 → 手前=大）----
function getFrameSize(i) {
  return lerp(W * 0.05, W * 0.43, i / (N - 1));
}

// ---- 宝石断面の半径（ベル曲線: 中間層が最大）----
function getCrossRadius(i) {
  let t = i / (N - 1); // 0〜1
  return sin(t * PI) * W * 0.28;
}

// ---- トンネルの壁（台形パネル4枚）----
function drawTunnelWalls(sBack, sFront, hue, t) {
  // sBack < sFront（奥が小さく、手前が大きい）
  let alpha = 38;
  let wallHue = (hue + 180) % 360; // 補色で壁に奥行き差をつける

  // 上面
  fill(hue, 50, 40, alpha);
  noStroke();
  beginShape();
  vertex(-sFront, -sFront);
  vertex( sFront, -sFront);
  vertex( sBack,  -sBack);
  vertex(-sBack,  -sBack);
  endShape(CLOSE);

  // 下面
  fill(wallHue, 45, 35, alpha);
  beginShape();
  vertex(-sFront, sFront);
  vertex( sFront, sFront);
  vertex( sBack,  sBack);
  vertex(-sBack,  sBack);
  endShape(CLOSE);

  // 左面
  fill(hue, 40, 50, alpha);
  beginShape();
  vertex(-sFront, -sFront);
  vertex(-sFront,  sFront);
  vertex(-sBack,   sBack);
  vertex(-sBack,  -sBack);
  endShape(CLOSE);

  // 右面
  fill(wallHue, 40, 55, alpha);
  beginShape();
  vertex( sFront, -sFront);
  vertex( sFront,  sFront);
  vertex( sBack,   sBack);
  vertex( sBack,  -sBack);
  endShape(CLOSE);

  // 稜線（エッジ）
  stroke(hue, 30, 100, 55);
  strokeWeight(0.8);
  line(-sFront, -sFront, -sBack, -sBack);
  line( sFront, -sFront,  sBack, -sBack);
  line( sFront,  sFront,  sBack,  sBack);
  line(-sFront,  sFront, -sBack,  sBack);
}

// ---- 宝石の断面（六角形 + 内側リング + ファセット線）----
function drawCrystalSlice(r, hue, alpha, twist, layerIndex) {
  let sides = 6;

  push();
  rotate(twist);

  // 外側六角形（半透明塗り）
  fill(hue, 65, 80, alpha * 0.55);
  stroke(hue, 50, 100, alpha);
  strokeWeight(1.5);
  beginShape();
  for (let j = 0; j < sides; j++) {
    let a = (j / sides) * TWO_PI;
    vertex(cos(a) * r, sin(a) * r);
  }
  endShape(CLOSE);

  // 中心からファセット線
  stroke(hue, 40, 100, alpha * 0.55);
  strokeWeight(0.8);
  for (let j = 0; j < sides; j++) {
    let a = (j / sides) * TWO_PI;
    line(0, 0, cos(a) * r, sin(a) * r);
  }

  // 内側リング
  noFill();
  stroke(hue, 55, 100, alpha * 0.6);
  strokeWeight(1.2);
  beginShape();
  for (let j = 0; j < sides; j++) {
    let a = (j / sides) * TWO_PI;
    vertex(cos(a) * r * 0.5, sin(a) * r * 0.5);
  }
  endShape(CLOSE);

  // 頂点に小さな輝点
  fill(hue, 20, 100, alpha * 0.9);
  noStroke();
  for (let j = 0; j < sides; j++) {
    let a = (j / sides) * TWO_PI;
    ellipse(cos(a) * r, sin(a) * r, 5, 5);
  }

  pop();
}

// ---- キー操作 ----
function keyPressed() {
  if (key === "r" || key === "R") {
    baseHue = random(360);
  }
  if (key === "c" || key === "C") {
    let ts = year() + nf(month(), 2) + nf(day(), 2) + nf(hour(), 2) + nf(minute(), 2);
    saveCanvas(`crystal-prism-${ts}`, "jpg");
  }
  if (key === "s" || key === "S") {
    let ts = year() + nf(month(), 2) + nf(day(), 2) + nf(hour(), 2) + nf(minute(), 2);
    saveGif(`crystal-prism-${ts}`, 5);
  }
}
