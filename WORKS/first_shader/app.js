let myShader;
let g;

function preload() {
  myShader = loadShader("shader.vert", "shader.frag");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  g = height / 8;
  noStroke();
  pixelDensity(1);
  shader(myShader);
  myShader.setUniform("u_resolution", [width, height]);
  rect(0, 0, width, height);
  resetShader();
  smooth();
}

function draw() {
  translate(-width / 2, -height / 2);
  for (let i = 0; i <= width; i += g) {
    for (let j = 0; j <= height; j += g) {
      ellipse(i, j, g * 1.1, g * 1.1);
    }
  }
}
