// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

canvas.width = w.innerWidth;
canvas.height = w.innerHeight-5;
document.body.appendChild(canvas);

// Game objects

center = new Center()

var pad = 
{
	rotation: 0
};

var spawnCount = 0;
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
		var refuseSound = new Audio("sound/Reject1.wav");
		refuseSound.play()
	}

	var sx = circle.x
	var sy = circle.y
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
};

var render = function (deltaTime) 
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = '#36A8E0';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	bar.drawLine(fighterBar);

	drawAndBlastBalls();

	centerColor = "rgb(" +String(center.redCounter)+", 0, 0)";
	center.redCounter = Math.max(center.redCounter-1, 0)
	center.draw()

	pad.draw()
    
    drawTurned();

	if(gameOver == true)
	{
		ctx.fillStyle = "black"
		ctx.font="20px Tekton Pro";
		ctx.fillText("You survived "+survivedSeconds+" seconds of invading balls. ",canvas.width/2 - 150,canvas.height /2-25)
		ctx.fillText("Press SPACE to try again.",canvas.width/2 - 100,canvas.height /2)
	}
    
	drawBall();

	drawLasers();

	drawShots();

	drawFighters();

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

	screenColorChanger();
};

var startTime = Date.now();
var aCounter = 1
var increasing = "a"
var a = 0
var b = 255
var c = 255

var main = function () 
{
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render(delta / 1000);

	then = now;
	requestAnimationFrame(main);
};

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

addEventListener("mousedown", doMouseDown, false);

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

function susbmitsceore(name, score){
	xmlhttp.open("POST","waveos.pf-control.de/scores/submitscore.php",true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send("username=" + name + "&score=" + score);
}

function drawAndBlastBalls()
{
	aoeArray.forEach(function(blast)
	{
		if(blast.radius < blast.maxBlastRadius)
		{
			blast.radius += blast.blastSpeed

			for (var b = 0; b < ballArray.length; b++)
			{
				var ball5 = ballArray[b]
				var dx = ball5.x -circle.x
				var dy = ball5.y - circle.y
				var distance = Math.sqrt(dx * dx + dy * dy)
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
}

function drawTurned()
{
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
}

function drawBall()
{
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
       
        ball.draw();
	});
}

function drawLasers()
{
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
}

function drawShots()
{
	shotArray.forEach(function(shot)
	{
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
}

function drawFighters()
{
	fighterArray.forEach(function(fighter)
	{
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
}

function screenColorChanger()
{
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
}