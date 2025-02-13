const NUM = 10;
const SW = 1;

function setup() {
  createCanvas((W = min(windowWidth, windowHeight) * 0.8), W);
  background(255);
  strokeWeight(SW);
  strokeCap(SQUARE);
  noFill();

  const r = W / NUM;
  const sr = r / NUM;

  for (let i = 0; i < NUM + 1; i++) {
    for (let j = 0; j < NUM + 1; j++) {
      stroke(random(random(colorPalette).colors));
      // DOWN
      if (i % 2 === 0) {
        if (random() < 0.5) {
          for (let k = NUM; k > 0; k--) {
            line(
              i * r - (r - k * sr) / 2,
              j * r + (k * sr) / 2,
              i * r + (r - k * sr) / 2,
              j * r + (k * sr) / 2,
            );
          }
        } else {
          push();
          noStroke();
          fill(random(random(colorPalette).colors));
          triangle(
            i * r - r / 2,
            j * r,
            i * r,
            j * r + r / 2,
            i * r + r / 2,
            j * r,
          );
          pop();
        }
      } else {
        if (random() < 0.5) {
          push();
          noStroke();
          fill(random(random(colorPalette).colors));
          arc(i * r, j * r, r, r, 0, PI);
          pop();
        } else {
          for (let k = r; k > 0; k -= sr) {
            arc(i * r, j * r, k, k, 0, PI);
          }
        }
      }

      // UP
      if (i % 2 === 1) {
        let cond = random();
        if (cond < 0.25) {
          // ■
          push();
          noStroke();
          fill(random(random(colorPalette).colors));
          rect(i * r, j * r - r / 2, r, r / 2);
          pop();
        } else if (cond < 0.5) {
          // 回
          if (random() < 0.5) {
            for (let k = r; k > 0; k -= sr) {
              rect(
                i * r + (r - k) / 2,
                j * r - r / 2 + (r - k) / 2,
                k,
                k / 2 - SW / 2,
              );
            }
          } else {
            for (let k = r; k > 0; k -= sr) {
              rect(i * r + (r - k) / 2, j * r - r / 2, k, k / 2);
            }
          }
        } else if (cond < 0.75) {
          // ||
          for (let k = NUM; k >= 0; k--) {
            line(i * r + k * sr, j * r - r / 2, i * r + k * sr, j * r);
          }
        } else {
          // =
          for (let k = NUM; k > 0; k--) {
            line(i * r, j * r - (k * sr) / 2, i * r + r, j * r - (k * sr) / 2);
          }
        }
      } else {
        if (random() < 0.5) {
          push();
          noStroke();
          fill(random(random(colorPalette).colors));
          arc(i * r + r / 2, j * r, r, r, PI, TAU);
          pop();
        } else {
          for (let k = r; k > 0; k -= sr) {
            arc(i * r + r / 2, j * r, k, k, PI, TAU);
          }
        }
      }
    }
  }
  push();
  // ellipse(r, j*r, 10);
  // line(r, j*r, W - r, j*r);
  // ellipse(W - r, j*r, 10);
  pop();
}

function keyPressed() {
  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
