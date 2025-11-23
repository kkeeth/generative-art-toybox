const step = 64;
const strings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let mySlider;
let myCheckbox;
let seed;

function setup() {
  createCanvas((W = 720), W);
  textSize(step / 2);
  textAlign(TOP, TOP);
  colorMode(HSB, W);
  seed = random(1000);

  myInput = createInput('a');
  mySlider = createSlider(3, 8, 3, 1);
  myInput.position(50, 20);
  mySlider.position(50, 50);
}

function draw() {
  background(0);
  randomSeed(seed);
  let value = myInput.value();

  for (let x = 0; x < W; x += step) {
    for (let y = 0; y < W; y += step) {
      if (((x + y) / step) % 2 === 0) {
        drawBlock(x, y, myInput.value());
      }
    }
  }
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

  fill(y, x / 2, W);
  drawDoubleL(c);

  for (let i = 0; i < mySlider.value() - 1; i++) {
    rotate(TAU / mySlider.value());
    drawDoubleL(c);
  }
  pop();
}

function keyPressed() {
  if (key === 'c') {
    saveCanvas('mySketch', 'png');
  }
}
