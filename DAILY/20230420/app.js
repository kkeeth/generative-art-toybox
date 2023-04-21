let radius = 100;
let m, r;
let items = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  blendMode(DIFFERENCE);
  frameRate(1);
  for (let i = 0; i < width; i += radius) {
    for (let j = 0; j < height; j += radius) {
      items.push({
        x: i,
        y: j,
      });
    }
  }
}

function draw() {
  clear();

  m = random([100, 150, 200, 300]);
  r = random([15, 30, 45, 50, 75, 100]);

  for (let { x, y } of items) {
    drawCircles(x, y, m, r);
  }
}

function drawCircles(x, y, m, step) {
  for (let i = m; i > 10; i -= step) {
    fill(map(x, 0, width, 180, 250), map(y, 0, height, 180, 250), i);
    circle(x, y, i);
  }
}
