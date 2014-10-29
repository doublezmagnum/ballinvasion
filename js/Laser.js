var laserColor = '#ff0000';

function Laser()
{
	this.spawn = function(angleError)
	{
		center.reloading = true
		center.redCounter = Math.min(center.redCounter + 40, 255)
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

	this.updateLaser = function(laser)
	{
		laser.flightCounter += 1;
						
		laser.x = laser.startX + laser.vector[0] * laser.flightCounter;
		laser.y = laser.startY - laser.vector[1] * laser.flightCounter;

		for (var y = 0; y < ballArray.length; y++)
		{
			var ball3 = ballArray[y]
			if (laser.testCollision(ball3))
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