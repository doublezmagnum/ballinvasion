var laserColor = '#ff0000';
var shotGunColor = '#ff0000';

function Laser()
{
	this.spawn = function(angleError, n, shotGun)
	{
		center.reloading = true
		center.redCounter = Math.min(center.redCounter + redLimit/n, 255)
		center.gunCounter = Math.min(center.gunCounter + gunLimit/n, 255)
		this.flightCounter = 0
		this.speed = 15

		if(shotGun == false)
		{
			this.color = laserColor
 		}

		else
		{
			this.color = shotGunColor
		}
		

		this.radius = 2
		this.x = pad.x
		this.y = pad.y
		this.rotation = pad.rotation + angleError

		this.width = 20
		this.height = 5

		laserArray[laserArray.length] = this

	 	this.startX = this.x
	 	this.startY = this.y

		var dx = this.x - mouseX
	   	var dy = mouseY - this.y

	   	this.a = dy/dx
	    this.b = this.y - this.a*this.x

		this.vector = [this.speed * Math.cos(this.rotation),- this.speed * Math.sin(this.rotation)];
	}

	this.updateLaser = function(modifier)
	{
		this.flightCounter += 1;
						
		this.x = this.startX + this.vector[0] * this.flightCounter;
		this.y = this.startY - this.vector[1] * this.flightCounter;
		
		if (Math.abs(this.x - center.x) > canvas.width/2 || Math.abs(this.y - center.y) > canvas.height/2)
		{
			laserArray.splice(laserArray.indexOf(this), 1)
		}

		for (var y = 0; y < ballArray.length; y++)
		{
			var ball3 = ballArray[y]
			if (collisionManager.testCollision(this, ball3, 7))
			{
				ballArray.splice(ballArray.indexOf(ball3), 1)
				explodingArray[explodingArray.length] = ball3
				var blast = new AoEBlast();
				blast.spawn(ball3.x, ball3.y, ball3.radius, 100, false);
			}
		}

		for (var ib = 0; ib < itemBoxArray.length; ib++)
		{
			var itemBox = itemBoxArray[ib]
			if (collisionManager.testCollision(this, itemBox, 7))
			{
				itemBox.destruct()
				itemBoxArray.splice(ib, 1)
			}
		}
		
	}
	this.drawLaser = function()
	{
		//ctx.fillStyle = this.color
		ctx.fillStyle = this.color
		ctx.save(); // save current state
 		ctx.translate(this.x,this.y); 
	    ctx.rotate(this.rotation);
	    ctx.fillRect(-this.width/2, -this.height, this.width,this.height) //NO CHANGES!!!
		ctx.restore(); 
    };
}