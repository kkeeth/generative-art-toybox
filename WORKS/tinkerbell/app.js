let balls = [];
const NUM = 200;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  for (let i = 0; i < NUM; i++) {
    balls.push(new Ball(width / 2, height / 2));
  }
}

function draw() {
  background(0, 5);
  push();
  stroke(0);
  circle(mouseX, mouseY, 20);
  pop();

  for (let i = 0; i < NUM; i++) {
    balls[i].update();
    balls[i].show();
  }
}

class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = random(-3, 3);
    this.dy = random(-3, 3);
    this.color = color(random(160, 255), random(160, 255), random(160, 255));
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x > width || this.y > height || this.x < 0 || this.y < 0) {
      this.x = mouseX;
      this.y = mouseY;
    }
  }

  show() {
    fill(this.color);
    circle(this.x, this.y, 10);
  }
}
