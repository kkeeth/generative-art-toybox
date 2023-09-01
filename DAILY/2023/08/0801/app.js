const baseSize = 12;
const CIRCLE_NUM = 8;
const DOTS_NUM = 4e2;
const cp = [
  "#e6302b",
  "#fd7800",
  "#fbd400",
  "#51b72d",
  "#2abde4",
  "#4e59a4",
  "#085a9b",
  "#f477c3",
  "#f8b862",
];
let selectedColor;

function setup() {
  createCanvas((W = windowHeight - 100), W);
  noStroke();
  selectedColor = random(cp);
  background("#1f3134");

  for (let j = random([0, 1]); j < int(random(2, 6)); j += 2) {
    const initX = ~~(random(-W / 4, W / 2) / baseSize);
    const maxX = random(600, 800) / baseSize;
    drawRectLine(initX, maxX, ((j + 1) * W) / 6);
  }
  for (let i = 0; i < CIRCLE_NUM; i++) {
    push();
    drawingContext.shadowColor = selectedColor;
    drawingContext.shadowBlur = 12;
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
        // fill(selectedColor);
        rect(0, 0, baseSize, baseSize);
        pop();
      }
    }
  }
  drawDots(initX, maxX, h);
  drawCloud(initX, maxX, h, true);
}

function drawDots(initX, maxX, h) {
  for (let i = 0; i < DOTS_NUM; i++) {
    push();
    translate(0, h);
    translate(random(initX, initX + maxX - 1) * baseSize, -random(10, 60));
    ellipse(0, 0, random(1, 3), random(1, 3));
    pop();
  }
  drawCloud(initX, maxX, h);
}
function drawCloud(initX, maxX, h, under) {
  for (let i = 0; i < DOTS_NUM; i++) {
    push();
    fill(random(180, 255));
    translate(0, h);
    for (let j = 0; j < 2; j++) {
      push();
      under
        ? translate(random(initX, initX + maxX - 1) * baseSize, -random(80, 95))
        : translate(random(initX, initX + maxX - 1) * baseSize, random(70, 85));
      ellipse(0, 0, random(5, 13), random(4, 9));
      pop();
    }
    pop();
  }
}

function keyPressed() {
  if (key === "s") {
    saveCanvas("mySketch", "png");
  }
}
