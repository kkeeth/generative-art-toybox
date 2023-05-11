let maxBoxes;
const baseSize = 50;
const boxDepth = 50;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  rectMode(CENTER);

  maxBoxes = height / 10;
}

function draw() {
  background(255);
  orbitControl();
  translate(0, height / 3, -2100);

  let baseSize = 50;
  let boxDepth = 100;
  let numBoxes = 30;
  let finalHeight = height / 1.5;

  for (let i = numBoxes - 1; i > 3; i--) {
    push();

    const progress = max(
      min((frameCount - (numBoxes - i) * 10) / numBoxes, 1),
      0,
    );
    const boxHeight = (finalHeight - (numBoxes - i) * 20) * progress;

    push();
    fill(200, 150, map(i, 0, width, 255, 0), 200);
    translate(-i * 10 - 100, -boxHeight / 2, i * (boxDepth - 20));
    box(baseSize, boxHeight, baseSize / 6);
    pop();

    push();
    fill(map(i, 0, width, 255, 0), 200, 200, 150);
    translate(i * 10 + 100, -boxHeight / 2, i * (boxDepth - 20));
    box(baseSize, boxHeight, baseSize / 6);
    pop();

    pop();

    if (i === numBoxes - 1 && boxHeight === 380) {
      noLoop();
    }
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 3);
  }
}
