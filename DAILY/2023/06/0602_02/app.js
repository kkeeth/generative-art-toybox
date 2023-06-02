const cp = ["#ff7f50", "#ff6347", "#ff4500", "#ff0000", "#dc143c"];
const NUM = 80;
let items = [];

function setup() {
  createCanvas((W = windowHeight), W, WEBGL);

  for (let i = 0; i < NUM; i++) {
    items.push(new Dotts());
  }
}

function draw() {
  background(0, 10);

  rotateX(frameCount / 61);
  rotateZ(frameCount / 59);

  for (let i = 0; i < NUM - 1; i++) {
    items[i].update();
    items[i].show();

    if (items[i].current.dist(items[i + 1].current) < 250) {
      const a = items[i].current;
      const b = items[i + 1].current;
      stroke(items[i].color);
      line(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  }
}

class Dotts {
  constructor() {
    this.current = createVector(
      random(-width / 2, width / 2),
      random(-height / 2, height / 2),
      random(-width / 2, width / 2),
    );
    this.target = createVector(
      random(-width / 2, width / 2),
      random(-height / 2, height / 2),
      random(-width / 2, width / 2),
    );
    this.size = random(3, 8);
    this.step = 0;
    this.color = random(cp);
  }

  update() {
    this.current = this.current.lerp(this.target, this.step);

    if (this.current.dist(this.target) < 0.01) {
      this.target = createVector(
        random(-width / 2, width / 2),
        random(-height / 2, height / 2),
        random(-width / 2, width / 2),
      );

      this.step = 0;
    }
    this.step += 0.001;
  }

  show() {
    push();
    noStroke();
    fill(this.color);
    translate(this.current.x, this.current.y, this.current.z);
    sphere(this.size);
    pop();
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5);
  }
}
