let particles = [];
const NUM = 2000;

function setup() {
  createCanvas((W = windowHeight), W, WEBGL);
  colorMode(HSB, height, 100, 100);
  for (let i = 0; i < NUM; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(0);
  rotateY(frameCount * 0.01);

  for (let p of particles) {
    p.update();
    p.display();
  }
}

class Particle {
  constructor() {
    this.angle = random(TAU);
    this.y = random(-height / 2, height / 2);
    this.radius =
      this.y > 0
        ? random(0, map(this.y, 0, height / 2, 50, W / 2))
        : random(map(this.y, -height / 2, 0, W / 2, 50));
    this.speed = random(0.01, 0.03);
    this.ySpeed = random(0.5, 3);
    this.size = random(1, 3);
  }

  update() {
    this.angle += this.speed;
    this.x = this.radius * cos(this.angle) + (noise(this.angle) - 0.5) * 10;
    this.z =
      this.radius * sin(this.angle) + (noise(this.angle + 100) - 0.5) * 10;

    this.y -= this.ySpeed;

    if (this.y < -height / 2) {
      this.y = height / 2;
    }
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    noStroke();
    fill(map(this.y, -height / 2, height / 2, 0, height / 3), 100, 100);
    sphere(this.size);
    pop();
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 3);
  }
}
