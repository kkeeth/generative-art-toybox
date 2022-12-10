const span = 10;
let xoff = 0.0;

function setup() {
  createCanvas(800, 600);
  strokeWeight(span);
  textSize(30);
  textAlign(RIGHT, TOP);
}

function draw() {
  background(220);
  push();
  stroke(0);
  strokeWeight(1);
  line(width / 2, 0, width / 2, height);
  line(0, height / 2, width, height / 2);
  fill("blue");
  text("sin curve", width - 10, 10);
  fill("orange");
  text("cos curve", width - 10, 40);
  pop();

  // sin curve
  stroke("blue");
  // x direction
  for (let i = 0; i < width; i += span) {
    point(i, sin((i + xoff) / 50) * 100 + height / 2);
    // point(i, sin(radians(i + xoff)) * 100 + height / 2);
  }
  // y direction
  for (let i = 0; i < height; i += span) {
    // point(sin((i + xoff) / 50) * 100 + width / 2, i);
    // point(sin(radians(i + xoff)) * 100 + width / 2, i);
  }

  // cos curve
  stroke("orange");
  // x direction
  for (let i = 0; i < width; i += span) {
    point(i, cos((i + xoff) / 50) * 100 + height / 2);
    // point(i, cos(radians(i + xoff)) * 100 + height / 2);
  }
  // y direction
  for (let i = 0; i < height; i += span) {
    // point(cos((i + xoff) / 50) * 100 + width / 2, i);
    // point(cos(radians(i + xoff)) * 100 + width / 2, i);
  }

  xoff++;
}
