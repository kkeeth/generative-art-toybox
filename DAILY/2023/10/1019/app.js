const NUM = 50;
const items = [];

function setup() {
  createCanvas((W = windowHeight - 50), W);
  // blendMode(ADD);
  noStroke();

  const span = width / 10;

  for (let x = span / 2; x < W; x += span) {
    for (let y = span / 2; y < W; y += span) {
      fill(random(160, 255), random(160, 255), random(160, 255));

      const cond = random();
      if (cond < 0.4) {
        ellipse(x, y, span / 2, span / 2);
        rect(x, y - span / 4, span, span / 2);
        ellipse(x + span, y, span / 2, span / 2);
      } else if (cond < 0.8) {
        ellipse(x, y, span / 2, span / 2);
        rect(x - span / 4, y, span / 2, span);
        ellipse(x, y + span, span / 2, span / 2);
      } else {
        ellipse(x, y, span / 2);
      }
    }
  }
  noLoop();
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5);
  }

  if (key === "c") {
    saveCanvas("mySketch", "png");
  }
}
