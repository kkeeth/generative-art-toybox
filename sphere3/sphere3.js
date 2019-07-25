const num = 2000;
const points = new Array(num);

function setup() {
  createCanvas(640, 420, WEBGL);
  pixelDensity(displayDensity());
  
  for (let i = 0; i < num; i++) {
    points[i] = new Point();
  }
  console.log(points)
}


function draw() {
  background(255);
  translate(0, 30, 0);
  rotateY(frameCount * 0.01);

  for (let i = 0; i < num; i++) {
    points[i].display();
  }
}
