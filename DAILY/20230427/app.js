const cp = [
  "#7B51A5",
  "#1B9C93",
  "#EF84C1",
  "#FA9920",
  "#EA4348",
  "#76A4E2",
  "#8BAD49",
];
const span = 10;
let seed;
let vmin;
let base = 250;
let offset;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();

  seed = random(100);
  vmin = height;
}

function draw() {
  noiseSeed(seed);
  background(240, 20);

  for (let i = 0; i < width; i += span / 1.1) {
    push();
    translate(width / 2, height / 2);
    let a = map(i, 0, width, 0, TAU);
    let r = base + sin(noise(i) * TAU * 10 + frameCount / 50) * vmin * 0.3;
    stroke(cp[~~map(r, base - vmin * 0.3, base + vmin * 0.3, cp.length, 0)]);
    ellipse(
      r * cos(a),
      r * sin(a),
      map(r, base - vmin * 0.3, base + vmin * 0.3, span, span + 20),
    );
    pop();
  }
  offset += 0.1;
  seed += 0.001;
}

function keyPressed() {
  if (key == "s") {
    saveGif("mySketch", 5);
  }
}
