var canvas = document.getElementById("Tree");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//////////////////////////////////////////////////////////////////////////////////////

var lines = [];
var snows = [];
var leaves = [];

var maxLineCount = 150;

//////////////////////////////////////////////////////////////////////////////////////

generateLine();
generateSnow(100);
generateLeaf();

setInterval(draw, 30);
// draw();

//////////////////////////////////////////////////////////////////////////////////////

function generateLine() {
	for (var i = 0; i < maxLineCount; i++) {
		lines.push(new Line());
	}
	initRoot();
	initChildren();
}

function generateSnow(count) {
	for (var i = 0; i < count; i++) {
		snows.push(new Snow());
	}
}

function generateLeaf() {
	for (var i = 4; i < lines.length; i++) {
		leaves.push(new Leaf(lines[i].x2,lines[i].y2));
	}
}

function initRoot() {
	lines[1].parent = null;
	lines[1].x1 = canvas.width/2;
	lines[1].y1 = canvas.height*4/5+20;
	lines[1].length = 100;
	lines[1].angle = 270;
	lines[1].x2 = canvas.width/2;
	lines[1].y2 = lines[1].y1-lines[1].length;
	lines[1].lineWidth = 5;
}

function initChildren() {
	for (var i = 1; i < lines.length/2; i++) {
		lines[i*2].parent = lines[i];
		lines[i*2+1].parent = lines[i];
	}
	for (var i = 2; i < lines.length; i++) {
		lines[i].init();
	}
}

//////////////////////////////////////////////////////////////////////////////////////

function randomBetween(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function clearCanvas() {
	context.fillStyle = "#222222";
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "#dddddd";
	context.fillRect(0, canvas.height*4/5, canvas.width, canvas.height*1/5);
}

//////////////////////////////////////////////////////////////////////////////////////

function draw() {
	clearCanvas();
	for (var i = 1; i < lines.length; i++) {
		lines[i].update().draw();
	}
	for (var i = 0; i < snows.length; i++) {
		snows[i].update().draw();
	}
	for (var i = 0; i < leaves.length; i++) {
		leaves[i].update().draw();
	}
}

//////////////////////////////////////////////////////////////////////////////////////

function Line() {
	this.parent;
	this.x1;
	this.y1;
	this.x2;
	this.y2;
	this.length;
	this.lineWidth;
	this.angle;

	this.init = function() {
		this.x1 = this.parent.x2;
		this.y1 = this.parent.y2;
		this.length = this.parent.length/1.5;
		this.angle = 270 + randomBetween(-90,90);
		this.x2 = this.x1 + Math.cos(this.angle * Math.PI / 180) * this.length;
		this.y2 = this.y1 - this.length + randomBetween(-20,20);
		this.lineWidth = this.parent.lineWidth / 1.3;
	}

	this.update = function() {
		return this;
	}

	this.draw = function() {
		context.beginPath();
		context.lineCap = "round";
		context.lineWidth = this.lineWidth;
		context.moveTo(this.x1,this.y1);
		context.lineTo(this.x2,this.y2);
		context.stroke();
	}
}

function Snow() {
	this.x = randomBetween(0, canvas.width);
	this.y = randomBetween(0, canvas.height);
	this.radius = 1;
	this.speed = randomBetween(1,3);

	this.update = function() {
		this.y += this.speed;
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

		context.beginPath();
		context.arc(this.x, this.y, this.radius*100, Math.PI * 2, false);
		context.fillStyle = "rgba(255,255,255,0.01)";
		context.fill();
		return this;
	}
}

function Leaf(x,y) {
	this.x = x;
	this.y = y;
	this.radius = 30;
	this.r = randomBetween(250,255);
	this.g = randomBetween(250,255);
	this.b = randomBetween(250,255);

	this.update = function() {
		return this;
	}

	this.draw = function() {
		// context.beginPath();
		// context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
		// context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",0.05)";
		// context.fill();

		context.beginPath();
		context.arc(this.x+30, this.y, this.radius/3, Math.PI * 2, false);
		context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",0.04)";
		context.fill();
		context.beginPath();
		context.arc(this.x-30, this.y, this.radius/3, Math.PI * 2, false);
		context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",0.04)";
		context.fill();
		context.beginPath();
		context.arc(this.x, this.y+30, this.radius/3, Math.PI * 2, false);
		context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",0.04)";
		context.fill();
		context.beginPath();
		context.arc(this.x, this.y-30, this.radius/3, Math.PI * 2, false);
		context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",0.04)";
		context.fill();

		context.beginPath();
		context.arc(this.x+50, this.y-50, this.radius/3, Math.PI * 2, false);
		context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",0.04)";
		context.fill();
		context.beginPath();
		context.arc(this.x-50, this.y+50, this.radius/3, Math.PI * 2, false);
		context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",0.04)";
		context.fill();
		context.beginPath();
		context.arc(this.x+50, this.y+50, this.radius/3, Math.PI * 2, false);
		context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",0.04)";
		context.fill();
		context.beginPath();
		context.arc(this.x-50, this.y-50, this.radius/3, Math.PI * 2, false);
		context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",0.04)";
		context.fill();
	}
}