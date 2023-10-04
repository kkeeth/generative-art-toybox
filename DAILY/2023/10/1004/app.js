const NUM = 12;
const SIZE = 50;
const margin = 30;
let items = [];

function setup() {
  createCanvas((W = 700), W);
  // strokeWeight(8);
  noStroke();

  for (let i = 0; i < NUM; i++) {
    items.push({
      c: color(
        map(i, 0, NUM, 0, 255),
        map(i, 0, NUM, 255, 0),
        map(i, 0, NUM, 255, 127),
      ),
      position: SIZE + margin,
    });
  }
}

function draw() {
  background(255);
  for (let i = SIZE; i < W - SIZE; i += SIZE + margin) {
    for (let j = 0; j < items.length; j++) {
      items[j].position = map(
        sin((frameCount + j * 8 + i / 12) / 40),
        -1,
        1,
        SIZE,
        W - SIZE,
      );
      fill(items[j].c);
      ellipse(i, items[j].position, SIZE);
    }
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 3.9);
  }
}
