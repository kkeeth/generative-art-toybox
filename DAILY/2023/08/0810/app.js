function setup() {
  createCanvas((W = windowHeight - 100), W);
  background(255);
  noFill();

  // fish
  beginShape();
  vertex(width - 30, height / 2);
  for (let i = 0; i <= 15; i++) {
    bezier(
      width - 30,
      height / 2,

      (2 * width) / 4,
      height / 2 + 300 - i * 20,

      (1 * width) / 4,
      height / 2 - 150 + i * 10,

      50 + i * 3,
      height / 2 - (45 - i * 3),
    );
    bezier(
      width - 30,
      height / 2,

      (2 * width) / 4,
      height / 2 - 300 + i * 20,

      (1 * width) / 4,
      height / 2 + 150 - i * 10,

      50 + i * 3,
      height / 2 + (45 - i * 3),
    );
  }
  endShape();
}

function keyPressed() {
  if (key === "s") {
    saveCanvas("mySketch", "png");
  }
}
