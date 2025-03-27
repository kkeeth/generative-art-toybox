const NUM = 8;

function setup() {
  createCanvas((W = 400), W);
  noStroke();
  background(255);
  fill('navy');
  rectMode(CENTER);
  textAlign(CENTER, CENTER);

  const SIZE = W / NUM;
  translate(SIZE / 2, SIZE / 2);

  for (let i = 0; i < NUM; i++) {
    for (let j = 0; j < NUM; j++) {
      if ((i + j) % 2 === 0) {
        if (random() > 0.4) {
          rect(i * SIZE, j * SIZE, SIZE, SIZE, SIZE / 32);
        }
      } else {
        textSize(random([SIZE / 1.5, SIZE / 2, SIZE / 3]));
        random() > 0.3 &&
          text(random(['✾', '✿', '❀', '❁']), i * SIZE, j * SIZE);
      }
    }
  }
}

function keyPressed() {
  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
