const CP = [
  ["#ff7f50", "#ff6347", "#ff4500", "#ff0000", "#dc143c"],
  ["#8cf1f1", "#6deeed", "#31e6e5", "#1adbda", "#16bdbb"],
  ["#ffdc63", "#ffd541", "#ffcd1f", "#fcc400", "#daaa00"],
];
const NUM_ITEMS = 200;
const ROTATE_SPEED_X = 61;
const ROTATE_SPEED_Z = 59;
const DISTANCE_THRESHOLD = 0.001;
const MIN_DISTANCE = 150;
const MAX_DISTANCE = 220;
let items = [];
let selectedPattern = 0;

function setup() {
  createCanvas((W = windowHeight - 50), W, WEBGL);
  items = Array.from({ length: NUM_ITEMS }, () => new Dotts());
}

function draw() {
  background(255);

  rotateX(frameCount / ROTATE_SPEED_X);
  rotateZ(frameCount / ROTATE_SPEED_Z);

  for (let i = 0; i < NUM_ITEMS - 1; i++) {
    items[i].update();
    items[i].show();

    if (items[i].current.dist(items[i + 1].current) < 200) {
      const a = items[i].current;
      const b = items[i + 1].current;
      stroke(items[i].color);
      line(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  }

  if (frameCount % 300 === 0) {
    selectedPattern++;
    if (selectedPattern > CP.length - 1) selectedPattern = 0;
  }
}

class Dotts {
  constructor() {
    this.current = p5.Vector.random3D().mult(MIN_DISTANCE);
    this.target = p5.Vector.random3D().mult(MAX_DISTANCE);
    this.size = random(3, 8);
    this.step = 0;
    this.color = random(CP[selectedPattern]);
  }

  update() {
    this.current = this.current.lerp(this.target, this.step);

    if (this.isNearTarget()) {
      this.target = p5.Vector.random3D().mult(MAX_DISTANCE);
      this.step = 0;
      this.color = random(CP[selectedPattern]);
    }
    this.step += 0.001;
  }

  isNearTarget() {
    return this.current.dist(this.target) < DISTANCE_THRESHOLD;
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
    saveGif("mySketch", 10);
  }
}
