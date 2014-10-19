// Create the canvas
var canvas = document.createElement("canvas");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
document.body.appendChild(canvas);




//not gameplay vars
var ctx = canvas.getContext("2d");
var then = Date.now();
var now = Date.now();
var w = window;
var requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;


//gameplay vars
var player = {};
var ballFactory = {};
var balls = []
var totaltime = 0;

//loads stuff
function load() {
	player = new Player();
	player.load(ctx.canvas.width/2 + 50, ctx.canvas.height/2 + 50, 50);

	ballFactory = new Ballfactory();
}


//updates the frame
function update(deltaTime) {
	player.update(deltaTime);
	ballFactory.update(deltaTime);
}


//draws the frame to the canvas
function render() {
	ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
	player.render(ctx);
}




// updates and renders a single frame
function main() {
	now = Date.now();
	var deltaTime = now - then;
	then = now;
	totaltime += deltaTime;
	update(deltaTime);
	render();


	requestAnimationFrame(main);
}





//starts the game
function startGame() {
	//gameplay vars
	var player = {};
	var enemyballs = [];


	load();

	main();
}





