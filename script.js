
//////////////////////////////////////////////////////////////////////////////////////

const canvas = document.getElementById("tree");
const context = canvas.getContext("2d");
const cover = document.getElementById("cover");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.6;

let coverOpacity = 1;
let interval = setInterval(function() { // soft opacity intro
    if (coverOpacity < 0) {
        clearInterval(interval);
    }
    cover.style.opacity = coverOpacity;
    coverOpacity -= 0.1;
}, 100);

let trees = {};
let people = [];
let snows = [];

////////////////////////////////////////////////////////////////////////////////////// support functions

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

function clearCanvas() {
    let gradient = context.createRadialGradient(
        canvas.width / 2, canvas.height * 2, canvas.height * 1,
        canvas.width / 2, canvas.height * 2, canvas.height * 2);
    gradient.addColorStop(0, '#016d9c');
    gradient.addColorStop(0.2, '#016d9c');
    gradient.addColorStop(0.4, '#004972');
    gradient.addColorStop(0.5, '#004972');
    gradient.addColorStop(1, '#002b44');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.shadowBlur = 16;
    context.shadowColor = 'white';
    context.fillStyle = "white";
    context.fillRect(0, canvas.height * 0.9, canvas.width, canvas.height * 0.1);
    context.fillRect(0, 0, canvas.width, canvas.height * 0.1);
    context.shadowBlur = 0;
};

////////////////////////////////////////////////////////////////////////////////////// initialize image data

clearCanvas(); // clear canvas

// draw mountains
let gradient = context.createLinearGradient(canvas.width/2, 0, canvas.width/2, canvas.height);
gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
gradient.addColorStop(0.3, 'rgba(255, 255, 255, 1)');
gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0)');
gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
context.fillStyle = gradient;
context.beginPath();
for (let i = 0; i < canvas.width; i += 60) {
    let x = randomBetween(i - 150, i + 160);
    let height = randomBetween(30, 200);
    let width = height * 2 + randomBetween(0, 100);

    context.moveTo(x, canvas.height * 0.9 - height);
    context.lineTo(x + width / 2, canvas.height * 0.9);
    context.lineTo(x - width / 2, canvas.height * 0.9);
}
context.closePath();
context.fill();

// draw trees
for (let i = 100, id = 0; i < canvas.width; i += 200, id++) {
    let x = i + randomBetween(-120, 120);
    let y = canvas.height * 0.9;
    let length = randomBetween(10, 50);
    let angle = -Math.PI / 2;
    let depth = 10;
    let width = length / randomBetween(4, 8);
    trees[id] = {x_sub: 0, branches: []};
    generateTree(x, y, length, angle, depth, width, id);
}
function generateTree(startX, startY, length, angle, depth, branchWidth, id) {
    let newLength, newAngle, newDepth, maxBranch = 3,
        endX, endY, maxAngle = 2 * Math.PI / 4, subBranches;

    endX = startX + length * Math.cos(angle);
    endY = startY + length * Math.sin(angle);

    context.lineWidth = branchWidth;

    trees[id].branches.push({
        startX, startY, endX, endY,
        length, angle, depth, branchWidth,
    });

    newDepth = depth - 1;
    if (!newDepth) {
        return;
    }

    subBranches = randomBetween(2, 4);
    branchWidth *= 0.7;

    for (let i = 0; i < subBranches; i++) {
        newAngle = angle + Math.random() * maxAngle - maxAngle * 0.5;
        newLength = length * (0.7 + Math.random() * 0.25);
        generateTree(endX, endY, newLength, newAngle, newDepth, branchWidth, id);
    }
}
function drawTrees() {
    for (let id in trees) {
        let tree = trees[id];
        context.lineCap = 'round';
        context.strokeStyle = 'white';
        for (let branch of tree.branches) {
            if (branch.depth <= 3) {
                let c = (((Math.random() * 64) + 255) >> 0);
                context.fillStyle = 'rgba(' + c + ',' + c + ',' + c + ', 0.2)';
                let ang = randomBetween(0, 200);
                let ang1 = Math.PI * ang * 0.01;
                let ang2 = Math.PI * randomBetween(ang, 200) * 0.01;
                context.beginPath();
                context.arc(branch.endX, branch.endY, branch.length * 0.7, ang1, ang2, false);
                context.fill();
            } else {
                context.strokeStyle = 'white';
                context.lineWidth = branch.branchWidth;
                context.shadowBlur = 16;
                context.beginPath();
                context.moveTo(branch.startX, branch.startY);
                context.lineTo(branch.endX, branch.endY);
                context.stroke();
                context.shadowBlur = 0;

                if (branch.depth == 4) {
                    context.fillStyle = 'rgba(255,255,255,0.5)';
                    context.beginPath();
                    context.arc(branch.endX, branch.endY, branch.length * 0.3, Math.PI * 2, false);
                    context.fill();
                }
            }
        }

    }
}
drawTrees();

// draw fence
context.strokeStyle = 'white';
context.shadowBlur = 10;
let fences = [];
for (var i = -50; i < canvas.width + 50; i += 25) {
    let h = 30;
    fences.push({
        height: h,
        x: i,
        visible: randomBetween(0, 4) == 0 ? false : true,
        points: [
            {x: i, y: h * 0.9},
            // {x: i, y: h * 0.7},
            {x: i, y: h * 0.5},
            // {x: i, y: h * 0.3},
            {x: i, y: h * 0.1},
        ]
    });
}
for (let i = 0; i < fences.length - 1; i++) {
    let fence = fences[i];
    let nextFence = fences[i + 1];
    let prevFence = fences[i - 1];
    if (fence.visible) {
        context.lineWidth = 0.3;
        for (let p1 of fence.points) {
            if (nextFence.visible) {
                for (let p2 of nextFence.points) {
                    context.beginPath();
                    context.moveTo(p1.x, canvas.height * 0.9 - p1.y);
                    context.lineTo(p2.x, canvas.height * 0.9 - p2.y);
                    context.stroke();
                }
            }
        }
        if (prevFence && prevFence.visible || nextFence.visible) {
            context.lineWidth = 3;
            context.beginPath();
            context.moveTo(fence.x, canvas.height * 0.9);
            context.lineTo(fence.x, canvas.height * 0.9 - (fence.height));
            context.stroke();
        }
    }
    if (fences[i - 2] && fences[i - 1] && fences[i + 2] && fences[i + 1]
        && fences[i - 2].visible && fences[i - 1].visible && !fence.visible
        && fences[i + 2].visible && fences[i + 1].visible) {
        drawLampPost(fence.x, canvas.height * 0.9 - 100);
    }
}
context.shadowBlur = 0;
context.lineWidth = 1;

// lamp post
function drawLampPost(x, y) {
    // light
    context.fillStyle = 'rgba(255, 255, 255, 0.1)';
    context.beginPath();
    context.arc(x, y, 70, Math.PI*2, false);
    context.fill();
    context.fillStyle = 'rgba(255, 255, 255, 0.1)';
    context.beginPath();
    context.arc(x, y, 60, Math.PI*2, false);
    context.fill();
    context.fillStyle = 'rgba(255, 255, 255, 0.1)';
    context.beginPath();
    context.arc(x, y, 50, Math.PI*2, false);
    context.fill();
    context.fillStyle = 'rgba(255, 255, 255, 0.1)';
    context.beginPath();
    context.arc(x, y, 40, Math.PI*2, false);
    context.fill();

    context.strokeStyle = 'white';
    context.fillStyle = 'white';
    context.lineWidth = 4;
    context.shadowBlur = 10;
    context.shadowColor = '#ddd';

    // post
    context.beginPath();
    context.moveTo(x, canvas.height * 0.9);
    context.lineTo(x, y);
    context.stroke();

    // bulb
    context.beginPath();
    context.arc(x, y, 10, Math.PI*0.8, Math.PI*2.2, false);
    context.fill();
    context.beginPath();
    context.arc(x, y + 3, 10, Math.PI*2.2, Math.PI*-1.2, false);
    context.fill();

    context.lineWidth = 1;
    context.shadowBlur = 0;
}

// get image data
let backgroundImageData = context.getImageData(0, 0, canvas.width, canvas.height);

////////////////////////////////////////////////////////////////////////////////////// initialize people

for (let i = 0; i < canvas.width; i += 150) {
    people.push(new Person());
}
function Person() {
    this.height = randomBetween(40, 60);
    this.x = randomBetween(0, canvas.width);
    this.y = canvas.height * 0.9 - this.height;
    this.speed = randomBetween(-10, 10) * 0.1;
    this.step = randomBetween(1, 10);
    this.stepSpeed = this.speed;
    if (this.speed >= -0.1 && this.speed <= 0.1) {
        this.speed *= 0.01;
    }
    this.update = function() {
        this.x += this.speed;
        if (this.x < -50) {
            this.x = canvas.width + 50;
        } else if (this.x > canvas.width + 50) {
            this.x = -50;
        }

        this.step += this.stepSpeed;
        if (this.step <= 0 || this.step >= 10) {
            this.stepSpeed *= -1;
        }
    };
    this.draw = function() {
        context.fillStyle = 'white';
        context.shadowColor = '#eee';
        context.shadowBlur = 16;

        context.beginPath(); // hoodie
        if (this.speed < 0) {
            context.arc(this.x, this.y, 8, Math.PI * 1.3, Math.PI * 0.6, false);
        } else if (this.speed > 0) {
            context.arc(this.x, this.y, 8, Math.PI * 2.4, Math.PI * 1.8, false);
        } else {
            context.arc(this.x, this.y, 8, Math.PI * 2, false);
        }
        context.fill();

        context.beginPath(); // hands
        context.arc(this.x, this.y + this.height * 0.4, 5, Math.PI * 2, false);
        context.fill();

        context.beginPath(); // body
        context.moveTo(this.x, this.y - 2.5);
        context.lineTo(this.x + 10 - this.speed * 10, this.y + this.height);
        context.lineTo(this.x - 10 - this.speed * 10, this.y + this.height);
        context.closePath();
        context.fill();

        if (this.speed != 0 && this.speed < -0.1 || this.speed > 0.1) {
            // context.fillStyle = 'red';
            context.beginPath(); // legs
            context.moveTo(this.x, this.y + 16);
            context.lineTo(this.x + this.step, this.y + this.height);
            context.lineTo(this.x - this.step, this.y + this.height);
            context.closePath();
            context.fill();

            // context.fillStyle = 'blue';
            let test = 20 - this.step;
            if (this.speed > 0) {
                test *= -1;
            }
            context.beginPath(); // cape
            context.moveTo(this.x, this.y + 16);
            context.lineTo(this.x, this.y + this.height);
            context.lineTo(this.x + test, this.y + this.height);
            context.closePath();
            context.fill();
        }

        context.shadowBlur = 0;
    }
}

////////////////////////////////////////////////////////////////////////////////////// initialize snow

for (let i = 0; i < canvas.width; i += 4) {
    snows.push(new Snow());
}
function Snow() {
    this.x = randomBetween(0, canvas.width);
    this.y = randomBetween(0, canvas.height);
    this.radius = randomBetween(10, 25) * 0.1;
    this.opacity = randomBetween(0, 100) * 0.01;
    this.speed = randomBetween(1, 10) * 0.1;

    this.isRightSwing = true;
    if (randomBetween(0, 2) == 0) { this.isRightSwing = false }
    this.minangle = 90 - randomBetween(20, 90);
    this.maxangle = 90 + randomBetween(20, 90);
    this.angle = randomBetween(this.minangle, this.maxangle);

    this.update = function() {
        if (this.y-this.radius > canvas.height) {this.y = 0-this.radius;}
        else if (this.y+this.radius < 0) {this.y = canvas.height+this.radius;}
        if (this.x-this.radius > canvas.width) {this.x = 0-this.radius;}
        else if (this.x+this.radius < 0) {this.x = canvas.width+this.radius;}

        if (this.isRightSwing) {
            this.angle--;
            if (this.angle <= this.minangle) {this.isRightSwing = false;}
        }
        else if (!this.isRightSwing) {
            this.angle++;
            if (this.angle >= this.maxangle) {this.isRightSwing = true;}
        }

        this.x += Math.cos(this.angle * (Math.PI / 180)) * this.speed;
        this.y += Math.sin(this.angle * (Math.PI / 180)) * this.speed;

        if (this.y > canvas.height) { // check y
            this.y = 0;
        }
        if (this.x < 0) { // check x
            this.x = canvas.width;
        } else if (this.x > canvas.width) {
            this.x = 0;
        }
    };
    this.draw = function() {
        context.fillStyle = 'rgba(255, 255, 255, ' + this.opacity + ')';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
        context.fill();
    };
}

////////////////////////////////////////////////////////////////////////////////////// main loop

setInterval(function() {
    context.putImageData(backgroundImageData, 0, 0); // draw image data

    for (let person of people) {
        person.update();
        person.draw();
    }

    for (let snow of snows) {
        snow.update();
        snow.draw();
    }
}, 30);

//////////////////////////////////////////////////////////////////////////////////////
