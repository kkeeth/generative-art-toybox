const cp = ["#A288A6", "#BB9BB0", "#BB9BB0", "#F1E3E4"];
const NUM = 30;
const diameter = 83;
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
      limitedy: 0,
      tempy: height - random(200, 300),
      v: random(3, 6),
      size: diameter / 2,
      color: random(cp),
    });
  }
}

function draw() {
  background(0);
  translate(-width / 2, -height / 2);

  lines.forEach((item, index) => {
    fill(item.color);
    if (item.tempy < item.liney) {
      if (item.liney + item.circley < item.limitedy) {
        item.v *= -1;
      }
      item.circley -= item.v;

      push();
      if (index % 2 === 0) {
        ellipse(
          item.x + diameter / 4,
          height - (item.liney + item.circley) - 10,
          item.size,
          item.size,
        );
      } else {
        ellipse(
          item.x + diameter / 4,
          item.liney + item.circley + 10,
          item.size,
          item.size,
        );
      }
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

    if (index % 2 === 0) {
      rect(
        item.x,
        0,
        diameter / 2,
        height - item.tempy,
        0,
        0,
        diameter / 4,
        diameter / 4,
      );
    } else {
      rect(
        item.x,
        item.tempy,
        diameter / 2,
        height - item.tempy,
        diameter,
        diameter,
        0,
        0,
      );
    }
  });
}

function keyPressed() {
  // this will download the first 5 seconds of the animation!
  if (key === "s") {
    saveGif("mySketch", 5);
  }
}
