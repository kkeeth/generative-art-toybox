function setup() {
  createCanvas(600, 600);
  background(240);
  drawContinuousSpiral(600, 600);
}

function drawContinuousSpiral(w, h) {
  // パラメータ設定
  let gridSize = 30; // グリッドの大きさ（線の間隔）
  let margin = gridSize; // 余白

  // 描画開始位置（左上から少し内側）
  let startX = width;
  let startY = margin;

  // キャンバス全体を使う大きさを計算
  let spiralWidth = w - 2 * margin;
  let spiralHeight = h - 2 * margin;

  // グリッド数を計算
  let cols = floor(spiralWidth / gridSize);
  let rows = floor(spiralHeight / gridSize);

  // 奇数のグリッド数にする（中央に向かって進むため）
  if (cols % 2 === 0) cols--;
  if (rows % 2 === 0) rows--;

  // 線のスタイル
  stroke(0);
  strokeWeight(4);
  noFill();

  // 渦巻きの描画開始
  beginShape();

  // 左上隅から始める
  let x = startX;
  let y = startY;
  vertex(x, y);

  // 最初は右に進む
  x -= cols * gridSize;
  vertex(x, y);

  // 渦巻きのロジック
  let remainingCols = cols - 1;
  let remainingRows = rows;

  while (remainingCols > 0 && remainingRows > 0) {
    // 下に進む
    y += remainingRows * gridSize;
    vertex(x, y);
    remainingRows--;

    // 左に進む
    x -= remainingCols * gridSize;
    vertex(x, y);
    remainingCols--;

    if (remainingCols <= 0 || remainingRows <= 0) break;

    // 上に進む
    y -= remainingRows * gridSize;
    vertex(x, y);
    remainingRows--;

    // 右に進む
    x += remainingCols * gridSize;
    vertex(x, y);
    remainingCols--;
  }

  endShape();
}

function keyPressed() {
  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
