const NUM = 50;
const padding = 100;
let xoff = 0.0;
let lines = [];

function setup() {
  createCanvas((W = 720), W);
  for (let i = 0; i < NUM; i++) {
    let cond = random();
    let tmpWidth = random(padding, width - padding);
    let tmpHeight = random(padding, height - padding);
    lines.push({
      x1: tmpWidth,
      y1: tmpHeight,
      x2: cond < 0.5 ? tmpWidth : random(width),
      y2: cond < 0.5 ? random(height) : tmpHeight,
      thick: random(1, 3),
      opacity: random(127, 255),
    });
  }
}

function draw() {
  background(0);

  drawingContext.shadowColor = color("yellow");

  for (let { x1, x2, y1, y2, thick, opacity } of lines) {
    drawingContext.shadowBlur = thick * 2;

    strokeWeight(thick);
    stroke(255, opacity);
    line(x1, y1, x2, y2);

    push();
    noStroke();
    fill(255, opacity);
    circle(x1, y1, thick * 4);
    circle(x2, y2, thick * 4);
    pop();
  }
}

function keyPressed() {
  if (key === "c") {
    saveCanvas("mySketch", "png");
  }
  if (key === "s") {
    saveGif("mySketch", 8.5);
  }
}
