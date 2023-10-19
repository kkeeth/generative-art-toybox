const NUM = 100;
const colors = {
  orange: "#FF6B35",
  teal: "#39A2DB",
  black: "#000000",
  white: "#FFFFFF",
};

function setup() {
  createCanvas((W = windowHeight - 100), W);
  noLoop();
  noStroke();

  background(colors.teal);
  noiseDetail(5);

  drawWavyShape(colors.orange, 0.3);
  drawWavyShape(colors.black, 0.5);
  drawWavyShape(colors.white, 0.7);

  for (let i = 0; i < NUM; i++) {
    let x = random(width);
    let y = random(height);
    // let d = random(10, 50);
    let c = random([colors.orange, colors.teal, colors.black, colors.white]);
    fill(c);
    ellipse(x, y, map(y, 0, height, 50, 10));
  }
}

function drawWavyShape(c, yOffset) {
  fill(c);
  beginShape();
  for (let x = 0; x <= width; x += 5) {
    let y = map(noise(x * 0.05, yOffset * 5), 0, 1, 0, height);
    vertex(x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
}

function keyPressed() {
  if (key === "c") {
    saveCanvas("mySketch", "png");
  }
}
