let hexRadius = 100;
let hexWidth, hexHeight;

function setup() {
  createCanvas((W = min(windowWidth, windowHeight) - 100), W);
  background(255);
  noStroke();
  noFill();
  noLoop();
  randomSeed(random(1000));

  hexWidth = sqrt(3) * hexRadius;
  hexHeight = 2 * hexRadius;
  let yOffset = 0;

  for (let y = 0; y < W + hexHeight / 2; y += hexHeight * 0.75) {
    let xOffset = yOffset % 2 === 0 ? 0 : hexWidth / 2;

    for (let x = 0; x < W + hexWidth / 2; x += hexWidth) {
      drawHexagonWithTriangles(x + xOffset, y);
    }

    yOffset++;
  }
}

function drawHexagonWithTriangles(cx, cy) {
  let angleOffset = PI / 3;
  // const cl = color(random(150, 240), random(150, 240), random(150, 240));
  // fill(cl);
  // stroke(cl);

  for (let i = 0; i < 6; i++) {
    let angle1 = angleOffset * i - PI / 6;
    let angle2 = angleOffset * (i + 1) - PI / 6;

    let x1 = cx + hexRadius * cos(angle1);
    let y1 = cy + hexRadius * sin(angle1);

    let x2 = cx + hexRadius * cos(angle2);
    let y2 = cy + hexRadius * sin(angle2);

    const cl = color(random(150, 240), random(150, 240), random(150, 240));
    if (i % 2 === 0) {
      fill(cl);
      stroke(cl);
    }
    triangle(cx, cy, x1, y1, x2, y2);
  }
}

function keyPressed() {
  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
