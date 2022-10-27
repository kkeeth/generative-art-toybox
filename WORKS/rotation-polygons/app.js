let number = 30;
let dias = [];
let breadth = 80;
const shapeTypes = ["triangle", "square", "pentagon", "hexagon", "octagon"];

function setup() {
  createCanvas(1000, 800);
  noStroke();
  // blendMode(ADD);

  for (let i = 0; i < number; i++) {
    for (let dx = 0; dx < width; dx += 2 * breadth + 20) {
      for (let dy = 0; dy < height; dy += 2 * breadth + 20) {
        dias.push(new Dia(dx, dy, random(shapeTypes)));
      }
    }
  }
}

function draw() {
  background(200);

  for (let i = 0; i < number; i++) {
    dias[i].update();
    dias[i].show();
  }
}

class Dia {
  constructor(x, y, type) {
    console.log(x, y);
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
    }
    this.color = color(random(100, 200), random(100, 200), random(100, 200));
    this.diff = 0;
    this.velocity = random(-3, 3);
    this.size = random(breadth, breadth + 100);
  }

  update() {
    this.diff += sin(millis() / 1234) * this.velocity;
  }

  show() {
    for (let i = 0 + this.diff; i < 360 + this.diff; i += this.ang) {
      push();
      stroke(200);
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
      fill(200);
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
