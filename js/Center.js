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
		console.trace("caller is " + arguments.callee.caller.name)
		circle.radius += radiusChange

		for (var uk = 0; uk < turnedArray.length; uk++)
        {
        	turnedArray[uk].orbitRadius += comboHits*5
        }
        for (var bk = 0; bk < ballArray.length; bk++)
		{
			var ballo = ballArray[bk]

			ballo.crashTime = Math.max(ballo.flightCounter+1, ballo.crashTime-Math.floor(radiusChange/ballo.speed))
		}
		for (var wk = 0; wk < wasteArray.length; wk++)
		{
			var wasted = wasteArray[wk]

			if ((wasted.x-circle.x)*(wasted.x-circle.x)+(wasted.y-circle.y)*(wasted.y-circle.y) < (wasted.radius+circle.radius)*(wasted.radius+circle.radius))
			{
				if (wasteArray.indexOf(wasted) != -1)
				{
					wasteArray.splice(wasteArray.indexOf(wasted),1)
				}
			}
		}
	}
}