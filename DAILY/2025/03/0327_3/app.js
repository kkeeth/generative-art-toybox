const NUM = 8;

function setup() {
  createCanvas((W = 400), W);
  noStroke();
  background(255);
  fill('navy');

  const SIZE = W / NUM;

  for (let i = 0; i < NUM; i++) {
    for (let j = 0; j < NUM; j++) {
      if ((i + j) % 2 === 0) {
        const leftCond = j % 2 === 0 ? 0 : 1;
        const rightCond = j % 2 !== 0 ? 0 : 1;
        rect(
          i * SIZE,
          j * SIZE + (leftCond * SIZE) / 2,
          SIZE / 2,
          SIZE / 2,
          SIZE / 40,
        );
        rect(
          i * SIZE + SIZE / 2,
          j * SIZE + (rightCond * SIZE) / 2,
          SIZE / 2,
          SIZE / 2,
          SIZE / 40,
        );
      } else {
        for (let k = 0; k < 7; k++) {
          push();
          noFill();
          stroke('navy');
          const size = SIZE - (k * SIZE) / 7;
          translate((k * SIZE) / 7 / 2, (k * SIZE) / 7 / 2);
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
