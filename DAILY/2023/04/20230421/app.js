const cp = ["#6209D4", "#08C6CD", "#FECD70", "#5E0792", "#E136A7", "#FF9F6F"];
const maxAttempts = 1000;
const NUM = 50;
let circles = [];

function setup() {
  createCanvas((W = windowHeight), W);
  background("beige");
  stroke(0);
  strokeWeight(2);
  createCircles();

  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      const circle1 = circles[i];
      const circle2 = circles[j];

      if (circle1.x === circle2.x || circle1.y === circle2.y) {
        line(circle1.x, circle1.y, circle2.x, circle2.y);
      }
    }
  }
  push();
  noStroke();
  for (let { x, y, color, size } of circles) {
    fill(color);
    circle(x, y, size);
  }
  pop();
}

function createCircles() {
  for (let i = 0; i < NUM; i++) {
    let circle;
    let isOverlap;
    do {
      const x = ~~random(width);
      const y = ~~random(height);
      const size = ~~random(10, 50);
      const color = random(cp);
      circle = { x, y, size, color };

      if (circles.length > 0 && random() < 0.2) {
        const otherCircle = random(circles);
        if (random() < 0.5) {
          circle.x = otherCircle.x;
        } else {
          circle.y = otherCircle.y;
        }
      }

      isOverlap = false;
      for (const otherCircle of circles) {
        if (
          dist(circle.x, circle.y, otherCircle.x, otherCircle.y) <=
          circle.size + otherCircle.size
        ) {
          isOverlap = true;
          break;
        }
      }
    } while (isOverlap);

    circles.push(circle);
  }
}

function keyPressed() {
  if (key === "s") {
    saveCanvas("mySketch", "png");
  }
}
