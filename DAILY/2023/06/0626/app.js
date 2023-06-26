const NUM = 50;
const padding = 50;
const max = 3000;
let w;

function setup() {
  createCanvas((W = 720), W);
  translate(0, height / 2);
  rectMode(CENTER);
  background(0);
  noStroke();
  angleMode(DEGREES);

  w = width / 10;

  push();
  stroke(random(200, 255));
  // line(0, -200, width, -200);
  // line(0, -100, width, -100);
  // line(0, 0, width, 0);
  // line(0, 100, width, 100);
  // line(0, 200, width, 200);
  pop();
  for (let x = padding; x < width - padding; x += w) {
    push();
    stroke(random(200, 255));
    // line(x + padding / 2, -height / 2, x + padding / 2, height / 2);
    pop();
    ellipse(x + padding / 2, -300, max / x);
    rect(x + padding / 2, -200, (x * w) / width);
    ellipse(x + padding / 2, -100, max / x);
    triangle(
      x + padding / 2,
      -(x * w) / width / 2,
      x + padding / 2 - (x * w) / width / 2,
      (x * w) / width / 2,
      x + padding / 2 + (x * w) / width / 2,
      (x * w) / width / 2,
    );
    ellipse(x + padding / 2, 100, max / x);
    drawHeart(x + padding / 2, 200, (x * w) / width);
    ellipse(x + padding / 2, 300, max / x);
  }
}

function drawHeart(x, y, size) {
  push();
  translate(x, y);

  size = map(
    size,
    (padding * w) / width,
    ((width - padding) * w) / width,
    0.2,
    2.2,
  );
  beginShape();
  for (let i = 0; i < 360; i++) {
    let dx = size * (16 * sin(i) * sin(i) * sin(i));
    let dy =
      size * -1 * (13 * cos(i) - 5 * cos(2 * i) - 2 * cos(3 * i) - cos(4 * i));
    vertex(dx, dy);
  }
  endShape(CLOSE);
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
