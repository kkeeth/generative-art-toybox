let xoff = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  noiseSeed(99);
  background(255);
  translate(windowWidth / 2, windowHeight / 2);

  // 2D
  noStroke();
  fill("#3182FE");
  circle(0, 0, 300);

  fill("#FFF");
  circle(0, 0, 250);

  fill("#3182FE");
  circle(0, 0, 140);

  strokeWeight(10);
  stroke("#FFF");
  fill("#3182FE");
  circle(
    135 * cos(noise(xoff) * PI + -radians(frameCount)),
    135 * sin(noise(xoff) * PI + -radians(frameCount)),
    65,
  );

  xoff += 0.01;
}
