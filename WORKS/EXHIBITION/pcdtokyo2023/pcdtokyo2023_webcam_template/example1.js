var example1_rW = 30;

function example1_setup() {
  cnv = createCanvas(windowWidth, windowHeight);
}

function example1_draw() {
  push();

  noStroke();

  background(30);
  for (let y = 0; y < camImg.height; y += example1_rW) {
    for (let x = 0; x < camImg.width; x += example1_rW) {
      var pixel = camImg.get(x + example1_rW / 2, y + example1_rW / 2);
      fill(pixel, 10);
      rect(x * 1.5, y * 1.5, example1_rW * 1.5, example1_rW * 1.5, 5);
    }
  }

  pop();
}
