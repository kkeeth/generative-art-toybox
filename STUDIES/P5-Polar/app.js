// See Also
// https://github.com/liz-peng/p5.Polar

function setup() {
  createCanvas(windowWidth, windowHeight)
}

function draw() {
  background(220)
    setCenter(width / 4, height/2);

  // polarLines( number, radius, distance, [callback] )
  stroke('#000')
  strokeWeight(0.3);
  polarLines(3, 200, 0);

  noStroke();

  // polarHexagon( angle, radius, [distance] )
  fill(175, 170, 238);
  polarHexagon(30, 50, 0);

  // polarEllipse( angle, widthRadius, heightRadius, [distance] )
  fill(252, 248, 200);
  polarEllipses(8, 10, 10, 100);
  fill(238, 175, 170);
  polarEllipses(12, 40, 40, 200);
  fill(252, 248, 200, 120);
  polarEllipses(5, 80, 80, 160);

  push()
    translate(width / 2, 0)
    polarEllipses(10, 0, 0, 100, function(...args) {
        fill(args[0]*40, args[0]*40, args[0]*40, 160);
        args[2] = args[0]*6;
        args[3] = args[0]*6;
        return args;
    });
  pop()
}
