var Player = {
	lifetime: 0,
	hp: 100,
	x: 0,
	y: 0,

	update: function() {
		this.x = ctx.canvas.width/2 + this.hp/2;
		this.y = ctx.canvas.height/2 + this.hp/2;
	},

	render: function() {

	}
};