const NUM = 8;

function setup() {
  createCanvas((W = 400), W);
  background(255);
  stroke(0);

  const SIZE = W / NUM;

  for (let i = 0; i < NUM; i++) {
    for (let j = 0; j < NUM; j++) {
      if ((i + j) % 2 === 0) {
        const x = i * SIZE;
        const y = j * SIZE;
        drawLineRect(x, y, SIZE);
      }
    }
  }
}

function drawLineRect(x, y, size) {
  const LINE_NUM = 8;
  const span = size / LINE_NUM;
  for (let i = 0; i < LINE_NUM; i++) {
    for (let j = 0; j < LINE_NUM; j++) {
      line(
        i * span + x,
        j * span + y,
        i * span + x + span,
        j * span + y + span,
      );
      line(
        i * span + x + span,
        j * span + y,
        i * span + x,
        j * span + y + span,
      );
    }
  }
}

function keyPressed() {
  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
