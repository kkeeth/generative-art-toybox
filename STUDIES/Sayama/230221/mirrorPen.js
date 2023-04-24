////////////////////////////////////


class MirrorPen
{
	constructor(n, sx, sy, srad, lineAngleAdjust, inputThreshDistance, inputSpeed, flipX, flipY, lineCol)
	{
		//初期位置
		this.x = sx;
		this.y = sy;
		this.rad = srad;

		// 回転複製数
		this.n = n;

		//移動スピード
		this.inputSpeed = inputSpeed;

		//線分の角度補正
		this.lineAngleAdjust = lineAngleAdjust;

		//インプットポジション
		this.inputPos = new PositionStock(inputThreshDistance);

		//
		this.gra = createGraphics(width, height);

		//移動量
		this.dv = createVector(0, 0);

		//反転設定
		this.flipX = flipX;
		this.flipY = flipY;

		//線の色
		this.lineCol = lineCol;
	}


	drawShape(drawFunc, x1, y1, x2, y2, flipX, flipY, target)
	{
		target.push();
		target.translate(width / 2, height / 2);
		target.rotate(this.rad);

		for(let i = 0; i < this.n; i++)
		{
			DrawFlip(drawFunc,x1, y1, x2, y2, flipX, flipY, target);
			target.rotate(TAU / this.n);
		}
		target.pop();
	}


	draw()
	{
		//インプット値の更新
		let success = this.inputPos.checkInput(mouseX, mouseY);
		if(!success)return;//移動判定がなければ終了

		//インプットの移動量を取得
		let newDv = this.inputPos.getDelta(this.inputSpeed);
		//角度補正をかけた移動量
		newDv = CulclateAdujustedAngleDelta(newDv.x, newDv.y, this.lineAngleAdjust);
		//前のフレームの移動量と方向を比較
		let r1 = atan2(newDv.y, newDv.x) ;
		let r2 = atan2(this.dv.y, this.dv.x);
		let deltaR = abs(r1 - r2);

		//方向が変化していたら描画
		if(r1 != r2 && deltaR != PI)
		{
			let x = this.x;
			let y = this.y;
			this.gra.noStroke();
			this.gra.fill(random(COLS));
			this.drawShape(df_ShapeAtLastPos, x, y, x, y, this.flipX, this.flipY, this.gra);
		}
		//移動量を更新
		this.dv = newDv.copy();

		//線を描画
		this.gra.stroke(this.lineCol);
		this.gra.strokeWeight(1);

		this.drawShape(df_Line, this.x, this.y, this.x + this.dv.x, this.y + this.dv.y, this.flipX, this.flipY, this.gra);

		this.x += this.dv.x;
		this.y += this.dv.y;
	}


	drawUI()
	{
		this.drawShape(df_CircleAtLastPos, this.x, this.y, this.x, this.y, false, true, UIGra);
	}

	inputReset()
	{
		this.inputPos.reset(this.gra, 0, 0);
	}
}




//////////////////

function DrawFlip(drawFunc, x1, y1, x2, y2, flipX, flipY, targetGra)
{
	drawFunc(x1, y1, x2, y2, targetGra);

	if(flipX == false && flipY == false)return;

	let scaleX = flipX == true ? -1 : 1;
	let scaleY = flipY == true ? -1 : 1;

	targetGra.push();
	targetGra.scale(scaleX, scaleY);

	drawFunc(x1, y1, x2, y2, targetGra);

	targetGra.pop();
}

//////////////////

function df_Line(x1, y1, x2, y2, targetGra)
{
	targetGra.line(x1, y1, x2, y2);
}

function df_CircleAtLastPos(x1, y1, x2, y2, targetGra)
{
	targetGra.circle(x2, y2, 8);
}


function df_ShapeAtLastPos(x1, y1, x2, y2, targetGra)
{
	targetGra.rectMode(CENTER);
	targetGra.ellipseMode(CENTER);

	const cs = min(width, height);
	const minSize = cs / 120;
	const maxSize = cs / 30;

	let w = map(noise(frameCount, 10000), 0, 1, minSize, maxSize);
	let h = map(noise(frameCount, 0), 0, 1, minSize, maxSize);
	let shape = noise(frameCount, 1000000) * 3;

	if(shape > 2)targetGra.triangle(x2, y2, x2 + w * 0.5, y2 + h, x2 - w * 0.5, y2 + h);
	else if(shape > 1)targetGra.rect(x2, y2, w, h);
	else targetGra.circle(x2, y2, min(w, h));
}

//////////////////


function CulclateAdujustedAngleDelta(dx, dy, adujustedAngle = 0)
{
	//0の時は角度補正なし
	if(adujustedAngle == 0)return createVector(dx, dy);


	let rad = atan2(dy, dx);
	let distance = dist(0, 0, dx, dy);

	rad = round(rad / adujustedAngle) * adujustedAngle;

	dx = distance * cos(rad);
	dy = distance * sin(rad);

	return createVector(dx, dy);
}
