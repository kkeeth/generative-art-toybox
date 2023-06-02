let p = [];
const edge = 300;
const dir = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

setup = (_) => {
  createCanvas((w = 640), w, WEBGL);
};

initArray = (_) => {
  p.length = 0;
  for (let x = -2; x <= 2; x++) {
    for (let y = -2; y <= 2; y++) {
      for (let z = -2; z <= 2; z++) {
        const [vx, vy, vz] = random(dir);
        p.push({
          x: x * 40,
          y: y * 40,
          z: z * 40,
          vx: vx,
          vy: vy,
          vz: vz,
        });
      }
    }
  }
};

draw = (_) => {
  const f = frameCount;
  if (f % ((edge + 1) * 2) == 1) initArray();
  // rotateX(f / 61);
  // rotateZ(f / 59)

  background("black");
  noFill();
  stroke("white");

  for (let i = 0; i < p.length - 1; i++) {
    let a = p[i];

    a.x += a.vx * 2;
    if (abs(a.x) > edge) a.vx *= -1;
    a.y += a.vy * 2;
    if (abs(a.y) > edge) a.vy *= -1;
    a.z += a.vz * 2;
    if (abs(a.z) > edge) a.vz *= -1;

    for (let j = i + 1; j < p.length; j++) {
      const b = p[j];
      if ((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2 < 2500) {
        line(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    push();
    translate(a.x, a.y, a.z);
    box(3);
    pop();
  }
};
