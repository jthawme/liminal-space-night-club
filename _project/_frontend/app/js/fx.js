





class FX
{
	constructor()
	{
		this.doc = document.documentElement;
		this.canvas = document.querySelector('#fx');
		this.ctx = this.canvas.getContext('2d');
		this.ctx.lineWidth = 0;
		this.ctx.fillStyle = '#202020';

		this.circle = new Path2D();
		this.pi2 = Math.PI * 2;
		this.scanRate = 0.05;

		this.phaseAOffset = 0.016;
		this.phaseA = 0;

		this.phaseBOffset = 0.020;
		this.phaseB = 0;

		this.currentMode = 0;
		this.modes = ['drawVertLines', 'drawHalftone', 'drawScanLines', 'drawHalftone'];

		this.animating = false;

		this.framedropCount = 0;
		this.framedrop = 2;

		this.scaleDelta = this.scaleRate;
		this.scaleRate = 0.1;
		this.scale = 0;

		this.dpiScale = 1;
	}

	maximizeCanvas()
	{
		this.canvas.width = this.dpiScale * this.doc.clientWidth * 1.5;
		this.canvas.height = this.dpiScale * this.doc.clientHeight * 1.5;
		this.clearCanvas();
	}

	clearCanvas()
	{
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	startAnimation()
	{
		if(!this.animating)
		{
			this.maximizeCanvas();
			this.animating = true;
			this.frameUpdate();
		}
	}

	stopAnimation()
	{
		this.animating = false;
	}

	frameUpdate()
	{
		this.framedropCount++;

		if(this.framedropCount > this.framedrop)
		{
			this.framedropCount = 0;

			this.scale += this.scaleDelta;

			if(this.scale > 1.0)
			{
				this.scale = 1;
				this.scaleDelta = 0;
			}

			if(this.scale <= 0)
			{
				this.scale = 0;
				this.currentMode++; // change drawing mode
				this.scaleDelta = this.scaleRate;
			}

			// draw stuff
			this.clearCanvas();
			this[this.modes[this.currentMode % this.modes.length]]();
		}

		if(this.animating) requestAnimationFrame(this.frameUpdate.bind(this));
	}

	changeMode()
	{
		// start scaling down to change drawing mode
		this.scaleDelta = 0 - this.scaleRate;
	}

	drawScanLines()
	{
		this.phaseA += this.phaseAOffset;
		let p = this.phaseA;
		let y = 0;
		let lineHeight = Math.round((this.dpiScale * this.doc.clientWidth) / 55);

		while(y < this.dpiScale * this.doc.clientHeight * 1.5)
		{
			let h = ((Math.sin(p) + 1) * 0.5) * lineHeight;
			this.fillRect(0, y, (this.dpiScale * this.doc.clientWidth * 1.5), h * this.scale);
			y += lineHeight;
			p += this.scanRate;
		}
	}

	drawVertLines()
	{
		this.phaseA -= this.phaseAOffset;
		let p = this.phaseA;
		let x = 0;
		let lineWidth = Math.round((this.dpiScale * this.doc.clientWidth) / 55);

		while(x < this.dpiScale * this.doc.clientWidth * 1.5)
		{
			let w = ((Math.sin(p) + 1) * 0.5) * lineWidth;
			this.fillRect(x, 0, w * this.scale, (this.dpiScale * this.doc.clientHeight * 1.5));
			x += lineWidth;
			p += this.scanRate;
		}
	}

	drawHalftone()
	{
		this.phaseA += this.phaseBOffset;
		this.phaseB += this.phaseAOffset;

		let dotSize = Math.round((this.dpiScale * this.doc.clientWidth) / 48);

		let x = -dotSize;
		let y = -dotSize;

		this.ctx.beginPath();

		while(y < (this.dpiScale * this.doc.clientHeight * 1.5)+dotSize)
		{
			x = -dotSize;
			while(x < (this.dpiScale * this.doc.clientWidth * 1.5)+dotSize)
			{
				let rad = (2 + Math.sin(this.phaseA + (x/this.dpiScale * 0.004)) + Math.sin(this.phaseB + (y/this.dpiScale * 0.004))) * 0.25;
				this.ctx.moveTo(x, y);
				this.ctx.arc(x + (Math.sin(this.phaseB + (x*0.01)) * 8), y + (Math.sin(this.phaseB + (y*0.01)) * 8), (0.6 + (dotSize * rad)) * this.scale, 0, this.pi2);
				x += dotSize;
			}
			y += dotSize;
		}
		this.ctx.fillStyle = '#000000';
		this.ctx.fill();
	}

	fillRect(x, y, w, h)
	{
		this.ctx.fillStyle = '#000000';
		this.ctx.fillRect(x, y, w, h);
	}
}





