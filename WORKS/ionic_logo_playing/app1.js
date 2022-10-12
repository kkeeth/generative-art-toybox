const size = 5;
let img;
let cnv;
// let xoff = 0;

function preload() {
  img = loadImage("ionic-without-text.png");
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  // colorMode(HSB, 1);
  // frameRate(10);
}

function draw() {
  background(240);
  let newCanvasX = (windowWidth - img.width) / 2;
  let newCanvasY = (windowHeight - img.height) / 2;
  translate(newCanvasX, newCanvasY);

  for (let col = 0; col < img.width; col += size) {
    for (let row = 0; row < img.height; row += size) {
      let xPos = col;
      let yPos = row;
      let c = img.get(xPos, yPos);

      strokeWeight(size);
      /** change each points size */
      // strokeWeight(size * abs(sin(radians(frameCount + col))));

      /** change each points color */
      // if (
      //   c.find((el) => {
      //     return el !== 0;
      //   })
      // ) {
      //   stroke(abs(cos(radians(frameCount + col / size))), 0.8, 0.9);
      //   // stroke(abs(cos(radians(frameCount + row / size))), 0.8, 0.9);
      //   // stroke(abs(cos(xoff / 5)), 0.8, 0.9);
      // } else {
      //   stroke(color(c));
      // }
      stroke(color(c));
      point(xPos, yPos);
    }
    // xoff += 0.01;
  }
}
