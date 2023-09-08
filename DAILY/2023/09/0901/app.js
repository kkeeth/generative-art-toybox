const N = 5;
let diff;
let radius = 200;

function setup() {
  createCanvas((W = windowHeight - 100), W);
  stroke(255);
  strokeWeight(2);
  noFill();
}

function draw() {
  background(50, 20);
  translate(W / 2, W / 2);

  for (let i = 0; i < N; i++) {
    let a = map(i, 0, N, 0, TAU);
    line(
      radius * cos(a + frameCount / 30),
      radius * sin(a + frameCount / 30),
      (radius + i * 0) * tan(a + frameCount / 20),
      (radius + i * 0) * sin(a + frameCount / 20),
    );
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5);
  }
}
