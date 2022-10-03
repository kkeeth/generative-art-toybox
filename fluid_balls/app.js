const balls = [];
let ammt = 20;
let t;
let bg = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  t = 0;
  for (let i = 0; i <= ammt; i++) {
    balls.push(new Fluid());
  }
}

function draw() {
  if (bg) {
    background(0, 4);
  } else {
    background(255, 5);
  }

  for (let i = 0; i <= ammt; i++) {
    balls[i].display();
    balls[i].move();
  }
}

function keyPressed() {
  if (key === " ") {
    bg = !bg;
  }
}

function mousePressed(t) {
  balls.push(new Fluid());
  ammt++;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Fluid {
  constructor() {
    this.t = random(10);
    this.x = width * noise(this.t + 15);
    this.y = height * noise(this.t + 15);
    this.r = noise(this.t + 20);
    this.g = noise(this.t + 30);
    this.b = noise(this.t + 40);
    this.diameter = random(10, 150);
  }

  move() {
    this.x = width * noise(this.t + 5);
    this.y = height * noise(this.t + 10);
    this.t = this.t + 0.001;

    this.r = 255 * noise(this.t + 20);
    this.g = 255 * noise(this.t + 30);
    this.b = 255 * noise(this.t + 40);
  }

  display() {
    noStroke();
    fill(this.r, this.g, this.b);
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }
}
