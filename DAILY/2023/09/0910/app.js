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
  createCanvas((W = windowHeight - 100), W);
  noLoop();
  noStroke();
}

function draw() {
  background(255);
  let numBuildings = 10;
  let blockMargin = 4;

  for (let i = 0; i < numBuildings; i++) {
    let rectSize = map(i, 0, numBuildings, 40, 80);
    let blockSize = map(rectSize, 40, 80, 8, 12);
    let margin = 5;
    let x = random(rectSize + margin, width - rectSize - margin);
    let y = random(300, height - rectSize - margin);
    let rectHeight = random(150, 300);
    let opacity = map(rectSize, 10, 60, 100, 200);

    push();
    translate(x, y);
    rectMode(CORNER);
    fill(...hexToRgb(random(cp)), opacity);

    // draw building main
    for (let bx = 0; bx < rectSize; bx += blockSize + blockMargin) {
      for (let by = -rectHeight; by < 0; by += blockSize + blockMargin) {
        let dy = map(by, -rectHeight, 0, 0.999, 0.3);
        if (random() < dy) rect(bx, by, blockSize, blockSize, 1);
      }
    }

    // draw building sub
    for (let bx = 1; bx < 4; bx++) {
      for (let by = -rectHeight; by < 0; by += blockSize + blockMargin) {
        rect(
          -(blockSize + (blockMargin - 5)) * bx,
          by + bx * (blockSize - 5),
          blockSize - 3,
          blockSize - 3,
        );
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
