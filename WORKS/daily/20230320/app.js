const cp = ["#382E37", "#DF642F", "#FAAB10", "#CB812B", "#3CAE64"];
const NUM = 15;
let items = [];
let bgc;

function setup() {
  createCanvas((W = windowHeight), W);
  noFill();
  bgc = random(cp);

  for (let i = 0; i < NUM; i++) {
    items.push({
      x: random(width),
      y: random(height),
      step: ~~random(5, 30),
      swingX: random([50, 0, -50]),
      swingY: random([50, 0, -50]),
      diff: random(TAU),
      lines: [],
    });

    for (let j = 0; j < ~~(~~random(80, 300) / items[i].step); j++) {
      let initAngle = random(TAU);
      items[i].lines.push({
        strokeColor: random(cp),
        weight: random(1, 8),
        start: initAngle,
        current: initAngle,
        end: initAngle + TAU,
        speed: random(0.03, 0.08),
        drawing: true,
        cond: random() < 0.3,
      });
    }
  }
}

function draw() {
  background(bgc);

  for (let i of items) {
    push();
    translate(
      i.x + sin(i.diff + frameCount / 30) * i.swingX,
      i.y + sin(i.diff + frameCount / 30) * i.swingY,
    );
    drawCircles(i);
    pop();
  }
}

function drawCircles({ lines, step, diff, swingX, swingY }) {
  let cSize = 0;
  let count = 0;

  while (count < lines.length) {
    const { strokeColor, weight, start, end, cond, speed } = lines[count];
    cSize += step;
    stroke(strokeColor);
    strokeWeight(weight);

    if (lines[count].drawing > 0) {
      lines[count].current += speed;
      if (lines[count].current + speed > end) {
        lines[count].current = end;
        lines[count].drawing = false;
      }
    } else {
      lines[count].current -= speed;
      if (lines[count].current - speed <= start) {
        lines[count].drawing = true;
      }
    }
    if (cond) {
      ellipse(0, 0, cSize, cSize);
    } else {
      arc(
        sin(diff + frameCount / 30) * swingX,
        cos(diff + frameCount / 30) * swingY,
        cSize,
        cSize,
        start,
        lines[count].current,
      );
    }
    count++;
  }
}

function keyPressed() {
  // this will download the first 5 seconds of the animation!
  if (key === "s") {
    saveGif("mySketch", 5);
  }
}

