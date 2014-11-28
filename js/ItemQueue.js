
function ItemQueue()
{
	this.queueItems = []
	this.changingPosition = false

	this.motionCounter = 0
	this.motionSpeed=5/(canvas.height*queueDistance)
	this.finalPositionScale = 1.5


	/*this.addItem = function(effect, image)
	{
		var itemSymbol = new itemSymbol(effect, image)
		this.queueItems[this.queueItems.length] = itemSymbol
	}*/

	this.queueMovement = function()
	{
		this.changingPosition = true;
		for (var n = 0; n < this.queueItems.length; n++)
		{
			var queueItem = this.queueItems[n]
			if (n == 0)
			{
				queueItem.planMotion("up", center.radius/(canvas.height/20))
			}
			else if (n == 1)
			{
				queueItem.planMotion("left", this.finalPositionScale)
			}
			else
			{
				queueItem.planMotion("left", 1)
			}
		}
	}

	this.update = function()
	{
		if (this.changingPosition)
		{
			this.queueItems.forEach(function(item) 
			{
	        	item.update()
	    	});

			this.motionCounter+= this.motionSpeed

			if (this.motionCounter>Math.PI/2)
			{
				this.queueItems.forEach(function(item) 
				{
		        	item.stopMotion()
		    	});
		    	
		    	this.changingPosition = false
		    	this.motionCounter = 0
			}
		}
	}

	this.draw = function()
	{
		this.queueItems.forEach(function(item) 
		{
        	item.draw()
    	});
	}
}
