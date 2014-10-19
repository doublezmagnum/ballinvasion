// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1280;
canvas.height = 720;
document.body.appendChild(canvas);


// Game objects
var circle = 
{
	radius: 47,
	x: canvas.width / 2 + 47,
	y: canvas.height / 2 + 47
}

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



addEventListener("mousemove", function (e) 
{

	var dx = event.clientX + document.body.scrollLeft - (canvas.width * 0.5 + 50)
	var dy = canvas.height * 0.5 + 50  - event.clientY - document.body.scrollTop
	var distance = Math.sqrt(dx * dx + dy * dy)
	var angle = 0
	if (dy > 0)
	{
		 angle = Math.PI / 2 - Math.acos(dx / distance)
	}
	else
	{
		angle = Math.PI / 2 + Math.acos(dx / distance)
	}

	pad.x = circle.x
	pad.y = circle.y

	pad.rotation = angle
	pad.visualRotation = angle - Math.PI/2

}, false);

var spawnCount = 0;

// SPAWN BALLS
var spawnDistance = 200 // Should be increased
var ballArray = []
var wasteArray = []
var ballRadius = 7
var turnedArray = []

var laserArray = []
function doMouseDown(event)
{
	if (center.redCounter < 200)
	{var laser = new Laser();
	laser.spawn(6);}
	
}

var spawnLimit = 0.005

var aoeArray = [] 

// Update game objects
var update = function (modifier) 
{
	if (Math.random() < spawnLimit)
	{
		var ball = new Ball();
		ball.spawn(2);
		spawnLimit += 0.0003


	}

	aoeArray.forEach(function(blast)
	{
		//blast.update();
	});
};

var circleX = canvas.width / 2
var circleY = canvas.height / 2

// Draw everything
var render = function (deltaTime) 
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = '#36A8E0';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	aoeArray.forEach(function(blast)
	{
		blast.draw();
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
			//console.trace(ball2)
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
			//console.trace(ballf)
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
    	
     
    ballArray.forEach(function(ball)
    {
        ball.flightCounter += 1;
								
		ball.x = ball.startX + ball.vector[0] * ball.flightCounter;
		ball.y = ball.startY - ball.vector[1] * ball.flightCounter;
         
        if (ball.flightCounter == Math.round(ball.crashTime) && ball.expectedToCrash == true)
        {
        	if (Math.abs(ball.crashAngle-pad.rotation) < Math.PI/2)
        	{
        		//ball.giveDirection(ball.spawnX, ball.spawnY, false)
        		ball.turn()
        	}
        	
        	else
        	{
	        	circle.radius -= 5
	        	center.x-=5
	        	center.y-=5
	        	ballArray.splice(ballArray.indexOf(ball),1)
	        	pad.draw()
        	}
        }
       
        ball.draw();
	});

	/*wasteArray.forEach(function(waste)
    {
    	//console.trace(waste.testCollision(circle) == true)
    	if (waste.testCollision(circle) == true)
    	{
    		waste.vector[0] = -waste.vector[0]
    		waste.vector[1] = -waste.vector[1]
    	}

    	for (var r = 0; r < ballArray.length; r++)
		{
			var ball4 = ballArray[r]

			if (ball4 != waste)
			{
				if (waste.testCollision(ball4))
				{
					waste.handleCollision(ball4)
				}
			}
			//console.trace(ball4)
			
		}

	});*/

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



	ctx.font="30px Georgia";
	ctx.fillText(String(Math.floor((Date.now()-startTime)/1000)),100,200)
};

var startTime = Date.now();

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

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;


var ballColor = '#DB2EC7';
var centerColor = "rgb(82, 92 ,209)"; //(R,G,B)

var pad = new Pad()

// Let's play this game!
var then = Date.now();
main();

function Pad()
{
	this.draw = function()
	{
		ctx.fillStyle = ballColor;
         
        /*ctx.beginPath();
         
        ctx.arc(pad.x, pad.y, circle.radius, pad.rotation - Math.PI/2, pad.rotation, false);
        ctx.fill();
         
        ctx.closePath();

        ctx.moveTo(pad.x,pad.y);
		ctx.arc(pad.x,pad.y,circle.radius,pad.rotation - Math.PI/6 - Math.PI/2 ,pad.rotation + Math.PI/6 - Math.PI/2);
		ctx.lineTo(pad.x,pad.y);
		ctx.stroke(); // or context.fill()*/

		ctx.beginPath();
      	ctx.arc(pad.x, pad.y, circle.radius+5, pad.visualRotation - Math.PI/4, pad.visualRotation + Math.PI/4, false);
      	ctx.lineWidth = 10;

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
		this.expectedToCrash = true

		this.friendly = false
		this.radius = 7
		this.color = ballColor
		var rNumber = Math.random()
		this.x = canvas.width / 2 + 400*Math.cos(rNumber* 2 * Math.PI)
	 	this.y = canvas.height / 2 + 400*Math.sin(rNumber * 2 * Math.PI)
	 	this.spawnX = this.x
	 	this.spawnY = this.y
	 	this.speed = speed
	    ballArray[ballArray.length] = this

	    this.giveDirection((canvas.width * 0.5 + 50), (canvas.height * 0.5 + 50), true)
	}

	this.turn = function()
	{
		ballArray.splice(ballArray.indexOf(this), 1)
		turnedArray[turnedArray.length] = this

		this.color = "#0000ff"

		this.crashAngle -= Math.PI / 2

		this.circleCounter = 0
		this.circleSpeed = 1 / (100)

		//this.x = (canvas.width * 0.5 + 50) + 100 * Math.cos((this.crashAngle));
		//this.y = (canvas.height * 0.5 + 50) + 100 * Math.sin((this.crashAngle));
		this.expectedToCrash = false
		this.errorSpeedX = 0
		this.errorSpeedY = 0
	}

	this.moveIntoOrbit = function()
	{
		var refX = canvas.width * 0.5 + 50 + 300*Math.cos(this.circleCounter + this.crashAngle)
		var refY = canvas.height * 0.5 + 50 + 300*Math.sin(this.circleCounter + this.crashAngle)

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
		console.trace("Kræsj")
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

	this.giveDirection = function(toX, toY, expectedToCrash)
	{
		this.flightCounter = 0;
		this.expectedToCrash = expectedToCrash
	 	this.startX = this.x
	 	this.startY = this.y
		   
	  	//var dx = this.radius + this.x - (canvas.width * 0.5 + 50)
	   	//var dy = canvas.height * 0.5 + 50  - this.y - this.radius
	   	var dx = this.radius + this.x - toX
	   	var dy = toY  - this.y - this.radius

	   	this.a = dy/dx
	    this.b = this.y - this.a*this.x

	    this.absvector = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
		this.vector = [-this.speed * dx / this.absvector,- this.speed * dy / this.absvector];

		if (expectedToCrash == true)
		{
			var sx = this.x - (canvas.width * 0.5 + 50)
		   	var sy = canvas.height * 0.5 + 50  - this.y
		   	var circleHit = circle.radius + 10
			
			// hehehhe:
			this.crashTime = -(Math.sqrt(-4*(this.vector[0]*this.vector[0]+this.vector[1]*this.vector[1])*(-(this.radius + circleHit)*(this.radius + circleHit)+sx*sx+sy*sy) + (2*sx*this.vector[0]+2*sy*this.vector[1])*(2*sx*this.vector[0]+2*sy*this.vector[1]))+2*sx*this.vector[0]+2*sy*this.vector[1])/(2*this.vector[0]*this.vector[0]+2*this.vector[1]*this.vector[1])

			this.crashAngle = Math.cos(-dx / Math.sqrt(dx*dx + dy*dy))

			var distance = Math.sqrt(dx * dx + dy * dy)

			if (dy > 0)
			{
				 this.crashAngle = Math.PI / 2 - Math.acos(dx / distance)
			}
			else
			{
				this.crashAngle = Math.PI / 2 + Math.acos(dx / distance)
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

addEventListener("mousedown", doMouseDown, false);

var laserColor = '#ff0000';

function Laser()
{
	this.spawn = function(speed)
	{
		center.reloading = true
		center.redCounter = Math.min(center.redCounter + 100, 255)
		//console.trace(center.redCounter)
		this.flightCounter = 0
		this.radius = 7
		this.speed = speed

		this.color = laserColor
		this.radius = 7

		this.x = pad.x
		this.y = pad.y

		this.rotation = pad.rotation

		laserArray[laserArray.length] = this

	 	this.startX = this.x
	 	this.startY = this.y

		var dx = this.radius + this.x - (event.clientX + document.body.scrollLeft)
	   	var dy = event.clientY + document.body.scrollTop - this.y - this.radius

	   	this.a = dy/dx
	    this.b = this.y - this.a*this.x

	    this.absvector = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
		this.vector = [-this.speed * dx / this.absvector,- this.speed * dy / this.absvector];
	}

	this.testCollision = function(ball2)
	{
		var dx = ball2.x - this.x
		var dy = ball2.y - this.y

		var distance = Math.sqrt(dx*dx+dy*dy)

		if (distance < ball2.radius + this.radius)
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

function keyboard(e)
{
	if(e.keyCode === 87) //32 = space
	{
		var blast = new AoEBlast();
		blast.spawn();
	}
}

//var blastColor = '#D424BF';
var blastColor = '#ff0000';

var blastRadius = center.radius;

function AoEBlast()
{
	this.spawn = function()
	{
		//var startBlastTime = Date.now();

		this.color = blastColor;
		this.radius = 200;
		this.x = center.x;
		this.y = center.y;

		var maxRadius = this.radius * 2;

		aoeArray[aoeArray.length] = this	
	};	

	//var timer = Date.now();

	this.update = function()
	{
		//timer -= startBlastTime / 1000;

		while(this.radius < maxRadius)
		{
			radius += .5;
		}
	};

	this.draw = function()
	{
		ctx.fillStyle = blastColor;
         
        ctx.beginPath();
         
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.fill();
         
        ctx.closePath();
	};
	
}








