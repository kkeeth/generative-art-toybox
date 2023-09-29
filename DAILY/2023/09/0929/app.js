const NUM = 5;
const padding = 20;
let SIZE;
let targetSize;
let items = [];

function setup() {
  createCanvas((W = 600), W);
  noStroke();

  SIZE = W / 8;
  targetSize = NUM * SIZE + (NUM - 1) * padding;

  for (let x = 0; x < NUM; x++) {
    for (let y = 0; y < NUM; y++) {
      items.push(new Item(x, y));
    }
  }
}

function draw() {
  background(255);
  translate((width - targetSize) / 2, (height - targetSize) / 2);

  for (item of items) {
    item.show();
  }
}

class Item {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = color(random(200, 240), random(200, 240), random(200, 240));
    this.initialAngle = random(TAU);
  }

  show() {
    fill(this.color);
    rect(
      this.x * (SIZE + padding),
      this.y * (SIZE + padding),
      SIZE,
      SIZE,
      (SIZE * (sin(frameCount / 50 + this.initialAngle) + 1)) / 2,
    );
  }
}
function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5);
  }
}
