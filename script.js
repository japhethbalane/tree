const canvas = document.getElementById("tree");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let trees = {};

for (let i = 100, id = 0; i < canvas.width; i += 100, id++) {
    let x = i + randomBetween(-40, 40);
    let y = canvas.height * 0.8;
    let length = randomBetween(25, 75);
    let angle = -Math.PI / 2;
    let depth = 10;
    let width = length / 5;
    trees[id] = {x_sub: 0, branches: []};
    generateTree(x, y, length, angle, depth, width, id);
}

//////////////////////////////////////////////////////////////////////////////////////

drawTrees();
function drawTrees() {
    clearCanvas();
    for (let id in trees) {
        let tree = trees[id];
        context.lineCap = 'round';
        context.strokeStyle = 'white';
        for (let branch of tree.branches) {
            if (branch.depth <= 3) {
                let c = (((Math.random() * 64) + 255) >> 0);
                context.fillStyle = 'rgba(' + c + ',' + c + ',' + c + ', 0.1)';
                context.beginPath();
                context.arc(branch.endX, branch.endY, branch.length / 2, Math.PI * 2, false);
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
            }
        }

    }
}

let imageData = context.getImageData(0, 0, canvas.width, canvas.height);

let people = [];
for (let i = 0; i < 30; i++) {
    people.push({
        x: randomBetween(0, canvas.width),
        speed: randomBetween(0, 5) * 0.2,
        direction: randomBetween(0, 2)
    })
}

setInterval(function() {
    clearCanvas();
    context.putImageData(imageData, 0, 0);

    for (let person of people) {
        context.beginPath();
        context.arc(person.x, canvas.height * 0.8 - 10, 10, Math.PI*2, false);
        context.fill();
        person.x += person.direction == 0 ? person.speed : person.speed * -1;
    }
}, 30);

//////////////////////////////////////////////////////////////////////////////////////

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
