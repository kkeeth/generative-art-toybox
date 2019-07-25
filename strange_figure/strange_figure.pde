void setup() {
  size(700, 500);
  background(255);
  strokeWeight(1);
  smooth();

  float radius = 100;
  int centx = width/2;
  int centy = height/2;

  stroke(0, 30);
  noFill();
  ellipse(centx, centy, radius*2, radius*2);

  stroke(20, 50, 70);
  strokeWeight(1);

  float x, y;
  float noiseVal = random(10);
  float radVariance, thisRadius, rad;

  beginShape();

  fill(20, 50, 70, 50);
  for (float ang = 0; ang <= 360; ang ++) {
    noiseVal += 0.1;
    radVariance = 30 * customNoise(noiseVal);

    thisRadius = radius + radVariance;
    rad = radians(ang);
    x = centx + (thisRadius * cos(rad));
    y = centy + (thisRadius * sin(rad));

    curveVertex(x, y);
  }

  endShape();
  saveFrame("screen-####.jpg");

}

float customNoise(float value) {
  int count = int(value % 12);
println("count: "+count);
  return pow(sin(value), count);
}