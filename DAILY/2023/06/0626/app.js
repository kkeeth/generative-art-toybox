const NUM = 50;
const padding = 50;
const shapeAmount = 8;
let w;
let shapes = [];

function setup() {
  createCanvas((W = 720), W);
  rectMode(CENTER);
  noStroke();
  angleMode(DEGREES);
  frameRate(20);

  for (let i = 0; i < shapeAmount; i++) {
    shapes.push({
      type: "circle",
      x: (width / shapeAmount) * i,
      y: height / 6,
      originY: height / 6,
      size: 10,
      direction: 1,
    });
    shapes.push({
      type: "heart",
      x: (width / shapeAmount) * i,
      y: (2 * height) / 6,
      originY: (2 * height) / 6,
      size: 10,
      direction: -1,
    });
    shapes.push({
      type: "triangle",
      x: (width / shapeAmount) * i,
      y: (3 * height) / 6,
      originY: (3 * height) / 6,
      size: 10,
      direction: 1,
    });
    shapes.push({
      type: "rect",
      x: (width / shapeAmount) * i,
      y: (4 * height) / 6,
      originY: (4 * height) / 6,
      size: 10,
      direction: -1,
    });
    shapes.push({
      type: "circle",
      x: (width / shapeAmount) * i,
      y: (5 * height) / 6,
      originY: (5 * height) / 6,
      size: 10,
      direction: 1,
    });
  }
}

function draw() {
  background(0);

  for (let shape of shapes) {
    if (random() < 0.005) {
      shape.y += random(-50, 50);
    } else {
      shape.y += (shape.originY - shape.y) / shapeAmount;
    }
    shape.x += shape.direction * 5;
    shape.size += abs(shape.direction) * 0.5;

    if (shape.type === "circle") {
      circle(shape.x, shape.y, shape.size);
    } else if (shape.type === "heart") {
      drawHeart(shape.x, shape.y, shape.size);
    } else if (shape.type === "rect") {
      rect(shape.x, shape.y, shape.size);
    } else if (shape.type === "triangle") {
      triangle(
        shape.x,
        shape.y - shape.size / 2,
        shape.x - shape.size / 2,
        shape.y + shape.size / 2,
        shape.x + shape.size / 2,
        shape.y + shape.size / 2,
      );
    }

    if (shape.direction === 1 && shape.x - shape.size / 2 > width) {
      shape.x = 0;
      shape.size = 10;
    } else if (shape.x + shape.size / 2 < 0) {
      shape.x = width;
      shape.size = 10;
    }
  }
}

function drawHeart(x, y, size) {
  push();
  translate(x, y);

  size = map(size, 0, 80, 0.2, 2.2);
  beginShape();
  for (let i = 0; i < 360; i++) {
    let dx = size * (16 * sin(i) * sin(i) * sin(i));
    let dy =
      -1 * size * (13 * cos(i) - 5 * cos(2 * i) - 2 * cos(3 * i) - cos(4 * i));
    vertex(dx, dy);
  }
  endShape(CLOSE);
  pop();
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5);
  }
}
