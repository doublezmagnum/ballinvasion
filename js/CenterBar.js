var centerBarLineWidth = 0.05
function CenterBar(type)
{
    this.represents = type
    this.color = items[type][3]
    this.startingAmount = powerUps[this.represents]
    this.barLength = 2*Math.PI
    this.position = Object.keys(center.centerBars).length
    center.centerBars[type] = this

    this.draw = function()
    {
        this.barLength = Math.max(this.barLength-1/this.startingAmount, 0)
        powerUps[this.represents] = (this.barLength/(2*Math.PI))*this.startingAmount

        if (this.barLength === 0)
        {
            delete center.centerBars[this.represents]

            for (var otherBar in center.centerBars)
            {
                if (center.centerBars[otherBar].position > this.position)
                {
                    center.centerBars[otherBar].position-=1
                }
            }
        }
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.arc(center.x, center.y, center.radius-(centerBarLineWidth*center.radius)*2*(this.position+1)-centerBarLineWidth*0.5*center.radius, 0, this.barLength, false);
        ctx.lineWidth = centerBarLineWidth*center.radius
        ctx.stroke();
    }
}