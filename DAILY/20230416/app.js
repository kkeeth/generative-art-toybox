const numRows = 25;
const numCols = 30;
const minDiameter = 8;
const maxDiameter = 20;
const waveFrequency = 0.8;
const waveAmplitude = 7;

function setup() {
  createCanvas(700, 700);
  noStroke();
}

function draw() {
  background(255);

  const cellWidth = width / numCols;
  const cellHeight = height / numRows;

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const x = col * cellWidth + cellWidth / 2;
      const y = row * cellHeight + cellHeight / 2;
      const xOffset =
        col * waveFrequency + frameCount * 0.03 + row * QUARTER_PI;
      const yOffset = row * waveFrequency + frameCount * 0.03 + row * HALF_PI;
      const diameterX = map(cos(xOffset), -1, 1, minDiameter, maxDiameter);
      const diameter = diameterX;
      const yPos = y + waveAmplitude * cos(xOffset);

      fill(0);
      circle(x, yPos, diameter);
    }
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("mysketch", 5);
  }
}
