function setup() {
  createCanvas((W = min(windowWidth, windowHeight) * 0.8), W);
  background(255);
  // noStroke();
  fill(0);
  // rectMode(CENTER);
  const r = W / 8;
  const sr = r / 5;

  // rotate(-PI / 12);

  for (let i = 1; i < 7; i++) {
    // DOWN
    if (i % 2 === 0) {
      triangle(
        i * r - r / 2,
        W / 2,
        i * r,
        W / 2 + r / 2,
        i * r + r / 2,
        W / 2,
      );
    } else {
      if (random() < 0.5) {
        arc(i * r, W / 2, r, r, 0, PI);
      } else {
        push();
        noFill();
        strokeWeight(4);
        strokeCap(SQUARE);
        for (let j = r; j > 0; j -= sr) {
          arc(i * r, W / 2, j, j, 0, PI);
        }
        pop();
      }
    }

    // UP
    if (i % 2 === 1) {
      let cond = random();
      if (cond < 0.3) {
        rect(i * r, W / 2 - r / 2, r, r / 2);
      } else if (cond < 0.7) {
        push();
        noFill();
        strokeWeight(4);
        strokeCap(SQUARE);
        for (let j = r; j > 0; j -= sr) {
          rect(i * r, W / 2 - j / 2, j, j / 2);
        }
        pop();
      } else {
        push();
        for (let j = r; j > 0; j -= sr) {
          rect(i * r, W / 2 - j / 2, r, sr / 5);
        }
        pop();
      }
    } else {
      if (random() < 0.5) {
        arc(i * r + r / 2, W / 2, r, r, PI, TAU);
      } else {
        push();
        noFill();
        strokeWeight(4);
        strokeCap(SQUARE);
        for (let j = r; j > 0; j -= sr) {
          arc(i * r + r / 2, W / 2, j, j, PI, TAU);
        }
        pop();
      }
    }
  }
  push();
  // ellipse(r, W / 2, 10);
  // line(r, W / 2, W - r, W / 2);
  // ellipse(W - r, W / 2, 10);
  pop();
}

function keyPressed() {
  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
