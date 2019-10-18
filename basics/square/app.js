function setup() {
  createCanvas(400, 400);
  smooth();
}

function draw() {

  background(220);
  fill(255,0,0, 127);
  noStroke();
  rect((width - 100)/2, (height - 100)/2, 100, 100); // x, y, width, height
}
