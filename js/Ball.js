function Ball() 
{
	this.spawn = function(speed)
	{
		this.crashing = false
		this.destroyed = false;
		this.expectedToCrash = true
		this.beingTargeted = false
		this.friendly = false
		this.radius = 7
		this.color = ballColor
		var rNumber = Math.random()
		if (test == true)
		{
			this.x = 0
			this.y = 0
		}
		else
		{
			this.x = circle.x + 700*Math.cos(rNumber* 2 * Math.PI)
	 		this.y = circle.y + 700*Math.sin(rNumber * 2 * Math.PI)
		}
		
	 	this.spawnX = this.x
	 	this.spawnY = this.y
	 	this.speed = speed
	    ballArray[ballArray.length] = this
		this.giveDirection((circle.x), (circle.y), true)
	}

	this.giveDirection = function(toX, toY, expectedToCrash)
	{
		this.flightCounter = 0;
		this.expectedToCrash = expectedToCrash
	 	this.startX = this.x
	 	this.startY = this.y
		   
	   	var dx = this.x - toX
	   	var dy = toY  - this.y

	   	this.a = dy/dx
	    this.b = this.y - this.a*this.x

	    this.absvector = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
		this.vector = [-this.speed * dx / this.absvector,-this.speed * dy / this.absvector];

		if (expectedToCrash == true)
		{
			var circleHit = circle.radius + 10
			var sx = this.x - circle.x
		   	var sy = circle.y  - this.y
		   	
			this.crashTime = -(Math.sqrt(-4*(this.vector[0]*this.vector[0]+this.vector[1]*this.vector[1])*(-(this.radius + circleHit)*(this.radius + circleHit)+sx*sx+sy*sy) + (2*sx*this.vector[0]+2*sy*this.vector[1])*(2*sx*this.vector[0]+2*sy*this.vector[1]))+2*sx*this.vector[0]+2*sy*this.vector[1])/(2*this.vector[0]*this.vector[0]+2*this.vector[1]*this.vector[1])
			var distance = Math.sqrt(dx * dx + dy * dy)

			this.crashAngle = -Math.atan2(dy, dx)
			this.testCrashAngle = 180 + 180 * -this.crashAngle / Math.PI
		}
	}

	this.turn = function()
	{
		this.destroyed = true;
		if (muted == false)
		{
			var snd = new Audio("sound/Interface1.wav");
			snd.play()
		}
		
		ballArray.splice(ballArray.indexOf(this), 1)
		turnedArray[turnedArray.length] = this
		this.friendly = true
		this.color = "#0000ff"

		//this.crashAngle -= Math.PI / 2

		this.circleCounter = 0
		this.circleSpeed = 1 / (100)
		this.orbitRadius = 1.5*circle.radius + 4*circle.radius*Math.random()

		this.expectedToCrash = false
		this.errorSpeedX = 0
		this.errorSpeedY = 0
	}

	this.moveIntoOrbit = function()
	{
		var refX = circle.x + this.orbitRadius*Math.cos(this.circleCounter + this.crashAngle)
		var refY = circle.y + this.orbitRadius*Math.sin(this.circleCounter + this.crashAngle)

		this.errorSpeedX = refX-this.x
		this.errorSpeedY = refY-this.y
	}

	this.testCollision = function(ball1)
	{
		var dx = ball1.x - this.x
		var dy = ball1.y - this.y

		var distance = Math.sqrt(dx*dx+dy*dy)

		if (distance < ball1.radius + this.radius)
		{
			return true
		}
		else
		{
			return false
		}
	}

	this.handleCollision = function(ball2, statusChange)
	{
		var dx = ball2.x-this.x
		var dy = this.x-ball2.y
		var distance = this.radius + ball2.radius

		var XaxisAngle = Math.atan2(dy, dx)
		var YaxisAngle = Math.atan2(dy, dx) - Math.PI/2

		var vx = ball2.vector[0]
		var vy = ball2.vector[1]

		var vBallAngle = Math.atan2(vy, vx)

		var vThisAngle = Math.atan2(this.vector[0], this.vector[1])

		var ballResult = YaxisAngle + vThisAngle
		var thisResult = YaxisAngle + vBallAngle

		if (statusChange == true)
		{
			if (turnedArray.indexOf(this) > -1)
			{

				turnedArray.splice(turnedArray.indexOf(this), 1)
			}
			ballArray[ballArray.length] = this
			this.color = "black"
			ball2.color = "black"
		}
		
		this.flightCounter = 0
		this.crashTime = 500	
		this.startX = this.x
		this.startY = this.y
		this.vector[0] = Math.cos(thisResult)
		this.vector[1] = Math.sin(thisResult)
		this.expectedToCrash = false
		
		ball2.expectedToCrash = false
		ball2.flightCounter = 0
		ball2.startX = ball2.x
		ball2.startY = ball2.y
		ball2.vector[0] = Math.cos(ballResult)
		ball2.vector[1] = Math.sin(ballResult)
		
	}

	this.handleCenterCollision = function()
	{
		//console.trace("Black Ball Center Collision")
		var dx = circle.x-this.x
		var dy = this.y-circle.y
		
		var distanceAngle = Math.atan2(dy, dx)
		var normalAngle = distanceAngle - Math.PI/2
		var crashAngleC = Math.atan2(this.vector[1],this.vector[0])
		var resultAngleC = 2*normalAngle-crashAngleC

		console.trace(normalAngle, crashAngleC) 
		
		this.vector[0]=Math.cos(resultAngleC)
		this.vector[1]=Math.sin(resultAngleC)

		this.flightCounter = 0
		this.startX = this.x
		this.startY = this.y
	}

	this.updateBall = function(ball)
	{
		ball.flightCounter += 1;
								
		ball.x = ball.startX + ball.vector[0] * ball.flightCounter;
		ball.y = ball.startY - ball.vector[1] * ball.flightCounter;

		if (ball.expectedToCrash == false)
		{
			//console.trace("Testing if crash")
			if (ball.testCollision(circle) == true)
			{
				//console.trace("Should crash")
				ball.handleCenterCollision()
			}
		}
         
        if (ball.flightCounter == Math.round(ball.crashTime) && ball.expectedToCrash == true)
        {
        	if(ball.crashing == false)
        	{
        		var Dangle = Math.abs(ball.crashAngle-pad.rotation)
			
				if(Dangle > Math.PI) 
				{
					Dangle = 2*Math.PI - Dangle
				}
				var ComboThen = comboThen
				var now = survivedSeconds
	        	if (Dangle < Math.PI/4)
	        	{
	        		ball.turn()
	        		
					if (survivedSeconds-ComboThen <= 1)
	        		{
	        			comboThen = now
	        			
	        			if (comboStage >= 1)
	        			{
	        				try
	        				{
	        					if (muted == false)
	        					{
	        						comboSounds[comboStage-1].play()
	        					}
	        					
	        				}
	        				catch (e)
	        				{
	        					console.trace(comboStage)
	        				}
	        			}
	        			comboStage += 1
	        			comboHits += 1  
	        			
						if(comboStage == 4)
	        			{
	        				if(circle.radius <= 50)
	        				{
	        					circle.radius += comboHits*5
	        					for (var yk = 0; yk < turnedArray.length; yk++)
	        					{
	        						turnedArray[yk].orbitRadius += comboHits*5
	        					}
	        					for (var bk = 0; bk < ballArray.length; bk++)
			        			{
			        				ballArray[bk].crashTime = Math.max(0, ballArray[bk].crashTime-comboHits*3)
			        			}
	        				}
	        			}
	        		}
	        		else
	        		{
	        			comboThen = now
	        			comboHits = 1
	        			comboStage = 1
	        		}
	        	}
	        	else
	        	{
	        		ball.crashing = true
	        		ball.crashTime += 5
	        	}
        	}
        	
        	else
        	{
        		if (now-ComboThen <= 1)
        		{
        			
        			comboStage += 1

        			if(comboStage == 4)
        			{
        				if(circle.radius <= 200)
        				{
        					circle.radius += comboHits*5
        					for (var uk = 0; uk < turnedArray.length; uk++)
        					{
        						turnedArray[uk].orbitRadius += comboHits*5
        					}
        					for (var bk = 0; bk < ballArray.length; bk++)
		        			{
		        				ballArray[bk].crashTime = Math.max(0, ballArray[bk].crashTime-comboHits*3)
		        			}
        				}
        			}

        			if (comboStage-comboHits == 2)
	        		{
	        			comboStage = 0
	        			comboHits = 0
	        		}
        		}
        		else
        		{
        			comboHits = 0
        			comboStage = 0
        		}

	        	circle.radius -= 5
	        	if (muted == false)
	        	{
	        		var haakon = new Audio("sound/LoseHealth.wav");
					haakon.play()
	        	}
	        	
	        	for (var wk = 0; wk < turnedArray.length; wk++)
        		{
        			turnedArray[wk].orbitRadius -= 5
        		}
        		for (var bk = 0; bk < ballArray.length; bk++)
        		{
        			ballArray[bk].crashTime += 3
        		}
	        	ballArray.splice(ballArray.indexOf(ball),1)
	        	pad.draw()

	        	if (circle.radius <= 0)
	        	{
	        		survivedSeconds = String(Math.floor((Date.now()-startTime)/1000))
					//meOverFunction(Math.floor((Date.now()-startTime)/1000));

					gameOver = true
	        		ballArray = []
	        		aoeArray = []
	        		turnedArray = []
	        		shotArray = []
	        		fighterArray = []
	        		center.x = 4000
	        		center.y = 4000
	        		circle.x = 4000
	        		circle.y = 4000
	        		circle.radius = 200
	        		pad.x = 4000
	        		pad.y = 4000
	        	}
        	}
        }
	}

 	this.draw = function() 
 	{
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.fill();
        ctx.closePath();
    };
}