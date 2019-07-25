let _angnoise, _radiusnoise;
let _xnoise, _ynoise;
let _angle = -Math.PI/2;
let _radius;
let _strokeCol = 254;
let _strokeChange = -1;

function setup() {
  createCanvas(800, 600);
  smooth();
  background(255);
  frameRate(30);
  noFill();

  _angnoise = random(10);
  _radiusnoise = random(10);
  _xnoise = random(10);
  _ynoise = random(10);
}


function draw() {
  _radiusnoise += 0.005;
  _radius = (noise(_radiusnoise) * 550) + 1;

  _angnoise += 0.005;
  _angle += (noise(_angnoise) * 6) - 3;
  if (_angle > 360) { _angle -= 360; }
  if (_angle < 0) { _angle += 360; }

  _xnoise += 0.01;
  _ynoise += 0.01;
  let centerx = width/2 + (noise(_xnoise) * 100) - 50;
  let centery = height/2 + (noise(_ynoise) * 100) - 50;

  let rad = radians(_angle);
  let x1 = centerx + (_radius * cos(rad));
  let y1 = centery + (_radius * sin(rad));

  let opprad = rad + Math.PI;
  let x2 = centerx + (_radius * cos(opprad));
  let y2 = centery + (_radius * sin(opprad));

  _strokeCol += _strokeChange;
  if (_strokeCol > 254) { _strokeChange = -1; }
  if (_strokeCol < 0) { _strokeChange = 1; }

  stroke(_strokeCol, 60);
  strokeWeight(1);
  line(x1, y1, x2, y2);
}
