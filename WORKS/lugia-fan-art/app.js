"use strict";

// ─── 操作方法 ──────────────────────────────────────────────────────────────
//  q / e  : ぼかし半径 ±1  （デフォルメの強さ）
//  ↑ / ↓  : エッジ感度 ±5  （拾う輪郭の細かさ）
//  ← / →  : 線の太さ  ±1
//  p / o  : ポスタリゼーション ±1（色面を減らす）
//  r      : 再計算
//  c      : 画像保存
// ──────────────────────────────────────────────────────────────────────────

let W;
let refImg  = null;
let edgeImg = null;

let blurR   = 4;   // ぼかし半径 0-20
let edgeThr = 20;  // Sobelしきい値 5-120
let lineW   = 2;   // 線の太さ（拡張px）0-6
let posterL = 4;   // ポスタリゼーション段階 0=off, 2-8

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
  if (refImg) buildEdgeImg();
}

function draw() {
  background(255);

  if (!refImg) {
    fill(130); noStroke();
    textAlign(CENTER, CENTER); textSize(15);
    text('reference.jpg をこのフォルダに置いてリロードしてください', W / 2, W / 2);
    return;
  }

  if (edgeImg) image(edgeImg, 0, 0, W, W);
  drawUI();
}

// ── パイプライン ─────────────────────────────────────────────────────────
// ① ぼかし → ② ポスタリゼーション → ③ Sobel + 線幅拡張
function buildEdgeImg() {
  // ① 参照画像をキャンバスサイズに収めてオフスクリーンに描画
  let pg = createGraphics(W, W);
  pg.background(255);
  let sc = min(W / refImg.width, W / refImg.height);
  let ox = (W - refImg.width  * sc) / 2;
  let oy = (W - refImg.height * sc) / 2;
  pg.image(refImg, ox, oy, refImg.width * sc, refImg.height * sc);

  // ② ぼかし：細かいディテールを消してシルエットを単純化
  if (blurR > 0) pg.filter(BLUR, blurR);

  // ③ ポスタリゼーション：色面を平坦化して境界を明確に
  if (posterL >= 2) pg.filter(POSTERIZE, posterL);

  // オフスクリーンからピクセルデータ取得
  let src = pg.get();
  pg.remove();
  src.loadPixels();

  // ④ Sobel エッジ検出 + 線幅拡張
  let dst = createImage(W, W);
  dst.loadPixels();

  // 背景を白で初期化
  for (let i = 0; i < dst.pixels.length; i += 4) {
    dst.pixels[i] = dst.pixels[i + 1] = dst.pixels[i + 2] = 255;
    dst.pixels[i + 3] = 255;
  }

  let gray = (x, y) => {
    x = constrain(x, 0, W - 1);
    y = constrain(y, 0, W - 1);
    let i = (y * W + x) * 4;
    return 0.299 * src.pixels[i] + 0.587 * src.pixels[i + 1] + 0.114 * src.pixels[i + 2];
  };

  for (let y = 1; y < W - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      let gx = (gray(x+1,y-1) + 2*gray(x+1,y) + gray(x+1,y+1))
             - (gray(x-1,y-1) + 2*gray(x-1,y) + gray(x-1,y+1));
      let gy = (gray(x-1,y+1) + 2*gray(x,y+1) + gray(x+1,y+1))
             - (gray(x-1,y-1) + 2*gray(x,y-1) + gray(x+1,y-1));

      if (sqrt(gx * gx + gy * gy) > edgeThr) {
        // エッジ色 = ポスタリゼーション後の元色（カラーラインアート）
        let si = (y * W + x) * 4;
        let r = src.pixels[si], g = src.pixels[si + 1], b = src.pixels[si + 2];

        // 線幅拡張：円形マスクで自然な太さに
        for (let dy = -lineW; dy <= lineW; dy++) {
          for (let dx = -lineW; dx <= lineW; dx++) {
            if (dx * dx + dy * dy > lineW * lineW) continue;
            let nx = constrain(x + dx, 0, W - 1);
            let ny = constrain(y + dy, 0, W - 1);
            let ni = (ny * W + nx) * 4;
            dst.pixels[ni]     = r;
            dst.pixels[ni + 1] = g;
            dst.pixels[ni + 2] = b;
            dst.pixels[ni + 3] = 255;
          }
        }
      }
    }
  }

  dst.updatePixels();
  edgeImg = dst;
}

// ── UI ────────────────────────────────────────────────────────────────────
function drawUI() {
  let posterStr = posterL >= 2 ? String(posterL) : 'off';
  push();
  noStroke();
  fill(20, 20, 50, 210);
  textSize(11);
  textAlign(LEFT);
  text(
    `blur:${blurR} [q/e]   threshold:${edgeThr} [↑↓]   line:${lineW} [←→]   posterize:${posterStr} [p/o]   [c: 保存]`,
    8, W - 8
  );
  pop();
}

// ── キー操作 ──────────────────────────────────────────────────────────────
function keyPressed() {
  let changed = false;

  if      (key === 'q' || key === 'Q') { blurR   = max(0,  blurR   - 1); changed = true; }
  else if (key === 'e' || key === 'E') { blurR   = min(20, blurR   + 1); changed = true; }
  else if (keyCode === UP_ARROW)       { edgeThr = max(5,  edgeThr - 5); changed = true; }
  else if (keyCode === DOWN_ARROW)     { edgeThr = min(120,edgeThr + 5); changed = true; }
  else if (keyCode === LEFT_ARROW)     { lineW   = max(0,  lineW   - 1); changed = true; }
  else if (keyCode === RIGHT_ARROW)    { lineW   = min(6,  lineW   + 1); changed = true; }
  else if (key === 'p' || key === 'P') { posterL = posterL < 2 ? 2 : max(2, posterL - 1); changed = true; }
  else if (key === 'o' || key === 'O') { posterL = posterL >= 2 ? min(8, posterL + 1) : 0; changed = true; }
  else if (key === 'r' || key === 'R') { changed = true; }

  if (changed && refImg) { buildEdgeImg(); redraw(); }

  if (key === 'c') {
    let name = `lugia-blur${blurR}-thr${edgeThr}-lw${lineW}-po${posterL}`;
    saveCanvas(name, 'jpeg');
  }
}
