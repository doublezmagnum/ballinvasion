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
var deltaMouseX = 0
var deltaMouseY = 0

// THIS CODE DISABLES RIGHT CLICKING - SHOULD BE ACTIVATED IN THE RELEASED GAME - DEACTIVATED FOR DEBUGGING PURPOSES
/*document.oncontextmenu = function(e){
 var evt = new Object({keyCode:93});
 stopEvent(e);
 //keyboardUp(evt);
}
function stopEvent(event){
 if(event.preventDefault != undefined)
  event.preventDefault();
 if(event.stopPropagation != undefined)
  event.stopPropagation();
}*/

navigator.sayswho= (function(){
    var ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\bOPR\/(\d+)/)
        if(tem!= null) return 'Opera '+tem[1];
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();

var soundType = ""
if (navigator.sayswho.indexOf("Opera") == -1)
{
	soundType = ".mp3"
}
else
{
	soundType = ".wav"
}

function doMouseDown(event)
{
	if (center.redCounter < 200)
	{
		var numLasers = 5
		var angleError = -0.1
		if (muted == false)
		{
			var snd = new Audio("sound/Menu1"+soundType);
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
		var refuseSound = new Audio("sound/Reject1"+soundType);
		refuseSound.play()
	}

	var sx = circle.x
	var sy = circle.y
}


function getX(event, canvas){
     if(event.offsetX){
       return event.offsetX;
     }
     if(event.clientX){
     return event.clientX - canvas.offsetLeft;
     }
    return null;
 }

function getY(event, canvas){
    if(event.offsetY){//chrome and IE
        return event.offsetY;
    }
    if(event.clientY){// FF
        return event.clientY- canvas.offsetTop;
    }
    return null;    
}

addEventListener("mousemove", function (e) 
{
	deltaMouseX = getX(e, canvas)-mouseX
	deltaMouseY = getY(e, canvas)-mouseY
	deltaMouse = Math.sqrt(deltaMouseX*deltaMouseX+deltaMouseY*deltaMouseY)
	mouseX = getX(e, canvas);
	mouseY = getY(e, canvas);

	var dx = mouseX - circle.x
	var dy = circle.y - mouseY
	var distance = Math.sqrt(dx * dx + dy * dy)
	
	deltaRotation = Math.atan2(-dy, dx)-pad.rotation
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
		fighterBar += 1;
	}

	updateBlast()

	updateBall();

	updateLasers();

	updateShots();

	updateFighters();
};

var render = function (deltaTime) 
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = '#36A8E0';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	bar.drawLine(fighterBar);

	drawBlast();

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
var music = new Audio("music/Mix3"+soundType);
music.play()
var then = Date.now();
main();


var comboSounds = [new Audio("sound/Combo/2/1"+soundType), new Audio("sound/Combo/2/2"+soundType), new Audio("sound/Combo/2/3.wav")]
var comboThen = 0
var comboStage = 0
var comboHits = 0

addEventListener("mousedown", doMouseDown, false);

addEventListener("keydown", keyboard, true);

var muted = false
var fighterBar = 0;
var fighterBarMax = canvas.width;

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
			var refuseSound = new Audio("sound/Reject1.mp3");
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

		if (muted == false)
		{
			// REFUSE BUY
			var refuseSound = new Audio("sound/Reject1.mp3");
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

			if (ball2 != turned && ball2.expectedToCrash == true)
			{
				if (turned.testCollision(ball2) == true)
				{
					turned.handleCollision(ball2, true)
				}
			}
		}

		/*for (var f = 0; f < turnedArray.length; f++)
		{
			var ballf = turnedArray[f]
			if (ballf != turned)
			{
				if (turned.testCollision(ballf) == true)
				{
					turned.handleCollision(ballf, false)
				}
			}	
		}*/

		turned.draw()
	});
}

function updateBlast()
{
	aoeArray.forEach(function(blast)
	{
		blast.updateBlast(blast);
	});
}

function drawBlast()
{
	aoeArray.forEach(function(blast)
	{
		blast.drawBlast();
	});
}

function updateBall()
{
	ballArray.forEach(function(ball)
    {  
        ball.updateBall(ball);
	});
}

function drawBall()
{
	ballArray.forEach(function(ball)
    {  
        ball.draw();
	});
}

function updateLasers()
{
	laserArray.forEach(function(laser)
	{	
		laser.updateLaser(laser);
	});
}

function drawLasers()
{
	laserArray.forEach(function(laser)
	{	
		laser.drawLaser();
	});
}

function updateShots()
{
	shotArray.forEach(function(shot)
	{
		shot.updateShot(shot);
	});
}

function drawShots()
{
	shotArray.forEach(function(shot)
	{
		shot.drawShot();
	});
}

function updateFighters()
{
	fighterArray.forEach(function(fighter)
	{
		fighter.updateFighter(fighter);
	});
}

function drawFighters()
{
	fighterArray.forEach(function(fighter)
	{	
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