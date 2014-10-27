function Pad()
{
	this.draw = function()
	{
		ctx.fillStyle = ballColor;

		ctx.beginPath();
      	ctx.arc(pad.x, pad.y, circle.radius+5, pad.visualRotation - Math.PI/4, pad.visualRotation + Math.PI/4, false);
      	ctx.lineWidth = 10

      	ctx.strokeStyle = "#0000ff";
      	ctx.stroke();
	}
}