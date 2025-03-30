function setup() {
  createCanvas(800, 600);
  background(255);
  noLoop();
}

function draw() {
  background(255);

  push();
  fill(100);
  noStroke();
  rect(0, 0, width, height * 0.65);
  pop();

  // 簡単な山の輪郭
  drawMountainOutline();

  // 雪
  drawSnows();

  // 杉林を描画
  drawSugiForest();
}

function drawSnows() {
  fill(255);
  noStroke();
  drawingContext.shadowColor = color(255);
  drawingContext.shadowBlur = 8;
  for (let i = 0; i < 300; i++) {
    ellipse(random(width), random(height * 0.65), random(2, 7));
  }
}

function drawMountainOutline() {
  push();
  stroke(150);
  strokeWeight(1);
  drawingContext.shadowBlur = 12;
  drawingContext.shadowColor = color(0, 0, 0, 100);
  fill(200, 200, 255);

  beginShape();
  vertex(0, height * 0.65);

  // 山の輪郭を描く
  for (let x = 0; x <= width; x += width / 10) {
    let mountainHeight = random(height * 0.15, height * 0.25);
    vertex(x, height * 0.65 - mountainHeight);
  }

  vertex(width, height * 0.65);
  endShape();
  pop();
}

function drawSugiForest() {
  // 遠くから近くまで複数の列で杉を描画
  for (let depth = 5; depth >= 0; depth--) {
    // 深度によって線の太さとサイズを変更
    let scaleFactor = map(depth, 0, 5, 1, 0.4);
    let lineWeight = map(depth, 0, 5, 1.5, 0.5);

    // 各深度レベルで複数の杉を描画
    let numTrees = map(depth, 0, 5, 5, 20);

    strokeWeight(lineWeight);
    stroke(0, 0, 0, map(depth, 0, 5, 200, 120));

    for (let i = 0; i < numTrees; i++) {
      let x = random(width);
      let y = map(depth, 0, 5, height * 0.95, height * 0.65);

      drawSugiTreeLines(x, y, scaleFactor);
    }
  }
}

function drawSugiTreeLines(x, y, scale) {
  push();
  translate(x, y);

  // 幹の高さと特性
  let trunkHeight = random(120, 220) * scale;

  // 杉の特徴的な枝を描画
  let maxBranchWidth = random(50, 90) * scale;
  let branchLayers = floor(random(40, 70));

  // 枝のレイヤーごとに両側に枝を描く
  for (let i = 0; i < branchLayers; i++) {
    // 上から下に向かって配置（杉は上部が細く下部が広い）
    let heightRatio = i / branchLayers;
    let layerY = -trunkHeight + trunkHeight * heightRatio;

    // 枝の長さ（上部は短く、下部は長い）
    let branchLength = map(
      heightRatio,
      0,
      1,
      maxBranchWidth * 0.1,
      maxBranchWidth * 0.5,
    );

    // わずかな傾斜角度（上向き）
    let angle = map(heightRatio, 0, 1, -PI / 4, -PI / 10);

    // 左右の枝を描画
    push();
    stroke(random(0, 60), random(120, 180), random(0, 60));
    let leftX = -branchLength * cos(angle);
    let leftY = -branchLength * sin(angle);
    line(0, layerY, leftX, layerY + leftY);

    let rightX = branchLength * cos(angle);
    let rightY = -branchLength * sin(angle);
    line(0, layerY, rightX, layerY + rightY);
    pop();

    // 不規則さを追加するために、たまに追加の短い枝を描く
    if (random() < 0.3) {
      let extraBranchLength = branchLength * random(0.3, 0.7);
      let extraAngle = angle * random(0.5, 1.5);

      if (random() < 0.5) {
        // 左側に追加の枝
        let extraLeftX = -extraBranchLength * cos(extraAngle);
        let extraLeftY = -extraBranchLength * sin(extraAngle);
        line(0, layerY, extraLeftX, layerY + extraLeftY);
      } else {
        // 右側に追加の枝
        let extraRightX = extraBranchLength * cos(extraAngle);
        let extraRightY = -extraBranchLength * sin(extraAngle);
        line(0, layerY, extraRightX, layerY + extraRightY);
      }
    }

    // 幹
    push();
    strokeWeight(1);
    // stroke(122, 82, 42);
    stroke(100, 75, 58);
    quad(2 * scale, 0, -2 * scale, 0, 0, -trunkHeight, 0, -trunkHeight);
    line(0, 0, 0, -trunkHeight);
    stroke(255);
    line(3 * scale, 0, 0, 0);
    line(-3 * scale, 0, 0, 0);
    pop();
  }

  pop();
}

// マウスクリックで新しい杉林を生成
function mousePressed() {
  redraw();
  return false;
}
function keyPressed() {
  if (key === 's') {
    saveGif(`mySketch-${round(new Date().getTime() / 100000)}`, 5);
  }

  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
