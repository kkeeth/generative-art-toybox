let t = 0;
let seed, span, margin, cellHeight, cellWidth, cellPadding;

function setup() {
  createCanvas((W = min(windowWidth, windowHeight)), W);
  textSize(32);
  textAlign(CENTER, CENTER);
  noStroke();

  seed = random(1000);
  span = W / 3;
  margin = 20;
  cellPadding = 20;
  cellWidth = (W - margin * 2) / 3;
  cellHeight = (W - margin * 2) / 3;
}

function draw() {
  background(0);
  randomSeed(seed);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let x = margin + j * cellWidth + cellPadding / 2;
      let y = margin + i * cellHeight + cellPadding / 2;
      let w = cellWidth - cellPadding;
      let h = cellHeight - cellPadding;
      drawBlackFlower(x + w / 2, y + h / 2);
    }
  }
  t += 0.03; // 時間経過で全体を回転させる
}

function drawBlackFlower(x, y) {
  push();
  // 花の位置
  translate(x, y);
  fill(255 * noise(t + x * y));
  let petals = ~~random(3, 8); // 花びらの数
  let radius = 40 + random(40); // 花びらの配置半径
  let flowerRotation = random(TAU); // 各花の初期回転
  let rotationSpeed = random(0.8, 2); // 各花の回転速度

  for (let j = 0; j < petals; j++) {
    push();
    // 花びらの回転（全体回転＋個別回転）
    rotate((TAU / petals) * j + flowerRotation + t * rotationSpeed);
    text('Black', radius * cos(t + (x + y) / 3), 0); // 半径分だけ外方向に配置
    pop();
  }
  pop();
}

function keyPressed() {
  if (key === 's') {
    saveGif(`mySketch-${round(new Date().getTime() / 100000)}`, 5);
  }
}
