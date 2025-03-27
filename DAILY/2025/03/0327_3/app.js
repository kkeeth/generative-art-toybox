const NUM = 7;

function setup() {
  createCanvas((W = 400), W);
  noStroke();
  background(255);
  fill('navy');
  rectMode(CENTER);

  const SIZE = W / NUM;
  translate(SIZE / 2, SIZE / 2);

  for (let i = 0; i < NUM; i++) {
    for (let j = 0; j < NUM; j++) {
      if ((i + j) % 2 === 0) {
        const cond = j % 2 === 0 ? 1 : -1;
        rect(
          i * SIZE - SIZE / 4,
          j * SIZE - (cond * SIZE) / 4,
          SIZE / 2,
          SIZE / 2,
          SIZE / 32,
        );
        rect(
          i * SIZE + SIZE / 4,
          j * SIZE + (cond * SIZE) / 4,
          SIZE / 2,
          SIZE / 2,
          SIZE / 32,
        );
      } else {
        for (let k = 0; k < 7; k++) {
          push();
          noFill();
          stroke('navy');
          const size = SIZE - (k * SIZE) / 7;
          rect(i * SIZE, j * SIZE, size, size);
          pop();
        }
      }
    }
  }
}

function keyPressed() {
  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
