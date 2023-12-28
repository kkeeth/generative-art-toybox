const r = 200;
const size = 10;
let odiff = 0.0;
let idiff = 0.0;

function setup() {
  createCanvas((W = windowHeight - 50), W);
  noStroke();
  colorMode(HSB, W);
  // fill("#008080");
  noFill();
  // strokeWeight(2);
  // rectMode(TOP, CENTER);
  // textSize(24);
  // textAlign(CENTER, CENTER);
}

function draw() {
  clear();
  background(W);
  translate(0, W / 2);

  for (let i = 0; i < TAU; i += 0.1) {
    let x = map(i, 0, TAU, 0, width);
    let y = r * sin(i + odiff);

    stroke(x, W, W / 1.5);
    // beginShape();
    // for (let j = 0; j < TAU; j += 0.09) {
    //   let sy = map(j, 0, TAU, 0, y);
    //   let sx = x + map(sy, 0, y, 0, size * 4) * sin(j + idiff * 3);

    //   // ellipse(sx, sy, size / 2);
    //   vertex(sx, sy);
    // }
    // endShape();

    // vertex(x, y);
    // ellipse(x, y, size);
    // square(x, y, size);
    // ellipse(x, y / 2, size / 2, y);
    // rect(x - size / 4, 0, size / 2, y);
    // triangle(x, 0, x + size, 0, x + size / 2, y);
    // text("❀", x, y);
    line(0, 0, x, y);
  }
  odiff += 0.01;
  idiff += 0.015;
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 3);
  }

  if (key === "c") {
    saveCanvas("mySketch", "png");
  }
}
