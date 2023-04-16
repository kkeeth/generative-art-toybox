const cp = [
  "#e6302b",
  "#fd7800",
  "#fbd400",
  "#51b72d",
  "#2abde4",
  "#4e59a4",
  "#085a9b",
  "#f477c3",
];
const numRows = 15;
const numCols = 15;
const minDiameter = 16;
const maxDiameter = 40;
const waveFrequency = 0.8;
const waveAmplitude = 7;
let seed;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  d = displayDensity();
  seed = ~~random(99);
}

function draw() {
  background(255);
  randomSeed(seed);

  const cellWidth = width / numCols;
  const cellHeight = height / numRows;

  for (let row = 0; row < numRows; row++) {
    let cond = random();
    let offsetX = random() < 0.5 ? 1 : -1;
    for (let col = 0; col < numCols; col++) {
      const x = col * cellWidth + cellWidth / 2;
      const y = row * cellHeight + cellHeight / 2;
      const xOffset =
        col * waveFrequency + frameCount * 0.03 + row * QUARTER_PI;
      const diameterX = map(sin(xOffset), -1, 1, minDiameter, maxDiameter);
      const diameter = diameterX;
      const yPos = y + waveAmplitude * cos(xOffset);
      let n = int(random(6, 10));
      let r = random(HALF_PI);
      let color1 = random(cp);
      let color2 = random(cp);

      push();
      translate(x, yPos);
      scale(map(row, 0, height, 0.2, 1));
      rotate(r + (offsetX * frameCount) / 50);
      for (let i = 0; i < n; i++) {
        fill(
          lerpColor(
            color(...hexToRgb(color1), 180),
            color(...hexToRgb(color2), 180),
            i / n,
          ),
        );
        if (cond > 0.5) {
          ellipse(1.4 * diameter, 0, diameter, diameter);
        } else {
          ellipse(1.4 * diameter, 0, 2 * diameter, 0.8 * diameter);
        }
        rotate(TAU / n);
      }
      fill(...hexToRgb(random(cp)), 200);
      if (cond > 0.5) {
        circle(0, 0, 1.5 * diameter);
      } else {
        circle(0, 0, 0.8 * diameter);
      }
      pop();
    }
  }
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16), // r
        parseInt(result[2], 16), // g
        parseInt(result[3], 16), // b
      ]
    : null;
}

function keyPressed() {
  if (key === "s") {
    saveGif("mysketch", 5);
  }
}
