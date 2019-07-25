size(700, 500);
background(255);
strokeWeight(1);
smooth();

float radius = 100;
int centx = width/2;
int centy = height/2;

// stroke(0, 30);
noFill();
// ellipse(centx, centy, radius*2, radius*2);

// stroke(20, 50, 70);
float x, y;
for (int i = 0; i < 50; i++) {
  float lastx = -999;
  float lasty = -999;
  float radiusNoise = random(10);
  radius = 10;
  stroke(random(255), random(255), random(255), 80);

  int startAngle = int(random(360));
  int endAngle = 1440 + int(random(1440));
  int angleStep = 5 + int(random(3));

  for (float ang = startAngle; ang <= endAngle; ang += angleStep) {
    radiusNoise += 0.05;
    radius += 0.5;
    // ノイズあり螺旋
    float thisRadius = radius + (noise(radiusNoise) * 200) - 100;
    float rad = radians(ang);
    x = centx + (thisRadius * cos(rad));
    y = centy + (thisRadius * sin(rad));

    if (lastx > -999) {
      line(x, y, lastx, lasty);
    }
    lastx = x;
    lasty = y;
  }

  saveFrame("screen-####.jpg");
}
