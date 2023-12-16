let d = 0.0;
let grid;
let span;
let seed;
let base;
const size = 12;

function setup() {
  createCanvas((W = windowHeight - 100), W);
  noFill();
  strokeWeight(2);
  rectMode(CENTER);

  base = W - 160;
  grid = base / 3;
  span = base / 15;
  seed = random(1000);
}

function draw() {
  background(255, 10);
  randomSeed(seed);

  for (let i = grid / 2; i < base; i += grid) {
    for (let j = grid / 2; j < base; j += grid) {
      push();
      translate(W / 2, -span);
      rotate(QUARTER_PI);
      rect(i, j, size, size);
      pop();
      for (let h = -2 * span; h <= 2 * span; h += span) {
        for (let v = -2 * span; v <= 2 * span; v += span) {
          push();
          translate(W / 2, -span);
          rotate(QUARTER_PI);
          if (h === v || h === -v) {
            push();
            noStroke();
            fill("red");
            ellipse(h + i, v + j, 8);
            pop();
          } else if (h === 0 || v === 0) {
            if (h === 0) stroke(random(random(colorPalette).colors));
            if (v === 0) stroke(random(random(colorPalette).colors));
            rect(
              v + i,
              h + j,
              v === 0 ? h * 1.1 + h * 1.1 * sin(d / 32 + random(TAU)) : size,
              h === 0 ? v * 1.1 + v * 1.1 * sin(d / 32 + random(TAU)) : size
            );
          }
          pop();
        }
      }
    }
  }
  d++;
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5);
  }

  if (key === "c") {
    saveCanvas("mySketch", "png");
  }
}
