var queueDistance = 0.2
function ItemSymbol(effect, type)
{
	this.itemType = type
	this.img = new Image()
	this.img.src = "images/"+type+".png" // path depending on type

	this.effect = effect

	this.y = canvas.height * 0.9	

	if (itemQueue.queueItems.length == 0)
	{
		this.scale = itemQueue.finalPositionScale
		this.x = canvas.width/2
		if (itemQueue.changingPosition)
		{
			this.vector=[0, 1]
		}	
	}

	else if (itemQueue.queueItems.length == 1)
	{
		this.scale = 1
		this.x = itemQueue.queueItems[itemQueue.queueItems.length-1].startX+ canvas.height*queueDistance
		if (itemQueue.changingPosition)
		{
			this.vector=[1, 0]
		}
	}

	else
	{
		if (itemQueue.changingPosition)
		{
			this.x = itemQueue.queueItems[itemQueue.queueItems.length-1].startX+ canvas.height*queueDistance
		}
		else
		{
			this.x = itemQueue.queueItems[itemQueue.queueItems.length-1].x+ canvas.height*queueDistance
		}
		this.scale = 1
		if (itemQueue.changingPosition)
		{
			this.vector=[1, 0]
		}
	}

	this.width = canvas.height/15
	this.height = canvas.height/15

	this.alpha = 1

	this.startX = this.x
	this.startY = this.y

	this.refScale = this.scale

	itemQueue.queueItems[itemQueue.queueItems.length] = this

	this.planMotion = function(direction, toScale)
	{
		this.refScale = toScale

		this.startX = this.x
		this.startY = this.y

		if(direction == "up")
		{
			this.vector=[0, 1]
			
		}
		else if (direction == "left")
		{
			this.vector=[1, 0]
		}
	}

	this.update = function()
	{
		this.x = this.startX-this.vector[0]*canvas.height*queueDistance*Math.sin(itemQueue.motionCounter)
		this.y = this.startY-this.vector[1]*2*canvas.height*queueDistance*Math.sin(itemQueue.motionCounter)

		if(this.vector[1] != 0)
		{
			this.alpha -= 0.5*itemQueue.motionSpeed
		}

		this.scale += 0.04*(this.refScale-this.scale)
	}

	this.stopMotion = function()
	{
		this.vector[0]=0
		this.refScale = this.scale
		if (this.vector[1] != 0)
		{
			this.effect()
			itemQueue.queueItems.splice(0, 1)
		}

		if (items[this.itemType][4])
		{
			try
			{
				center.centerBars[this.itemType].barLength = 2*Math.PI
				center.centerBars[this.itemType].startingAmount = powerUps[this.itemType]
			}
			catch(e)
			{
				var centerBar = new CenterBar(this.itemType)
			}
		}

		if (items[this.itemType][5])
		{
			var itemBlast = new ItemBlast()
			itemBlast.spawn()
		}		
	}

	this.draw = function()
	{
		ctx.globalAlpha = this.alpha
		ctx.drawImage(this.img, this.x-this.scale*this.width*0.5, this.y-this.scale*this.height*0.5, this.scale*this.width, this.scale*this.height)
		ctx.globalAlpha = 1
	}
}
