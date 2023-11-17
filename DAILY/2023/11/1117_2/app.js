let seed;

function setup() {
  createCanvas(600, 600);
  noFill();
  seed = random(1000);
}

function draw() {
  background(255);
  randomSeed(seed);
  translate(width / 2, height / 2); // 中心に移動

  let numberOfLemniscates = 10;
  for (let i = 0; i < numberOfLemniscates; i++) {
    let a = 200; // レムニスケートのサイズをランダムに
    let dx = random(-width / 4, width / 4);
    let dy = random(-height / 4, height / 4);
    let rotation = i * QUARTER_PI;
    drawLemniscate(a, 0, 0, rotation);
  }
}

function drawLemniscate(a, dx, dy, rotation) {
  push();
  rotate(rotation);
  translate(dx, dy);

  let r = random(255);
  let g = random(255);
  let b = random(255);
  stroke(r, g, b, 100); // 透明度を下げる
  strokeWeight(2);

  beginShape();
  for (let t = 0; t < TAU; t += 0.01) {
    let x =
      ((a + 50 * cos(frameCount / 77)) * cos(t + frameCount / 100)) /
      (1 + sq(sin(t + frameCount / 99)));
    let y =
      ((a + 50 * sin(frameCount / 100)) *
        cos(t + frameCount / 100) *
        sin(t + frameCount / 66)) /
      (1 + sq(sin(t + frameCount / 33)));
    vertex(x, y);
  }
  endShape();
  pop();
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 8);
  }
  if (key === "c") {
    saveCanvas("mySketch", "png");
  }
}
