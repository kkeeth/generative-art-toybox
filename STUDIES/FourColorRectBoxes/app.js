const ColorPalette = Object.freeze({
	"colorT": "#50d0d0",
  "colorM": "#be1e3e",
  "colorK": "#7967c3",
  "colorH": "#ffc639",
	"colorN": "#255699"
});

var trails = [];

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	background(color(ColorPalette.colorN));
}

function draw() {
	background(color(ColorPalette.colorN));

	camera(0, -400, 800);
	rotateY(frameCount*0.02);

	if(random(1) > 0.97){
		createFourRectBox();
	}

	for(var i = this.trails.length-1; i >= 0; i--){
		this.trails[i].update();
		this.trails[i].display();
		if(this.trails[i].isFinished()){
			this.trails.splice(i, 1);
		}
	}
}

function createFourRectBox(){
	var centerPos = p5.Vector.random3D().mult(random(width/2));

	trails.push(new RectTrail(centerPos.x, centerPos.y, centerPos.z-70, 100, color(ColorPalette.colorM), 0, false));
	trails.push(new RectTrail(centerPos.x, centerPos.y, centerPos.z+70, 100, color(ColorPalette.colorT), 0, false));
	trails.push(new RectTrail(centerPos.x-70, centerPos.y, centerPos.z, 100, color(ColorPalette.colorK), 0, true));
	trails.push(new RectTrail(centerPos.x+70, centerPos.y, centerPos.z, 100, color(ColorPalette.colorH), 0, true))
}
function RectTrail(x, y, z, len, col, a, isRotated){
    this.isReverse = (random(1) > 0.5);
    this.centerPos = createVector(x, y, z);
    this.col = col;
    this.len = len;
    this.vertices = [];
    this.angle = a;
    for(var i = 0; i < 4; i++){
        var angle = (TWO_PI/4)*i + QUARTER_PI;
        var vx = cos(angle + a) * this.len;
        var vy = sin(angle + a) * this.len;
        var vz = 0.0;
        this.vertices.push(createVector(vx, vy, vz));
    }
    this.pointPos = this.vertices[0].copy();
    this.time = 0.0;
    this.trail = [];
    this.isRotatedTheta = isRotated ? (random(1) > 0.5 ? HALF_PI : -HALF_PI) : (random(1) > 0.5 ? 0 : PI);

    this.update = function(){
        this.time += 1.0/30.0;

        if(0.0 <= this.time && this.time < 1.0){
            this.pointPos.x = lerp(this.vertices[0].x, this.vertices[1].x, fract(this.time));
            this.pointPos.y = lerp(this.vertices[0].y, this.vertices[1].y, fract(this.time));
            this.pointPos.z = lerp(this.vertices[0].z, this.vertices[1].z, fract(this.time));
            this.trail.push(this.pointPos.copy());
        }
        else if(1.0 <= this.time && this.time < 2.0){
            this.pointPos.x = lerp(this.vertices[1].x, this.vertices[2].x, fract(this.time));
            this.pointPos.y = lerp(this.vertices[1].y, this.vertices[2].y, fract(this.time));
            this.pointPos.z = lerp(this.vertices[1].z, this.vertices[2].z, fract(this.time));
            this.trail.push(this.pointPos.copy());
        }
        else if(2.0 <= this.time && this.time < 3.0){
            this.pointPos.x = lerp(this.vertices[2].x, this.vertices[3].x, fract(this.time));
            this.pointPos.y = lerp(this.vertices[2].y, this.vertices[3].y, fract(this.time));
            this.pointPos.z = lerp(this.vertices[2].z, this.vertices[3].z, fract(this.time));
            this.trail.push(this.pointPos.copy());
        }
        else if(3.0 <= this.time && this.time < 4.0){
            this.pointPos.x = lerp(this.vertices[3].x, this.vertices[0].x, fract(this.time));
            this.pointPos.y = lerp(this.vertices[3].y, this.vertices[0].y, fract(this.time));
            this.pointPos.z = lerp(this.vertices[3].z, this.vertices[0].z, fract(this.time));
            this.trail.push(this.pointPos.copy());
            this.pointAlpha = lerp(255, 0, fract(this.time));
        }
        else if(this.time > 7.0){
            this.trail.splice(0, 1);
        }
    }

    this.display = function(){
        smooth(true);
        rectMode(CENTER);
        strokeWeight(8);
        stroke(this.col);
        noFill();
        push();
        translate(this.centerPos.x, this.centerPos.y, this.centerPos.z);
        rotateY(this.isRotatedTheta);
        beginShape();
        for(var i = this.trail.length-1; i >= 0; i--){
            vertex(this.trail[i].x, this.trail[i].y, this.trail[i].z);
        }
        endShape();
        pop();
    }

    this.isFinished = function(){
        return (this.time > 4.0) && (this.trail.length == 0);
    }
}

