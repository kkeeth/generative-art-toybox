const cp = [
  "#e6302b",
  "#6fd0e7",
  "#fd7800",
  "#fbd400",
  "#9AE671",
  "#f477c3",
  "#f8b862",
];
let selectedColor;

function setup() {
  createCanvas((W = windowHeight - 100), W);
  background(255);
  noStroke();

  let span = height / 16;
  selectedColor = random(cp);

  translate(0, -span / 2);
  for (let i = height; i > 0; i -= span) {
    let tmpX1 = random(0, W / 1.5);
    let tmpX2 = random(W / 1.5, W);
    push();
    if (i % (span * 2) === 0) {
      fill(30);
      rect(0, i - span / 2, W, span);

      fill(selectedColor);
      ellipse(tmpX1, i, span);
      ellipse(tmpX1 - random(30, 200), i, span);
      rect(tmpX1, i - span / 2, W, span);
    } else {
      fill(selectedColor);
      rect(0, i - span / 2, W, span);

      fill(30);
      ellipse(tmpX2, i, span);
      translate(-(W - tmpX2), 0);
      rect(0, i - span / 2, W, span);
    }
    pop();
  }
}

function keyPressed() {
  if (key === "s") {
    saveCanvas("mySketch", "png");
  }
}
