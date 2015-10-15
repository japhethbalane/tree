var canvas = document.getElementById("Tree");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var line = [];
var snow = [];
var level = 100;
var flag = false;
var ang1 = 0; 
var ang2 = 180;

clearCanvas();
generateTrunk(); 
generateSnow(50);
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

function drawCharacter() {
	context.beginPath();
    context.arc(canvas.width-500, canvas.height-200, 15, 2 * Math.PI, false);
    context.moveTo(canvas.width-500, canvas.height-175);
    context.lineTo(canvas.width-490, canvas.height-100);
    context.lineTo(canvas.width-510, canvas.height-100);
    context.lineTo(canvas.width-500, canvas.height-175);
    context.fillStyle = "rgba(255, 255, 255, 0.85)";
    context.strokeStyle = "#ffffff";
    context.fill();
    context.stroke();
}

function generateTrunk() {
	line.push(new Line(350, canvas.height-100, 80, 100));
	line.push(new Line(canvas.width-400, canvas.height-100, 80, 100));
}

function generateSnow(count) {
	for (var i = 0; i < count; i++) {
		snow.push(new Snow());
	}
}

function drawTree() {
	clearCanvas();
	drawCharacter();
	var a = 0;
	var b = 0;
	var c = randomBetween(3, 6);
	for (var i = 0; i < snow.length && level < 0; i++) {
		snow[i].update().draw();
	};
	for (var i = 0; i < line.length && level >= 0; i++) {
		line[i].update().draw();
		if (line[i].grow) {
			flag = true;
			a = line[i].x2;
			b = line[i].y2;
			for (var j = 1; j <= c; j++) {
				line[line.length] = new Line(a, b, ang1, ang2);
				line[line.length-1].life = level;
			};
			c = randomBetween(3, 6);
		};
	};
	if (flag && level >= 0) {
		flag = false;
		level -= 19;
		ang1 -= 15;
		ang2 += 15;
	};
	if (level < 0) {
		level = -1;
		for (var i = 0; i < line.length; i++) {
			line[i].draw();
		}
	};
}

function Line(x, y, a1, a2) {
	this.x1 = x;
	this.x2 = x;
	this.y1 = y;
	this.y2 = y;
	this.angle = randomBetween(a1, a2);
	this.life = 150;
	this.grow = false;

	this.update = function() {
		var dx = Math.cos(this.angle * Math.PI / 180);
    	var dy = Math.sin(this.angle * Math.PI / 180);
    	this.life--;
    	if (this.life > 0) {
    		this.x2+=dx;
    		this.y2-=dy;
    	};
    	if (this.life == 0) {
    		this.grow = true;
    	};
    	if (this.life < 0) {
    		this.grow = false;
    	};

		return this;
	}

	this.draw = function() {
		context.beginPath();
		context.moveTo(this.x1, this.y1);
		context.lineTo(this.x2, this.y2);
		context.strokeStyle = "#ffffff";
		context.fill();
		context.stroke();

		return this;
	}
}

function Snow() {
	this.x = randomBetween(0, canvas.width);
	this.y = randomBetween(0-canvas.height, 0);
	this.radius = randomBetween(1,3);
	this.speed = this.radius;

	this.update = function() {
		this.y+=this.speed;

		if (this.y == canvas.height) {
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