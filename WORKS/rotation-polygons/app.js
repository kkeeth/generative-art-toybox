let number = 30;
let dias = [];
let breadth = 80;
const shapeTypes = [
  "triangle",
  "square",
  "pentagon",
  "hexagon",
  "octagon",
  "nonagon",
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  // blendMode(ADD);

  for (let dx = 0; dx < 8; dx++) {
    for (let dy = 0; dy < 4; dy++) {
      dias.push(
        new Dia(
          dx * 2 * breadth + 120,
          dy * 2 * breadth + 120,
          random(shapeTypes),
        ),
      );
    }
  }
}

function draw() {
  background(220);

  for (obj of dias) {
    obj.update();
    obj.show();
  }
}

class Dia {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    switch (type) {
      case "triangle":
        this.ang = 120;
        break;
      case "square":
        this.ang = 90;
        break;
      case "pentagon":
        this.ang = 72;
        break;
      case "hexagon":
        this.ang = 60;
        break;
      case "octagon":
        this.ang = 45;
        break;
      case "nonagon":
        this.ang = 40;
        break;
    }
    this.color = color(random(100, 200), random(100, 200), random(100, 200));
    this.diff = 0;
    this.velocity = random(-3, 3);
    this.size = random(breadth, 2 * breadth);
  }

  update() {
    this.diff += sin(millis() / 1234) * this.velocity;
  }

  show() {
    for (let i = 0 + this.diff; i < 360 + this.diff; i += this.ang) {
      push();
      stroke(220);
      fill(this.color);

      arc(
        this.x,
        this.y,
        this.size,
        this.size,
        radians(i),
        radians(i + this.ang),
        PIE,
      );
      pop();

      push();
      fill(220);
      arc(
        this.x,
        this.y,
        this.size - 10,
        this.size - 10,
        radians(i),
        radians(i + this.ang),
        OPEN,
      );
      pop();
    }
  }
}
