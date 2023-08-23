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

function setup() {
  createCanvas(windowWidth - 110, windowHeight - 50);
  noFill();
  strokeCap(SQUARE);

  for (let i = 110; i < width; i += 215) {
    for (let j = 0; j < height; j += 100) {
      drawGlass(i, j, random(1, 10), random(cp));
    }
  }
}

function drawGlass(x, y, thickness, color) {
  push();
  stroke(color);
  strokeWeight(thickness);
  ellipse(x - 50, y, 80);
  ellipse(x + 50, y, 80);
  arc(x, y, 25 * cos((18 * PI) / 16), 25, (18 * PI) / 16, (30 * PI) / 16);
  pop();
}

function keyPressed() {
  if (key === "s") {
    saveCanvas("mySketch", "png");
  }
}
