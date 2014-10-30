function Fighter()
{
	this.spawn = function()
	{
		this.color = "red"
		this.sideLength = 20

		this.hunting = false;
		this.lasts = 5 //seconds
		this.leaving = false;
		this.ready = false
		this.Target = false;
		this.then = Date.now();
		this.slowspeed = 0.7;
		this.maxSpeed = 0.9;
		this.speed = this.slowspeed;
		this.reload = 0;
		this.reloadCounter = 30;
		this.huntingRange = Math.pow(600, 2);
		this.shotsFired = false;
		
		this.vector_x = 0;
		this.vector_y = 0;
		this.absvector = 0;
		this.radius = 5;

		var dx = -center.x + mouseX
	   	var dy = center.y - mouseY
	   	var distance = Math.sqrt(dy*dy+dx*dx)

	   	this.rotation = -Math.atan2(dy, dx) + (Math.PI/2)

		this.vector = [this.speed * Math.cos(-Math.atan2(dy, dx)), this.speed * Math.sin(-Math.atan2(dy, dx))];

		this.x = center.x + center.radius * Math.cos(this.rotation-Math.PI/2)
		this.y = center.y + center.radius * Math.sin(this.rotation-Math.PI/2)
			
		this.rotAks = 0.02;
		this.degrees = 0;

		fighterArray[fighterArray.length] = this

	};	

	this.updateFighter = function(modifier)
	{
		if (this.leaving == false)
		{
			if (this.hunting == true && this.ready == true)
			{
				this.calculateRoute(this.Target, modifier);
			}
			else 
			{
				this.searchForTarget(modifier);
			}
		}
		else
		{
			this.disAppear()
		}	
	}

	this.calculateRoute = function(target, modifier)
	{
		this.Target = target

		if (target.friendly == true || target.destroyed == true || target.expectedToCrash == false)
		{
			this.Target = false
			this.hunting = false
			return
		}
		target.beingTargeted = false
		
		this.vector_x = this.Target.x - this.x;
		this.vector_y = this.Target.y - this.y;
			
		this.absvector = Math.sqrt(Math.pow((this.vector_x),2) + Math.pow((this.vector_y),2));
		this.vector = [this.speed*this.vector_x / this.absvector,this.speed*this.vector_y / this.absvector];
		
		this.x += this.vector[0];
		this.y += this.vector[1];
			
		if (this.absvector < 270)
		{
			this.speed = this.slowspeed;
		}
			
		else
		{
			this.speed = this.maxSpeed;
		}
			
		if (this.absvector < 300)
		{
			this.reload += 1;
			if (this.reload == this.reloadCounter)
			{
				if (muted == false)
				{
					var haakon2 = new Audio("sound/InterFace2"+soundType);
					haakon2.play()
				}
				
				var shot = new Shot();
				shot.spawn(this.x, this.y, this.vector[0], this.vector[1], this.rotation, this.Target, this)
				this.shotsFired = true; 	
				this.reload = 0;
			}
		}
			
		this.rotation = Math.PI/2 + Math.atan2(this.vector[1], this.vector[0])// + (Math.PI/2) * (Math.abs(this.vector[0])/this.vector[0]);
	
		if (Math.floor((Date.now()-this.then)/1000) == this.lasts)
		{
			this.leaving = true
			this.flightCounter = 0

			var dx = -center.x + mouseX
	   		var dy = center.y - mouseY
			
			this.degrees = Math.atan2(dy, dx);
		}
	};	


	this.searchForTarget = function(modifier)
	{
		this.vector[0] = this.vector[0]*0.99
		this.vector[1] = this.vector[1]*0.99

		if(Math.sqrt(this.vector[0]*this.vector[0]+this.vector[1]*this.vector[1]) < 0.2)
		{
			this.ready = true
		}
		this.x += this.vector[0];
		this.y += this.vector[1];

		var flightCounterIndex = 1000

		for (var cc = 0; cc < ballArray.length; cc++)
		{
			var ball6 = ballArray[cc]
			if (ball6.beingTargeted == false && ball6.flightCounter < flightCounterIndex && Math.pow((ball6.x - this.x),2) + Math.pow((this.y - ball6.y),2) < this.huntingRange)
			{
				flightCounterIndex = ball6.flightCounter;
				this.Target = ball6;
			}
		}
		
		if (flightCounterIndex != 1000)
		{
			this.hunting = true;
		}

		if (Math.floor((Date.now()-this.then)/1000) == this.lasts)
		{
			this.leaving = true
			this.flightCounter = 0

			var dx = -center.x + mouseX
	   		var dy = center.y - mouseY
			
			this.degrees = Math.atan2(dy, dx);
		}

	}

	this.disAppear = function()
	{	
		this.flightCounter+= 1
		var er = this.degrees-this.rotation

		this.rotation -= er*this.rotAks
		this.vector[0] = this.speed * Math.cos(this.rotation)
		this.vector[1] = this.speed * Math.sin(this.rotation)

		this.x += this.vector[0]
		this.y += this.vector[1]

		if (this.flightCounter % 9 == 0)
		{
			var nShot = new Shot()
			nShot.spawn(this.x, this.y, this.vector[0], this.vector[1], this.rotation, false, this)
		}

		else if(this.flightCounter == 1000)
		{
			fighterArray.splice(fighterArray.indexOf(this))
		}
	};
	

	this.drawFighter = function()
	{	
		var v = [[0,-this.sideLength],[-this.sideLength,0],[this.sideLength,0]]
		ctx.save(); 
		ctx.fillStyle = "green"

    	ctx.translate(this.x,this.y);
	    ctx.rotate(this.rotation);
	    ctx.beginPath();
	    ctx.moveTo(v[0][0],v[0][1]);
	    ctx.lineTo(v[1][0],v[1][1]);
	    ctx.lineTo(v[2][0],v[2][1]);
	    ctx.closePath();
	    ctx.fill();
	    ctx.restore();
	};
	
}