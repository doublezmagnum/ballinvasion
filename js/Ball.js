var ballSpeed = 4
var maxAngleOffset = Math.PI/6
var spawnDistance = 1000
var speedMod = 0.5
var ballColor = '#CF0000';

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
		this.alpha = 1

		this.red = '207'
		this.green = '0'
		this.blue = '0'

		var rNumber = Math.random()
		if (test == true)
		{
			this.x = 0
			this.y = 0
		}
		else
		{
			this.x = center.x + spawnDistance*Math.cos(rNumber* 2 * Math.PI)
	 		this.y = center.y + spawnDistance*Math.sin(rNumber * 2 * Math.PI)
		}
		
	 	this.spawnX = this.x
	 	this.spawnY = this.y
	 	this.speed = speed
	    ballArray[ballArray.length] = this
		this.giveDirection((center.x), (center.y), true)
	}

	this.giveDirection = function(toX, toY, expectedToCrash)
	{
		this.flightCounterSpeed = 1
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
			var circleHit = center.radius + 10
			var sx = this.x - center.x
		   	var sy = center.y  - this.y
		   	
			//this.crashTime = -(Math.sqrt(-4*(this.vector[0]*this.vector[0]+this.vector[1]*this.vector[1])*(-(this.radius + circleHit)*(this.radius + circleHit)+sx*sx+sy*sy) + (2*sx*this.vector[0]+2*sy*this.vector[1])*(2*sx*this.vector[0]+2*sy*this.vector[1]))+2*sx*this.vector[0]+2*sy*this.vector[1])/(2*this.vector[0]*this.vector[0]+2*this.vector[1]*this.vector[1])
			//this.crashTime = Number(this.crashTime.toFixed(2))
			
			this.crashTime = (spawnDistance-center.radius-this.radius-pad.padWidth)/(this.speed*100)
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
			var snd = new Audio("sound/Interface1"+soundType);
			snd.play()
		}
		
		ballArray.splice(ballArray.indexOf(this), 1)
		turnedArray[turnedArray.length] = this
		this.friendly = true
		
		this.red = '0'
		this.green = '0'
		this.blue = '255'

		if (Math.abs(pad.deltaRotation) > 0)
		{
			var angleChange = 5*pad.deltaRotation
			angleChange = Math.min(Math.abs(angleChange), maxAngleOffset)*angleChange/Math.abs(angleChange)
			this.crashAngle -= angleChange
		}
		
		this.circleCounter = 0
		this.orbitRadius = Math.min(4*center.radius + 4*Math.random()*center.radius + 0.5*pad.deltaRotation * pad.deltaRotation, 0.4*canvas.height)

		if (pad.deltaRotation >= 0)
		{
			this.circleSpeed = this.speed*100/Math.pow(this.orbitRadius,2)
		}
		else
		{
			this.circleSpeed = -this.speed*100/Math.pow(this.orbitRadius,2)
		}

		this.expectedToCrash = false
		this.errorSpeedX = 0
		this.errorSpeedY = 0
	}

	this.die = function() // Get shot
	{
		this.radius += 0.1
		this.alpha -= 0.02
		if (this.alpha < 0.1)
		{
			explodingArray.splice(explodingArray.indexOf(this))
		}
	}

	this.moveIntoOrbit = function()
	{
		var refX = center.x + this.orbitRadius*Math.cos(this.circleCounter + this.crashAngle)
		var refY = center.y + this.orbitRadius*Math.sin(this.circleCounter + this.crashAngle)

		this.errorSpeedX = (refX-this.x)* Math.abs(this.circleSpeed)
		this.errorSpeedY = (refY-this.y)* Math.abs(this.circleSpeed)
	}

	this.updateBall = function(modifier)
	{
		if (powerUps["slowMotion"] > 0)
		{
			this.flightCounter += 0.01*speedMod;
			this.x+=this.vector[0]*speedMod
			this.y-=this.vector[1]*speedMod
		}
		else
		{
			this.flightCounter += 0.01;
			this.x+=this.vector[0];
			this.y-=this.vector[1];
		}
		

        if (this.flightCounter >= this.crashTime && this.flightCounter < this.crashTime + pad.padWidth/(this.speed*100))
        {
        	var Dangle = Math.abs(this.crashAngle-pad.rotation)
			 
			if(Dangle > Math.PI) 
			{
				Dangle = 2*Math.PI - Dangle
			}				
			var ComboThen = comboThen
			var now = survivedSeconds

	       	if (Dangle < pad.padLength*0.5 + Math.min(Math.PI/6,Math.abs(10*pad.deltaRotation)))
	        {
	       		this.turn()
	        		
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
        					console.trace("-")
        				}
        			}
        			comboStage += 1
        			comboHits += 1  
        			
					if(comboStage == 4)
        			{
        				if(center.radius <= 50)
        				{
        					center.handleRadiusChange(comboHits*5)
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
       	}
 		
        else if (this.flightCounter > this.crashTime + 2*pad.padWidth/(this.speed*100) && this.crashing==false)
        {
        	center.redCounter = Math.min(center.redCounter+30, 255)
        	comboHits = 0
        	comboStage = 0
        	
        	this.crashing=true
        	center.handleRadiusChange(-5)
        	if (muted == false)
        	{
   				var haakon = new Audio("sound/LoseHealth"+soundType);
				haakon.play()
        	}
        	
        	ballArray.splice(ballArray.indexOf(this),1)
        	pad.draw()
        }
        //console.trace(ball.flightCounter, ball.crashTime, ball.speed, ball.crashing)
	}

	this.drawTurned = function(modifier)
	{
		this.moveIntoOrbit()
        this.circleCounter += this.circleSpeed
        this.radius = 7;
		this.vector[0] = -Math.sin(this.circleCounter + this.crashAngle) + this.errorSpeedX
		this.vector[1] = Math.cos(this.circleCounter + this.crashAngle) + this.errorSpeedY
		this.x += this.vector[0]
        this.y += this.vector[1]
		if (Math.abs(this.circleCounter) >= 2*Math.PI)
		{
			this.circleCounter = 0
		}

		for (var e = 0; e < ballArray.length; e++)
		{
			var ball2 = ballArray[e]

			if (ball2 != this && ball2.expectedToCrash == true)
			{
				if (collisionManager.testCollision(this, ball2, 0) == true)
				{
					collisionManager.handleCollision(this, ball2)
				}
			}
		}


		this.draw()
	}

	this.drawWaste = function(modifier)
	{
		this.x += this.vector[0]
		this.y += this.vector[1]

        if (Math.abs(this.x - center.x) > canvas.width/2 || Math.abs(this.y - center.y) > canvas.height/2)
		{
			wasteArray.splice(wasteArray.indexOf(this), 1)
		}

		if (collisionManager.testCollision(this, center, 0) == true)
		{
			collisionManager.handleCenterCollision(this)
		}

		this.draw()
	}


 	this.draw = function() 
 	{
      	ctx.fillStyle = "rgba("+this.red+","+this.green+","+this.blue+","+String(this.alpha)+")";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.closePath();
    }
} // Lucas is no longer allowed anywhere near lines 277 - 285 in ball.js