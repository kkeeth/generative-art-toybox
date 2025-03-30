function setup() {
  createCanvas((W = min(windowWidth, windowHeight) - 50), W);
  background(255);
  noStroke();

  const iSize = W / 12;

  for (let x = 0; x < W; x += iSize) {
    for (let y = 0; y < W; y += iSize) {
      fill(random(random(colorPalette).colors));
      ellipse(x + iSize / 2, y + iSize / 2, iSize);
    }
  }
}

function keyPressed() {
  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
