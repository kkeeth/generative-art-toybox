let xoff = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 1);
}

function draw() {
  // noiseSeed(99);
  background(255);
  translate(windowWidth / 2, windowHeight / 2);

  noStroke();
  fill("#3182FE");
  circle(0, 0, 300);

  fill("#FFF");
  circle(0, 0, 260);

  fill("#3182FE");
  circle(0, 0, 140);
  // circle(0, 0, 140 * cos(-2 * radians(frameCount)));

  strokeWeight(10);
  stroke("#FFF");
  fill(color(noise(xoff), 1, 1));
  circle(
    140 * cos(noise(xoff) * PI - radians(frameCount)),
    140 * sin(noise(xoff) * PI - radians(frameCount)),
    60,
  );
  // circle(
  //   140 * cos(3 * radians(frameCount)),
  //   140 * sin(3 * radians(frameCount)),
  //   60,
  // );

  xoff += 0.01;
}
