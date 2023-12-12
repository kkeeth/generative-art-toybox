// radius
const rSmall = 100;
const rMedium = 200;
const rLarge = 350;
// circle size
const weightSmall = 50;
const weightMedium = 75;
const weightLarge = 200;
// color pattern
const cp = [
  "#ffb6b9",
  "#bbded6",
  "#fae3d9",
  "#8ac6d1",
  "#fff1ac",
  "#f9bcdd",
  "#d5a4cf",
  "#b689b0",
];
// count circle
const targetCountSmall = 22;
const targetCountMedium = 20;
const targetCountLarge = 18;
// circle color
let targetColorSmall;
let targetColorMedium;
let targetColorLarge;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // initial color
  targetColorSmall = color(cp[0]);
  targetColorMedium = color(cp[1]);
  targetColorLarge = color(cp[2]);
  frameRate(8);
  smooth();
  noStroke();
}

function draw() {
  background(255);
  const incSmall = TWO_PI / targetCountSmall;
  const incMedium = TWO_PI / targetCountMedium;
  const incLarge = TWO_PI / targetCountLarge;
  translate(width / 2, height / 2);

  drawCircles(
    incSmall,
    targetCountSmall,
    rSmall,
    weightSmall,
    targetColorSmall,
    "small"
  );
  drawCircles(
    incMedium,
    targetCountMedium,
    rMedium,
    weightMedium,
    targetColorMedium,
    "medium"
  );
  drawCircles(
    incLarge,
    targetCountLarge,
    rLarge,
    weightLarge,
    targetColorLarge,
    "large"
  );
}

function setFillColor(count, val, targetColor) {
  if (frameCount % count === val) {
    fill(targetColor);
  } else {
    noFill();
    const c = color("#000");
    c.setAlpha(150);
    stroke(c);
  }
}

function drawCircles(inc, targetCount, r, w, targetColor, type) {
  let angle = 0;

  for (let val = 0; val < targetCount; val++) {
    push();
    setFillColor(targetCount, val, targetColor);
    const e = int(random(-40, 40));
    ellipse(cos(angle) * r, sin(angle) * r, w + e, w + e);
    angle = angle + inc;
    pop();
  }

  // initialize after one cycle
  if (frameCount % targetCount === 0) {
    const c = color(cp[int(random(cp.length))]);

    switch (type) {
      case "small":
        targetColorSmall = color(cp[int(random(cp.length))]);
        break;
      case "medium":
        targetColorMedium = color(cp[int(random(cp.length))]);
        break;
      case "large":
        targetColorLarge = color(cp[int(random(cp.length))]);
        break;
    }
  }
}
