// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Game objects
var hero = {
	speed: 256,
	yspeed: 0,
	jumping: false
};

// Handle keyboard controls
var keysDown = {};

addEventListener("keypress", function (e) 
{
	console.trace(hero.yspeed, e.keyCode)
	if (e.keyCode == 32 && hero.jumping == false)
	{
		hero.jumping = true
		hero.yspeed = 4
	}
}, false);

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = 400;
};

// Update game objects
var update = function (modifier) 
{
	test += 1

	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	if (hero.jumping == true)
	{
		hero.yspeed -= 0.1
		console.trace(hero.yspeed, test, hero.jumping, hero.y)
		hero.y -= hero.yspeed
	}
	if (hero.y > 400)
	{
		hero.jumping = false
	}
	



	
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
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

test = 1

// Let's play this game!
var then = Date.now();
reset();
main();

