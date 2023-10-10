const NUM = 12;
const SIZE = 50;
const RAW = 8;
let items = [];
let outer;
let margin;

function setup() {
  createCanvas((W = 700), W);
  strokeWeight(8);
  stroke(255);

  for (let i = 0; i < NUM; i++) {
    items.push({
      c: color(
        map(i, 0, NUM, 0, 255),
        map(i, 0, NUM, 255, 0),
        map(i, 0, NUM, 255, 127)
      ),
      position: SIZE + margin,
    });
  }
  margin = (W - RAW * SIZE) / (RAW + 1);
}

function draw() {
  background(100);
  for (let i = 0; i < RAW; i++) {
    for (let j = 0; j < items.length; j++) {
      items[j].position = map(
        sin((frameCount + j * RAW + (i * (SIZE + margin)) / 10) / 40),
        -1,
        1,
        SIZE,
        W - SIZE
      );
      fill(items[j].c);
      ellipse(i * (SIZE + margin) + margin + SIZE / 2, items[j].position, SIZE);
    }
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 3.9);
  }
}
