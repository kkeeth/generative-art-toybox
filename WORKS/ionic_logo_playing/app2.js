let xoff = 0;
let dFlg = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 1);
}

function draw() {
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
  fill(color(noise(xoff), 1, 1));
  if (dFlg) {
    circle(
      135 * cos(-2 * radians(frameCount)),
      135 * sin(-2 * radians(frameCount)),
      65,
    );
  } else {
    circle(
      135 * cos(2 * radians(frameCount)),
      135 * sin(2 * radians(frameCount)),
      65,
    );
  }
  if (radians(frameCount) % PI === 0) dFlg = !dFlg;
  xoff += 0.01;
}
