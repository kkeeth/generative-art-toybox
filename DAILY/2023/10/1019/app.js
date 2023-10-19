const NUM = 50;
const items = [];

function setup() {
  createCanvas((W = windowHeight - 50), W);
  // blendMode(ADD);
  noStroke();

  const span = width / 10;

  for (let x = span / 2; x < W; x += span) {
    for (let y = span / 2; y < W; y += span) {
      fill(random(160, 255), random(160, 255), random(160, 255));

      const cond = random();
      if (cond < 0.4) {
        ellipse(x, y, span / 2, span / 2);
        rect(x, y - span / 4, span, span / 2);
        ellipse(x + span, y, span / 2, span / 2);
      } else if (cond < 0.8) {
        ellipse(x, y, span / 2, span / 2);
        rect(x - span / 4, y, span / 2, span);
        ellipse(x, y + span, span / 2, span / 2);
      } else {
        ellipse(x, y, span / 2);
      }
    }
  }
  noLoop();
}

// function draw() {
//   background(0);

//   for (let i = 0; i < NUM; i++) {
//     push();
//     strokeWeight(map(items[i].z, -width, width / 2, 5, 1));
//     translate(items[i].x, items[i].y, items[i].z);
//     box(30, 30, 30, 0.1);

//     items[i].z += items[i].speed;
//     if (items[i].z > width / 2) {
//       items[i].x = random(-width / 3, width / 3);
//       items[i].y = random(-width / 3, width / 3);
//       items[i].z = -width;
//     }
//     pop();
//   }
// }

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5);
  }

  if (key === "c") {
    saveCanvas("mySketch", "png");
  }
}
