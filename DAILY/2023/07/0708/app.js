let g;
let items = [];
const N = 10;
const cp = ["#160D26", "#C50607", "#F78D1B", "#504721", "#452F19"];

function setup() {
  createCanvas((W = windowHeight - 200), W);
  noStroke();

  g = W / 20;

  for (let i = 0; i < N; i++) {
    items.push(new Triangle(g * int(random(1, 9)), int(random(2, 5))));
  }
}

function draw() {
  background(255);

  for (let item of items) {
    item.update();
    item.show();
  }
}

class Triangle {
  constructor(g, s) {
    this.points = [
      { x: g, y: g },
      { x: g * s, y: g * s },
      { x: g, y: g * s },
    ];
    this.corners = [
      { x: g, y: g },
      { x: g * s, y: g },
      { x: g * s, y: g * s },
      { x: g, y: g * s },
    ];
    this.movingPoint = int(random(this.corners.length));
    this.movingTarget = { x: 0, y: 0 };
    this.color = random(cp);

    this.selectTarget();
  }

  update() {
    let diffX = this.movingTarget.x - this.points[this.movingPoint].x;
    let diffY = this.movingTarget.y - this.points[this.movingPoint].y;
    this.points[this.movingPoint].x += diffX / 10;
    this.points[this.movingPoint].y += diffY / 10;

    // If the point has reached its target, select a new one
    if (
      dist(
        this.points[this.movingPoint].x,
        this.points[this.movingPoint].y,
        this.movingTarget.x,
        this.movingTarget.y,
      ) < 0.1
    ) {
      this.selectTarget();
    }
  }

  show() {
    fill(this.color);
    triangle(
      this.points[0].x,
      this.points[0].y,
      this.points[1].x,
      this.points[1].y,
      this.points[2].x,
      this.points[2].y,
    );
  }

  selectTarget() {
    this.movingPoint--;
    if (this.movingPoint < 0) this.movingPoint = this.points.length - 1;
    const nextTarget = this.corners.filter((corner) => {
      return !this.points.some(
        (point) => dist(corner.x, corner.y, point.x, point.y) < 0.1,
      );
    });
    this.movingTarget = nextTarget[0];
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5);
  }
}
