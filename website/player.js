var Player = function (){
	lifetime = 0;
	hp = 0;
	x = 0;
	y = 0;
	padAngle = 0;

	this.load = function(xMid, yMid, health) {
		this.hp = health;
		this.x = xMid;
		this.y = yMid;

		document.addEventListener("mousemove", function(e) {
			var dx = e.clientX - (canvas.width * 0.5 + 50);
			var dy = canvas.height * 0.5 + 50  - e.clientY;

			var distance = Math.sqrt(dx * dx + dy * dy);

			if (dy > 0)
			{
				padAngle = Math.PI / 2 - Math.acos(dx / distance);
			}
			else
			{
				padAngle = Math.PI / 2 + Math.acos(dx / distance);
			}
		});
	}

	this.update = function() {
		
	};

	this.render = function(ctx) {
		this.drawPad(ctx);
		this.drawBall(ctx);
	};

	this.drawBall = function(ctx) {
		ctx.fillStyle="black";
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.hp, 0, Math.PI*2); 
		ctx.closePath();
		ctx.fill();
	};

	this.drawPad = function(ctx) {
		ctx.strokeStyle="#FF0000";
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.hp+10, (padAngle - (Math.PI / 4)) - Math.PI / 2, (padAngle + (Math.PI / 4)) - Math.PI / 2);
		ctx.stroke();
	};

	this.collidesWith = function(ball) {

	};
};