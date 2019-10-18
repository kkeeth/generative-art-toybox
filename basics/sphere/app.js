function setup() {
  createCanvas(400, 400, WEBGL);
  smooth();
  background(200);
}

function draw() {
  this.directionalLight(128, 128, 128, 0, 0, -1);

  push();
  strokeWeight(1);
  sphere(100);
  pop();
}
