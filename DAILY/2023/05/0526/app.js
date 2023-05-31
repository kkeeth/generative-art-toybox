const cp = [
  "#0d8cf1",
  "#0eb4f0",
  "#0b770d",
  "#0b0e13",
  "#EFB6F9",
  "#FF9521",
  "#f60402",
  "#cdd3e7",
  "#F4E6FF",
];
const baseSize = 150;
const sphereSize = 100;

function setup() {
  createCanvas((W = windowHeight), W, WEBGL);
  shuffle(cp, true);
  strokeWeight(0.8);
}

function draw() {
  background(0);

  rotateX(frameCount * 0.03);
  rotateY(frameCount * 0.03);

  push();
  randomSeed(9999);

  stroke(random(cp));
  for (let i = 0; i <= 2000; i++) {
    push();
    push();
    translate(
      random([-baseSize, baseSize]),
      random(-baseSize, baseSize),
      random(-baseSize, baseSize),
    );
    point(0, 0, 0);
    pop();
    pop();
  }

  stroke(random(cp));
  for (let i = 0; i <= 2000; i++) {
    push();
    push();
    translate(
      random(-baseSize, baseSize),
      random([-baseSize, baseSize]),
      random(-baseSize, baseSize),
    );
    point(0, 0, 0);
    pop();
    pop();
  }

  stroke(random(cp));
  for (let i = 0; i <= 2000; i++) {
    push();
    push();
    translate(
      random(-baseSize, baseSize),
      random(-baseSize, baseSize),
      random([-baseSize, baseSize]),
    );
    point(0, 0, 0);
    pop();
    pop();
  }

  push();
  stroke(255);
  for (let i = 0; i < TAU; i += 0.09) {
    for (let j = 0; j < TAU; j += 0.09) {
      if (random() < 0.5) {
        const x = sphereSize * sin(i) * cos(j);
        const y = sphereSize * sin(i) * sin(j);
        const z = sphereSize * cos(i);
        point(x, y, z);
      } else {
        const x = random(sphereSize) * sin(i) * cos(j);
        const y = random(sphereSize) * sin(i) * sin(j);
        const z = random(sphereSize) * cos(i);
        point(x, y, z);
      }
    }
  }
  pop();
  pop();
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5);
  }
}
