function setup() {
  createCanvas(400, 400, WEBGL);
  smooth();
}

function draw() {
  background(200);
  this.ambientLight(128, 128, 128);
  this.directionalLight(128, 128, 128, 0, 0, -1);
  noStroke();

  push();
  rotateZ(frameCount * 0.01);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  torus(70, 20);
  pop();
}
