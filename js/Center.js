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
}