const cp = [
  "#e6302b",
  "#fd7800",
  "#fbd400",
  "#51b72d",
  "#2abde4",
  "#4e59a4",
  "#085a9b",
  "#f477c3",
  "#f8b862",
];

function setup() {
  createCanvas((W = windowHeight - 120), W);
  noStroke();
  shuffle(cp, true);
  background(255);

  const r = W / 10;
  const color1 = cp[0];
  const color2 = cp[1];

  translate(W / 2, r * 1.5);

  for (let j = 0; j < W / (r * 1.2); j++) {
    for (let i = PI; i < TAU; i += PI / 20) {
      push();
      for (let k = -2; k < 3; k++) {
        if (2 * r * cos(i) + k * r < 0) {
          if (j % 2 === 0) fill(color1);
          else fill(color2);
        } else {
          if (j % 2 === 0) fill(color2);
          else fill(color1);
        }
        ellipse(2 * r * cos(i) + k * r, r * (j + sin(i)) + 20, 5);
      }
      pop();
    }
  }
}

function keyPressed() {
  if (key === "s") {
    saveCanvas("mySketch", "png");
  }
}
