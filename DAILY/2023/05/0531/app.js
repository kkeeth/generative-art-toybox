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
const baseSize = 120;
const sphereSize = 80;

function setup() {
  createCanvas((W = windowHeight), W, WEBGL);
  shuffle(cp, true);
  strokeWeight(2);
  background(255);

  // rotateX(random(TAU));
  rotateY(random(TAU));

  push();
  randomSeed(9999);

  // y-coordinate axis
  stroke(random(cp));
  for (let i = 0; i <= 2000; i++) {
    push();
    // if (random() < 0.2) {
    //   point(
    //     random([-baseSize, baseSize]),
    //     -baseSize * 1.5,
    //     random(-baseSize, baseSize),
    //   );
    // } else {
    point(
      random([-baseSize, baseSize]),
      random(-baseSize * 1.5, baseSize * 1.5),
      random(-baseSize, baseSize),
    );
    // }
    pop();
  }

  // x-coordinate axis
  stroke(random(cp));
  for (let i = 0; i <= 2000; i++) {
    let cond = random();
    push();
    // if (cond < 0.2) {
    //   point(
    //     random(-baseSize, baseSize),
    //     -baseSize * 1.5,
    //     random([-baseSize, baseSize]),
    //   );
    // } else {
    point(
      random(-baseSize, baseSize),
      cond < 0.7 ? -baseSize * 1.5 : random(baseSize * 1.5, baseSize * 2.5),
      random(-baseSize, baseSize),
    );
    // }
    pop();
  }

  // z-coordinate axis
  stroke(random(cp));
  for (let i = 0; i <= 2000; i++) {
    push();
    // if (random() < 0.2) {
    //   point(
    //     random([-baseSize, baseSize]),
    //     random(-baseSize * 1.5, baseSize * 1.5),
    //     random([-baseSize, baseSize]),
    //   );
    // } else {
    point(
      random(-baseSize, baseSize),
      random(-baseSize * 1.5, baseSize * 1.5),
      random([-baseSize, baseSize]),
    );
    // }
    pop();
  }
  pop();
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5);
  }
}
