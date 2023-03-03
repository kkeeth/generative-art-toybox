const cp = [
  "#F5EAEA",
  "#FFB84C",
  "#F16767",
  "#A459D1",
  "#4D455D",
  "#E96479",
  "#F5E9CF",
  "#7DB9B6",
];
let f = 0;
let n;
let t;
let w;
let x, y;
let seed;
let isNight = true;
let items = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);

  for (let i = 0; i < 20; i++) {
    items.push({
      x: random(-width / 2, width / 2),
      y: random(-height / 2, height / 2),
      s: random(0.5, 1.5),
      v: random([-1, 1]) * random(1, 3),
      c: random(cp),
    });
  }
}

function draw() {
  background(isNight ? 50 : 255);

  for (let item of items) {
    drawUmbrella(item.x, item.y, item.v, item.s, item.c);
  }
}

function drawUmbrella(initX, initY, v, s, c) {
  translate(initX, initY);
  rotateY(frameCount * v);
  scale(s);

  push();
  fill(isNight ? 255 : c);
  noStroke();
  beginShape();
  for (let i = 180; i < 360; i += 6) {
    x = 100 * cos(i);
    y = 90 * sin(i);
    vertex(x, y);
  }
  for (let j = 100; j > -100; j -= 40) {
    for (let i = 360; i > 180; i -= 6) {
      x = j - 20 + 20 * cos(i);
      y = 20 * sin(i);
      vertex(x, y);
    }
  }
  endShape(CLOSE);
  pop();

  push();
  stroke(isNight ? width : c);
  strokeWeight(3);
  // draw stick
  line(0, -110, 0, +50);

  // draw handle
  noFill();
  arc(-7.5, 50, 15, 20, 0, 180);
  pop();

  rotateY(-frameCount * v);
  translate(-initX, -initY);
}

function mousePressed() {
  isNight = !isNight;
}
