function setup() {
  createCanvas(400, 400, WEBGL);
  rectMode(CENTER);
}

function draw() {
  background(0);

  this.ambientLight(128, 128, 128);
  this.directionalLight(128, 128, 128, 0, 0, -1);

  push();
  rotateX(millis() / 1000);
  rotateY(millis() / 1000);
  rotateZ(millis() / 1000);
  noStroke();
  box(100);
  pop();
}
