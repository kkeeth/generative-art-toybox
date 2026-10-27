// 2026-10-26 Daily 01 — 流れるラインアート
// 抽象画 / ラインアートのデイリー再開・第1作のプロトタイプ。
//
// この作品の約束ごと（ユーザーの方針に合わせたもの）:
// - 画像そのものを生成するのではなく、コードで描く。再現性がある。
// - SEED を変えなければ、いつ開いても同じ絵になる。
// - PARAMS の数値を変えるだけで、誰でも別の作品に伸ばせる。
//
// 使い方:
// - index.html をブラウザで開くだけで描画される。
// - キー [s] … PNG で保存（ファイル名に SEED が入る）
// - キー [n] … 新しい SEED で描き直す（気に入った SEED は PARAMS に戻す）
// - キー [1] [2] [3] … 線の密度プリセットを切り替える

let SEED = 20261026;

const PARAMS = {
  lineCount: 90,      // 線の本数
  step: 6,            // 1歩の長さ（px）。小さいほど滑らか
  noiseScale: 0.0022, // ノイズの粗さ。小さいほどゆったりした流れ
  turnStrength: 1.6,  // 曲がりやすさ
  maxWeight: 1.8,     // 線の太さの上限
  margin: 60,         // 余白
};

// 墨っぽい単色 + ほんの少しだけ入るアクセント。抽象画らしく色数を絞る。
const INK = [28, 28, 32];
const ACCENT = [196, 84, 52];

function setup() {
  createCanvas(800, 800);
  pixelDensity(2);
  noLoop();
}

function draw() {
  drawArtwork();
}

function drawArtwork() {
  randomSeed(SEED);
  noiseSeed(SEED);
  background(247, 243, 234); // 紙のようなオフホワイト

  for (let i = 0; i < PARAMS.lineCount; i++) {
    drawOneLine(i);
  }

  // 画面下に SEED を小さく残す。再現のためのメモ。
  noStroke();
  fill(28, 28, 32, 120);
  textSize(12);
  textAlign(LEFT, BOTTOM);
  text(`SEED ${SEED}  ·  [s] save  [n] new seed  [1/2/3] density`, 16, height - 12);
}

function drawOneLine(index) {
  // 開始点は左端寄り・上下ランダム。線ごとに異なる流れを持たせる。
  let x = random(-20, width * 0.25);
  let y = random(PARAMS.margin, height - PARAMS.margin);
  let angleOffset = random(1000);
  let weight = random(0.4, PARAMS.maxWeight);
  let steps = 0;

  // ごく一部の線だけアクセント色にする。全体はモノトーンで保つ。
  const isAccent = index % 17 === 0;
  stroke(isAccent ? ACCENT : INK);
  strokeWeight(weight);
  noFill();

  beginShape();
  while (x < width + 20 && steps < 600) {
    vertex(x, y);
    const n = noise(x * PARAMS.noiseScale, y * PARAMS.noiseScale, angleOffset);
    const angle = map(n, 0, 1, -PARAMS.turnStrength, PARAMS.turnStrength);
    x += cos(angle) * PARAMS.step;
    y += sin(angle) * PARAMS.step;
    // 画面の上下からはみ出したら、その線はそこで終える。
    if (y < -20 || y > height + 20) break;
    steps++;
  }
  endShape();
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas(`daily-2026-10-26-seed-${SEED}`, 'png');
  } else if (key === 'n' || key === 'N') {
    SEED = floor(random(100000, 999999));
    redraw();
  } else if (key === '1') {
    PARAMS.lineCount = 45;
    redraw();
  } else if (key === '2') {
    PARAMS.lineCount = 90;
    redraw();
  } else if (key === '3') {
    PARAMS.lineCount = 160;
    redraw();
  }
}
