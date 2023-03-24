const NUM = 50;
const maxSize = 150;
const ballSize = 20;
let items = [];
let r;

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(1);

  for (let i = 0; i < NUM; i++) {
    items.push({
      x: random(width),
      y: random(height),
      cy: random(height),
      count: ~~random(255),
    });
  }
}

function draw() {
  background(255, 30);

  items.forEach((item, index) => {
    let ballGradient = drawingContext.createLinearGradient(0, 0, width, height);
    ballGradient.addColorStop(0, "blue");
    ballGradient.addColorStop(1, "turquoise");
    drawingContext.fillStyle = ballGradient;
    drawingContext.strokeStyle = ballGradient;

    // ripple
    push();
    noFill();
    r = map(item.count, 0, 255, 0, maxSize);
    // stroke(0, 50, 255, map(item.count, 0, 255, 255, 0));
    ellipse(item.x, item.y, r, r / 3);

    items[index].count += 2;
    if (items[index].count >= 255) items[index].count = 0;
    pop();

    // circle
    push();
    noStroke();

    items[index].cy -= 1.5;
    ellipse(item.x, item.cy, map(item.cy, item.y, item.y - 200, 5, ballSize));

    if (item.y > 200 && items[index].cy < item.y - 200) {
      items[index].cy = item.y;
    }
    pop();
  });
}

function keyPressed() {
  // this will download the first 5 seconds of the animation!
  if (key === "s") {
    saveGif("mySketch", 5);
  }
}

