const cp = Object.freeze({
  cT: '#50d0d0',
  cM: '#be1e3e',
  cK: '#7967c3',
  cH: '#ffc639',
  cN: '#255699',
});

let trails = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(color(cp.cN));

  camera(0, -400, 800);
  rotateY(frameCount * 0.02);

  if (random(1) > 0.97) {
    createFourRectBox();
  }

  for (let i = trails.length - 1; i >= 0; i--) {
    trails[i].update();
    trails[i].display();
    if (trails[i].isFinished()) {
      trails.splice(i, 1);
    }
  }
}

function createFourRectBox() {
  var centerPos = p5.Vector.random3D().mult(random(width / 2));

  trails.push(
    new RectTrail(
      centerPos.x,
      centerPos.y,
      centerPos.z - 70,
      100,
      color(cp.cM),
      false,
    ),
  );
  trails.push(
    new RectTrail(
      centerPos.x,
      centerPos.y,
      centerPos.z + 70,
      100,
      color(cp.cT),
      false,
    ),
  );
  trails.push(
    new RectTrail(
      centerPos.x - 70,
      centerPos.y,
      centerPos.z,
      100,
      color(cp.cK),
      false,
    ),
  );
  trails.push(
    new RectTrail(
      centerPos.x + 70,
      centerPos.y,
      centerPos.z,
      100,
      color(cp.cH),
      false,
    ),
  );
}
class RectTrail {
  constructor(x, y, z, len, col, isRotated) {
    this.centerPos = createVector(x, y, z);
    this.col = col;
    this.len = len;
    this.vertices = [];
    for (let i = 0; i < 4; i++) {
      const angle = HALF_PI * i + QUARTER_PI;
      const vx = cos(angle) * this.len;
      const vy = sin(angle) * this.len;
      this.vertices.push(createVector(vx, vy));
    }
    this.pointPos = this.vertices[0].copy();
    this.time = 0.0;
    this.trail = [];
    this.isRotatedTheta = isRotated && HALF_PI;
  }

  update = () => {
    this.time += 1.0 / 30.0;

    if (0.0 <= this.time && this.time < 1.0) {
      this.pointPos.x = lerp(
        this.vertices[0].x,
        this.vertices[1].x,
        fract(this.time),
      );
      this.pointPos.y = lerp(
        this.vertices[0].y,
        this.vertices[1].y,
        fract(this.time),
      );
      this.trail.push(this.pointPos.copy());
    } else if (1.0 <= this.time && this.time < 2.0) {
      this.pointPos.x = lerp(
        this.vertices[1].x,
        this.vertices[2].x,
        fract(this.time),
      );
      this.pointPos.y = lerp(
        this.vertices[1].y,
        this.vertices[2].y,
        fract(this.time),
      );
      this.trail.push(this.pointPos.copy());
    } else if (2.0 <= this.time && this.time < 3.0) {
      this.pointPos.x = lerp(
        this.vertices[2].x,
        this.vertices[3].x,
        fract(this.time),
      );
      this.pointPos.y = lerp(
        this.vertices[2].y,
        this.vertices[3].y,
        fract(this.time),
      );
      this.trail.push(this.pointPos.copy());
    } else if (3.0 <= this.time && this.time < 4.0) {
      this.pointPos.x = lerp(
        this.vertices[3].x,
        this.vertices[0].x,
        fract(this.time),
      );
      this.pointPos.y = lerp(
        this.vertices[3].y,
        this.vertices[0].y,
        fract(this.time),
      );
      this.trail.push(this.pointPos.copy());
    } else if (this.time > 7.0) {
      this.trail.splice(0, 1);
    }
  };

  display = () => {
    strokeWeight(8);
    stroke(this.col);
    noFill();
    push();
    translate(this.centerPos.x, this.centerPos.y, this.centerPos.z);
    rotateY(this.isRotatedTheta);
    beginShape();
    for (let i = this.trail.length - 1; i >= 0; i--) {
      vertex(this.trail[i].x, this.trail[i].y);
    }
    endShape();
    pop();
  };

  isFinished = () => {
    return this.time > 4.0 && this.trail.length == 0;
  };
}
