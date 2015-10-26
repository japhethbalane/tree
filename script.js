var canvas = document.getElementById("Tree");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var line = [];
var snow = [];

clearCanvas(); 
generateSnow(5);
setInterval(drawTree, 30);

function randomBetween(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function clearCanvas() {
	context.fillStyle = "#222222";
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "#dddddd";
	context.fillRect(0, canvas.height-100, canvas.width, 100);
}

function generateSnow(count) {
	for (var i = 0; i < count; i++) {
		snow.push(new Snow());
	}
}

function drawTree() {
	clearCanvas();
	for (var i = 0; i < snow.length; i++) {
		snow[i].update().draw();
	}
	for (var i = 0; i < line.length; i++) {
		line[i].update().draw();
	}
}

function Line() {
	this.x1 = canvas.width/2;
	this.x2 = canvas.height-100;
	this.y1 = this.x1;
	this.y2 = this.y1;

	this.update = function() {
		// var dx = Math.cos(this.angle * Math.PI / 180);
    	// var dy = Math.sin(this.angle * Math.PI / 180);
    	

		return this;
	}

	this.draw = function() {
		context.beginPath();
		context.moveTo(this.x1, this.y1);
		context.lineTo(this.x2, this.y2);
		context.strokeStyle = "#ffffff";
		context.stroke();

		return this;
	}
}

function Snow() {
	this.x = randomBetween(0, canvas.width);
	this.y = randomBetween(0, canvas.height);
	this.radius = 1;

	this.update = function() {
		this.y++;
		this.x--;

		if (this.x < 0) {
			this.x = canvas.width;
		};

		if (this.y > canvas.height) {
			this.x = randomBetween(0, canvas.width);
			this.y = 0;
		};

		return this;
	}

	this.draw = function() {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
		context.fillStyle = "#ffffff";
		context.fill();

		return this;
	}
}