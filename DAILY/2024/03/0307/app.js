

function setup() {
  createCanvas((W = windowHeight - 50), W, WEBGL);
  background(255);
  noStroke();
  
  for (let i = 0; i < 5e3; i++) {
    const v = p5.Vector.random3D().mult(W/2);
    fill(0, map(dist(0, 0, v.x, v.y), 0, W/2, 200, 0));
    ellipse(v.x, v.y, 5);
  }

  // for (let i = 0; i < 10; i++) {
  //   strokeWeight()
  // }
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5);
  }

  if (key === "c") {
    saveCanvas("mySketch", "jpeg");
  }
}
