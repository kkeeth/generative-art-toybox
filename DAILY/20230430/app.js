const cp = [
  "#7B51A5",
  "#1B9C93",
  "#EF84C1",
  "#FA9920",
  "#EA4348",
  "#76A4E2",
  "#8BAD49",
];
let angle = 0;
let numSpheres = 200;
let radius = 100;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(25);
  translate(0, -height / 2);

  rotateY(angle * 0.2);
  // ambientLight(255);
  lights();

  for (let i = 0; i < numSpheres; i++) {
    let angle = map(i, 0, numSpheres, 0, TAU * 5);
    let spiralX1 = sin(angle) * (radius + i);
    let spiralY1 = height - i * 5;
    let spiralZ1 = cos(angle) * (radius + i);

    angle = map(i + 1, 0, numSpheres, 0, TAU * 5);
    spiralX2 = sin(angle) * (radius + (i + 1));
    spiralY2 = height - (i + i) * 3;
    spiralZ2 = cos(angle) * (radius + (i + 1));

    // グラデーションを適用
    let colorHue = map(spiralY1, 0, height, 0, 255);
    let col = color(colorHue, 180, 255);
    stroke(col);

    push();
    translate(spiralX1, spiralY1, spiralZ1);
    // rotateY(angle);
    // rotateX(angle);

    // line(spiralX1, spiralY1, spiralZ1, spiralX2, spiralY2, spiralZ2);
    sphere(5);
    pop();
    push();
    line(spiralX1, spiralY1, spiralZ1, spiralX2, spiralY2, spiralZ2);
    translate(spiralX2, spiralY2, spiralZ2);
    // rotateY(angle);
    // rotateX(angle);

    sphere(5);

    pop();
  }

  angle += 0.02;
}

function keyPressed() {
  if (key == "s") {
    saveGif("mySketch", 5);
  }
}
