let time = 0;
const numDots = 80;
let baseRadius;

// 動的なパラメータ
let pulse = 0;
let rotationSpeed = 0.3;
let expansionFactor = 1;

// 前フレームの位置を保存する配列
let prevPositions = [];

function setup() {
  createCanvas((W = min(windowWidth, windowHeight) - 300), W);
  baseRadius = W / 4.5;
  textSize(W / 32);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(255);

  // 動的なパラメータの更新
  pulse = sin(time * 0.5) * 0.2 + 1; // 0.8から1.2の間で脈動
  rotationSpeed = 0.3 + sin(time * 0.2) * 0.1; // 回転速度の変化
  expansionFactor = 1 + sin(time * 0.3) * 0.3; // 全体の拡大縮小

  push();
  translate(width / 2, height / 2);

  // 現在の位置を保存する配列
  let currentPositions = [];

  for (let i = 0; i < numDots; i++) {
    const angle = (i / numDots) * TWO_PI;

    // より複雑な半径の変化
    const radiusVariation =
      sin(time + angle * 3) * 30 * pulse +
      cos(time * 0.7 + angle * 2) * 20 +
      sin(time * 1.3 + angle * 4) * 15 +
      cos(time * 0.4 + angle * 5) * 10 +
      sin(time * 2.1 + angle * 6) * 8;

    const radius = (baseRadius + radiusVariation) * expansionFactor;

    // より複雑な位置計算
    const xOffset =
      sin(time * 0.5 + angle * 2) * 40 * pulse +
      cos(time * 0.3 + angle * 3) * 30 +
      sin(time * 1.2 + angle * 4) * 20 +
      cos(time * 0.8 + angle * 5) * 15;

    const yOffset =
      cos(time * 0.7 + angle * 2) * 40 * pulse +
      sin(time * 0.4 + angle * 3) * 30 +
      cos(time * 1.5 + angle * 4) * 20 +
      sin(time * 0.9 + angle * 5) * 15;

    const x = cos(angle + time * rotationSpeed) * radius + xOffset;
    const y = sin(angle + time * rotationSpeed) * radius + yOffset;

    // 現在の位置を保存
    currentPositions[i] = { x, y };

    // より複雑な色の変化
    const hue =
      (i * 2 +
        time * 30 +
        sin(time + i * 0.1) * 30 +
        cos(time * 0.5 + i * 0.2) * 20) %
      360;
    const saturation =
      70 + sin(time * 2 + i * 0.05) * 30 + cos(time * 1.2 + i * 0.1) * 15;
    const brightness =
      80 + cos(time * 1.5 + i * 0.03) * 20 + sin(time * 0.8 + i * 0.07) * 15;

    fill(hue, saturation, brightness);
    noStroke();

    // 回転角度の計算
    let rotation = 0;
    if (prevPositions[i]) {
      const dx = x - prevPositions[i].x;
      const dy = y - prevPositions[i].y;
      rotation = atan2(dy, dx);
    }

    // はさみの絵文字を回転させて描画
    push();
    translate(x, y);
    rotate(rotation);
    text('✄', 0, 0);
    pop();
  }

  // 前フレームの位置を更新
  prevPositions = currentPositions;

  pop();

  time += 0.03;
}

function keyPressed() {
  if (key === 's') {
    saveGif(`mySketch-${round(new Date().getTime() / 100000)}`, 4);
  }

  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
