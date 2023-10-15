function setup() {
  createCanvas((W = windowHeight - 100), W);
  background(255);
  noLoop();

  let colors = [
    color(255, 100, 100),
    color(200, 50, 50),
    color(150, 25, 25),
    color(100, 150, 200),
    color(50, 100, 150),
    color(25, 50, 100),
    color(200, 150, 100),
    color(150, 100, 50),
  ];

  let rows = 10;
  let cols = 10;
  let padding = 20;
  let cellWidth = (width - padding * 2) / cols;
  let cellHeight = (height - padding * 2) / rows;

  for (let x = padding; x < width - padding; x += cellWidth) {
    for (let y = padding; y < height - padding; y += cellHeight) {
      let numOfCircles = floor(random(1, 4));
      let baseSize = random(10, cellWidth / 2.5);

      for (let j = 0; j < numOfCircles; j++) {
        let sizeOffset = random(8, 24);
        let currentSize = baseSize + j * sizeOffset;
        let chosenColor = random(colors);
        let isRing = random(1) > 0.2;

        if (isRing) {
          let ringWidth = random(2, 6);
          strokeWeight(ringWidth);
          stroke(chosenColor);
          noFill();
        } else {
          noStroke();
          fill(chosenColor);
        }

        if (
          x + currentSize / 2 <= width - padding &&
          y + currentSize / 2 <= height - padding
        ) {
          ellipse(x + cellWidth / 2, y + cellHeight / 2, currentSize);
        }
      }
    }
  }
}

function keyPressed() {
  if (key === "s") {
    saveCanvas("sketch", "png");
  }
}
