var laserColor = '#ff0000';

function Laser()
{
	this.spawn = function(angleError)
	{
		center.reloading = true
		center.redCounter = Math.min(center.redCounter + redLimit, 255)
		center.gunCounter = Math.min(center.gunCounter + gunLimit, 255)
		this.flightCounter = 0
		this.speed = 15

		this.color = laserColor
		this.radius = 4
		this.x = pad.x
		this.y = pad.y
		this.rotation = pad.rotation + angleError

		laserArray[laserArray.length] = this

	 	this.startX = this.x
	 	this.startY = this.y

		var dx = this.x - mouseX
	   	var dy = mouseY - this.y

	   	this.a = dy/dx
	    this.b = this.y - this.a*this.x

		this.vector = [this.speed * Math.cos(this.rotation),- this.speed * Math.sin(this.rotation)];
	}

	this.testCollision = function(ball2)
	{
		var dx = ball2.x - this.x
		var dy = ball2.y - this.y

		var distance = Math.sqrt(dx*dx+dy*dy)

		if (distance < ball2.radius + this.radius + 7)
		{
			return true
		}
		else
		{
			return false
		}
	}

	this.updateLaser = function(modifier)
	{
		this.flightCounter += 1;
						
		this.x = this.startX + this.vector[0] * this.flightCounter;
		this.y = this.startY - this.vector[1] * this.flightCounter;

		for (var y = 0; y < ballArray.length; y++)
		{
			var ball3 = ballArray[y]
			if (this.testCollision(ball3))
			{
				ballArray.splice(y, 1)
			}
		}
	}

	this.drawLaser = function()
	{
		
		ctx.fillStyle = this.color;
         
        ctx.beginPath();
        
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.fill();
         
        ctx.closePath();
	};
}