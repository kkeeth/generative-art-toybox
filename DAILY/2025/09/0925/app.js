function setup() {
  createCanvas((W = min(windowWidth, windowHeight) - 50), W);
}

function draw() {
  background(255);
}

function keyPressed() {
  if (key === 's') {
    saveGif(`mySketch-${round(new Date().getTime() / 100000)}`, 5);
  }

  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
