function AoEBlast()
{
	this.spawn = function()
	{
		if (muted == false)
		{
			var blastSound = new Audio('sound/Mail1.wav')
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

	this.drawBlast = function()
	{
		ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.fill();
        ctx.closePath();
	};

}