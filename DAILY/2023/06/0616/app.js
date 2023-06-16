const step = 64;
const strings = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let mySlider;
let seed;

function setup() {
  createCanvas((W = 720), W);
  textSize(step / 2);
  textAlign(TOP, TOP);
  colorMode(HSB, W);
  frameRate(3);
  seed = random(1000);

  // mySlider = createSlider(0, 25, 0, 1);
  // mySlider.position(100, 20);
}

function draw() {
  background(0);
  randomSeed(seed);
  // let value = mySlider.value();
  let value = (frameCount - 1) % 26;

  for (let x = 0; x < W; x += step) {
    for (let y = 0; y < W; y += step) {
      drawBlock(x, y, strings[value]);
    }
  }

  push();
  drawingContext.shadowColor = color(W);
  drawingContext.shadowBlur = 10;

  fill(W);
  textAlign(CENTER, CENTER);
  textSize(step * 2);
  text(strings[value], W / 2, W / 2);
  pop();
}

function drawDoubleL(character) {
  push();
  rotate(-QUARTER_PI);
  rotate(HALF_PI);
  text(character, 0, 0);
  scale(-1, 1);
  text(character, 0, 0);
  pop();
}

function drawBlock(x, y, c) {
  push();
  translate(x, y);

  fill(random(W), W / 2, W);
  drawDoubleL(c);
  rotate(HALF_PI);
  drawDoubleL(c);
  rotate(HALF_PI);
  drawDoubleL(c);
  rotate(HALF_PI);
  drawDoubleL(c);
  pop();
}

function keyPressed() {
  if (key === "c") {
    saveCanvas("mySketch", "png");
  }
  if (key === "s") {
    saveGif("mySketch", 8.5);
  }
}
