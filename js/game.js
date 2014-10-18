// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Hero image
var circleReady = false;
var circleImage = new Image();
circleImage.onload = function () {
	circleReady = true;
};

circleImage.src = "images/Center.png";

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
	radius: 47
}

var pad = 
{
	rotation: 0
};

function drawRotatedImage(image, x, y, angle) { 
 


	console.trace(angle)
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


// Update game objects
var update = function (modifier) 
{
	

};

// Draw everything
var render = function () {
	if (circleReady) {
		ctx.drawImage(circleImage, canvas.width / 2, canvas.height / 2);
	}

	if (padReady) {
		drawRotatedImage(padImage, pad.x, pad.y, pad.rotation);
	}
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
main();

