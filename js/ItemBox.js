var startAngleError = Math.PI/6
var gravity = 1500
var speed =1
function ItemBox() 
{
	this.spawn = function()
	{
		this.radius = 15
		this.carriedItem = itemManager.decideItem()

		var rNumber = Math.random()
		this.x = center.x + spawnDistance*Math.cos(rNumber* 2 * Math.PI)
	 	this.y = center.y + spawnDistance*Math.sin(rNumber * 2 * Math.PI)
	 	var dx = center.x-this.x
	 	var dy = center.y-this.y

	 	this.a = Math.atan2(dy, dx)

	 	var rn = Math.random()-0.5

	 	this.a += Math.abs(rn)/rn * startAngleError

	 	this.vector = [speed*Math.cos(this.a), speed*Math.sin(this.a)]

	 	itemBoxArray[itemBoxArray.length] = this
	}

	this.update = function(modifier)
	{
		var dx = this.x-center.x
	 	var dy = center.y-this.y
	 	var distanceSquared = dx*dx+dy*dy

	 	this.a = Math.atan2(dx, dy)
		this.vector[0]-= gravity*Math.sin(this.a)/distanceSquared
		this.vector[1]+= gravity*Math.cos(this.a)/distanceSquared
		this.x += this.vector[0]
		this.y += this.vector[1]

		/*

		if (Math.abs(this.x - center.x) > canvas.width/2 || Math.abs(this.y - center.y) > canvas.height/2)
		{
			itemBoxArray.splice(itemBoxArray.indexOf(this), 1)
		}*/
	} 

	this.destruct = function() 
 	{
 		//console.trace(this.carriedItem)
 		var itemSymbol = new ItemSymbol(this.carriedItem[0], this.carriedItem[1])
    };

	this.draw = function() 
 	{
 		ctx.fillStyle = 'rgba('+String(f)+','+String(g)+','+'0'+','+String(1)+')';
 		ctx.fillRect(this.x+0.5*this.radius, this.y+0.5*this.radius, this.radius, this.radius)
    };
}


