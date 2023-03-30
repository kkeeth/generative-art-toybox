function setup() {
  createCanvas(400, 400)
}

function draw() {
  background(220)
}

function keyPressed() {
  // this will download the first 5 seconds of the animation!
  if (key === 's') {
    saveGif('mySketch', 5);
  }
}
