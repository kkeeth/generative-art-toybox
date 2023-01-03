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
let n = 8;
let g, sg;
let xoff = 0;
let yoff = 0;
let mode = "+";

function setup() {
  createCanvas(720, 720);
  noStroke();
  rectMode(CENTER);
  angleMode(DEGREES);

  g = width / n;
  sg = g / 4;
}

function draw() {
  background(250);
  randomSeed(100);

  for (let x = g / 2; x < width; x += g) {
    for (let y = g / 2; y < width; y += g) {
      fill(random(colors));
      push();

      let xord = ((x - g / 2) / g) % 2;
      let yord = ((y - g / 2) / g) % 2;
      let cond = 0;
      let moveCond = random();

      if (xord === 0 && yord === 0) {
        cond = 2;
        translate(g, g);
        if (mode === "+") {
          arc(x - g / 2 - xoff, y - g / 2, g, g, 0 + 90 * cond, 90 + 90 * cond);
        } else {
          arc(
            x - g / 2 + xoff,
            y - g / 2 + yoff,
            g,
            g,
            0 + 90 * cond,
            90 + 90 * cond,
          );
        }
      } else if (xord === 0 && yord === 1) {
        cond = 1;
        translate(g, 0);
        if (mode === "+") {
          arc(x - g / 2, y - g / 2 + yoff, g, g, 0 + 90 * cond, 90 + 90 * cond);
        } else {
          arc(
            x - g / 2 + xoff,
            y - g / 2 - yoff,
            g,
            g,
            0 + 90 * cond,
            90 + 90 * cond,
          );
        }
      } else if (xord === 1 && yord === 0) {
        cond = 3;
        translate(0, g);
        if (mode === "+") {
          arc(x - g / 2, y - g / 2 - yoff, g, g, 0 + 90 * cond, 90 + 90 * cond);
        } else {
          arc(
            x - g / 2 - xoff,
            y - g / 2 + yoff,
            g,
            g,
            0 + 90 * cond,
            90 + 90 * cond,
          );
        }
      } else if (xord === 1 && yord === 1) {
        translate(0, 0);
        if (mode === "+") {
          arc(x - g / 2 + xoff, y - g / 2, g, g, 0 + 90 * cond, 90 + 90 * cond);
        } else {
          arc(
            x - g / 2 - xoff,
            y - g / 2 - yoff,
            g,
            g,
            0 + 90 * cond,
            90 + 90 * cond,
          );
        }
      }
      pop();
    }
  }
  xoff = map(sin(frameCount), 0, 1, 0, g);
  yoff = map(sin(frameCount), 0, 1, 0, g);

  if (frameCount % 340 === 0) {
    mode === "+" ? (mode = "*") : (mode = "+");
  }
}
