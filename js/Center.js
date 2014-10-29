function Center()
{
	this.reloading = false
	this.redCounter = 0
	this.draw = function()
	{
		ctx.fillStyle = centerColor;
        ctx.beginPath();
		ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2, false);
        ctx.fill();
        ctx.closePath();
	}

	this.handleRadiusChange = function(radiusChange)
	{
		circle.radius += radiusChange

		for (var uk = 0; uk < turnedArray.length; uk++)
        {
        	turnedArray[uk].orbitRadius += comboHits*5
        }
        for (var bk = 0; bk < ballArray.length; bk++)
		{
			var ballo = ballArray[bk]

			if (ballo.expectedToCrash == true)
			{
				ballo.crashTime = Math.max(ballo.flightCounter+1, ballo.crashTime-comboHits*3)
			}
			else
			{
				if ((ballo.x-circle.x)*(ballo.x-circle.x)+(ballo.y-circle.y)*(ballo.y-circle.y) < (ballo.radius+circle.radius)*(ballo.radius+circle.radius))
				{
					if (ballArray.indexOf(ballo) != -1)
					{
						console.trace("Removed ball")
						ballArray.splice(ballArray.indexOf(ballo),1)
					}
				}
			}
		}
	}
}