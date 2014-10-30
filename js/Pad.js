function Pad()
{
	this.draw = function()
	{
		ctx.strokeStyle = "#0000ff";
		ctx.beginPath();
      	ctx.arc(pad.x, pad.y, center.radius+5, pad.visualRotation - Math.PI/4, pad.visualRotation + Math.PI/4, false);
      	ctx.lineWidth = 10
		ctx.stroke();
	}
}