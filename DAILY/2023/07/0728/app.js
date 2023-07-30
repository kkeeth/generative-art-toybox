const baseWidth = 100;
const baseHeight = baseWidth / 2;
const NUM = 30;
let leafWidth;
let leafHeight;
let leafLineBase;
const cp = [
  "#e6302b",
  "#fd7800",
  "#fbd400",
  "#51b72d",
  "#2abde4",
  "#4e59a4",
  "#085a9b",
  "#f477c3",
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  // blendMode();
  // noLoop();
}

function draw() {
  background(255);
  randomSeed(999);

  for (let i = 0; i < NUM; i++) {
    drawLeaf(
      random(width),
      random(height),
      random([PI / 4, (2 * PI) / 4, (3 * PI) / 4, PI]),
      random(cp),
      random() > 0.5
        ? random(1, 5) * map(sin((frameCount + i) / 100), -1, 1, 0.5, 1)
        : random(1, 5) * map(cos((frameCount + i) / 100), -1, 1, 0.5, 1),
    );
  }
}

function drawLeaf(x, y, angle, color, size) {
  push();
  fill(color);
  translate(x, y);
  rotate(angle);

  leafWidth = baseWidth * size;
  leafHeight = baseHeight * size;
  leafLineBase = leafWidth / 6;

  // draw leaf
  arc(0, 0, leafWidth, leafHeight, 0, PI, FILL);
  arc(0, 0, leafWidth, leafHeight, PI, TAU);

  // draw lines
  push();
  stroke(120);
  strokeWeight(2);
  // center line
  line(-leafWidth / 2.5, 0, leafWidth / 2.5, 0);

  // sub lines
  let cx = -leafLineBase;
  let cy = calculateCy(cx - leafLineBase);
  for (let i = 0; i < 4; i++) {
    line(cx, 0, cx - leafLineBase, cy);
    line(cx, 0, cx - leafLineBase, -cy);
    cx += leafLineBase;
    cy = calculateCy(cx - leafLineBase);
  }
  pop();
  pop();
}

function calculateCy(cx) {
  /**
   * (x-s)^2 / a^2 + (y-t)^2 / b^2 = 1
   *
   * ↓ in this case, s = t = 0
   *
   * y = sqrt(b^2 * (1 - x^2 / a^2))
   */
  return sqrt(
    pow(leafHeight / 3, 2) * (1 - pow(cx, 2) / pow(leafWidth / 2, 2)),
  );
}

function keyPressed() {
  // this will download the first 5 seconds of the animation!
  if (key === "s") {
    saveGif("mySketch", 5);
  }
}
