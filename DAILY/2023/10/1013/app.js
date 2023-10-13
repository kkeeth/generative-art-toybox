const NUM = 100;
let paths = [];
let colors = ["#FF5733", "#33FF57", "#5733FF", "#FF33A6", "#FFFF33"];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  strokeWeight(8);
  noFill();

  for (let i = 0; i < NUM; i++) {
    paths.push(new Path(random(width), random(height)));
  }
}

function draw() {
  background(0, 10);

  for (let item of paths) {
    item.update();
    item.display();
  }
}

class Path {
  constructor(x, y) {
    this.points = [createVector(x, y)];
    this.vel = createVector(random(-3, 3), random(-3, 3));
    this.color = random(colors);
  }

  update() {
    let lastPoint = this.points[this.points.length - 1];
    let newPoint = createVector(
      lastPoint.x + this.vel.x,
      lastPoint.y + this.vel.y
    );

    if (random(1) < 0.05) {
      this.vel.rotate((PI / 2) * floor(random(4)));
    }

    this.points.push(newPoint);

    if (this.points.length > 60) {
      this.points.splice(0, 1);
    }
  }

  display() {
    beginShape();
    stroke(this.color);
    for (let i = 0; i < this.points.length; i++) {
      vertex(this.points[i].x, this.points[i].y);
    }
    endShape();
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5);
  }
}
