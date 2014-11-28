function ItemBlast()
{
	this.spawn = function()
	{
		this.maxBlastRadius = 400
		this.alpha = 0.25
		this.radius = 1000;
		this.x = center.x;
		this.y = center.y;
		this.blastSpeed = 20

		itemBlastArray[itemBlastArray.length] = this  
	};  

	this.updateBlast = function(modifier)
	{
		if(this.radius > 0)
		{
			this.radius -= this.blastSpeed
			this.alpha -= 0.01
		}
		else
		{
			itemBlastArray.splice(itemBlastArray.indexOf(this), 1)
		}
	};

	this.drawBlast = function()
	{
		//var al = 0.7-0.7*this.radius/this.maxBlastRadius
		ctx.fillStyle = "rgba(0, 0, 255,"+String(this.alpha)+")";
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
		ctx.fill();
		ctx.closePath();
	};
}