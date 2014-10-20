// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

canvas.width = w.innerWidth;
canvas.height = w.innerHeight;
document.body.appendChild(canvas);




// Game objects

center = new Center()

var pad = 
{
	rotation: 0
};


function drawRotatedImage(image, x, y, angle) 
{ 
 
	// save the current co-ordinate system 
	// before we screw with it
	ctx.save(); 
 
	// move to the middle of where we want to draw our image
	ctx.translate(x, y);
 
	// rotate around that point, converting our 
	// angle from degrees to radians 
	ctx.rotate(angle);
 
	// draw it up and to the left by half the width
	// and height of the image 
	ctx.drawImage(image, -(image.width/2), -(image.height/2));
 
	// and restore the co-ords to how they were when we began
	ctx.restore(); 
}




var spawnCount = 0;

// SPAWN BALLS
var spawnDistance = 200 // Should be increased
var ballArray = []
var wasteArray = []
var ballRadius = 7
var turnedArray = []
var fighterArray = []
var shotArray = []

var laserArray = []

var circle = 
{
	radius: 50,
	x: canvas.width/2,
	y: canvas.height/2
}

var rect = canvas.getBoundingClientRect();
var mouseX = 0
var mouseY = 0
function doMouseDown(event)
{
	if (center.redCounter < 200)
	{
		var numLasers = 5
		var angleError = -0.1
		if (muted == false)
		{
			var snd = new Audio("sound/Menu1.wav");
			snd.play()
		}
		
		for (l = 0; l < numLasers; l++)
		{
			var laser = new Laser();
			laser.spawn(angleError);
			angleError += 0.05
		}	
	}
	else if (muted == false)
	{
		// REFUSE BUY
		var refuseSound = new Audio("sound/Reject1.wav");
		refuseSound.play()
	}

	// TESTING

	var sx = circle.x
	var sy = circle.y
	console.log("Mouse Coordinates: ", mouseX, mouseY)
	console.log("Pad Rotation: ", pad.testRotation)
	console.log("Center relative coordinates", mouseX-sx, mouseY-sy)
	
}


addEventListener("mousemove", function (e) 
{
	mouseX = event.clientX - rect.left + document.body.scrollLeft;
	mouseY = event.clientY - rect.top + document.body.scrollTop;

	var dx = mouseX - circle.x
	var dy = circle.y - mouseY
	var distance = Math.sqrt(dx * dx + dy * dy)
	var angle = 0

	angle = Math.atan2(-dy, dx)
	
	pad.x = circle.x
	pad.y = circle.y

	pad.rotation = angle
	pad.visualRotation = angle
	pad.testRotation = 180 + 180 * -angle / Math.PI 

}, false);

var spawnLimit = 0.01
var test = false

var aoeArray = [] 
var gameOver = false
var survivedSeconds = 0
var ballSpeed = 2

var bar = new jetBar();

// Update game objects
var update = function (modifier) 
{
	if (Math.random() < spawnLimit && gameOver == false)
	{
		var ball = new Ball();
		ball.spawn(ballSpeed);
		spawnLimit += 0.0001
	}
	if(fighterBar <= fighterBarMax)
	{
		fighterBar += 0.01;
	}
	
	//console.trace(fighterBar);

};

// Draw everything
var render = function (deltaTime) 
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = '#36A8E0';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	bar.drawLine(fighterBar);

	aoeArray.forEach(function(blast)
	{
		//blast.update();
		if(blast.radius < blast.maxBlastRadius)
		{
			blast.radius += blast.blastSpeed

			for (var b = 0; b < ballArray.length; b++)
			{
				var ball5 = ballArray[b]
				var dx = ball5.x -circle.x
				var dy = ball5.y - circle.y
				var distance = Math.sqrt(dx * dx + dy * dy)
				//console.trace(distance)
				if (distance <= blast.radius)
				{
					ballArray.splice(b, 1)
				}
			}
		}
		else
		{
			
			aoeArray.splice(aoeArray.indexOf(blast), 1)
		}
		blast.drawBlast()
	});

	centerColor = "rgb(" +String(center.redCounter)+", 0, 0)";
	center.redCounter = Math.max(center.redCounter-1, 0)
	center.draw()

	pad.draw()
   
    turnedArray.forEach(function(turned)
    {
    	turned.moveIntoOrbit()
        turned.circleCounter += turned.circleSpeed

		turned.vector[0] = -Math.sin(turned.circleCounter + turned.crashAngle) + turned.errorSpeedX * 0.01
		turned.vector[1] = Math.cos(turned.circleCounter + turned.crashAngle) + turned.errorSpeedY * 0.01
		turned.x += turned.vector[0]
		turned.y += turned.vector[1]

		if (turned.circleCounter >= 2*Math.PI)
		{
			turned.circleCounter = 0
		}

		for (var e = 0; e < ballArray.length; e++)
		{
			var ball2 = ballArray[e]

			if (ball2 != turned)
			{
				if (turned.testCollision(ball2) == true)
				{
					turned.handleCollision(ball2, true)
				}
			}
		}

		for (var f = 0; f < turnedArray.length; f++)
		{
			var ballf = turnedArray[f]
			if (ballf != turned)
			{
				if (turned.testCollision(ballf) == true)
				{
					turned.handleCollision(ballf, false)
				}
			}	
		}

		turned.draw()
	});

	if(gameOver == true)
	{
		ctx.fillStyle = "black"
		ctx.font="20px Tekton Pro";
		ctx.fillText("You survived "+survivedSeconds+" seconds of invading balls. ",canvas.width/2 - 150,canvas.height /2-25)
		ctx.fillText("Press SPACE to try again.",canvas.width/2 - 100,canvas.height /2)
		
	}
    	
     
    ballArray.forEach(function(ball)
    {
        ball.flightCounter += 1;
								
		ball.x = ball.startX + ball.vector[0] * ball.flightCounter;
		ball.y = ball.startY - ball.vector[1] * ball.flightCounter;
         
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
	        		//ball.giveDirection(ball.spawnX, ball.spawnY, false)
	        		ball.turn()
	        		
	        		console.trace(now-ComboThen, now, ComboThen)
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
        				// GET HELATH
        				//combohits

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

        		//console.trace("SLIPTHROUGH: ", ball.crashAngle, pad.rotation, Math.abs(ball.crashAngle-pad.rotation))
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
	        	//console.trace("Edited circle posision: ", circle.radius, circle.x, circle.y)
	        	//circle.x -= 5
	        	//circle.y -= 5
	        	ballArray.splice(ballArray.indexOf(ball),1)
	        	pad.draw()

	        	if (circle.radius <= 0)
	        	{

	        		gameOverFunction(Math.floor((Date.now()-startTime)/1000));


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
	        		
	        		
	        		// Game over
	        		survivedSeconds = String(Math.floor((Date.now()-startTime)/1000))
	        		
	        	}
        	}
        }
       
        ball.draw();
	});

	laserArray.forEach(function(laser)
	{
		laser.flightCounter += 1;
						
		laser.x = laser.startX + laser.vector[0] * laser.flightCounter;
		laser.y = laser.startY - laser.vector[1] * laser.flightCounter;

		for (var y = 0; y < ballArray.length; y++)
		{
			var ball3 = ballArray[y]
			if (laser.testCollision(ball3))
			{
				ballArray.splice(y, 1)
			}
		}
		

		laser.drawLaser()
	});

	shotArray.forEach(function(shot)
	{
		//console.trace("Moving shot: ", shot.speed, shot.xDif, shot.Target)
		
		if (shot.Target != false)
		{

			shot.x += shot.speed * shot.xDif;
			shot.y += shot.speed * shot.yDif;

			if (Math.sqrt((shot.Target.x-shot.x)*(shot.Target.x-shot.x)+(shot.y-shot.Target.y)*(shot.y-shot.Target.y)) < shot.parentPlane.sideLength + shot.Target.radius)
			{
				try
				{
					shot.parentPlane.hunting = false;
					shot.parentPlane.speed = shot.parentPlane.slowspeed;
				}
				catch (e)
				{
					trace("nf error");
				}
				
				if (shot.Target.destroyed == false)
				{
					shot.Target.destroyed = true
					//console.trace(shot.Target.destroyed)
					//console.trace(ballArray.indexOf(shot.Target));
					if (ballArray.indexOf(shot.Target) != -1)
					{
						ballArray.splice(ballArray.indexOf(shot.Target), 1);
					}
					shotArray.splice(shotArray.indexOf(shot), 1)
					shot.parentPlane = false;
				}
			}
			shot.drawShot()
		}
	});

	fighterArray.forEach(function(fighter)
	{
		//trace("Fighter: ", fighter.x, fighter.y);
		if (fighter.leaving == false)
		{
			if (fighter.hunting == true && fighter.ready == true)
			{
				fighter.calculateRoute(fighter.Target);
			}
			else 
			{
				fighter.searchForTarget();
			}
		}

		else
		{
			fighter.disAppear()
		}
		fighter.drawFighter()
		
	});

	if(gameOver == false)
	{
		var Now = Date.now()
		survivedSeconds = Math.floor((Now-startTime)/1000)
		ctx.fillStyle = "black"
		ctx.font="40px Tekton Pro";
		ctx.fillText(String(Math.floor((Now-startTime)/1000)),canvas.width/2-20,100)
	}

	
	ctx.fillStyle = 'rgba('+String(a)+','+String(b)+','+String(c)+',0.4)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	if (increasing == "a")
	{
		a+= 1
		b-=1
		if (a == 255)
		{
			increasing = "b"
		}
	}
	else if (increasing == "b")
	{
		b+= 1
		c-=1
		if (b == 255)
		{
			increasing = "c"
		}
	}
	else
	{
		c+= 1
		a-=1
		if (c == 255)
		{
			increasing = "a"
		}
	}
};

var startTime = Date.now();
var aCounter = 1
var increasing = "a"
var a = 0
var b = 255
var c = 255

// The main game loop
var main = function () 
{
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render(delta / 1000);

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};


//var ballColor = '#DB2EC7';
var ballColor = '#CF0000';
var centerColor = "rgb(82, 92 ,209)"; //(R,G,B)

var pad = new Pad()

var songLength = 15*60
var music = new Audio("music/Mix3.mp3");
music.play()
var then = Date.now();
main();


var comboSounds = [new Audio("sound/Combo/2/1.wav"), new Audio("sound/Combo/2/2.wav"), new Audio("sound/Combo/2/3.wav")]
var comboThen = 0
var comboStage = 0
var comboHits = 0

function Pad()
{
	this.draw = function()
	{
		ctx.fillStyle = ballColor;

		ctx.beginPath();
      	ctx.arc(pad.x, pad.y, circle.radius+5, pad.visualRotation - Math.PI/4, pad.visualRotation + Math.PI/4, false);
      	ctx.lineWidth = 10

      	// line color
      	ctx.strokeStyle = 'green';
      	ctx.stroke();
	}
}


function Center()
{
	this.reloading = false
	this.redCounter = 0
	this.draw = function()
	{

		ctx.fillStyle = centerColor;
         
        ctx.beginPath();

        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2, false);
        ctx.fill();
         
        ctx.closePath();
	}
}


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
		   
	  	//var dx = this.radius + this.x - (canvas.width * 0.5 + 50)
	   	//var dy = canvas.height * 0.5 + 50  - this.y - this.radius
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


			/*var expectedX = this.x+this.vector[0]*this.crashTime
			var expectedY = this.y-this.vector[1]*this.crashTime
			var expectedXDistance = this.x+this.vector[0]*this.crashTime-circle.x
			var expectedYDistance = this.y-this.vector[1]*this.crashTime-circle.y
			if (Math.abs(Math.sqrt(expectedXDistance*expectedXDistance+expectedYDistance*expectedYDistance)- circleHit) > 10)
			{
				ballArray.splice(ballArray.indexOf(this))
				this.destroyed == true
			}*/
			//console.trace(circleHit, Math.sqrt(expectedXDistance*expectedXDistance+expectedYDistance*expectedYDistance))
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

		this.crashAngle -= Math.PI / 2

		this.circleCounter = 0
		this.circleSpeed = 1 / (100)
		this.orbitRadius = 1.5*circle.radius + 1.5*circle.radius*Math.random()

		//this.x = (canvas.width * 0.5 + 50) + 100 * Math.cos((this.crashAngle));
		//this.y = (canvas.height * 0.5 + 50) + 100 * Math.sin((this.crashAngle));
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

	

 	this.draw = function() 
 	{
        ctx.fillStyle = this.color;
         
        ctx.beginPath();
         
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.fill();
         
        ctx.closePath();
    };
}

addEventListener("mousedown", doMouseDown, false);

var laserColor = '#ff0000';

function Laser()
{
	this.spawn = function(angleError)
	{
		

		center.reloading = true
		center.redCounter = Math.min(center.redCounter + 40, 255)
		
		this.flightCounter = 0

		this.speed = 15

		this.color = laserColor
		this.radius = 4

		this.x = pad.x
		this.y = pad.y

		this.rotation = pad.rotation + angleError

		laserArray[laserArray.length] = this

	 	this.startX = this.x
	 	this.startY = this.y

		var dx = this.x - mouseX
	   	var dy = mouseY - this.y

	   	this.a = dy/dx
	    this.b = this.y - this.a*this.x

	    //this.absvector = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
		this.vector = [this.speed * Math.cos(this.rotation),- this.speed * Math.sin(this.rotation)];
	}

	this.testCollision = function(ball2)
	{
		var dx = ball2.x - this.x
		var dy = ball2.y - this.y

		var distance = Math.sqrt(dx*dx+dy*dy)

		if (distance < ball2.radius + this.radius + 7)
		{
			return true
		}
		else
		{
			return false
		}
	}

	this.drawLaser = function()
	{
		
		ctx.fillStyle = this.color;
         
        ctx.beginPath();
        
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.fill();
         
        ctx.closePath();
	};
}

addEventListener("keydown", keyboard, true);

var muted = false
var fighterBar = 0;
var fighterBarMax = 40;

function keyboard(e)
{
	if(e.keyCode === 87) //32 = space
	{
		// W
		if(center.redCounter === 0)
		{
			var blast = new AoEBlast();
			blast.spawn();
		}
		else if (muted == false)
		{
			// REFUSE BUY
			var refuseSound = new Audio("sound/Reject1.wav");
			refuseSound.play()
		}
		
	}
	else if (e.keyCode == 69)
	{
		// E
		if (fighterBar >= fighterBarMax)
		{
			var fighter = new Fighter();
			fighter.spawn();
			fighterBar = 0;
		}

		else if (muted == false)
		{
			// REFUSE BUY
			var refuseSound = new Audio("sound/Reject1.wav");
			refuseSound.play()
		}
		
	}
	else if (e.keyCode == 77)
	{
		// E
		muted = !muted
	}
	else if (e.keyCode == 32)
	{
		// SPACE
		if(gameOver == true)
		{
			location.reload();
		}
	}
}

//var blastColor = '#D424BF';
//var blastColor = '#ff0000';



function AoEBlast()
{
	this.spawn = function()
	{
		if (muted == false)
		{
			var blastSound = new Audio('sound/Mail1.wav')
			blastSound.play()
		}
		
		//var startBlastTime = Date.now();
		this.maxBlastRadius = 200
		//this.color = '#D424B';
		this.color = "white"
		this.radius = circle.radius;
		this.x = circle.x;
		this.y = circle.y;
		this.blastSpeed = 10

		center.reloading = true
		center.redCounter = Math.min(center.redCounter + 200, 255)

		aoeArray[aoeArray.length] = this	
	};	

	//var timer = Date.now();

	this.drawBlast = function()
	{

		ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
         
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.fill();
         
        ctx.closePath();
	};
	
}


function Fighter()
{
	this.spawn = function()
	{
		this.color = "red"
		this.sideLength = 20

		this.hunting = false;
		this.lasts = 30 //seconds
		this.leaving = false;
		this.ready = false
		this.Target = false;
		this.then = Date.now();
		this.slowspeed = 0.7;
		this.maxSpeed = 0.9;
		this.speed = this.slowspeed;
		this.reload = 0;
		this.reloadCounter = 30;
		this.huntingRange = 400;
		this.shotsFired = false;
		
		this.vector_x = 0;
		this.vector_y = 0;
		this.absvector = 0;
		this.radius = 5;

		var dx = -circle.x + mouseX
	   	var dy = circle.y - mouseY
	   	var distance = Math.sqrt(dy*dy+dx*dx)

	   	this.rotation = -Math.atan2(dy, dx) + (Math.PI/2)

		this.vector = [this.speed * Math.cos(-Math.atan2(dy, dx)), this.speed * Math.sin(-Math.atan2(dy, dx))];

		this.x = circle.x + circle.radius * Math.cos(this.rotation-Math.PI/2)
		this.y = circle.y + circle.radius * Math.sin(this.rotation-Math.PI/2)
			
		this.rotAks = 0.02;
		this.degrees = 0;

		//console.trace(this.rotation, this.x, this.y, this.vector[0])

		fighterArray[fighterArray.length] = this

	};	

	this.calculateRoute = function(target)
	{
		//console.trace("calculating route")
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
			//trace("Reloading: ", this.reload);
			if (this.reload == this.reloadCounter)
			{
				//console.trace("FIRING");
				if (muted == false)
				{
					var haakon2 = new Audio("sound/InterFace2.wav");
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

			var dx = -circle.x + mouseX
	   		var dy = circle.y - mouseY
			
			this.degrees = Math.atan2(dy, dx);
		}
	};	


	this.searchForTarget = function()
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
			if (ball6.beingTargeted == false && ball6.flightCounter < flightCounterIndex && Math.sqrt(Math.pow((ball6.x - this.x),2) + Math.pow((this.y - ball6.y),2)) < this.huntingRange)
			{
				flightCounterIndex = ball6.flightCounter;
				this.Target = ball6;
			}
		}
		
		if (flightCounterIndex != 1000)
		{
			this.hunting = true;
		}
		//console.trace(Math.floor((Date.now()-this.then)/1000), this.lasts)

		if (Math.floor((Date.now()-this.then)/1000) == this.lasts)
		{
			this.leaving = true
			this.flightCounter = 0

			var dx = -circle.x + mouseX
	   		var dy = circle.y - mouseY
			
			this.degrees = Math.atan2(dy, dx);
		}

	}

	this.disAppear = function()
	{	
		this.flightCounter+= 1
		//console.trace("Disappearing")
		var er = this.degrees-this.rotation

		this.rotation -= er*this.rotAks
		this.vector[0] = this.speed * Math.cos(this.rotation)
		this.vector[1] = this.speed * Math.sin(this.rotation)

		this.x += this.vector[0]
		this.y += this.vector[1]

		if(this.flightCounter == 1000)
		{
			fighterArray.splice(fighterArray.indexOf(this))
		}
	};
	

	this.drawFighter = function()
	{	
		var v = [[0,-this.sideLength],[-this.sideLength,0],[this.sideLength,0]]
		//console.trace("Tracing fighter", this.x, this.y, this.rotation, this.sideLength)
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



function Shot()
{
	this.spawn = function(xStart, yStart, xDif, yDif, rot, Target, pPlane)
	{
		//console.trace("Spawned shot")
		this.Error = 0.2
		this.speed = 15
		this.x = xStart
		this.y = yStart
		this.xStart = xStart 
		this.yStart = yStart 
		this.xDif = xDif + Math.random()*this.Error
		this.yDif = yDif- Math.random()*this.Error
		this.rotation = rot
		this.Target = Target
		this.parentPlane = pPlane

		shotArray[shotArray.length] = this
	};	

	//var timer = Date.now();

	this.drawShot = function()
	{

		ctx.fillStyle = "blue"
         
        ctx.beginPath();
       // console.trace(1111);
        ctx.arc(this.x, this.y, 4, 0, Math.PI*2, false);
        ctx.fill();
         
        ctx.closePath();
	};
	
}

function jetBar(){
	this.x = 0;
	this.y = 8;

	this.color = 'green';

	this.drawLine = function(length){
		ctx.fillStyle = this.color;

		ctx.beginPath();

		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x + length * (30 + 2), this.y);
		ctx.lineWidth = 15;

		ctx.stroke();
	}
}


//gameOver
function gameOverFunction(sec){

}