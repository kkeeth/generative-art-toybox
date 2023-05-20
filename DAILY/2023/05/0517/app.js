const NUM = 70;
const cp = [
  "#ffb6b9",
  "#bbded6",
  "#fae3d9",
  "#8ac6d1",
  "#fff1ac",
  "#f9bcdd",
  "#d5a4cf",
  "#b689b0",
];
let items = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(3);
  noLoop();

  for (let i = 0; i < NUM; i++) {
    items.push({
      x: ~~random(20, width - 20),
      y: ~~random(20, height - 20),
      z: ~~random(height),
      size: ~~random(5, 20),
      circleColor: random(cp),
    });
  }
}

function draw() {
  background(50);

  for (let i = 0; i < NUM; i++) {
    stroke(items[i].circleColor);
    if (i + 1 === NUM) {
      line(items[i].x, items[i].y, items[0].x, items[0].y);
    } else {
      line(items[i].x, items[i].y, items[i + 1].x, items[i + 1].y);
    }
  }

  for ({ x, y, size, circleColor } of items) {
    push();
    noStroke();
    drawingContext.shadowColor = "#fff";
    drawingContext.shadowBlur = 20;
    fill(255);
    ellipse(x, y, size, size);
    pop();
  }
}

function keyPressed() {
  if (key === "r") {
    redraw();
  }
  if (key === "s") {
    saveGif("mySketch", 5);
  }
}
