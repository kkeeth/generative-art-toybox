let colors = [
  "#333333",
  "#666666",
  "#999999",
  "#CC66CC",
  "#FF66FF",
  "#FF99FF",
  "#1e90ff",
];

function setup() {
  createCanvas((W = windowHeight - 50), W);
  background(255);
  noLoop();
  drawPattern();
}

function drawPattern() {
  for (let i = 0; i < 300; i++) {
    let x = random(width);
    let y = random(height);
    let s = random(20, 150); // size
    let col = random(colors);

    fill(col);
    noStroke();

    let choice = floor(random(4));
    switch (choice) {
      case 0:
        ellipse(x, y, s);
        drawDetails(x, y, s);
        break;
      case 1:
        rect(x, y, s, s);
        drawDetails(x, y, s);
        break;
      case 2:
        triangle(x, y, x + s, y, x + s / 2, y - s);
        drawDetails(x, y, s);
        break;
      case 3:
        arc(x, y, s, s, 0, HALF_PI);
        drawDetails(x, y, s);
        break;
    }
  }
}

function drawDetails(x, y, s) {
  let choice = floor(random(3));
  strokeWeight(map(s, 20, 150, 2, 5));
  stroke(255); // white details
  switch (choice) {
    case 0:
      line(x, y, x + s, y + s);
      break;
    case 1:
      line(x + s, y, x, y + s);
      break;
    case 2:
      ellipse(x + s / 2, y + s / 2, s / 2);
      break;
  }
}

function keyPressed() {
  if (key === "s") {
    saveCanvas("mySketch", "png");
  }
}
