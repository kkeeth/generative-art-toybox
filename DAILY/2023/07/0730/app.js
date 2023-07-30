const r = 80;
const thick = 20;
const cp = [
  "#e6302b",
  "#fd7800",
  "#fbd400",
  "#51b72d",
  "#2abde4",
  "#4e59a4",
  "#085a9b",
  "#f477c3",
  "#a0d8ef",
  "#90ee90",
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  angleMode(DEGREES);

  for (let i = 100; i < height - thick; i += 180) {
    push();
    translate(-width + 180, 0);
    let tmpColor1 = random(cp);
    let tmpColor2 = random(cp);
    while (tmpColor1 === tmpColor2) {
      tmpColor2 = random(cp);
    }
    drawWaves(i, tmpColor1, tmpColor2);
    pop();
  }
}

function drawWaves(h, color1, color2) {
  drawCrossWavePlus(10, h, color1, color2);
  for (let i = 180; i < width; i += 180) {
    drawCrossWaveMinus(180, 0, color1, color2);
    drawCrossWavePlus(180, 0, color1, color2);
  }
}

function drawCrossWavePlus(x, y, color1, color2) {
  translate(x, y);
  for (let i = 0; i < 180; i++) {
    fill(color1);
    ellipse(i, r * cos(i), thick);
  }
  for (let i = 0; i < 180; i++) {
    fill(color2);
    ellipse(i, -r * cos(i), thick);
  }
}

function drawCrossWaveMinus(x, y, color1, color2) {
  translate(x, y);
  for (let i = 0; i < 180; i++) {
    fill(color2);
    ellipse(i, r * cos(i), thick);
  }
  for (let i = 0; i < 180; i++) {
    fill(color1);
    ellipse(i, -r * cos(i), thick);
  }
}

function keyPressed() {
  if (key === "s") {
    saveCanvas("mySketch", "png");
  }
}
