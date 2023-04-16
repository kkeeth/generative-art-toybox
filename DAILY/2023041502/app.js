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
let circleDiameter = 60;
let numRows = 10;
let numCircles;
let spacingY = 20;
let baseSpeed = circleDiameter / 30;
let rowSpeeds = [];
let petals = [];
let spans = [];

function setup() {
  createCanvas(800, windowHeight);
  noStroke();
  frameRate(30);
  for (let row = 0; row < numRows; row++) {
    rowSpeeds[row] = random(baseSpeed * 0.5, baseSpeed * 2);
    petals[row] = ~~random(6, 9);
    spans[row] = random([0, width / 5, (2 * width) / 5, (3 * width) / 5]);
  }
  numCircles = ceil(width / circleDiameter) + 1;
}

function draw() {
  background(255);
  randomSeed(99);
  let verticalSpacing =
    (height - numRows * (circleDiameter + spacingY) + spacingY) / 2;

  for (let row = 0; row < numRows; row++) {
    let y =
      row * (circleDiameter + spacingY) + circleDiameter / 2 + verticalSpacing;
    let isEvenRow = row % 2 === 0;
    let rowSpeed = rowSpeeds[row];
    let offsetX = isEvenRow ? 1 : -1;

    for (let i = 0; i < numCircles; i++) {
      let x =
        ((i * circleDiameter + frameCount * offsetX * rowSpeed) %
          (width + circleDiameter)) -
        circleDiameter / 2;
      if (!isEvenRow && x < -circleDiameter / 2) {
        x += width + circleDiameter;
      }

      let n = petals[row];
      let r = random(HALF_PI);
      let fSize = 8;
      let color1 = random(cp);
      let color2 = random(cp);

      push();
      translate(x, y);
      rotate(r + (offsetX * frameCount) / 50);
      if (isEvenRow) {
        scale(max(norm(x, spans[row], spans[row] + width / 5), 1));
      }
      if (!isEvenRow) {
        scale(
          map(
            norm(x, spans[row] + width / 5, spans[row] + (2 * width) / 5),
            0,
            1,
            2,
            1,
          ),
        );
        // scale(0.8);
      }
      for (let i = 0; i < n; i++) {
        fill(
          lerpColor(
            color(...hexToRgb(color1), 180),
            color(...hexToRgb(color2), 180),
            i / n,
          ),
        );
        ellipse(1.4 * fSize, 0, 2 * fSize, 0.8 * fSize);
        rotate(TAU / n);
      }
      fill(...hexToRgb(random(cp)), 200);
      circle(0, 0, fSize);
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
    saveGif("2023041502", 4);
  }
}
