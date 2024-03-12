let cp;
let prevHeight;

function setup() {
  createCanvas((W = windowHeight - 50), W);
  background(255);
  noStroke();

  cp = random(colorPalette).colors;

  translate(0, W / 2);
  for (let i = 0; i < cp.length; i++) {

    fill(cp[i]);
    // stroke(cp[i]);
    let randomHeight = random(-W/2, W/2)
    prevHeight = randomHeight;
    let randomSize = random(3, 8);
    let weight = ~~random(1, 4);
    for (let j = 0; j < W; j++) {
      // line(j, randomHeight * sin(j/3), j-1, prevHeight * sin((j-1)/3))
      ellipse(j, randomHeight *  sin(j/weight), randomSize);
    }
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5);
  }

  if (key === "c") {
    saveCanvas("mySketch", "jpeg");
  }
}
