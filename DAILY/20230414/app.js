let cp = [
  "#e6302b",
  "#fd7800",
  "#fbd400",
  "#51b72d",
  "#2abde4",
  "#4e59a4",
  "#085a9b",
  "#f477c3",
];
const step = 100;
let t = 0;
let w;
let xMax;
let xCount = 5;

function setup() {
  createCanvas(500, windowHeight);
  background(255);
  rectMode(CENTER);
  fill(0, 100);
  noStroke();

  w = width / 60;
  xMax = width / xCount;

  for (let j = height; j > 0; j -= xMax * 1.7) {
    let numCircles = min(xMax, xCount) - 1;
    let totalCirclesWidth = numCircles * xMax;
    let remainingSpace = width - totalCirclesWidth;
    let spacing = remainingSpace / (numCircles + 1);

    for (let i = 0; i < numCircles; i++) {
      let n = xCount;
      let r = random(HALF_PI);
      let fSize = xMax / 5;
      let color1 = random(cp);
      let color2 = random(cp);

      push();
      translate(fSize * 2 + i * xMax + spacing * (i + 1), j - xMax / 2);
      rotate(r);
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
      circle(0, 0, fSize /* / map(j, height, 0, 1, 2)*/);
      pop();
    }
    xCount++;
    xMax = width / xCount;
  }
}

function keyPressed() {
  if (key == "s") {
    saveCanvas("mysketch", "png");
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
