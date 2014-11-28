

//spawns items
function ItemManager()
{
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

	this.decideItem = function()
	{
		var item = [{
	//  Function, probability, active, color, usingBar, displayBlastEffect
	"slowMotion": [slowMotion, 5, true, "#00CED1", true, true],
	"shotgun": [shotgun, 10, true, "#9400D3", true, true],
	"fighter": [fighter, 10, true, "green", false, true],
	"blast": [blast, 10, false, "#AA00FF", false, false],
	"biggerpaddle": [biggerpaddle, 10, true,"#AA00FF", true, true]}];
		for(var x = 3; x > 0; x--){
		item.push("slowMotion")	
		}	
		for(var z = 3; z > 0; z--){
			item.push("shotgun")
		}
		for(var y = 2; y > 0; y--){
			item.push("biggerpaddle")
		}
		for(var v = 4; v > 0; v--){
			item.push("fighter")
		}
		for(var q = 6; q > 0; q--){
			item.push("blast")
		}
		this.carriedItem = (item[Math.floor(Math.random())])
	}
}


