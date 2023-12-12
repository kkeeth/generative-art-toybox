let size;
let img;
let pX, pY, mX, mY;

function preload() {
  img = loadImage("./dogs_toe_paw.png");
}

function setup() {
  createCanvas(400, 400);
  noStroke();
  background(0);

  pX = width / 2;
  pY = height / 2;
  img.resize(width, height);
  img.loadPixels();
  size = random(10, 30);
}

function draw() {
  const c = img.get(pX, pY);
  fill(c);
  ellipse(pX, pY, size);

  drawingContext.shadowColor = c;
  drawingContext.shadowBlur = 8;

  mX = random(-1, 1);
  mY = random(-1, 1);

  tmpX = size * mX;
  tmpY = size * mY;

  if (pX + tmpX > width || pX + tmpX < 0) {
    pX += -tmpX;
  } else {
    pX += tmpX;
  }
  if (pY + tmpY > width || pY + tmpY < 0) {
    pY += -tmpY;
  } else {
    pY += tmpY;
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5);
  }
}
