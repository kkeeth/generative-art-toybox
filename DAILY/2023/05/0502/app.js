let maxBoxes;
const baseSize = 50;
const boxDepth = 50;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  rectMode(CENTER);
  stroke(255);

  maxBoxes = height / 10;
}

function draw() {
  background(0);
  // orbitControl();
  translate(0, height / 3, -2750);

  let baseSize = 50;
  let boxDepth = 100;
  let numBoxes = 50;
  let finalHeight = floor(height / 1.5);

  for (let i = numBoxes - 1; i > 5; i--) {
    push();

    const progress = max(
      min((frameCount * 2 - (numBoxes - i) * 12) / numBoxes, 1),
      0,
    );
    const boxHeight = finalHeight * progress;

    push();
    fill(50, 80, map(i, 0, width, 100, 0), 200);
    translate(-i * 9, -boxHeight / 2, i * (boxDepth - 40));
    box(baseSize, boxHeight, baseSize / 20);
    pop();

    push();
    fill(map(i, 0, width, 100, 0), 50, 80, 150);
    translate(i * 9, -boxHeight / 2, i * (boxDepth - 40));
    box(baseSize, boxHeight, baseSize / 20);
    pop();

    pop();

    if (i === 6 && boxHeight === finalHeight) {
      noLoop();
    }
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 3);
  }
}
