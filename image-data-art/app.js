let img;
let cnv;

function preload() {
  img = loadImage('assets/kuwahara_yumemi.png');
  // img = loadImage('assets/kuwahara_yumemi_gray.png');
}

function setup() {
  cnv = createCanvas(img.width, img.height);
  // print(img.width, img.height);

  let newCanvasX = (windowWidth - img.width)/2;
  let newCanvasY = (windowHeight - img.height)/2;
  cnv.position(newCanvasX, newCanvasY);

  for (let col = 0; col < img.width; col += 2) {
    for (let row = 0; row < img.height; row += 2) {
      let xPos = col;
      let yPos = row;
      let c = img.get(xPos, yPos);

      push();
      translate(xPos, yPos);
      rotate(radians(random(360)));
      noFill();
      strokeWeight(random(5));
      point(xPos, yPos);
      strokeWeight(random(3));
      stroke(color(c));
      // curve(x1, y1, x2, y2, x3, y3, x4, y4);
      curve(xPos, yPos, sin(xPos) * random(60), cos(xPos) * sin(xPos) * 90, 0, 0, cos(yPos) * sin(xPos) * random(140), cos(yPos) * sin(yPos) * 50);
      pop();
    }
  }
}
