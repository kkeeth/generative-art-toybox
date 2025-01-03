function setup() {
  createCanvas((W = min(windowWidth, windowHeight)), W);
  noLoop();
  strokeCap(SQUARE);
}

function draw() {
  background(255);

  for (let i = 0; i < 8; i++) {
    drawLayer(
      random(W / 12, W / 4),
      color(random([0, 255]), 0, 0, random(80, 200)),
    );
  }
}

function drawLayer(maxCellSize, col) {
  stroke(col);

  let x = 0;
  while (x < width) {
    let y = 0;
    while (y < height) {
      let cellWidth = random(maxCellSize / 2, maxCellSize);
      let cellHeight = random(maxCellSize / 2, maxCellSize);

      if (random() > 0.7) {
        drawLinesInCell(x, y, cellWidth, cellHeight);
      }

      y += cellHeight;
    }
    x += random(maxCellSize / 2, maxCellSize);
  }
}

function drawLinesInCell(x, y, w, h) {
  let numLines = ~~random(5, 20);
  let spacing, offset;

  if (random() > 0.5) {
    spacing = w / ~~random(20, 30);
    for (let i = 1; i <= numLines; i++) {
      offset = spacing * i;
      line(x + offset, y, x + offset, y + h);
    }
  } else {
    spacing = h / ~~random(18, 28);
    for (let i = 1; i <= numLines; i++) {
      offset = spacing * i;
      line(x, y + offset, x + w, y + offset);
    }
  }
}

function keyPressed() {
  if (key === 'c') {
    save('mySketch');
  }
}
