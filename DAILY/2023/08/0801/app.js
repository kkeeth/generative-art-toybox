const baseSize = 12;
const CIRCLE_NUM = 5;
const DOTS_NUM = 5e2;
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
let selectedColor;

function setup() {
  createCanvas((W = windowHeight - 100), W);
  noStroke();
  selectedColor = random(cp);
  background("#1f3134");

  for (let j = random([0, 1]); j < int(random(2, 5)); j += 2) {
    drawRectLine(
      ~~(random(30, W / 2) / baseSize),
      random(300, 700) / baseSize,
      ((j + 1) * W) / 6,
    );
    drawDots(
      ~~(random(30, W / 2) / baseSize),
      random(300, 700) / baseSize,
      ((j + 1) * W) / 6,
    );
  }
  for (let i = 0; i < CIRCLE_NUM; i++) {
    push();
    drawingContext.shadowColor = "#fff";
    drawingContext.shadowBlur = 7;
    ellipse(random(W), random(W / 10, height - W / 10), random(10, 100));
    pop();
  }
}

function drawRectLine(initX, maxX, h) {
  for (let x = initX; x < initX + maxX; x++) {
    for (let y = 0; y <= 2; y++) {
      if ((x + y) % 2 === 0) {
        push();
        drawingContext.shadowColor = "#e6b422";
        drawingContext.shadowBlur = 4;
        translate(0, h);
        translate(x * baseSize, y * baseSize * 1.5);
        rotate(PI / 4);
        fill("#f8b862");
        rect(0, 0, baseSize, baseSize);
        pop();
      }
    }
  }
}

function drawDots(initX, maxX, h) {
  for (let i = 0; i < DOTS_NUM; i++) {
    push();
    strokeWeight(2);
    stroke(255);
    point(random(initX, initX + maxX - 1) * baseSize, h - random(10, 50));
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

function keyPressed() {
  if (key === "s") {
    saveCanvas("mySketch", "png");
  }
}
