const size = 6;
let img;
let cnv;
let xoff = 0;

function preload() {
  img = loadImage("ionic-without-text.png");
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  frameRate(10);
  colorMode(HSB, 1);
}

function draw() {
  background(100, 0.5);
  let newCanvasX = (windowWidth - img.width) / 2;
  let newCanvasY = (windowHeight - img.height) / 2;
  translate(newCanvasX, newCanvasY);

  for (let col = 0; col < img.width; col += size) {
    for (let row = 0; row < img.height; row += size) {
      if (floor(millis() / 250) === col) {
        strokeWeight(abs(cos(millis() / 500)) * size);
      }
      let xPos = col;
      let yPos = row;
      let c = img.get(xPos, yPos);

      push();
      noFill();
      if (
        c.find((el) => {
          return el !== 0;
        })
      ) {
        // stroke(random() * 255, random() * 255, random() * 255);
        // stroke(noise(xoff) * 255, noise(xoff) * 255, noise(xoff) * 255);
        // stroke(
        //   noise(xoff) * 255,
        //   noise(xoff + 0.01) * 255,
        //   noise(random()) * 255,
        // );
        stroke(abs(cos(xoff / 10)), 1, 1);
      } else {
        stroke(color(c));
      }
      point(xPos, yPos);
      pop();
    }
    xoff += 0.01;
  }
}
