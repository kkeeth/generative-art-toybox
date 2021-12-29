function setup() {
  createCanvas((w = windowHeight), w);
  noFill();
  stroke(255);
  frameRate(10);
  rectMode(CENTER);
}

function draw() {
  background(0);
  translate(w / 2, w / 2);
  for (let x = 0; x < 10; x++) {
    push();
    // const c = color(random(120, 220), random(120, 220), random(120, 220));
    // stroke(c);
    strokeWeight(random([1, 3]));
    translate(random(-w / 2, w / 2), random(-w / 2, w / 2));
    rect(20, 20, random(w / 5), random(w / 5));
    pop();
  }
}
