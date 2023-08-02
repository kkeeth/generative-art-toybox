const cp = ["#a5dff9", "#60c5ba", "#ef5285", "#feee7d"];
const eSize = 120;
let poff = 0.0;
let moff = 0.0;

function setup() {
  createCanvas(600, 600);
  background(255);
  shuffle(cp, true);
  noStroke();
  // noLoop();
}

function draw() {
  background(25);
  translate(width / 2, height / 2);

  push();
  drawCircles(eSize, eSize);
  drawCircles(0, -eSize * 2);
  pop();
  push();
  drawCircles(-eSize, eSize);
  drawCircles(0, -eSize * 2);
  pop();

  poff += 0.03;
  moff -= 0.03;
}

function drawCircles(x, y) {
  translate(x, y);

  // top-left
  push();
  translate(-eSize / 2, -eSize / 2);
  rotate(moff);
  fill(cp[2]);
  arc(0, 0, eSize, eSize, HALF_PI, TAU);
  fill(cp[1]);
  arc(0, 0, eSize, eSize, 0, HALF_PI);
  fill(cp[0]);
  arc(0, 0, eSize, eSize, PI, 3 * HALF_PI);
  pop();

  // top-light
  push();
  translate(eSize / 2, -eSize / 2);
  rotate(poff);
  fill(cp[2]);
  arc(0, 0, eSize, eSize, PI, HALF_PI);
  fill(cp[1]);
  arc(0, 0, eSize, eSize, HALF_PI, PI);
  fill(cp[0]);
  arc(0, 0, eSize, eSize, 3 * HALF_PI, TAU);
  pop();

  // bottom-light
  push();
  translate(eSize / 2, eSize / 2);
  rotate(moff);
  fill(cp[2]);
  arc(0, 0, eSize, eSize, -HALF_PI, PI);
  fill(cp[0]);
  arc(0, 0, eSize, eSize, 0, HALF_PI);
  fill(cp[1]);
  arc(0, 0, eSize, eSize, PI, 3 * HALF_PI);
  pop();

  // bottom-left
  push();
  translate(-eSize / 2, eSize / 2);
  rotate(poff);
  fill(cp[2]);
  arc(0, 0, eSize, eSize, 0, 3 * HALF_PI);
  fill(cp[1]);
  arc(0, 0, eSize, eSize, 3 * HALF_PI, TAU);
  fill(cp[0]);
  arc(0, 0, eSize, eSize, HALF_PI, PI);
  pop();
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5);
  }
}
