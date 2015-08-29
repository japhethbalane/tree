var canvas = document.getElementById("Tree");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var line = [];

clearCanvas();
generateLine();
setInterval(drawTree, 30);

function randomBetween(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function clearCanvas() {
	context.fillStyle = "#aaaaaa";
	context.fillRect(0, 0, canvas.width, canvas.height);
}

function generateLine() {
	branch.push(new Line());
}

function drawTree() {
	for (var i = 0; i < line.length; i++) {
		line[i].update().draw();
	};
}

