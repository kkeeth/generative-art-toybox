const centerR = 80;
const arroundR = 20;
const r1 = 100;
const r2 = 200;
const step = 45;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  colorMode(HSB, 360);
}

function draw() {
  // background(0, 0, 360);

  fill(180, 100, 330);
  circle(0, 0, centerR);

  for (let i = 0; i < 360; i += step) {
    let dx = r1 * cos(-radians(i * 2 + millis() / 5));
    let dy = r1 * sin(-radians(i * 3 + millis() / 5));

    push();
    fill(i, 180, 360);
    circle(dx, dy, arroundR);
    pop();

    push();
    let outerCircleRange = map(cos(frameCount / 15), -1, 1, 3 / 4, 3 / 2);
    dx = r2 * outerCircleRange * cos(radians(i) + frameCount / 50);
    dy = r2 * outerCircleRange * sin(radians(i) + frameCount / 50);
    fill(i, 200, 300);
    circle(dx, dy, 10);
    pop();
  }
}
