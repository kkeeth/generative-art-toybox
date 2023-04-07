let colors = [
  "#e6302b",
  "#fd7800",
  "#fbd400",
  "#51b72d",
  "#2abde4",
  "#4e59a4",
  "#085a9b",
  "#f477c3",
];
const c = 50;
let w;
let items = [];
let boff = 0;

function setup() {
  createCanvas((W = windowHeight), W);
  w = width / 30;
  noStroke();
  // blendMode(LIGHTEST);

  for (let i = 0; i < c; i++) {
    let x = random(w / 2, width - w / 2);
    let h = random(height);
    let y = random(h / 2, height - h / 2);
    items.push(new Flower(x, y, w, h));
  }
}

function draw() {
  background(map(sin(200 + boff), -1, 1, 0, 255));
  for (let i = 0; i < items.length; i++) {
    items[i].update();
    items[i].show();
  }
  boff += 0.01;
}

class Flower {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.s = random(0.5, 1.5);
    this.r = random(QUARTER_PI);
    this.v = random(10);
    this.n = int(random(5, 10));
    this.color1 = random(colors);
    this.color2 = random(colors);
  }

  update() {
    this.r += sin(frameCount * 0.01);
  }

  show() {
    push();
    translate(this.x, this.y);
    scale(this.s);
    rotate(this.r);
    fill(this.color1);
    for (let i = 0; i < this.n; i++) {
      ellipse(w * 1.4, 0, w * 2, w * 0.8);
      // ellipse(w * 0.6, 0.1, w * 0.7, w * 0.3);
      rotate(TAU / this.n);
    }
    fill(this.color2);
    circle(0, 0, w * 0.7);
    pop();
  }
}

function keyPressed() {
  if (key == "s") {
    saveGif("sketch", 5);
  }
}
