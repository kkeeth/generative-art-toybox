const maxSize = 100;
const N = 40;
const colors = ["#FF6B35", "#39A2DB", "#000000"];
let seed;
let aiff = 0.0;

function setup() {
  createCanvas((W = windowHeight - 100), W);
  noFill();
  rectMode(CENTER);
  seed = random(1000);
}

function draw() {
  background(255);
  randomSeed(seed);
  translate(0, maxSize / 2);
  for (let j = 0; j < width; j++) {
    push();
    stroke(random(colors));
    translate(maxSize * j, 0);
    for (let i = 0; i < N; i++) {
      rect(
        0,
        i * N,
        maxSize * cos(map(i, 0, N, 0, TAU) + aiff + random(width))
      );
    }
    pop();
  }
  aiff += 0.01;
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5);
  }
  if (key === "c") {
    saveCanvas("mySketch", "png");
  }
}
