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
let max;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  strokeWeight(5);

  seed = random(100);
  max = height / 8;
}

function draw() {
  background(240);
  randomSeed(seed);

  for (let x = 30; x < width - 30; x += 20) {
    stroke(random(colors));
    line(
      x,
      lerp(
        height / 2,
        (max / 3) * sin(map(x, 30, width - 30, 0, TAU * 2)),
        ((frameCount + x / 3) % 100) / 100,
      ),
      x,
      lerp(
        height / 2,
        height - (max / 3) * sin(map(x, 30, width - 30, 0, TAU * 2)),
        ((frameCount + x / 4) % 100) / 100,
      ),
    );
    fill(random(colors));
    ellipse(
      x,
      lerp(
        height / 2,
        (max / 3) * sin(map(x, 30, width - 30, 0, TAU * 2)),
        ((frameCount + x / 3) % 100) / 100,
      ),
      10,
    );
    ellipse(
      x,
      lerp(
        height / 2,
        height - (max / 3) * sin(map(x, 30, width - 30, 0, TAU * 2)),
        ((frameCount + x / 4) % 100) / 100,
      ),
      10,
    );
  }
}

function keyPressed() {
  if (key === "s") saveGif("mySketch", 5);
}
