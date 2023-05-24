const r = 50;
const step = 24;
const colors = [
  "#0d8cf1",
  "#0eb4f0",
  "#0b770d",
  "#0b0e13",
  "#EFB6F9",
  "#FF9521",
  "#f60402",
  "#cdd3e7",
  "#F4E6FF",
];
let seed;
let cond;

function setup() {
  createCanvas((W = windowHeight), W);
  noStroke();
  rectMode(CENTER);
  seed = random(100);
  frameRate(30);
}

function draw() {
  background(255);
  translate(width / 2, height / 2);
  randomSeed(seed);
  cond = abs(24 * sin(frameCount / 50)) + 7;
  rotate(frameCount / 300);

  if (cond !== 0) {
    for (let d = r; d < height / 2 - r; d += cond) {
      let s = random(8, step);
      fill(random(colors));
      for (let i = 0; i < TAU; i += PI / 6) {
        let x = d * cos(i + radians(d));
        let y = d * sin(i + radians(d));
        if (~~cond % 2 === 0) ellipse(x, y, s);
        else rect(x, y, s);
      }
    }
  }
}

function keyPressed() {
  if (key === "s") saveGif("mySketch", 7.8);
}
