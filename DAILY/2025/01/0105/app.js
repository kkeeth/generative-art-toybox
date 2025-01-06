let cubeSize = 45;
let rows = 5;
let cols = 5;
let colors;
let cubes = [];
let seed;

function setup() {
  createCanvas((W = min(windowWidth, windowHeight) - 80), W);
  angleMode(DEGREES);
  colors = [
    color(255, 87, 51),
    color(255, 195, 0),
    color(144, 190, 109),
    color(79, 193, 233),
    color(199, 144, 234),
  ];
  seed = random(1000);

  for (let row = -rows; row <= rows; row++) {
    for (let col = -cols; col <= cols; col++) {
      let x = (col - row) * (cubeSize / 2);
      let y = (col + row) * (cubeSize / 3);
      let z = random(-2, 2) * cubeSize * 1.2;
      let offset = random(360);
      let baseRadius = random(50, 150);
      let radiusOffset = random(TWO_PI);
      cubes.push({ x, y, z, offset, baseRadius, radiusOffset });
    }
  }
}

function draw() {
  background(0);
  randomSeed(seed);
  translate(width / 2, height / 2);

  for (let cube of cubes) {
    let timeRadius =
      cube.baseRadius + sin(frameCount * 0.02 + cube.radiusOffset) * 30;

    let angle = frameCount + cube.offset;
    let animatedX = cos(angle) * timeRadius;
    let animatedY = sin(angle) * timeRadius;
    let animatedZ = cube.z + sin(angle) * 2 * timeRadius;

    drawIsometricCube(
      cube.x + animatedX,
      cube.y + animatedY - animatedZ,
      cubeSize,
    );
  }
}

function drawIsometricCube(x, y, s) {
  let h = s * 0.7;

  let topColor = random(colors);
  let sideColor = lerpColor(topColor, color(0), 0.3);
  let frontColor = lerpColor(topColor, color(0), 0.5);

  push();
  translate(x, y);

  fill(topColor);
  stroke(255);
  strokeWeight(2);
  beginShape();
  vertex(0, -h / 2);
  vertex(s / 2, 0);
  vertex(0, h / 2);
  vertex(-s / 2, 0);
  endShape(CLOSE);

  fill(sideColor);
  beginShape();
  vertex(-s / 2, 0);
  vertex(0, h / 2);
  vertex(0, h + h / 2);
  vertex(-s / 2, h);
  endShape(CLOSE);

  fill(frontColor);
  beginShape();
  vertex(0, h / 2);
  vertex(s / 2, 0);
  vertex(s / 2, h);
  vertex(0, h + h / 2);
  endShape(CLOSE);

  pop();
}

function keyPressed() {
  if (key === 's') {
    saveGif(`mySketch-${round(new Date().getTime() / 100000)}`, 4);
  }
}
