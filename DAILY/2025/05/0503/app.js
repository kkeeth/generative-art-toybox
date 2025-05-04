let W; // キャンバスのサイズ
let circles = []; // 円の配列
let gridSize = 10; // グリッドのサイズ
let maxAttempts = 1000; // 円を配置する試行回数
let quads = [];
let maxQuads = 5; // 四角形の数
let colors = [];

function setup() {
  W = min(windowWidth, windowHeight) - 100;
  createCanvas(W, W);
  background(255);
  noStroke();
  drawCowOutline();
  noLoop();
  colors = [
    color(41, 128, 185), // ベースカラー（青）
    color(39, 174, 96), // アナログスキーム（青緑）
    color(142, 68, 173), // アナログスキーム（紫）
    color(230, 126, 34), // アクセントカラー（オレンジ）
  ];

  // ランダムな四角形を生成
  for (let i = 0; i < maxQuads; i++) {
    let x1 = random(width);
    let y1 = random(height);
    let x2 = random(width);
    let y2 = random(height);
    let x3 = random(width);
    let y3 = random(height);
    let x4 = random(width);
    let y4 = random(height);
    quads.push({ x1, y1, x2, y2, x3, y3, x4, y4 });
  }

  // 円を配置
  for (let i = 0; i < maxAttempts; i++) {
    let x = random(width);
    let y = random(height);
    let r = random(5, 20);
    let valid = true;

    // 既存の円と重ならないかチェック
    for (let circle of circles) {
      let d = dist(x, y, circle.x, circle.y);
      if (d < r + circle.r) {
        valid = false;
        break;
      }
    }

    // 四角形の内部にあるかチェック
    if (valid && isInsideQuad(x, y)) {
      circles.push({ x, y, r, color: colors[floor(random(colors.length))] });
    }
  }
}

function draw() {
  background(255);
  drawCowOutline();
  // 四角形を描画
  console.log(quads);
  for (let item of quads) {
    quad(
      item.x1,
      item.y1,
      item.x2,
      item.y2,
      item.x3,
      item.y3,
      item.x4,
      item.y4,
    );
  }
  push();
  for (let circle of circles) {
    fill(circle.color);
    ellipse(circle.x, circle.y, circle.r * 2);
  }
  pop();
}

// 円のサイズを決定する関数
function getCircleSize(x, y) {
  let minSize = 2;
  let maxSize = gridSize;
  // ここで円の大きさを決定するロジックを追加
  return random(minSize, maxSize);
}

// 点が四角形の内部にあるかチェックする関数
function isInsideQuad(x, y) {
  let inside = false;
  for (let quad of quads) {
    // 四角形の頂点を配列に格納
    let vertices = [
      { x: quad.x1, y: quad.y1 },
      { x: quad.x2, y: quad.y2 },
      { x: quad.x3, y: quad.y3 },
      { x: quad.x4, y: quad.y4 },
    ];

    // Ray Casting Algorithm
    let j = vertices.length - 1;
    for (let i = 0; i < vertices.length; i++) {
      let xi = vertices[i].x;
      let yi = vertices[i].y;
      let xj = vertices[j].x;
      let yj = vertices[j].y;

      // 点が辺の上にある場合は内部と判定
      if (xi === xj && yi === yj) continue;
      if (xi === x && yi === y) return true;

      // 辺と水平線の交差判定
      let intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
      j = i;
    }
    if (inside) return true;
  }
  return false;
}

function drawCowOutline() {
  beginShape();
  // 牛の頭部
  vertex(100, 100);
  vertex(150, 50);
  vertex(200, 100);
  // 牛の胴体
  vertex(250, 150);
  vertex(300, 200);
  vertex(250, 250);
  // 牛の後ろ足
  vertex(200, 300);
  vertex(150, 250);
  // 牛の前足
  vertex(100, 200);
  vertex(50, 150);
  endShape(CLOSE);
}

function keyPressed() {
  if (key === 'c') {
    saveCanvas('myCanvas', 'png');
  }
}
