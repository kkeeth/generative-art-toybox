function setup() {
  createCanvas(800, 600);
  background(245, 245, 255); // 淡い青白色の背景
  noLoop();
}

function draw() {
  background(245, 245, 255);

  // 杉林を描画
  drawSugiForest();

  // 雲を描画
  drawClouds();

  // 鳥を描画
  drawBirds();
}

function drawSugiForest() {
  // 杉の木を描画（複数の層で）
  for (let row = 0; row < 3; row++) {
    let y = map(row, 0, 2, height * 0.4, height * 0.85);
    let numTrees = map(row, 0, 2, 4, 6);
    let treeHeight = map(row, 0, 2, 150, 200);

    // 青色のインク風の色
    stroke(70, 90, 140, 200);
    strokeWeight(row === 0 ? 1 : 1.5);

    for (let i = 0; i < numTrees; i++) {
      let x = map(i, 0, numTrees - 1, width * 0.1, width * 0.9);
      // 少しランダムにずらす
      x += random(-20, 20);
      drawSugiTree(x, y, treeHeight);
    }
  }
}

function drawSugiTree(x, y, treeHeight) {
  push();
  translate(x, y);

  // 幹
  line(0, 0, 0, -treeHeight);

  // 枝の数
  let branchCount = floor(map(treeHeight, 150, 200, 15, 25));

  // 葉の枝を描く（ほぼ水平に近い角度で）
  for (let i = 0; i < branchCount; i++) {
    // 上から下へ配置位置を計算
    let posY = map(
      i,
      0,
      branchCount - 1,
      -treeHeight * 0.95,
      -treeHeight * 0.2,
    );

    // 枝の長さ（上部は短く、下部は長く）
    let branchLength = map(
      i,
      0,
      branchCount - 1,
      treeHeight * 0.05,
      treeHeight * 0.25,
    );

    // より垂直に近い角度（下向き）
    let angle = map(i, 0, branchCount - 1, -PI / 30, -PI / 20);

    // 左右の枝
    // 左側の枝
    line(0, posY, -branchLength, posY + branchLength * tan(angle));

    // 右側の枝
    line(0, posY, branchLength, posY + branchLength * tan(angle));
  }

  pop();
}

function drawClouds() {
  // 複数の雲を描く
  let numClouds = 3;

  strokeWeight(2);
  stroke(70, 90, 140);
  noFill();

  for (let i = 0; i < numClouds; i++) {
    let cloudY = map(i, 0, numClouds, height * 0.15, height * 0.5);
    let cloudWidth = random(width * 0.3, width * 0.5);
    let cloudX = random(width * 0.1, width * 0.6);

    drawStyleCloud(cloudX, cloudY, cloudWidth);
  }
}

function drawStyleCloud(x, y, width) {
  // 雲の上部の輪郭
  beginShape();
  let startX = x;
  let endX = x + width;

  // 雲の開始点
  vertex(startX, y);

  // 波打つような雲の上部を描く
  let segments = floor(random(3, 6));
  let segmentWidth = width / segments;

  for (let i = 0; i < segments; i++) {
    let controlX1 = startX + i * segmentWidth + segmentWidth * 0.3;
    let controlY1 = y - random(20, 30);

    let controlX2 = startX + i * segmentWidth + segmentWidth * 0.7;
    let controlY2 = y - random(20, 30);

    let endPointX = startX + (i + 1) * segmentWidth;
    let endPointY = y;

    bezierVertex(
      controlX1,
      controlY1,
      controlX2,
      controlY2,
      endPointX,
      endPointY,
    );
  }

  endShape();

  // 雲の下部の波打つような線
  beginShape();
  vertex(startX, y + random(15, 25));

  for (let i = 0; i < segments; i++) {
    let controlX1 = startX + i * segmentWidth + segmentWidth * 0.3;
    let controlY1 = y + random(30, 50);

    let controlX2 = startX + i * segmentWidth + segmentWidth * 0.7;
    let controlY2 = y + random(30, 50);

    let endPointX = startX + (i + 1) * segmentWidth;
    let endPointY = y + random(15, 25);

    bezierVertex(
      controlX1,
      controlY1,
      controlX2,
      controlY2,
      endPointX,
      endPointY,
    );
  }

  endShape();

  // 雲の内部に格子模様を描く
  let gridLines = 8;
  let gridSpacing = width / gridLines;

  // 横線
  for (let i = 1; i < gridLines; i++) {
    let lineY = y + map(i, 0, gridLines, 5, 25);
    let startPoint = startX + random(5, 15);
    let endPoint = endX - random(5, 15);

    // 波打つような横線
    beginShape();
    vertex(startPoint, lineY);

    for (let j = 0; j < 3; j++) {
      let ctrlX1 = lerp(startPoint, endPoint, j * 0.3 + 0.1);
      let ctrlY1 = lineY + random(-5, 5);

      let ctrlX2 = lerp(startPoint, endPoint, j * 0.3 + 0.2);
      let ctrlY2 = lineY + random(-5, 5);

      let ptX = lerp(startPoint, endPoint, (j + 1) * 0.3);
      let ptY = lineY;

      bezierVertex(ctrlX1, ctrlY1, ctrlX2, ctrlY2, ptX, ptY);
    }

    endShape();
  }

  // 縦線
  for (let i = 1; i < gridLines; i++) {
    let lineX = startX + i * gridSpacing;
    let lineStartY = y + random(5, 10);
    let lineEndY = y + random(20, 35);

    line(lineX, lineStartY, lineX, lineEndY);
  }
}

function drawBirds() {
  // 陶磁器風の小さな鳥を描く
  strokeWeight(1);
  stroke(70, 90, 140, 180);

  for (let i = 0; i < 4; i++) {
    let birdX = random(width * 0.1, width * 0.9);
    let birdY = random(height * 0.1, height * 0.3);
    let birdSize = random(8, 15);

    // シンプルな鳥の形（山形の2本線）
    line(birdX - birdSize / 2, birdY, birdX, birdY - birdSize / 2);
    line(birdX, birdY - birdSize / 2, birdX + birdSize / 2, birdY);
  }
}

// マウスクリックで新しい構図を生成
function mousePressed() {
  redraw();
  return false;
}

function keyPressed() {
  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
