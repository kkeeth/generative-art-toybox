let d;

function setup() {
  createCanvas((w = 800), w);
  noFill();
  stroke(255);
  frameRate(10);
  rectMode(CENTER);

  d = w / 8;
}

function draw() {
  background(0);
  translate(w / 2, w / 2);
  for (let x = 0; x < 10; x++) {
    push();
    strokeWeight(random([1, 2]));
    translate(random(-d, d), random(-d, d));
    translate(p5.Vector.fromAngle(millis() / 1000, d * 2));
    rect(20, 20, random(w / 5), random(w / 5));
    pop();
  }
}
