const cp = ["#359560", "#D22A2E", "#CA6772", "#0A91D3", "#EFB64E"];
const baseSize = 120;
const sphereSize = 80;

function setup() {
  createCanvas((W = windowHeight), W, WEBGL);
  shuffle(cp, true);
  strokeWeight(1.1);
  background(255);

  rotateY(random(TAU));

  push();
  randomSeed(9999);

  // y-coordinate axis
  stroke(cp[0]);
  for (let i = 0; i <= 5000; i++) {
    push();
    if (random() < 0.1) {
      point(
        random([-baseSize, baseSize]),
        random([-baseSize * 1.5, baseSize * 1.5]),
        random(-baseSize, baseSize),
      );
    } else {
      point(
        random([-baseSize, baseSize]),
        random(-baseSize * 1.5, baseSize * 1.5),
        random(-baseSize, baseSize),
      );
    }
    pop();
  }

  // x-coordinate axis
  stroke(cp[1]);
  for (let i = 0; i <= 4000; i++) {
    let cond = random();
    push();
    if (cond < 0.1) {
      point(
        random(-baseSize, baseSize),
        random([-baseSize * 1.5, baseSize * 1.5]),
        random([-baseSize, baseSize]),
      );
    } else {
      point(
        random(-baseSize, baseSize),
        cond < 0.3 ? -baseSize * 1.5 : random(baseSize * 1.5, baseSize * 2.5),
        random(-baseSize, baseSize),
      );
    }
    pop();
  }

  // z-coordinate axis
  stroke(cp[2]);
  for (let i = 0; i <= 4000; i++) {
    push();
    if (random() < 0.2) {
      point(
        random([-baseSize, baseSize]),
        random(-baseSize * 1.5, baseSize * 1.5),
        random([-baseSize, baseSize]),
      );
    } else {
      point(
        random(-baseSize, baseSize),
        random(-baseSize * 1.5, baseSize * 1.5),
        random([-baseSize, baseSize]),
      );
    }
    pop();
  }
  pop();
}

function keyPressed() {
  if (key === "c") {
    saveCanvas("mySketch", "png");
  }
}
