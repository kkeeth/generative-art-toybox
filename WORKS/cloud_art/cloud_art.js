let xstart, ystart;

function setup() {
  createCanvas(800, 600, WEBGL);
  // sphereDetail(8);
  noStroke();

  xstart = random(10);
  ystart = random(10);
}

function draw() {
  background(0);
  translate(-width / 2, -height / 2);

  xstart += 0.03;
  ystart += 0.03;

  xnoise = xstart;
  ynoise = ystart;

  for (let y = 0; y <= height; y += 5) {
    ynoise += 0.1;
    xnoise = xstart;

    for (let x = 0; x <= width; x += 5) {
      xnoise += 0.1;
      drawPoint(x, y, noise(xnoise, ynoise));
    }
  }
}

function drawPoint(x, y, noiseFactor) {
  push();
  translate(x, 25 - -y, y);
  sphereSize = noiseFactor * 20;
  gray = 150 + noiseFactor * 120;
  alpha = 150 + noiseFactor * 120;
  fill(gray, alpha);
  sphere(sphereSize);
  pop();
}

