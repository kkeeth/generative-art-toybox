class PositionStock
{
	constructor(distThresh)
	{
		this.PosCache = [];
		this.distThresh = distThresh;
		this.capacity = 10;
	}

	checkInput(x, y)
	{
		if(this.PosCache.length == 0)
		{
			this.PosCache.push(createVector(x, y));
			return false;
		}

		let lastIndex = this.PosCache.length - 1;
		let lastPos = this.PosCache[lastIndex];

		let newPos = createVector(mouseX, mouseY);
		let distance = p5.Vector.dist(lastPos, newPos);


		if(distance > this.distThresh)
		{
			this.PosCache.push(newPos);
			if(this.PosCache.length > this.capacity)
			{
				this.PosCache.shift();
			}
			return true;
		}

		return false;
	}

	getDelta(mul = 1)
	{
		if(this.PosCache.length <= 1)
		{
			print("no Cache!");
			return;
		}
		let cp = this.PosCache[this.PosCache.length - 1];
		let pp = this.PosCache[this.PosCache.length - 2];

		return p5.Vector.sub(cp, pp).mult(mul);
	}

	reset()
	{
		this.PosCache = [];
	}

}
