let colors = [
  "#F94144",
  "#F65A38",
  "#F3722C",
  "#F68425",
  "#F8961E",
  "#F9AF37",
  "#F9C74F",
  "#C5C35E",
  "#90BE6D",
  "#6AB47C",
  "#43AA8B",
  "#4D908E",
  "#52838F",
  "#577590",
];
let N;
let g;
const span = 9;

function setup() {
  createCanvas(600, 600);
  noStroke();

  N = width / 8;

  for (let i = 0; i < 8; i++) {
    fill(random(colors));
    for (let j = -(span * 5); j < height + span * 5; j += span) {
      push();
      j % 2 === 0 && fill(255);
      const tilt = span * 4;
      quad(
        i * N,
        j,
        i * N,
        j + tilt,
        (i + 1) * N,
        (i % 2 === 0 ? j - tilt : j + tilt) + tilt,
        (i + 1) * N,
        i % 2 === 0 ? j - tilt : j + tilt
      );
      pop();
    }
  }
}

function keyPressed() {
  if (key === "c") {
    saveCanvas("mySketch", "png");
  }
}
