let dotts = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  for (let i = 0; i < 10; i++) {
    dotts.push({
      x: width / 2,
      y: height / 2 - i * 28,
    });
  }
}

function draw() {
  background(30, 4);

  fill(255, 0, 0);
  drawCircles((1 * width) / 8, height / 4, QUARTER_PI);
  fill(0, 255, 0);
  drawCircles((3 * width) / 8, height / 4, QUARTER_PI);
  fill(50, 100, 200);
  drawCircles((5 * width) / 8, height / 4, QUARTER_PI);
  fill(255, 255, 0);
  drawCircles((7 * width) / 8, height / 4, QUARTER_PI);

  fill(255, 0, 255);
  drawCircles(width / 2, height / 2, QUARTER_PI);
  fill(0, 255, 255);
  drawCircles(width / 4, height / 2, PI);
  fill(127, 255, 255);
  drawCircles((3 * width) / 4, height / 2, 3 * QUARTER_PI);

  fill(255, 127, 255);
  drawCircles((1 * width) / 8, (3 * height) / 4, 4 * QUARTER_PI);
  fill(255, 255, 127);
  drawCircles((3 * width) / 8, (3 * height) / 4, 5 * QUARTER_PI);
  fill(127, 255, 127);
  drawCircles((5 * width) / 8, (3 * height) / 4, 5 * QUARTER_PI);
  fill(127, 127, 255);
  drawCircles((7 * width) / 8, (3 * height) / 4, 5 * QUARTER_PI);
}

function drawCircles(x, y, r) {
  push();
  translate(x, y);
  for (let i = 0; i < dotts.length; i++) {
    x = i * 30 * cos(frameCount / (i + 3) + r);
    y = i * 30 * sin(frameCount / (i + 3) + r);

    circle(x, y, 3);
  }
  pop();
}

function keyPressed() {
  if (key == "s") {
    saveGif("mySketch", 5);
  }
}
