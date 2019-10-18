function setup() {
  createCanvas(400, 400);
  smooth();
}

function draw() {

  background(224);
  fill(0, 0, 255, 127);
  noStroke();

  push();
  rotate(radians(30));
  scale(1.5, 3);
  rect(width/3, 0, 50, 50); // x, y, width, height, r
  pop();
}
