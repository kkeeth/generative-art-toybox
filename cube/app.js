function setup() {
  createCanvas(400, 400, WEBGL);
  //smooth();
  //rectMode(CENTER);
  //ellipseMode(CENTER);
}

function draw() {
  background(0);
  this.ambientLight(128, 128, 128);
  this.directionalLight(128, 128, 128, 0, 0, -1);

  push();
  rotateX(millis() / 1000);
  rotateY(millis() / 1000);
  rotateZ(millis() / 1000);
  //noStroke();
  box(100);
  pop();

  //push();
  //translate(100, 100, 0);
  //noStroke();
  //sphere();
  //pop();
  //stroke('#008080');
  //strokeWeight(2);

  //fill(255,0,0, 127);
  //noStroke();
  //rect(10, 10, 50, 50); // x, y, width, height

  //fill(0, 0, 255, 127);
  //noStroke();
  //push();
  //translate(30, 10);
  //rotate(radians(30));
  //scale(1.5, 3);
  //rect(10, 10, 50, 50); // x, y, width, height, r
  //pop();

  //translate(240, 0, 0);
  //push();
  //rotateZ(frameCount * 0.01);
  //rotateX(frameCount * 0.01);
  //rotateY(frameCount * 0.01);
  //torus(70, 20);
  //pop();

  //rect(width/2, height/2, 100, 100, 4); // x, y, width, height, r

  //point(50, 50);
  
  //ellipse(50, 50, 80, 80);
  
  //arc(100, 100, 80, 80, 0, PI); // radian
  //arc(100, 100, 80, 80, 0, radians(225), OPEN);
  //arc(100, 200, 80, 80, 0, radians(225), PIE);
  //arc(100, 300, 80, 80, 0, radians(225), CHORD);

  //textSize(24);
  //textFont("Helvetica");
  // text color
  //fill("#ffff00");
  //text("Hello World", 100, 100);
}
