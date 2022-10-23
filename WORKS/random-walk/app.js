// coordinates
let pX, pY, mX, mY;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB);

  pX = width / 2;
  pY = height / 2;
}

function draw() {
  noStroke();

  push();
  fill(pY % 360, 100, 100);
  ellipse(pX, pY, 3);
  pop();

  mX = random(-1, 1);
  mY = random(-1, 1);

  pX = pX + 10 * mX;
  pY = pY + 10 * mY;

  textSize(32);

  rect(0, 0, 70, 40);
  text(frameCount, 10, 30);
}
