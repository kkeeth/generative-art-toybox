const items = [];
const NUM = 30;
const SPAN = 20;
const MAX = 600;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();

  for (let i = 0; i < NUM; i++) {
    items.push({
      color: color(random(160, 220), random(160, 220), random(160, 220)),
      size: i * SPAN,
      weight: random(SPAN),
    });
  }
}

function draw() {
  background(25, 20);

  push();
  fill(255);
  textSize(24);
  textAlign(CENTER);
  text("← Move the mouse left or right →", width / 2, 50);
  pop();

  translate(width / 2, height / 2);

  for (let item of items) {
    push();
    stroke(item.color);
    strokeWeight(item.weight);
    ellipse(0, 0, item.size);

    item.size += map(mouseX, 0, width, -3, 3);

    if (item.size > MAX) {
      item.size = 0;
      item.weight = random(SPAN);
    } else if (item.size < 0) {
      item.size = MAX;
      item.weight = random(SPAN);
    }

    pop();
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("myCanvas", 5);
  }
}
