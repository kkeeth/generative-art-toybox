const NUM = 30;
const diameter = 50;
let lines = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  rectMode(CORNER);
  noStroke();
  fill(220);

  for (let i = 0; i < NUM; i++) {
    lines.push({
      x: map(i, 0, NUM, diameter * 1.5, windowWidth - diameter),
      liney: random(200, height / 2),
      circley: 0,
      miny: random(100, 120),
      limitedy: 50,
      tempy: height - random(200, 300),
      v: random(3, 6),
      size: 0,
    });
  }
}

function draw() {
  background(0);
  translate(-width / 2, -height / 2);

  for (let item of lines) {
    if (item.tempy < item.liney) {
      if (item.liney + item.circley < item.limitedy) {
        item.v *= -1;
      }
      item.circley -= item.v;
      item.size = map(item.circley, 0, item.limitedy, 2, 10);

      push();
      stroke(255);
      ellipse(item.x, item.liney + item.circley, item.size, item.size);
      pop();

      if (item.liney + item.circley > item.liney) {
        item.tempy -= item.v;
      }
    } else if (item.tempy >= height - item.miny) {
      item.v *= -1;
      item.tempy -= item.v;
    } else {
      item.tempy -= item.v;
    }

    rect(
      item.x - diameter / 4,
      item.tempy,
      diameter / 2,
      height - item.tempy,
      diameter,
      diameter,
      0,
      0,
    );
  }
}
