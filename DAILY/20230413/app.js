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

function setup() {
  createCanvas((W = windowHeight), W);
  noLoop();
  noStroke();
}

function draw() {
  background(255);
  let numBuildings = 50;
  let blockMargin = 2;

  for (let i = 0; i < numBuildings; i++) {
    let rectSize = map(i, 0, numBuildings, 10, 80);
    let blockSize = map(rectSize, 10, 80, 4, 10);
    let margin = 5;
    let x = random(rectSize + margin, width - rectSize - margin);
    let y = random(300, height - rectSize - margin);
    let rectHeight = random(100, 300);
    let opacity = map(rectSize, 10, 60, 100, 200);

    push();
    translate(x, y);
    rectMode(CORNER);
    fill(...hexToRgb(random(cp)), opacity);

    for (let bx = 0; bx < rectSize; bx += blockSize + blockMargin) {
      for (let by = -rectHeight; by < 0; by += blockSize + blockMargin) {
        rect(bx, by, blockSize, blockSize);
      }
    }

    pop();
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
