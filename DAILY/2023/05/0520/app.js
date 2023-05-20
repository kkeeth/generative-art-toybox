let colors = [
  "#123456",
  "#789abc",
  "#def012",
  "#345678",
  "#9abcde",
  "#abcdef",
  "#fedcba",
  "#567890",
  "#098765",
  "#012345",
];
let numPoints = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);

  // 半径の間隔
  let radiusSpacing = width / numPoints;

  for (let n = 0; n < 30; n++) {
    let randomColor = random(colors);
    let c = color(randomColor);
    let r = red(c);
    let g = green(c);
    let b = blue(c);

    drawingContext.shadowColor = randomColor;
    drawingContext.shadowBlur = 20;

    const initialAngle = random(TAU);
    const diffX = (width / 3) * (random() * 2 - 1);
    const diffY = (height / 3) * (random() * 2 - 1);
    let prevX = width / 2 + diffX;
    let prevY = height / 2 + diffY;
    const initialX = prevX;
    const initialY = prevY;
    const initialW = random(20, 40);
    let strokeW = initialW;

    for (let i = 0; i < numPoints; i += 0.7) {
      if (strokeW > 0.1) {
        stroke(r, g, b);
        strokeWeight(strokeW);

        let angle = (TAU / (3 * numPoints)) * i;
        let radius = radiusSpacing * i;

        let x = width / 2 + radius * cos(angle + initialAngle) + diffX;
        let y = height / 2 + radius * sin(angle + initialAngle) + diffY;

        line(prevX, prevY, x, y);

        prevX = x;
        prevY = y;

        if (strokeW > initialW / 3) {
          strokeW *= 0.5;
        } else {
          strokeW *= 0.85;
        }
      }
    }

    fill(255);
    ellipse(initialX, initialY, 15);
  }
}

function keyPressed() {
  if (key === "s") {
    saveCanvas("mySketch", "png");
  }
}
