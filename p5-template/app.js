function setup() {
  createCanvas((W = windowHeight - 50), W);
}

function draw() {
  background(255);
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5);
  }

  if (key === "c") {
    saveCanvas("mySketch", "png");
  }
}
