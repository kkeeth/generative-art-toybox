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
const minDistance = 100;
let w;
let items = [];
let boff = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  w = width / 40;
  noStroke();
  // blendMode(OVERLAY);

  for (let i = 0; i < c; i++) {
    let tries = 0;
    let x, y, h;
    do {
      x = random(w / 2, width - w / 2);
      h = random(height / 4, height / 2);
      y = random(h / 2, height - h / 2);
      tries++;
    } while (!isFarEnough(x, y) && tries < 100);
    items.push(new Flower(x, y, w));
  }
}

function draw() {
  // background(map(sin(200 + boff), -1, 1, 0, 255));
  background(200);
  for (let i = 0; i < items.length; i++) {
    items[i].update();
    items[i].show();
  }
  boff += 0.1;
}

class Flower {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = random(w / 2, w * 2);
    this.r = random(QUARTER_PI);
    this.v = random(10);
    this.n = int(random(5, 10));
    this.size = random(0.5, 2);
    this.color1 = random(colors);
    this.color2 = random(colors);
    if (this.color1 === this.color2) this.color2 = random(colors);
    this.rotationSpeed = random(0.005, 0.02);
    this.rotationDirection = random([1, -1]);
  }

  update() {
    this.r = map(
      sin(frameCount * this.rotationSpeed) * this.rotationDirection,
      -1,
      1,
      0,
      TAU,
    );
  }

  show() {
    push();
    translate(this.x, this.y);
    // scale(this.size);
    rotate(this.r);
    for (let i = 0; i < this.n; i++) {
      fill(lerpColor(color(this.color1), color(this.color2), i / this.n));
      ellipse(1.4 * this.w, 0, 2 * this.w, 0.8 * this.w);
      rotate(TAU / this.n);
    }
    fill(this.color2);
    circle(0, 0, this.w * 0.8);
    pop();
  }
}

function isFarEnough(x, y) {
  for (let i = 0; i < items.length; i++) {
    let flower = items[i];
    let d = dist(x, y, flower.x, flower.y);
    if (d < minDistance) {
      return false;
    }
  }
  return true;
}

function keyPressed() {
  if (key == "s") {
    saveGif("sketch", 5);
  }
}
