const cp = [
  "#FFB6C1", // Light Pink
  "#FFD1E8", // Mauve
  "#B0E0E6", // Powder Blue
  "#FFDEAD", // Navajo White
  "#C3CDE6", // Lavender Blue
  "#E6E6FA", // Lavender
  "#D1E231", // Pastel Yellow
  "#FFDAC1", // Peach Puff
];

function setup() {
  createCanvas((W = windowHeight - 50), W);
  strokeWeight(10);
  strokeCap(SQUARE);
  shuffle(cp, true);
}

function draw() {
  background(70, 10);
  translate(width / 2, height / 2);

  for (let j = 0; j < 6; j++) {
    stroke(cp[j]);
    for (let i = 0; i < TAU; i += PI / (3 * (j + 1))) {
      push();
      const direction = j % 2 === 0 ? 1 : -1;
      rotate((direction * frameCount) / 120);
      rotate(i);
      line(j * 50, 0, (j + 1) * 50, 0);
      pop();
    }
    // stroke(cp[cp.length - j - 1]);
    // for (let i = 0; i < TAU; i += PI / (3 * (j + 1))) {
    //   push();
    //   const direction = j % 2 === 0 ? -1 : 1;
    //   rotate((direction * frameCount) / 120);
    //   rotate(i);
    //   line(j * 50, 0, (j + 1) * 50, 0);
    //   pop();
    // }
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 3);
  }
}
