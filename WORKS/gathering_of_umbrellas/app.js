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
const NUM = 30;
let f = 0;
let n;
let t;
let w;
let x, y;
let isNight = true;
let items = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  for (let i = 0; i < NUM; i++) {
    items.push(new Umbrella());
  }
}

function draw() {
  translate(width / 2, height / 2);
  background(isNight ? 0 : 255);

  for (let item of items) {
    item.update();
    push();
    item.show();
    pop();
  }
}

class Umbrella {
  constructor() {
    this.x = random(-width / 2, width / 2);
    this.y = random(-height / 2, height / 2);
    this.diff = random(-200, -80);
    this.s = random(0.5, 1);
    this.rv = random([-1, 1]) * random(1, 5);
    this.fv = random(2, 5);
    this.c = random(cp);
    this.r = 0;
    this.tr = 90;
    console.log(hexToRgb(this.c));
  }

  update() {
    if (this.y <= height / 2 + this.diff) {
      this.y += this.fv;
    } else {
      this.r += 2;
    }

    if (this.r > this.tr) {
      this.x = random(-width / 2, width / 2);
      this.y = -height / 2 - 70;
      this.r = 0;
    }
  }

  show() {
    translate(this.x, this.y);

    if (this.y <= height / 2 + this.diff) {
      scale(cos(frameCount / this.rv) * this.s, this.s);

      push();
      stroke(hexToRgb(this.c, map(this.y, -height / 2, height / 2, 255, 0)));
      strokeWeight(4);
      // draw stick
      line(0, -110, 0, 50);

      // draw handle
      noFill();
      drawingContext.shadowBlur = 20;
      drawingContext.shadowColor = color(isNight ? 255 : 0);
      drawingContext.shadowOffsetX = 10;
      drawingContext.shadowOffsetY = 20;
      arc(-7.5, 50, 15, 20, 0, 180);
      pop();

      // draw body
      push();
      drawingContext.shadowBlur = 20;
      drawingContext.shadowColor = color(isNight ? 220 : 100);
      drawingContext.shadowOffsetX = 10;
      drawingContext.shadowOffsetY = 20;
      fill(hexToRgb(this.c, map(this.y, -height / 2, height / 2, 255, 80)));
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
    } else {
      noFill();
      stroke(isNight ? 255 : 0, map(this.r, 0, this.tr, 255, 0));

      ellipse(0, 50, this.r, this.r * 0.4);
    }
  }
}

function mousePressed() {
  isNight = !isNight;
}

function hexToRgb(hex, alpha) {
  hex = hex.replace("#", "");
  alpha = alpha || 0;

  const bigint = parseInt(hex, 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return color(r, g, b, alpha);
}
