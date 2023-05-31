const COLOR1 = "#7E9CB9";
const COLOR2 = "#BCCEDD";
const WAVE_NUM = 5;
let diff;
let step;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  diff = QUARTER_PI;
  step = width / 100;
}

function draw() {
  background(0);
  for (let i = 0; i < WAVE_NUM; i++) {
    drawWave(i, i % 2 === 0 ? 1 : -1);
  }

  push();
  drawingContext.shadowColor = "#ffea00";
  drawingContext.shadowBlur = 50;

  fill("#f5e56b");
  ellipse((4 / 5) * width, 100, 200);
  pop();
}

function drawWave(i, d) {
  const fillColor = lerpColor(color(COLOR1), color(COLOR2), i / WAVE_NUM);

  fill(fillColor);
  beginShape();
  for (let x = 0; x < width + step; x += step) {
    vertex(
      x,
      40 * sin(frameCount / 200) * sin(radians(x + d * frameCount) + i * diff) +
        height / 3 +
        i * 80,
    );
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5);
  }
}
