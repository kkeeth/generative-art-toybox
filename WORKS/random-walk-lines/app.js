let dx = 0;
let dy = 0;
let ndx = 0;
let ndy = 0;
const length = 50;

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 255);
  strokeWeight(5);
}

function draw() {
  translate(width / 2, height / 2);

  if (frameCount % 3 === 0) {
    stroke(random(255));
    let cond = random();
    if (cond < 0.25) {
      ndx += length;
    } else if (cond < 0.5) {
      ndy += length;
    } else if (cond < 0.75) {
      ndx -= length;
    } else {
      ndy -= length;
    }

    if (ndx < -width / 2) {
      ndx += length;
    } else if (ndy < -height / 2) {
      ndy += length;
    } else if (ndx >= width / 2) {
      ndx -= length;
    } else if (ndy >= height / 2) {
      ndy -= length;
    }
    line(dx, dy, ndx, ndy);

    dx = ndx;
    dy = ndy;
  }
}
