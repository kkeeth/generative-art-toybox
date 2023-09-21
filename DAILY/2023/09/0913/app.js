const N = 5;
const baseW = 600;
const circumference = baseW / 1.2;
let circleDistance = baseW / 4.5;
let circleRadius = circumference / 2 - circleDistance * 1.2;
let mySlider;

function setup() {
  createCanvas(baseW, baseW);
  noStroke();
  frameRate(30);
  mySlider = createSlider(2, 9, 3, 1);
  mySlider.position(width, 100);
}

function draw() {
  translate(baseW / 2, baseW / 2);
  background(255);
  const value = mySlider.value();
  circleDistance = baseW / map(value, 2, 9, 4.5, 4);
  circleRadius =
    circumference / 2 - circleDistance * map(value, 2, 9, 1.1, 1.5);

  push();
  fill(0);
  rotate(-frameCount / 30);
  drawObjects(value);
  pop();
}

function drawObjects(n) {
  // arc(0, 0, circumference, circumference, HALF_PI, 3 * HALF_PI);
  // ellipse(0, -circumference / 4, circumference / 2);
  // fill(255);
  // ellipse(0, circumference / 4, circumference / 2);
  // fill(0);
  // ellipse(0, circumference / 4, circumference / 16);
  // fill(255);
  // ellipse(0, -circumference / 4, circumference / 16);
  for (let i = 0; i < n; i++) {
    // if (i === 0) {
    const is4th = n % 4 === 0;
    // const initial = is4th ? HALF_PI - TAU / N : -HALF_PI + TAU / N;
    const initial = (PI - TAU / n) / 2;
    const a = i * ((2 * PI) / n);

    push();
    rotate(a);
    // wheel image
    ellipse(
      circleDistance * cos(initial),
      circleDistance * sin(initial),
      circleRadius * 2,
    );

    // sickle image
    beginShape();
    // start point
    vertex(
      (circleDistance + circleRadius) * cos(initial),
      (circleDistance + circleRadius) * sin(initial),
    );

    // outer curve
    // const nextAngle = is4th ? HALF_PI - initial : PI - initial;
    const nextAngle = initial + TAU / n;
    for (let i = initial; i < nextAngle; i += 0.1) {
      vertex(
        (circleDistance + circleRadius) * cos(i),
        (circleDistance + circleRadius) * sin(i),
      );
    }

    // inner curve
    for (let i = nextAngle; i > initial; i -= 0.1) {
      vertex(
        // circleDistance * cos(i) - circleRadius * cos(initial),
        circleDistance * cos(i) - circleRadius * cos(initial),
        circleDistance * sin(i) + circleRadius * sin(initial),
      );
    }

    // end point
    vertex(
      circleRadius * cos(nextAngle) + circleDistance * cos(initial),
      circleRadius * sin(nextAngle) + circleDistance * sin(initial),
    );

    // return point === start point
    vertex(
      (circleDistance + circleRadius) * cos(initial),
      (circleDistance + circleRadius) * sin(initial),
    );
    endShape();

    pop();
  }
  // }
}

function keyPressed() {
  if (key === "s") {
    saveCanvas("mySketch", "png");
    // saveGif("mySketch", 3);
  }
}
