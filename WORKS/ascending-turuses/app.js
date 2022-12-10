let items = [];
const NUM = 100;
const SIZE = 30;
const colors = ["#612503", "#abb2bf", "#ffcfa8", "#ffae6b", "#f56e45"];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  for (let i = 0; i < NUM; i++) {
    items.push(
      new Cube({
        x: random(-width / 2, width / 2),
        y: random(-20, height / 2 + 100),
        z: random(-width / 2, width / 2),
        size: random(10, SIZE),
      }),
    );
  }
}

function draw() {
  orbitControl();
  background(20);
  noStroke();
  lights();

  for (item of items) {
    push();
    item.update();
    item.draw();
    pop();
  }
}

class Cube {
  constructor({ x, y, z, size }) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.size = size;
    this.speed = random(2, 5);
    this.color = random(colors);
    this.rotateRate = random(10, 20);
  }

  update() {
    this.y -= this.speed;
    if (this.y < -height / 2) {
      this.x = random(-width / 2, width / 2);
      this.y = height / 2;
    }
  }

  draw() {
    fill(this.color);
    translate(this.x, this.y, this.z);
    rotateX(frameCount / this.rotateRate);
    rotateY(frameCount / this.rotateRate);
    rotateZ(frameCount / this.rotateRate);
    torus(item.size);
  }
}
