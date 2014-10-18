// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1280;
canvas.height = 720;
document.body.appendChild(canvas);

// Pad image
var padReady = false;
var padImage = new Image();
padImage.onload = function () {
	padReady = true;
};

padImage.src = "images/Pad.png";



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

	pad.x = 50 + canvas.width * 0.5 + circle.radius * dx / distance// - 32
	pad.y = 50 + canvas.height * 0.5 - circle.radius * dy / distance //- 13.5

	pad.rotation = angle

}, false);

var spawnCount = 0;

// SPAWN BALLS
var spawnDistance = 200 // Should be increased
var ballArray = []
var ballRadius = 7
var turnedArray = []

var laserArray = []
function doMouseDown(event)
{
	var laser = new Laser();
	laser.spawn(6);
}

var spawnLimit = 0.005

// Update game objects
var update = function (modifier) 
{
	if (Math.random() < spawnLimit)
	{
		var ball = new Ball();
		ball.spawn(2);
		spawnLimit += 0.0003


	}

	
};

var circleX = canvas.width / 2
var circleY = canvas.height / 2

// Draw everything
var render = function (deltaTime) 
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	center.draw()

	if (padReady) 
	{
		drawRotatedImage(padImage, pad.x, pad.y, pad.rotation);
	}
   
    turnedArray.forEach(function(turned)
    {
    	turned.moveIntoOrbit()
        turned.circleCounter += turned.circleSpeed
		
		turned.x += -Math.sin(turned.circleCounter + turned.crashAngle) + turned.errorSpeedX * 0.01
		turned.y += Math.cos(turned.circleCounter + turned.crashAngle) + turned.errorSpeedY * 0.01

		if (turned.circleCounter >= 2*Math.PI)
		{
			turned.circleCounter = 0
		}

		for (var e = 0; e < ballArray.length; e++)
		{
			ball2 = ballArray[e]

			if (turned.testCollision(ball2) == true)
			{
				turned.handleCollision(ball2)
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
        	if (Math.abs(ball.crashAngle-pad.rotation) < Math.PI/3)
        	{
        		//ball.giveDirection(ball.spawnX, ball.spawnY, false)
        		ball.turn()
        	}
        	
        	else
        	{
	        	circle.radius -= 5
	        	pad.x -= 5
	        	pad.y -= 5
        	}
        }
       
        ball.draw();
	});

	laserArray.forEach(function(laser)
	{
		laser.flightCounter += 1;
		
		console.trace(laser.startX, laser.vector[0], laser.flightCounter)					
		laser.x = laser.startX + laser.vector[0] * laser.flightCounter;
		laser.y = laser.startY - laser.vector[1] * laser.flightCounter;

		laser.drawLaser()
	});
};

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


var ballColor = '#00ff00';
var centerColor = '#32cd32';	

// Let's play this game!
var then = Date.now();
main();

function Center()
{
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
		spawnCount++;
		console.trace(spawnCount)
		this.expectedToCrash = true

		this.friendly = false
		this.radius = 7
		this.color = ballColor
		this.x = canvas.width / 2 + 400*Math.cos(Math.random() * 2 * Math.PI)
	 	this.y = canvas.height / 2 + 400*Math.sin(Math.random() * 2 * Math.PI)
	 	this.spawnX = this.x
	 	this.spawnY = this.y
	 	this.speed = speed
	    ballArray[ballArray.length] = this

	    this.giveDirection((canvas.width * 0.5 + 50), (canvas.height * 0.5 + 50), true)
	}

	this.turn = function()
	{
		console.trace("Turned")
		console.trace("BallArray pre: ", ballArray)
		ballArray.splice(ballArray.indexOf(this), 1)
		console.trace("BallArray post: ", ballArray)
		turnedArray[turnedArray.length] = this

		this.crashAngle -= Math.PI / 2
		console.log("Crashangle: ", this.crashAngle)

		this.circleCounter = 0
		this.circleSpeed = 1 / (100)

		//this.x = (canvas.width * 0.5 + 50) + 100 * Math.cos((this.crashAngle));
		//this.y = (canvas.height * 0.5 + 50) + 100 * Math.sin((this.crashAngle));

		this.errorSpeedX = 0
		this.errorSpeedY = 0
	}

	this.moveIntoOrbit = function()
	{
		var refX = canvas.width * 0.5 + 50 + 100*Math.cos(this.circleCounter + this.crashAngle)
		var refY = canvas.height * 0.5 + 50 + 100*Math.sin(this.circleCounter + this.crashAngle)

		this.errorSpeedX = refX-this.x
		this.errorSpeedY = refY-this.y
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

	this.handleCollision = function(ball2)
	{
		var angle = Math.atan2(ball2.x - this.x, this.y - ball2.y);

        var targetX = this.x + Math.cos(angle) * (ball2.radius + this.radius);

        var targetY = this.y + Math.sin(angle) * (ball2.radius + this.radius);

        var ax = (targetX - ball2.x) * 0.05;

        var ay = (targetY - ball2.y) * 0.05;

        //this.vector[0] -= ax;

        //this.vector[1] -= ay

        ball2.vector[0] += ax;

        ball2.vector[1] += ay;
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
		   	var circleHit = circle.radius + 2
			
			// hehehhe:
			this.crashTime = -(Math.sqrt(-4*(this.vector[0]*this.vector[0]+this.vector[1]*this.vector[1])*(-(this.radius + circleHit)*(this.radius + circleHit)+sx*sx+sy*sy) + (2*sx*this.vector[0]+2*sy*this.vector[1])*(2*sx*this.vector[0]+2*sy*this.vector[1]))+2*sx*this.vector[0]+2*sy*this.vector[1])/(2*this.vector[0]*this.vector[0]+2*this.vector[1]*this.vector[1])
			console.log("Crashes in: ", this.crashTime)

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

	this.drawLaser = function()
	{
		
		ctx.fillStyle = this.color;
         
        ctx.beginPath();
         
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.fill();
         
        ctx.closePath();
	};
}







