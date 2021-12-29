function setup() {
  createCanvas(w = windowHeight,w,WEBGL);
  frameRate(1);
  w = 800;
  n = 900;
  noLoop();
}

function draw() {
  background(255);
  noStroke();

// light
  r = random;
  v = createVector;
  myAl = ambientLight;
  myPl = pointLight;
  myDl = directionalLight;

//customize ( Material )
  myVal = random(4,20);//4-25
  myVal2 = random(-5,5);//4-25

// drawing
  for (i = -n; i < n; i++) {
      push();
      rotateX(r(n));
      rotateY(r(n));
      rotateZ(r(n));

//customize ( RGB Light Color )
      myPl(225, 250, 222, v(1000));
      myPl(202, 13, 125, v(100));
      // myDl(22, 250, 50, 0,myVal2,0);

//motif
      torus(n, w/10, r(w) > int(myVal)  ? int(myVal) : n);
      pop();
  }
}