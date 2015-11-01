var canvas = document.getElementById("Tree");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var line = [];
var snow = [];
var leaves = [];

var ctr = 0;

var level = 10;
var flag = true;

clearCanvas(); 
// generateSnow(10);
generateLine();
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

function generateLeaf(x,y) {
	leaves.push(new Leaf(x,y));
}

function generateLine() {
	line.push(new Line(canvas.width/2, canvas.height-100, 260, 280, 150));
	// line.push(new Line(canvas.width/2+300, canvas.height-100, 260, 280, 150));
}

function drawTree() {
	clearCanvas();
	for (var i = 0; i < snow.length; i++) {
		snow[i].update().draw();
	}
	for (var i = 0; i < line.length; i++) {
		line[i].update().draw();
	}
	for (var i = 0; i < leaves.length; i++) {
		leaves[i].update().draw();
	}
	// flag = true;
}

function Line(x,y,ang1,ang2,life) {
	this.x1 = x;
	this.y1 = y;
	this.x2 = this.x1;
	this.y2 = this.y1;
	this.angle = randomBetween(ang1,ang2);
	this.speed = 5;
	this.life = life;
	this.flag = true;

	if (life <= 50) {
		this.flag = false;
	};

	this.update = function() {
		this.life--;
    	if (this.life > 50) {
    		var dx = Math.cos(this.angle * Math.PI / 180);
    		var dy = Math.sin(this.angle * Math.PI / 180);
    		this.x2 += dx;
    		this.y2	+= dy;
    	};
    	if (this.life <= 50 && this.flag) {
    		var rand = randomBetween(5, 10);
    		for (var i = 0; i < rand; i++) {
    			line.push(new Line(this.x2, this.y2, ang1-40, ang2+40, life-20));
    			if (ctr == 1) {
    				generateLeaf(this.x2, this.y2);
    			};
    		};
    		ctr = 1;
    		level--;
    		this.flag = false;
    		// console.log(rand);
    		// flag = false;
    	};

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
	this.windx = randomBetween(-1,2);
	this.windy = randomBetween(1,3);

	this.update = function() {
		this.y+=this.windy;
		this.x-=this.windx;

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

function Leaf(x,y) {
	this.x = x;
	this.y = y;
	this.radius = 10;
	this.r = randomBetween(100,255);
	this.g = randomBetween(100,255);
	this.b = randomBetween(0,0);
	this.fall = false;

	this.update = function() {
		// if (!this.fall) {
		// 	var f = randomBetween(1, 5000);
		// 	if (f == 1) {
		// 		this.fall = true;
		// 	};
		// };
		// if (this.fall) {
		// 	if (this.y <= canvas.height-100) {
		// 		this.y++;
		// 	};
		// };

		return this;
	}

	this.draw = function() {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
		context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",0.1)";
		context.fill();
	}
}