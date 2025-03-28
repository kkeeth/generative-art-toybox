const NUM = 8;

function setup() {
  createCanvas((W = 400), W);
  noStroke();
  background(255);
  fill('navy');

  const SIZE = W / NUM;

  for (let i = 0; i < NUM; i++) {
    for (let j = 0; j < NUM; j++) {
      if ((i + j) % 2 === 0) {
        const leftCond = j % 2 === 0 ? 0 : 1;
        const rightCond = j % 2 !== 0 ? 0 : 1;
        rect(
          i * SIZE,
          j * SIZE + (leftCond * SIZE) / 2,
          SIZE / 2,
          SIZE / 2,
          SIZE / 40,
        );
        rect(
          i * SIZE + SIZE / 2,
          j * SIZE + (rightCond * SIZE) / 2,
          SIZE / 2,
          SIZE / 2,
          SIZE / 40,
        );
      } else {
        // for (let k = 0; k < 7; k++) {
        //   push();
        //   noFill();
        //   stroke('navy');
        //   const size = SIZE - (k * SIZE) / 7;
        //   rect(i * SIZE, j * SIZE, size, size);
        //   pop();
        // }
        push();
        noFill();
        stroke('navy');
        rect(i * SIZE, j * SIZE, SIZE, SIZE);
        drawContinuousSpiral(i * SIZE, j * SIZE, SIZE, SIZE);
        pop();
      }
    }
  }
}

function drawContinuousSpiral(initX, initY, w, h) {
  let gridSize = NUM / 2;
  let margin = gridSize;

  let spiralWidth = w;
  let spiralHeight = h;

  let cols = floor(spiralWidth / gridSize);
  let rows = floor(spiralHeight / gridSize);

  if (cols % 2 === 0) cols--;
  if (rows % 2 === 0) rows--;

  // 渦巻きの描画開始
  beginShape();

  /**
   * 1: 1→6→4→2→8→6…
   * 2: 2→5→7→1→3→5…
   * 3: 3→8→6→4→2→8…
   * 4: 4→7→1→3→5→7…
   * 5: 5→2→8→6→4→2…
   * 6: 6→1→3→5→7→1…
   * 7: 7→4→2→8→6→4…
   * 8: 8→3→5→7→1→3…
   */
  const originTarget = random([1, 2, 3, 4, 5, 6, 7, 8]);
  let loopArray;
  let index = 0;
  let x = initX;
  let y = initY;

  switch (originTarget) {
    case 1:
      loopArray = [6, 4, 2, 8];
      x += margin;
      break;
    case 2:
      loopArray = [5, 7, 1, 3];
      x += w - margin;
      break;
    case 3:
      loopArray = [8, 6, 4, 2];
      x += w;
      y += margin;
      break;
    case 4:
      loopArray = [7, 1, 3, 5];
      x += w;
      y += h - margin;
      break;
    case 5:
      loopArray = [2, 8, 6, 4];
      x += w - margin;
      y += h;
      break;
    case 6:
      loopArray = [1, 3, 5, 7];
      x += margin;
      y += h;
      break;
    case 7:
      loopArray = [4, 2, 8, 6];
      y += h - margin;
      break;
    case 8:
      loopArray = [3, 5, 7, 1];
      y += margin;
      break;
  }
  nextTarget = loopArray[index];
  vertex(x, y);

  let remainingCols = cols;
  let remainingRows = rows;

  while (remainingCols > 0 && remainingRows > 0) {
    switch (nextTarget) {
      case 5:
      case 6:
        // 下に進む: 1 or 2
        y += remainingRows * gridSize;
        vertex(x, y);
        remainingRows--;
        break;
      case 7:
      case 8:
        // 左に進む: 3 or 4
        x -= remainingCols * gridSize;
        vertex(x, y);
        remainingCols--;
        break;
      case 1:
      case 2:
        // 上に進む: 5 or 6
        y -= remainingRows * gridSize;
        vertex(x, y);
        remainingRows--;
        break;
      case 3:
      case 4:
        // 右に進む: 7 or 8
        x += remainingCols * gridSize;
        vertex(x, y);
        remainingCols--;
        break;
    }
    index++;
    if (index >= loopArray.length) index = 0;
    nextTarget = loopArray[index];

    if (remainingCols <= 0 || remainingRows <= 0) break;
  }

  endShape();
}

function keyPressed() {
  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
