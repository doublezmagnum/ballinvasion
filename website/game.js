// Create the canvas
var canvas = document.createElement("canvas");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
document.body.appendChild(canvas);

//not gameplay vars
var ctx = canvas.getContext("2d");

//gameplay vars
var player = {};
var enemyballs = [];


load();

var then = Date.now();
var now = Date.now();

//gameloop
while (true) {
	var now = Date.now();

	main(then-now * 1000);

	then = now;
}

// updates and renders a single frame
function main(delta) {
	update(delta);
	render();
}


//loads stuff
function load() {
	player = new Player();
}

//updates the frame
function update(deltaTime) {
	player.update(deltaTime);
}

//draws the frame to the canvas
function render() {
	player.render();
}