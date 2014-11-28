function AoEBlast()
{
	this.spawn = function(x, y, radius, maxRadius, shouldIncreaseReload)
	{
		if (muted == false)
		{
			var blastSound = new Audio('sound/Mail1'+soundType)
			blastSound.play()
		}

		this.maxBlastRadius = maxRadius
		this.color = "white"
		this.radius = radius;
		this.x = x;
		this.y = y;
		this.blastSpeed = this.maxBlastRadius*0.02

		if(shouldIncreaseReload)
		{
			center.reloading = true
			center.redCounter = Math.min(center.redCounter + 200, 255)
		}



		aoeArray[aoeArray.length] = this  
	};  

	this.updateBlast = function(modifier)
	{
		if(this.radius < this.maxBlastRadius)
		{
			this.radius += this.blastSpeed

			for (var b = 0; b < ballArray.length; b++)
			{
				var ball5 = ballArray[b]
				var dx = ball5.x -this.x
				var dy = ball5.y - this.y
				var distance = Math.sqrt(dx * dx + dy * dy)
				if (distance <= this.radius)
				{
					ballArray.splice(b, 1)
					explodingArray[explodingArray.length] = ball5
					var blast = new AoEBlast();
					blast.spawn(ball5.x, ball5.y, ball5.radius, 100, false);
				}
			}

			for (var t = 0; t < wasteArray.length; t++)
			{
				var waste = wasteArray[t]
				var dx = waste.x - this.x
				var dy = this.y - waste.y
				var distance = Math.sqrt(dx * dx + dy * dy)
				if (distance <= this.radius)
				{
					var a = Math.atan2(dy, dx)
					waste.vector[0]+= 0.3*Math.cos(a)
					waste.vector[1]-= 0.3*Math.sin(a)
				}
			}

			for (var u = 0; u < turnedArray.length; u++)
			{
				var turned = turnedArray[u]
				var dx = turned.x - this.x
				var dy = this.y - turned.y
				var distance = Math.sqrt(dx * dx + dy * dy)
				if (distance <= this.radius)
				{
					turned.orbitRadius = Math.min(turned.orbitRadius+10, 0.5*canvas.height)
				}
			}
		}
		else
		{
			aoeArray.splice(aoeArray.indexOf(this), 1)
		}
	}

	this.drawBlast = function()
	{
		//console.trace(this.x, this.y, this.radius, this.maxBlastRadius, this.blastSpeed)
		var al = 0.7-0.7*this.radius/this.maxBlastRadius
		ctx.fillStyle = "rgba(255, 0, 0,"+String(al)+")";
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
		ctx.fill();
		ctx.closePath();
	};
}