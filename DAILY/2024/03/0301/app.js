const graphices = [];
const items = [];
const NUM = 8;
const offset = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  for (let i = 0; i < NUM; i++) {
    const g = createGraphics(width, height);
    g.size = width;
    graphices.push(g);
    items.push(new Light());
  }
}

function draw() {
  background(0);
  fill("lemonyellow");

  for (let g of graphices) {
    g.clear();
  }

  for (let item of items) {
    item.update();
    item.show();
  }

  let i = 0;
  for (let g of graphices) {
    drawingContext.filter = "blur(8px)";
    image(g, 0, 0);
  }
}

class Light {
  constructor() {
    this.pos = createVector(
      random(offset, width - offset),
      random(offset, height - offset),
    );
    this.oSize = 30;
    this.speed = random() * 5 * (random() > 0.5 ? 1 : -1);
    this.angle = random() * TAU;
  }

  update() {
    this.angle += 0.01;
  }

  show() {
    ellipse(this.pos.x, this.pos.y, this.oSize);
    quad(
      this.pos.x,
      this.pos.y,
      this.pos.x,
      this.pos.y,
      this.pos.x + width * cos(this.angle),
      this.pos.y + width * sin(this.angle),
      this.pos.x + width * cos(this.angle - PI / 12),
      this.pos.y + width * sin(this.angle - PI / 12),
    );
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5);
  }

  if (key === "c") {
    saveCanvas("mySketch", "jpeg");
  }
}
