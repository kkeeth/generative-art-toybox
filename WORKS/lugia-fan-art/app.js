"use strict";

// ─── reference.jpg / reference.png をこのフォルダに置いて開く ───────────
// キー操作:
//   1        : エッジ検出モード
//   2        : ピクセルアートモード
//   ↑↓      : しきい値調整（モード1）/ ブロックサイズ調整（モード2）
//   c        : 画像保存

let W;
let refImg    = null;
let edgeImg   = null;
let mode      = 1;     // 1=エッジ検出, 2=ピクセルアート
let edgeThr   = 30;    // Sobel しきい値
let pixelSize = 8;     // ピクセルアートのブロックサイズ

// ─────────────────────────────────────────────────────────────────────────
function preload() {
  loadImage('reference.jpg',
    img => { refImg = img; },
    ()  => loadImage('reference.png',
      img => { refImg = img; },
      ()  => {}
    )
  );
}

function setup() {
  createCanvas((W = min(windowWidth, windowHeight) - 50), W);
  noLoop();
  if (refImg) {
    refImg.loadPixels();
    buildEdgeImg();
  }
}

function draw() {
  background(255);

  if (!refImg) {
    noStroke();
    fill(130);
    textAlign(CENTER, CENTER);
    textSize(15);
    text('reference.jpg または reference.png を\nこのフォルダに置いてリロードしてください', W / 2, W / 2);
    return;
  }

  if (mode === 1) drawEdgeMode();
  else            drawPixelMode();

  drawUI();
}

// ── エッジ検出モード ──────────────────────────────────────────────────────
function drawEdgeMode() {
  if (edgeImg) image(edgeImg, 0, 0, W, W);
}

// ── ピクセルアートモード ──────────────────────────────────────────────────
function drawPixelMode() {
  let ps   = pixelSize;
  let cols = ceil(W / ps);
  let rows = ceil(W / ps);

  noStroke();
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      // 参照画像からサンプリング
      let sx  = floor(i / cols * refImg.width);
      let sy  = floor(j / rows * refImg.height);
      let idx = (sy * refImg.width + sx) * 4;

      let r = refImg.pixels[idx];
      let g = refImg.pixels[idx + 1];
      let b = refImg.pixels[idx + 2];

      // ほぼ白（背景）はスキップ
      if (r > 238 && g > 238 && b > 238) continue;

      fill(r, g, b);
      // ブロック間に1pxの隙間を入れてピクセルアートらしさを演出
      rect(i * ps, j * ps, ps - 1, ps - 1);
    }
  }
}

// ── Sobel エッジ検出 ──────────────────────────────────────────────────────
function buildEdgeImg() {
  // 処理用に参照画像をキャンバスサイズにリサイズ
  let src = createImage(W, W);
  src.copy(refImg, 0, 0, refImg.width, refImg.height, 0, 0, W, W);
  src.loadPixels();

  let dst = createImage(W, W);
  dst.loadPixels();

  // 背景を白で初期化
  for (let i = 0; i < dst.pixels.length; i += 4) {
    dst.pixels[i] = dst.pixels[i + 1] = dst.pixels[i + 2] = 255;
    dst.pixels[i + 3] = 255;
  }

  // グレースケール輝度
  let gray = (x, y) => {
    x = constrain(x, 0, W - 1);
    y = constrain(y, 0, W - 1);
    let i = (y * W + x) * 4;
    return 0.299 * src.pixels[i] + 0.587 * src.pixels[i + 1] + 0.114 * src.pixels[i + 2];
  };

  for (let y = 1; y < W - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      // Sobel カーネル
      let gx = (gray(x+1,y-1) + 2*gray(x+1,y) + gray(x+1,y+1))
             - (gray(x-1,y-1) + 2*gray(x-1,y) + gray(x-1,y+1));

      let gy = (gray(x-1,y+1) + 2*gray(x,y+1) + gray(x+1,y+1))
             - (gray(x-1,y-1) + 2*gray(x,y-1) + gray(x+1,y-1));

      let mag = sqrt(gx * gx + gy * gy);

      if (mag > edgeThr) {
        let i = (y * W + x) * 4;
        // エッジ部分は元画像の色を使う（自動カラーライン）
        dst.pixels[i]     = src.pixels[i];
        dst.pixels[i + 1] = src.pixels[i + 1];
        dst.pixels[i + 2] = src.pixels[i + 2];
        dst.pixels[i + 3] = 255;
      }
    }
  }

  dst.updatePixels();
  edgeImg = dst;
}

// ── UI テキスト ────────────────────────────────────────────────────────────
function drawUI() {
  let info = mode === 1
    ? `[1] エッジ検出  しきい値:${edgeThr}  (↑↓で調整)`
    : `[2] ピクセルアート  ブロック:${pixelSize}px  (↑↓で調整)`;

  push();
  noStroke();
  fill(30, 30, 60, 200);
  textSize(12);
  textAlign(LEFT);
  text(info + '  [c:保存]', 8, W - 8);
  pop();
}

// ── キー操作 ──────────────────────────────────────────────────────────────
function keyPressed() {
  if (key === '1') { mode = 1; redraw(); return; }
  if (key === '2') { mode = 2; redraw(); return; }

  if (mode === 1 && refImg) {
    if (keyCode === UP_ARROW)   { edgeThr = max(5,   edgeThr - 5); buildEdgeImg(); redraw(); }
    if (keyCode === DOWN_ARROW) { edgeThr = min(120, edgeThr + 5); buildEdgeImg(); redraw(); }
  }
  if (mode === 2) {
    if (keyCode === UP_ARROW)   { pixelSize = max(2,  pixelSize - 2); redraw(); }
    if (keyCode === DOWN_ARROW) { pixelSize = min(32, pixelSize + 2); redraw(); }
  }

  if (key === 'c') {
    let suffix = mode === 1 ? `edge-thr${edgeThr}` : `pixel-${pixelSize}px`;
    saveCanvas(`lugia-${suffix}-${round(millis())}`, 'jpeg');
  }
}
