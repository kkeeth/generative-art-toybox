let sSlider;

function setup() {
  createCanvas((W = windowHeight - 50), W);
  noStroke();
  fill(255);
  blendMode(DIFFERENCE);

  sSlider = createSlider(2, 15, 6, 0.1);
}

function draw() {
  clear();
  const span = W / 10;
  const cSize = span * sSlider.value();

  for (let x = -1; x <= 10; x++) {
    for (let y = -1; y <= 10; y++) {
      if ((x + y) % 2 === 0)
        ellipse(x * span + span / 2, y * span + span / 2, cSize);
    }
  }
}

function keyPressed() {
  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
