// https://openprocessing.org/sketch/1414389

// by SamuelYAN
// more works //
// https://twitter.com/SamuelAnn0924
// https://www.instagram.com/samuel_yan_1990/
// Lissajous figure(Lissajous curve)

var seed = Math.random() * 1000;
var a = 2,
  b = 3;
var th = 0,
  seg = 0.01;
var r;
var mySize;
let colors1 = "f8f9fbBF-f9f6e040-45454cBF-ef9643b3-f0654380"
  .split("-")
  .map((a) => "#" + a);
let colors2 = "f8f9fb-f9f6e0-45454c-ef9643-f06543"
  .split("-")
  .map((a) => "#" + a + "00");
let colorbg = "f06543".split("-").map((a) => "#" + a);
let colorbg2 = "e9ebfb80".split("-").map((a) => "#" + a);

function setup() {
  mySize = min(windowWidth, windowHeight);
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  pixelDensity(1);
  r = mySize / 2;
  background(colorbg2);
  noFill();
  strokeCap(SQUARE);
  makeFilter();
}

function draw() {
  randomSeed(seed);
  // background(colorbg2);
  push();
  translate(width / 2, height / 2);
  for (let i = 0; i < 3; i += random()) {
    a = random();
    b = random();
    rotate(random(TAU));
    strokeWeight(random(50));
    stroke(random(colors1));
    ellipse(
      random(-i * 50, i * 50) + r * cos(a * th),
      random(-i * 50, i * 50) + r * sin(b * th),
      r * cos(a * (th + seg)),
      r * sin(b * (th + seg)),
    );
  }
  pop();
  th += seg;
  image(overAllTexture, 0, 0);
}

// by SamuelYAN
// more works //
// https://twitter.com/SamuelAnn0924
// https://www.instagram.com/samuel_yan_1990/

function makeFilter() {
  randomSeed(seed);
  // noiseのフィルターをつくる
  colorMode(HSB, 360, 100, 100, 100);
  drawingContext.shadowColor = color(0, 0, 5, 10);
  overAllTexture = createGraphics(windowWidth, windowHeight);
  overAllTexture.loadPixels();
  for (var i = 0; i < width; i++) {
    // noprotect
    for (var j = 0; j < height; j++) {
      overAllTexture.set(
        i,
        j,
        color(10, 90, 70, noise(i / 3, j / 3, (i * j) / 50) * random(1, 15)),
      );
    }
  }
  overAllTexture.updatePixels();
}

function keyTyped() {
  if (key === "s" || key === "S") {
    //noLoop();
    saveCanvas("DancingShapes_Tubes", "png");
  }
}
