let myShader;

function preload() {
  myShader = loadShader("shader.vert", "shader.frag");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  pixelDensity(1);
  shader(myShader);
  myShader.setUniform("u_resolution", [width, height]);
  rect(0, 0, width, height);
  resetShader();
}
