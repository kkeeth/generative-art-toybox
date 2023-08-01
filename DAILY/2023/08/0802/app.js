const cp = [
  "#e6302b",
  "#fd7800",
  "#fbd400",
  "#51b72d",
  "#2abde4",
  "#4e59a4",
  "#085a9b",
  "#f477c3",
  "#f8b862",
];
let selectedColor;
const lineWeight = 3;
let max;
let aiff = 0.0;

function setup() {
  createCanvas((W = windowHeight - 80), W);
  noFill();
  strokeCap(SQUARE);
  strokeWeight(lineWeight);

  max = W / 5;
}

function draw() {
  background(255);
  randomSeed(999);
  for (let i = max / 2; i < width; i += max) {
    for (let j = max / 2; j < height; j += max) {
      drawLeaves(i, j);
    }
  }
  aiff += 0.01;
}

function drawLeaves(x, y) {
  let diff = random(TAU) + aiff;
  drawLeave(x, y, PI / 4 + diff);
  drawLeave(-x, y, (3 * PI) / 4 + diff);
  drawLeave(-x, -y, (5 * PI) / 4 + diff);
  drawLeave(x, -y, (7 * PI) / 4 + diff);
}
function drawLeave(x, y, angle) {
  push();
  translate(x, y);
  rotate(angle);
  fill(255);
  for (let i = max; i > 0; i -= lineWeight * 2) {
    if (i - max / 2 > 0) {
      stroke(random(cp));
      rotate(angle);
      arc(0, 0, i, i - max / 2, 0, PI);
      arc(0, 0, i, i - max / 2, PI, TAU);
    }
  }
  pop();
}
function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5);
  }
}
