const canvas = document.getElementById("tree");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//////////////////////////////////////////////////////////////////////////////////////

// setInterval(draw, 30);
draw();
function draw() {
    clearCanvas();
    drawTree(canvas.width / 2, canvas.height * 0.8, 50, -Math.PI / 2, 14, 10);
}

//////////////////////////////////////////////////////////////////////////////////////

function drawTree(startX, startY, length, angle, depth, branchWidth) {
    var newLength, newAngle, newDepth, maxBranch = 3,
        endX, endY, maxAngle = 2 * Math.PI / 4, subBranches;

    context.beginPath();
    context.moveTo(startX, startY);
    endX = startX + length * Math.cos(angle);
    endY = startY + length * Math.sin(angle);

    context.lineCap = 'round';
    context.lineWidth = branchWidth;
    context.lineTo(endX, endY);

    // context.strokeStyle = 'white';
    if (depth <= 2) {
        var c = (((Math.random() * 64) + 255) >> 0);
        context.strokeStyle = 'rgb(' + c + ',' + c + ',' + c + ')';
    } else {
        var c = (((Math.random() * 64) + 150) >> 0);
        context.strokeStyle = 'rgb(' + c + ',' + c + ',' + c + ')';
    }

    context.stroke();
    newDepth = depth - 1;
    if (!newDepth) {
        return;
    }

    subBranches = (Math.random() * (maxBranch - 1)) + 1;
    branchWidth *= 0.7;

    for (var i = 0; i < subBranches; i++) {
        newAngle = angle + Math.random() * maxAngle - maxAngle * 0.5;
        newLength = length * (0.7 + Math.random() * 0.2);
        drawTree(endX, endY, newLength, newAngle, newDepth, branchWidth);
    }
}

//////////////////////////////////////////////////////////////////////////////////////

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function clearCanvas() {
    context.fillStyle = "skyblue";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.shadowBlur = 16;
    context.shadowColor = 'white';
    context.fillStyle = "white";
    context.fillRect(0, canvas.height * 0.8, canvas.width, canvas.height * 0.2);
    context.shadowBlur = 0;
}
