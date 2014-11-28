var Ballfactory = function() {

	cooldown = 1;
	currentCooldown = 0;

	this.update = function(deltatime) {
		this.calculateBps();

		currentCooldown += deltatime;
		if(currentCooldown >= cooldown) {
			this.spawn();
		}	
	}

	this.calculateBps = function() {
		//Increases bps every 2*pi seconds by 1
		var ballsPerSecond = Math.floor(totaltime / (2 * Math.PI * 1000));

		//the gamejam way to prevent divide by zero
		cooldown = 1 / (ballsPerSecond + 0.001);
	}

	this.spawn = function() {
		var tmpBall = new Ball();
		tmpBall.angle = Math.random() * Math.PI * 2;
		tmpBall.speed = 1 + Math.random() * 2;
		balls.push(tmpBall);
	}
}

var Ball = function() {
	x = 0;
	y = 0;
	radius = 7;
	speed = 0; //positive speed means the ball is approaching
	distance = 0;
	isFriendly = false;

	this.update = function(deltatime) {
		//check collision, if collide -> speed *= -1
		//check if collision with pad, if collide -> isFriendly = true

		if(isFriendly = false) {
		//angle = const.
			//distance -= speed * deltatime
			
		} else {
			//orbit around player (distance = semi-major axis/distance to player = const.)
			//angle += angularVelocity * deltatime;
		}

		//polar coords to cartesian
			//x = distance * cos(angle)
			//y = distance * sin(angle)
	};
	this.draw = function(ctx) {
		ctx.fillStyle = this.color;
         
        ctx.beginPath();
         
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.fill();
         
        ctx.closePath();
	};
};