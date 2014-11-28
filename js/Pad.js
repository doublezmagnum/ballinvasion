var padLength = Math.PI
function Pad()
{
	this.x = center.x
	this.y = center.y
	this.padWidth = 10
	this.rotation = 0
	this.deltaRotation = 0
	this.draw = function()
	{
		ctx.beginPath();
		if (powerUps["biggerpaddle"] > 0)
		{
			this.padLength = padLength
			ctx.arc(this.x, this.y, center.radius+this.padWidth*0.5, this.rotation-0.5*this.padLength, this.rotation + 0.5*this.padLength, false);
			ctx.strokeStyle = "#0000ff";
		}
		else
		{
			this.padLength = padLength * 0.5

			ctx.arc(this.x, this.y, center.radius+this.padWidth*0.5, this.rotation-0.5*this.padLength, this.rotation + 0.5*this.padLength, false);
			ctx.strokeStyle = "#0000ff";
		}
      	ctx.lineWidth = this.padWidth
		ctx.stroke();	
	}
	
}