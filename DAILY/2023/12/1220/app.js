let diff = 0;
let seed;
let items = [];
const N = 500;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  stroke(255);
  colorMode(HSB, width, 100, 100);

  for (let i = 0; i < N; i++) {
    items.push({
      x: random(100, width - 100),
      y: random(30, height - 30),
      span: 0,
      r: random(10, 50),
      speed: random(3, 20),
      thin: random(2, 8),
      length: random(20, 50),
      color: color(0),
    });
    items[i].span = items[i].x - items[i].length;
    items[i].color = color(items[i].x, 100, 100);
  }
}

function draw() {
  background(255);

  for (let item of items) {
    stroke(item.color);
    strokeWeight(item.thin);
    beginShape();
    for (let i = item.x; i > item.span; i -= 15) {
      let x = i - item.speed;
      let y = item.y + item.r * sin(radians(i - diff));

      vertex(x, y);
    }
    endShape();
    item.x -= item.speed;
    item.span -= item.speed;

    if (item.x < 0) {
      item.x = width + item.length;
      item.span = width;
      item.y = random(80, height - 80);
      item.r = random(10, 50);
    }
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 3);
  }
}
