var example2_rW = 30;

function example2_setup() {
  cnv = createCanvas(1280, 720);
}

function example2_draw() {
  push();
  
  noStroke();
  translate(example2_rW/2, example2_rW/2);
  
  background(30);
  for (let y = 0; y < camImg.height; y += example2_rW) {
    for (let x = 0; x < camImg.width; x += example2_rW) {
      var pixel = camImg.get(x+example2_rW/2, y+example2_rW/2);
      fill(pixel, 10);
      var sum = red(pixel) + green(pixel) + blue(pixel);
      var theta = map(sum, 0, 255*3, 0, TAU)
      var ratio = width / capture.width;
      push();
      translate(x * ratio, y * ratio);
      arc(0, 0, example2_rW*ratio, example2_rW*ratio, 0, theta);
      pop();
    }
  }
  
  pop();
}
