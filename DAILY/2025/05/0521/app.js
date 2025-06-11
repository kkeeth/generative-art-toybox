const NUM = 10;
let SIZE;

function setup() {
  createCanvas((W = min(windowWidth, windowHeight) - 50), W);
  background(255);
  // noStroke();
  noFill();
  SIZE = W / NUM;

  for (let n = 0; n < 50; n++) {
    for (let i = 0; i < NUM; i++) {
      for (let j = 0; j < NUM; j++) {
        stroke(random(random(colorPalette).colors));
        if ((i + j) % 2 === 0) {
          const x = i * SIZE;
          const y = j * SIZE;
          const R = random(SIZE * 1.5);
          ellipse(x + SIZE / 2, y + SIZE / 2, R);
        }
      }
    }
  }
}

function keyPressed() {
  if (key === 's') {
    saveGif(`mySketch-${round(new Date().getTime() / 100000)}`, 5);
  }

  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
