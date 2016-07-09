var canvas = document.getElementById("Tree");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//////////////////////////////////////////////////////////////////////////////////////
var jap = canvas.width/6;
var tree0 = new Tree(0+randomBetween(5,20),canvas.height*4/5,randomBetween(50,100));
var tree1 = new Tree(jap+randomBetween(-20,20),canvas.height*4/5,randomBetween(50,100));
var tree2 = new Tree(jap*2+randomBetween(-100,100),canvas.height*4/5,randomBetween(50,100));
var tree3 = new Tree(jap*3+randomBetween(-20,20),canvas.height*4/5,randomBetween(50,100));
var tree4 = new Tree(jap*4+randomBetween(-50,50),canvas.height*4/5,randomBetween(50,100));
var tree5 = new Tree(jap*5+randomBetween(-20,20),canvas.height*4/5,randomBetween(50,100));
var tree6 = new Tree(jap*6+randomBetween(-50,-5),canvas.height*4/5,randomBetween(50,100));

var snows = [];
var grass = []

//////////////////////////////////////////////////////////////////////////////////////

generateSnow(100);
generateGrass(5000);

setInterval(draw, 30);

//////////////////////////////////////////////////////////////////////////////////////

function generateSnow(count) {
	for (var i = 0; i < count; i++) {
		snows.push(new Snow());
	}
}

function generateGrass(count) {
	for (var i = 0; i < count; i++) {
		grass.push(new Grass());
	}
}

//////////////////////////////////////////////////////////////////////////////////////

function randomBetween(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function clearCanvas() {
	context.fillStyle = "skyblue";
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "yellowgreen";
	context.fillRect(0, canvas.height*4/5+2, canvas.width, canvas.height*1/5);
}

//////////////////////////////////////////////////////////////////////////////////////

function draw() {
	clearCanvas();
	tree0.draw();
	tree1.draw();
	tree2.draw();
	tree3.draw();
	tree4.draw();
	tree5.draw();
	tree6.draw();
	// for (var i = 0; i < snows.length; i++) {
	// 	snows[i].update().draw();
	// }
	for (var i = 0; i < grass.length; i++) {
		grass[i].draw();
	}
}

//////////////////////////////////////////////////////////////////////////////////////

function Tree(x,y,len) {
	this.lines = [];
	this.leaves = [];
	this.maxLineCount = 300;

	this.initRoot = function() {
		this.lines[1].parent = null;
		this.lines[1].x1 = x;
		this.lines[1].y1 = y;
		this.lines[1].length = len;
		this.lines[1].angle = randomBetween(260,280);
		this.lines[1].x2 = this.lines[1].x1 + Math.cos(this.lines[1].angle * Math.PI / 180) * len;
		this.lines[1].y2 = this.lines[1].y1 + Math.sin(this.lines[1].angle * Math.PI / 180) * len;
		this.lines[1].lineWidth = 5;
	}
	this.initChildren = function() {
		for (var i = 1; i < this.lines.length/2; i++) {
			this.lines[i*2].parent = this.lines[i];
			this.lines[i*2+1].parent = this.lines[i];
		}
		for (var i = 2; i < this.lines.length; i++) {
			this.lines[i].init(i);
		}
	}
	this.generateLeaf = function() {
		for (var i = 4; i < this.lines.length; i++) {
			this.leaves.push(new Leaf(this.lines[i].x2,this.lines[i].y2));
		}
	}
	this.generateLine = function() {
		for (var i = 0; i < this.maxLineCount; i++) {
			this.lines.push(new Line());
		}
		this.initRoot();
		this.initChildren();
		this.generateLeaf();
	}; this.generateLine();
	this.draw = function() {
		for (var i = 1; i < this.lines.length; i++) {
			this.lines[i].update().draw();
		}
		for (var i = 0; i < this.leaves.length; i++) {
			this.leaves[i].update().draw();
		}
	}
}

function Line() {
	this.parent;
	this.x1;
	this.y1;
	this.x2;
	this.y2;
	this.length;
	this.lineWidth;
	this.angle;

	this.init = function(test) {
		var jap;
		if (test % 2 == 0) {jap = randomBetween(-100,20);}
			else {jap = randomBetween(-20,100);}
		this.x1 = this.parent.x2;
		this.y1 = this.parent.y2;
		this.length = this.parent.length/1.4;
		this.angle = 270 + jap;
		this.x2 = this.x1 + Math.cos(this.angle * Math.PI / 180) * this.length;
		this.y2 = this.y1 + Math.sin(this.angle * Math.PI / 180) * this.length;
		this.lineWidth = this.parent.lineWidth / 1.3;
	}

	this.update = function() {
		return this;
	}

	this.draw = function() {
		context.lineWidth = this.lineWidth;
		context.strokeStyle = "#550";
		context.shadowBlur = 1;
		context.shadowColor = "brown";
		context.beginPath();
		context.moveTo(this.x1,this.y1);
		context.lineTo(this.x2,this.y2);
		context.stroke();
		context.shadowBlur = 0;
	}
}

function Leaf(x,y) {
	this.x = x;
	this.y = y;
	this.radius = 5;
	this.r = randomBetween(150,255);
	this.g = randomBetween(150,255);
	this.b = 0;

	var opacity = 1;

	var randx = randomBetween(1,15);
	var randy = randomBetween(1,15);

	this.update = function() {
		return this;
	}

	this.draw = function() {
		context.beginPath();
		context.arc(this.x+5*randx, this.y+3*randy, this.radius, Math.PI * 2, false);
		context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+","+opacity+")";
		context.fill();
		context.beginPath();
		context.arc(this.x-5*randx, this.y+3*randy, this.radius, Math.PI * 2, false);
		context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+","+opacity+")";
		context.fill();
		context.beginPath();
		context.arc(this.x+3*randy, this.y+5*randy, this.radius, Math.PI * 2, false);
		context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+","+opacity+")";
		context.fill();
		context.beginPath();
		context.arc(this.x+3*randy, this.y-5*randy, this.radius, Math.PI * 2, false);
		context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+","+opacity+")";
		context.fill();
	}
}

function Snow() {
	this.x = randomBetween(0, canvas.width);
	this.y = randomBetween(0, canvas.height);
	this.radius = 1;
	this.speed = 0.5;

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
		context.arc(this.x, this.y, this.radius*10, Math.PI * 2, false);
		context.fillStyle = "rgba(255,255,255,0.01)";
		context.fill();
		return this;
	}
}

function Grass() {
	this.x = randomBetween(0,canvas.width);
	this.y = randomBetween(canvas.height*4/5,canvas.height);
	this.draw = function() {
		context.beginPath();
		context.arc(this.x,this.y,2,Math.PI*2,false);
		context.fillStyle = "#DFFF00";
		context.fill();
	}
}

function Cloud() {

}
