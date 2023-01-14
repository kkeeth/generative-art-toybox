let step;
let roses = [];

function setup() {
  createCanvas((w = windowHeight), w);
  stroke(255);
  strokeWeight(2);
  background(0);
  angleMode(DEGREES);
  colorMode(HSB, 100);
  textAlign(CENTER);
  textSize(24);
  smooth();
  step = w / 2;

  for (let x = step / 2; x < w; x += step) {
    for (let y = step / 2; y < w; y += step) {
      roses.push(new Rose(x, y));
    }
  }
}

function draw() {
  for (let rose of roses) {
    push();
    rose.update();
    rose.show();
    pop();
  }
}

class Rose {
  constructor(initX, initY) {
    this.bx = 0;
    this.by = 0;
    this.x = 0;
    this.y = 0;
    this.n = int(random(1, 9));
    this.d = int(random(1, 9));
    this.angle = 0;
    this.range = 0;
    this.radius = step / 3;
    this.color = int(random(100));
    this.speed = int(random(3, 45));
    this.position = createVector(initX, initY);
  }

  update() {
    this.bx = this.x;
    this.by = this.y;
    this.range = this.radius * sin(this.angle * (this.n / this.d));
    this.x = this.range * cos(this.angle);
    this.y = this.range * sin(this.angle);
    this.angle += this.speed;
  }

  show() {
    stroke(this.color, 100, 100);
    translate(this.position.x, this.position.y + 30);
    line(this.bx, this.by, this.x, this.y);

    push();
    noStroke();
    fill(this.color, 100, 100);
    text(
      `n = ${this.n}, d = ${this.d}, s = ${this.speed}`,
      0,
      -this.radius - 24,
    );
    pop();
  }
}
