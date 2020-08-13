let x, y, r;

function setup() {
  createCanvas(600, 480);
  smooth();
  noStroke();
  background('skyblue');
}

function draw() {
  x = random(width);
  y = random(height);

  if (random() > 0.9) {
    r = random(50, 80);
  }
  else {
    r = random(10, 30);
  }
  fill(255, 255, 255, random(30, 250));
  ellipse(x, y, r, r);
}
