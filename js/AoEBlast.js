function AoEBlast()
{
	this.spawn = function()
	{
		if (muted == false)
		{
			var blastSound = new Audio('sound/Mail1'+soundType)
			blastSound.play()
		}
		
		this.maxBlastRadius = 300
		this.color = "white"
		this.radius = center.radius;
		this.x = center.x;
		this.y = center.y;
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
				var dx = ball5.x -center.x
				var dy = ball5.y - center.y
				var distance = Math.sqrt(dx * dx + dy * dy)
				if (distance <= blast.radius)
				{
					ballArray.splice(b, 1)
				}
			}
			for (var t = 0; t < wasteArray.length; t++)
			{
				var waste = wasteArray[t]
				var dx = waste.x - center.x
				var dy = center.y - waste.y
				var distance = Math.sqrt(dx * dx + dy * dy)
				if (distance <= blast.radius)
				{
					var a = Math.atan2(dy, dx)
					waste.vector[0]+= 0.3*Math.cos(a)
					waste.vector[1]-= 0.3*Math.sin(a)
				}
			}
			for (var u = 0; u < turnedArray.length; u++)
			{
				var turned = turnedArray[u]
				var dx = turned.x - center.x
				var dy = center.y - turned.y
				var distance = Math.sqrt(dx * dx + dy * dy)
				if (distance <= blast.radius)
				{
					turned.orbitRadius += 10
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
		var al = 0.7-0.7*this.radius/this.maxBlastRadius
		console.trace(al)
		ctx.fillStyle = "rgba(255, 0, 0,"+String(al)+")";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.fill();
        ctx.closePath();
	};

}