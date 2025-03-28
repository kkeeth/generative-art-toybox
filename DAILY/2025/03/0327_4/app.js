const NUM = 8;

function setup() {
  createCanvas((W = 600), W);
  background(255);
  noFill();
  stroke('navy');
  rectMode(CENTER);

  const SIZE = W / NUM;
  const dSize = Math.sqrt(2) * SIZE;

  for (let i = 0; i < NUM; i++) {
    for (let j = 0; j < NUM; j++) {
      drawLineRect(i * dSize, j * dSize, SIZE);
    }
  }
}

function drawLineRect(x, y, size) {
  const LINE_NUM = 7;
  for (let k = 0; k < LINE_NUM; k++) {
    const span = (k * size) / LINE_NUM;
    push();
    translate(x, y);
    rotate(PI / 4);
    rect(
      0,
      0,
      size - span * noise(k * random()),
      size - span * noise(k * random()),
    );
    pop();
  }
}

function keyPressed() {
  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
