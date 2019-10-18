size(500, 300);
background(255);
strokeWeight(5);
smooth();

float radius = 100;
int centx = 250;
int centy = 150;

stroke(0, 30);
noFill();
ellipse(centx, centy, radius*2, radius*2);

stroke(20, 50, 70);
float x, y;

for(float ang = 0; ang <= 360; ang += 5) {
    float rad = radians(ang);
    x = centx + (radius * cos(rad));
    y = centy + (radius * sin(rad));
    point(x, y);
}
