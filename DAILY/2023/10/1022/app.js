const NUM = 9;
const items = [];

function setup() {
  createCanvas((W = windowHeight - 50), W, WEBGL);
  noFill();
  rectMode(CENTER);

  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < TAU; i += TAU / (NUM + j * 8 + 3)) {
      items.push(new Item(j, i, 120));
    }
  }
}

function draw() {
  background(50);
  for (let item of items) {
    push();
    item.update();
    item.show();
    pop();
  }
}

class Item {
  constructor(n, i, d) {
    this.x = (n * 100 + d) * cos(i);
    this.y = (n * 100 + d) * sin(i);
    this.z = 0;
    this.i = i;
    this.n = n;
    this.color = color(random(160, 255), random(160, 255), random(160, 255));
    this.size = d / 3;
    this.baseSize = d / 3;
    this.weight = random(1, 5);
    this.initialAngle = random(TAU);
  }

  update() {
    this.size = this.baseSize * abs(sin(this.i + this.n + frameCount / 70));
  }

  show() {
    translate(this.x, this.y, this.z);
    rotateX(this.initialAngle + frameCount / 50);
    rotateY(this.initialAngle + frameCount / 77);
    stroke(this.color);
    strokeWeight(this.n + 1);
    box(this.size);
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5);
  }

  if (key === "c") {
    saveCanvas("mySketch", "png");
  }
}
