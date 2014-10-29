function AoEBlast()
{
	this.spawn = function()
	{
		if (muted == false)
		{
			var blastSound = new Audio('sound/Mail1.mp3')
			blastSound.play()
		}
		
		this.maxBlastRadius = 200
		this.color = "white"
		this.radius = circle.radius;
		this.x = circle.x;
		this.y = circle.y;
		this.blastSpeed = 10

		center.reloading = true
		center.redCounter = Math.min(center.redCounter + 200, 255)

		aoeArray[aoeArray.length] = this	
	};	

	this.updateBlast = function(blast)
	{
		if(blast.radius < blast.maxBlastRadius)
		{
			blast.radius += blast.blastSpeed

			for (var b = 0; b < ballArray.length; b++)
			{
				var ball5 = ballArray[b]
				var dx = ball5.x -circle.x
				var dy = ball5.y - circle.y
				var distance = Math.sqrt(dx * dx + dy * dy)
				if (distance <= blast.radius)
				{
					ballArray.splice(b, 1)
				}
			}
		}
		else
		{
			
			aoeArray.splice(aoeArray.indexOf(blast), 1)
		}
	}

	this.drawBlast = function()
	{
		ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.fill();
        ctx.closePath();
	};

}