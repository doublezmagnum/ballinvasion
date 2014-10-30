function Shot()
{
	this.spawn = function(xStart, yStart, xDif, yDif, rot, Target, pPlane)
	{
		this.Error = 0.2
		this.speed = 15
		this.x = xStart
		this.y = yStart
		this.xStart = xStart 
		this.yStart = yStart 
		this.xDif = xDif + Math.random()*this.Error
		this.yDif = yDif- Math.random()*this.Error
		this.rotation = rot
		this.Target = Target
		this.parentPlane = pPlane

		shotArray[shotArray.length] = this
	};	

	this.updateShot = function(modifier)
	{
		this.x += this.speed * this.xDif;
		this.y += this.speed * this.yDif;
		if (this.Target != false)
		{
			if (Math.sqrt((this.Target.x-this.x)*(this.Target.x-this.x)+(this.y-this.Target.y)*(this.y-this.Target.y)) < this.parentPlane.sideLength + this.Target.radius)
			{
				try
				{
					this.parentPlane.hunting = false;
					this.parentPlane.speed = this.parentPlane.slowspeed;
				}
				catch (e)
				{
					trace("nf error");
				}
				
				if (this.Target.destroyed == false)
				{
					this.Target.destroyed = true
					if (ballArray.indexOf(this.Target) != -1)
					{
						ballArray.splice(ballArray.indexOf(this.Target), 1);
					}
					shotArray.splice(shotArray.indexOf(this), 1)
					this.parentPlane = false;
				}
			}			
		}
		else
		{
			for (var iu = 0; iu < ballArray.length; iu++)
			{
				var balll = ballArray[iu]
				if (Math.sqrt((balll.x-this.x)*(balll.x-this.x)+(this.y-balll.y)*(this.y-balll.y)) < 14 + balll.radius) // need crash radius constant
				{
					if (balll.destroyed == false)
					{
						balll.destroyed = true
						if (ballArray.indexOf(balll) != -1)
						{
							ballArray.splice(ballArray.indexOf(balll), 1);
						}
						shotArray.splice(shotArray.indexOf(this), 1)
						this.parentPlane = false;
					}
				}
			}	
		}
	}

	this.drawShot = function()
	{

		ctx.fillStyle = "blue"
         
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, Math.PI*2, false);
        ctx.fill();
         
        ctx.closePath();
	};
	
}
