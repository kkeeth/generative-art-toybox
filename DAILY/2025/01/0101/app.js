function setup() {
  createCanvas(800, 800);
  background(255); // 背景を白に
  noLoop();
}

function draw() {
  const numCircles = 10; // 描画する円の数

  for (let i = 0; i < numCircles; i++) {
    let x = random(width); // 円の中心X座標
    let y = random(height); // 円の中心Y座標
    let r = random(50, 200); // 円の半径
    let colorCircle = color(
      random(255),
      random(255),
      random(255),
      random(150, 255),
    ); // ランダムな色
    drawCircleWithLines(x, y, r, colorCircle);
  }
}

function drawCircleWithLines(cx, cy, radius, col) {
  stroke(col);
  noFill();

  // 縦線
  for (let x = cx - radius; x <= cx + radius; x += random(5, 15)) {
    let y1 = cy - sqrt(sq(radius) - sq(x - cx)); // 上部のy座標
    let y2 = cy + sqrt(sq(radius) - sq(x - cx)); // 下部のy座標
    if (!isNaN(y1) && !isNaN(y2)) {
      strokeWeight(random(1, 5)); // ランダムな線の太さ
      line(x, y1, x, y2);
    }
  }

  // 横線
  for (let y = cy - radius; y <= cy + radius; y += random(5, 15)) {
    let x1 = cx - sqrt(sq(radius) - sq(y - cy)); // 左部のx座標
    let x2 = cx + sqrt(sq(radius) - sq(y - cy)); // 右部のx座標
    if (!isNaN(x1) && !isNaN(x2)) {
      strokeWeight(random(1, 5)); // ランダムな線の太さ
      line(x1, y, x2, y);
    }
  }
}
function keyPressed() {
  if (key === 's') {
    saveCanvas('mySketch', 'png');
  }
}
