const N = 5;
let diff;
let radius = 200;

function setup() {
  createCanvas((W = 600), W);
  background(0);
  translate(W / 2, W / 2);
  noStroke();

  push();
  noFill();
  strokeWeight(3);
  stroke(255);
  ellipse(0, 0, W / 1.2);
  pop();

  // wheel image
  push();
  for (let i = 0; i < 3; i++) {
    let a = PI / 6 + i * ((2 * PI) / 3);
    ellipse((W / 4.5) * cos(a), (W / 4.5) * sin(a), (W / 2.4 - W / 4) * 2);
  }
  pop();
}

function keyPressed() {
  if (key === "s") {
    saveCanvas("mySketch", "png");
  }
}
