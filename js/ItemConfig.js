

//spawns items
function ItemManager()
{
	this.decideItem = function()
	{
		var totalP = 0
		var item;

		for(item in items) 
		{
			if (items[item][2])
			{
				totalP += items[item][1]
			}
		}

		var randomSelection = Math.floor(totalP*Math.random())
		var Pcounter = 0

		for(item in items) 
		{
			Pcounter += items[item][1]
			if (Pcounter > randomSelection)
			{
				return [items[item][0], item]
			}
		}
	}
}

// items

var slowMotion = function()
{
	powerUps["slowMotion"] += 30
}

var shotgun = function()
{
	powerUps["shotgun"] += 30
}

var biggerpaddle = function()
{
	powerUps["biggerpaddle"] += 30
}

var fighter = function()
{
	var newFighter = new Fighter()
	newFighter.spawn()
}

var blast = function()
{
	var newBlast = new AoEBlast()
	newBlast.spawn(center.x, center.y, 0, 400, false)
}

var items=
{
	//  Function, probability, active, color, usingBar, displayBlastEffect
	"slowMotion": [slowMotion, 10, true, "#00CED1", true, true],
	"shotgun": [shotgun, 10, true, "#9400D3", true, true],
	"fighter": [fighter, 10, true, "green", false, true],
	"blast": [blast, 10, true, "blue", false, false],
	"biggerpaddle": [biggerpaddle, 10, true,"#AA00FF", true, true]
}
