let seed, margin, cellHeight, cellWidth, cellPadding;
let houseWidth;
let houseHeight;
let spacingX = 80;
let spacingY = 40;
let rows = 4;
let cols = 12;
let cp1, cp2;

function setup() {
  createCanvas(windowWidth * 0.8, windowHeight * 0.6);
  noLoop();
  noStroke();

  margin = 30;
  cellWidth = width / cols;
  cellHeight = height / rows;
  cp1 = random(colorPalette).colors;
  cp2 = random(colorPalette).colors;
}

function draw() {
  background(0);

  for (let row = rows; row > 0; row--) {
    for (let col = cellWidth / 2; col < width; col += cellWidth) {
      let x = col;
      let y = height - (row * cellHeight) / 2 + 25;

      if (row === rows) {
        houseWidth = random(30, cellWidth / 2);
        houseHeight = random(90, cellHeight);
        if (random() < 0.6) {
          drawBuilding(x, y - margin, houseWidth, houseHeight);
        }
      } else if (row === rows - 1) {
        houseWidth = random(30, cellWidth / 2);
        houseHeight = random(90, cellHeight);
        if (random() < 0.9) {
          drawBuilding(x, y - margin, houseWidth, houseHeight);
        }
      } else if (random() < 0.5) {
        houseWidth = random(30, cellWidth / 2);
        houseHeight = random(50, 100);
        drawHouse(x, y, houseWidth, houseHeight, 0.5);
      } else {
        houseWidth = random(30, cellWidth / 2);
        houseHeight = random(50, 100);
        drawHouse(x, y, houseWidth, houseHeight, 0.2);
      }
    }
  }
  drawStars();
  drawBlurredMoon(width - 40, 40, 40);
}

function drawHouse(x, y, w, h, opacity) {
  push();
  translate(x + random(-cellWidth / 4, cellWidth / 4), y);
  random() < 0.5 && scale(-1, 1);

  let roofHeight = random(-h / 3, -h / 6);

  let bodyColor = color(random(cp1));
  let roofColor = color(random(cp2));
  let shadowColor = lerpColor(bodyColor, color(0), opacity);
  let roofShadowColor = lerpColor(roofColor, color(0), opacity + 0.2);

  // 屋根
  fill(roofShadowColor);
  quad(-w / 2 - w / 8, roofHeight, w / 2, roofHeight, w, 0, -w - w / 8, 0);

  /**
   * 家
   */
  // 本体
  fill(bodyColor);
  rect(0, 0, w, h);
  // 側面
  fill(shadowColor);
  quad(-w / 2, roofHeight, 0, 0, 0, h, -w / 2, h);
  quad(-w, 0, -w / 2, roofHeight, 0, h, -w, h);

  /**
   * 屋根
   */
  fill(roofColor);
  quad(
    -w / 2 - w / 8,
    roofHeight,
    w / 2 + w / 8,
    roofHeight,
    w + w / 8,
    0,
    -w / 8,
    0,
  );

  /**
   * 窓
   */
  fill(255, 255, 200, 255);
  let windowSize = w * 0.1;
  // 本体
  rect(w / 2 - windowSize, h / 3, windowSize, windowSize);
  rect(w / 2 - windowSize + w / 6, h / 3, windowSize, windowSize);
  // 側面
  rect(-w / 2 - windowSize, h / 6, windowSize, windowSize);
  rect(-w / 2 - windowSize + w / 6, h / 6, windowSize, windowSize);

  pop();
}

function drawBuilding(x, y, w, h) {
  push();
  translate(x, y);
  random() < 0.5 && scale(-1, 1);

  let bodyColor = lerpColor(color(random(cp1)), color(0), 0.6);
  let shadowColor = lerpColor(bodyColor, color(0), 0.7);

  if (random() < 0.5) {
    fill(bodyColor);
    rect(0, 0, w * 1.5, h);
    fill(shadowColor);
    quad(w * 1.5, 0, w * 2, h / 4, w * 2, h, w * 1.5, h);

    // windows
    fill(255);
    let windowSize = w * 0.1;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        rect(
          ((i + 1) * w) / 3 + windowSize / 2,
          h / 4 + (j * w) / 4,
          windowSize,
          windowSize,
        );
      }
    }
  } else {
    let cond = random();
    fill(cond < 0.5 ? shadowColor : bodyColor);
    quad(-w, -h / 4, 0, 0, 0, h, -w, h);
    fill(cond < 0.5 ? bodyColor : shadowColor);
    quad(-w * 2, -h / 6, -w, -h / 4, -w, h, -w * 2, h);

    // windows
    push();
    fill(255);
    let windowSize = w * 0.1;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {}
    }
    pop();
    // for (let i = 0; i < 3; i++) {
    //   for (let j = 0; j < 4; j++) {
    //     rect(
    //       ((i + 1) * w) / 3 + windowSize / 2,
    //       h / 4 + (j * w) / 4,
    //       windowSize,
    //       windowSize,
    //     );
    //   }
    // }
  }

  pop();
}

function drawStars() {
  fill(255, 255, 204);
  for (let i = 0; i < 100; i++) {
    let x = random(0, width);
    let y = random(height / 15, height / 2);
    ellipse(x, y, random(1, 3));
  }
}

function drawBlurredMoon(x, y, size) {
  for (let i = size * 1.5; i > size; i -= 1) {
    fill(255, 255, 200, map(i, size, size * 1.5, 50, 0));
    ellipse(x, y, i);
  }

  fill(255, 255, 200, 255);
  ellipse(x, y, size);

  drawMoonTexture(x, y, size);
}

function drawMoonTexture(x, y, size) {
  let craterCount = 8;
  for (let i = 0; i < craterCount; i++) {
    let angle = random(TWO_PI);
    let r = random(size * 0.2, size * 0.4);
    let craterX = x + cos(angle) * r;
    let craterY = y + sin(angle) * r;
    let craterSize = random(size * 0.05, size * 0.1);

    fill(200, 200, 180, 150);
    ellipse(craterX, craterY, craterSize);
  }
}

function keyPressed() {
  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
