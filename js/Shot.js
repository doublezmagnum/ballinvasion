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

	this.updateShot = function(shot)
	{
		shot.x += shot.speed * shot.xDif;
		shot.y += shot.speed * shot.yDif;
		if (shot.Target != false)
		{
			if (Math.sqrt((shot.Target.x-shot.x)*(shot.Target.x-shot.x)+(shot.y-shot.Target.y)*(shot.y-shot.Target.y)) < shot.parentPlane.sideLength + shot.Target.radius)
			{
				try
				{
					shot.parentPlane.hunting = false;
					shot.parentPlane.speed = shot.parentPlane.slowspeed;
				}
				catch (e)
				{
					trace("nf error");
				}
				
				if (shot.Target.destroyed == false)
				{
					shot.Target.destroyed = true
					if (ballArray.indexOf(shot.Target) != -1)
					{
						ballArray.splice(ballArray.indexOf(shot.Target), 1);
					}
					shotArray.splice(shotArray.indexOf(shot), 1)
					shot.parentPlane = false;
				}
			}			
		}
		else
		{
			for (var iu = 0; iu < ballArray.length; iu++)
			{
				var balll = ballArray[iu]
				if (Math.sqrt((balll.x-shot.x)*(balll.x-shot.x)+(shot.y-balll.y)*(shot.y-balll.y)) < 14 + balll.radius) // need crash radius constant
				{
					if (balll.destroyed == false)
					{
						balll.destroyed = true
						if (ballArray.indexOf(balll) != -1)
						{
							ballArray.splice(ballArray.indexOf(balll), 1);
						}
						shotArray.splice(shotArray.indexOf(shot), 1)
						shot.parentPlane = false;
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
