import {OPENGL} from "processing/opengl";

function setup() {
  size(800, 600, OPENGL);
  background(0);
  sphereDetail(8);
  noStroke();

  xstart = random(10);
  ystart = random(10);
}

function draw() {
  background(0);

  xstart += 0.01;
  ystart += 0.01;

  xnoise = xstart;
  ynoise = ystart;

  for (int y = 0; y <= height; y += 5) {
    ynoise += 0.1;
    xnoise = xstart;

    for (int x = 0; x <= width; x += 5) {
      xnoise += 0.1;
      drawPoint(x, y, noise(xnoise, ynoise));
    }
  }
}

function drawPoint(x, y, noiseFactor) {
  pushMatrix();
  translate(x, 25- - y, y);
  sphereSize = noiseFactor * 20;
  gray = 150 + (noiseFactor * 120);
  alpha = 150 + (noiseFactor * 120);
  fill(gray, alpha);
  sphere(sphereSize);
  popMatrix();
}