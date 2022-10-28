let cWidth = 30;
let cHeight = 30;

function setup() {
  createCanvas(920, 700);
  background(220);
  randomSeed(9);
  //blendMode(DARKEST);

  for (let i = cWidth; i < width; i += cWidth * 3.5) {
    for (let j = cHeight; j < height; j += cHeight * 3.5) {
      noStroke();
      fill(random(255), random(255), random(255));
      ellipse(i, j, cWidth, cHeight);
      fill(random(255), random(255), random(255));
      ellipse(i + cWidth / 2, j, cWidth, cHeight);
    }
  }
}
