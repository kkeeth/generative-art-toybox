const div = 70;
const items = [];
const dis = [
  [-1, -1, -1],
  [-1, -1, 1],
  [-1, 1, -1],
  [-1, 1, 1],
  [1, -1, -1],
  [1, -1, 1],
  [1, 1, -1],
  [1, 0, -1],
  [1, 1, 1],
  [1, 0, 1],
  [0, 0, 0],
  [0, 1, -1],
  [0, 1, 1],
  [0, -1, -1],
  [0, -1, 1],
  [-1, 0, -1],
  [-1, 0, 1],
  [-1, -1, 0],
  [-1, 1, 0],
  [1, -1, 0],
  [1, 1, 0],
];
const dir = [
  [-1, 1, 1],
  [-1, 1, -1],
  [1, -1, 1],
  [1, -1, -1],
  [1, 1, 1],
  [1, 1, -1],
  [-1, -1, 1],
  [-1, -1, -1],
];

function setup() {
  createCanvas((W = windowHeight), W, WEBGL);
  noFill();
  stroke(255);

  for (let d of dis) {
    for (let x = -2; x < 2; x++) {
      for (let y = -2; y < 2; y++) {
        for (let z = -2; z < 2; z++) {
          const [tx, ty, tz] = random(dir);
          items.push({
            x: x * 16,
            y: y * 16,
            z: z * 16,
            vx: tx,
            vy: ty,
            vz: tz,
            dx: d[0] * div * 2.5,
            dy: d[1] * div * 2.5,
            dz: d[2] * div * 2.5,
            size: random(2, 5),
          });
        }
      }
    }
  }
}

function draw() {
  background(0);
  // rotateY(frameCount / 100);

  for (let item of items) {
    push();
    translate(item.dx, item.dy, item.dz);
    item.x += item.vx;
    item.y += item.vy;
    item.z += item.vz;

    if (abs(item.x) > div) item.vx *= -1;
    if (abs(item.y) > div) item.vy *= -1;
    if (abs(item.z) > div) item.vz *= -1;

    push();
    translate(item.x, item.y, item.z);
    box(item.size);
    pop();
    pop();
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5);
  }
}
