var destynation = [1,1];
var start = [5,5];
var boardSize = [];
var obstycle  = {};



function makeGrid(x,y) {
    boardSize = [x,y];
    var result = '';
    for (let yi = 0; yi < x; yi++) {
        result += `<tr>`;
        for (let xi = 0; xi < x; xi++) {
            result += `<td id="x${xi}y${yi}" onmouseover="hoverObstycle(${xi}, ${yi})" onclick="input(${xi},${yi})"></td>`;
        }
        result += `</tr>`;
    }
    document.querySelector(`tbody`).innerHTML = result;
}

class Node {
    origin = [-1,-1];
    myPosition = [-1, -1];
    distanceStart = 0;
    distanceDest  = 0;
    totalCost = 0;
    isWork = true;

    constructor(origin, myCords, originCostDest, originCostStart, isWork = true)  {
        this.origin = origin;
        this.myPosition = myCords;
        this.distanceStart = originCostStart;
        this.distanceDest = originCostDest;
        this.totalCost = this.distanceStart+this.distanceDest;
        this.isWork = isWork;
    }
}

function AStarV2() {
    var nodes = {};
    let cost = [
        //straight
        10,
        //diagnal
        14
    ]
    let directions = [
        [-1, 0, cost[0]],
        [1,  0, cost[0]],
        [-1,-1, cost[1]],
        [0, -1, cost[0]],
        [1, -1, cost[1]],
        [-1, 1, cost[1]],
        [0,  1, cost[0]],
        [1,  1, cost[1]],
    ];
    nodes[`x${start[0]}y${start[1]}`] = new Node(null, start, calculateDst(start,destynation), 0, true);
    for (var x = 0; x < 20*20*5; x++) {
        let lowTotalNode = -1;
        for (node in nodes) {
            if (!nodes[node].isWork) continue;
            if (nodes[node].origin === null && x != 0) continue;
            if ((lowTotalNode == -1)) {
                lowTotalNode = node;
                continue;
            }
            if (nodes[lowTotalNode].totalCost >= nodes[node].totalCost) {
                lowTotalNode = node;
            }
        }
        if (lowTotalNode == -1) return null;
        for (let i = 0; i < directions.length; i++) {
            let newCordinates = [nodes[lowTotalNode].myPosition[0]+directions[i][0],nodes[lowTotalNode].myPosition[1]+directions[i][1]];
            if (newCordinates[0] == destynation[0] && newCordinates[1] == destynation[1]) {
                console.log(nodes);
                console.log("PATH FOUND");
                let path = [];
                path.push(nodes[lowTotalNode]);
                let couter = 0;
                while (true) {
                    if (couter > 100) break;
                    path.push(nodes[path[path.length-1].origin]);
                    console.log(path)
                    if (nodes[path[path.length-1].origin].origin == null) break;
                    couter+=1;
                }
                console.log(path)
                drawPath(path);
                return;
            }
            if (obstycle[`x${newCordinates[0]}y${newCordinates[1]}`] !== undefined) continue;
            if (!isInMap(newCordinates[0], newCordinates[1])) continue;
            let newOrigine = `x${newCordinates[0]}y${newCordinates[1]}`;

            let nodeDistanceToStart =       nodes[lowTotalNode].distanceStart+directions[i][2];
            let nodeDistanceToDestynation = calculateDst(newCordinates, destynation);

            let testNode = new Node(lowTotalNode, newCordinates, nodeDistanceToDestynation,nodeDistanceToStart,true);
            if (nodes[newOrigine] !== undefined) {
                continue
            }

            nodes[newOrigine] = testNode;
            
        }
        nodes[lowTotalNode].isWork = false;
    }
    return nodes;
}

function AStarV1() {
    if (!validStartDest()) return false;
    var path = [];
    let directions = [
        [-1, 0],
        [1,  0],
        [-1,-1],
        [0, -1],
        [1, -1],
        [-1, 1],
        [0,  1],
        [1,  1],
    ];
    path.push(start);
    for (let i = 0; i < 60; i++)  {
        var bestMove      = -1;
        var bestMoveScore = -1;
        for (let i = 0; i < directions.length; i++) {
            let newCords = [path[path.length-1][0]+directions[i][0], path[path.length-1][1]+directions[i][1]];
            if (!isInMap(newCords[0], newCords[1])) {console.log("skipped bc: outside map");continue;}
            if (obstycle[`x${newCords[0]}y${newCords[1]}`] !== undefined) {console.log("skipped bc: obstycle in way");continue;}
            if (isInArray(path, [newCords[0], newCords[1]])) {console.log("skipped bc: no step back");continue;}
            
            let distance = calculateDst(newCords, destynation);

            if (distance < bestMoveScore || bestMoveScore == -1) {
                bestMove = i;
                bestMoveScore = distance;
            }
        }
        if (destynation[0] == path[path.length-1][0] && destynation[1] == path[path.length-1][1])  return path;
        if (bestMove == -1) return null;
        path.push([path[path.length-1][0]+directions[bestMove][0], path[path.length-1][1]+directions[bestMove][1]]);
    }

    return path;
}

function calculateDst(cords1, cords2) {
    return Math.round(Math.sqrt(
        Math.pow(cords2[0]-cords1[0],2)
        +
        Math.pow(cords2[1]-cords1[1],2)
    )*10);
    // let dx = Math.abs(cords2[0] - cords1[0]);
    // let dy = Math.abs(cords2[1] - cords1[1]);
    // let min = Math.min(dx, dy);
    // let max = Math.max(dx, dy);
    // let diagonalSteps = min;
    // let straightSteps = max - min;

    // return Math.sqrt(2)*diagonalSteps+straightSteps;
    // return Math.abs(
    //     cords2[0]-cords1[0]
    //     +
    //     cords2[1]-cords1[1]
    // )
}

function isInArray(array, element) {
    for (let i = 0; i < array.length; i++) {
        if (array[i][0] == element[0] && array[i][1] == element[1]) return true;
    }
    return false;
}
function setDestStart(setDest, x,y) {
    if (setDest) {
        destynation = [x,y];
        setDest = false;
    } else {
        start = [x,y];
        setDest = true;
    }
    drawDestStart();
}

function drawDestStart() {
    if (!validStartDest()) return false;
    document.querySelector(`#x${start[0]}y${start[1]}`).style.backgroundColor = "green";
    document.querySelector(`#x${destynation[0]}y${destynation[1]}`).style.backgroundColor = "red";
    
}

function clearStyle() {
    document.querySelectorAll("td[style]").forEach((e) => {
        e.style = "";
    });
    drawObstycle();
    drawDestStart();
}

function input(x,y) {
    var addres = document.querySelector(`input[name="input"]:checked`);
    if (addres == null) return;
    addres = parseInt(addres.value); 
    switch (addres) {
        case 0:
            setDestStart(true, x, y);
        break;
        case 1:
            setDestStart(false, x, y);
        break;
        case 2:
            setObstycle(x,y);
        break;
    }
}

function setObstycle(x,y) {
    obstycle[`x${x}y${y}`] = true;
    clearStyle();
    drawObstycle();
}

function drawObstycle() {
    for (var key in obstycle) {
        document.querySelector(`#${key}`).style.backgroundColor = "black";
    }
}

function isInMap(x,y) {
    if (x < 0 || x >= boardSize[0]) return false;
    if (y < 0 || y >= boardSize[1]) return false;
    return true;
}
function validStartDest() {
    if (!isInMap(destynation[0], destynation[1]) || !isInMap(start[0], start[1])) return false;
    if (destynation[0] == start[0] && destynation[1] == start[1]) return false;
    return true;
}

function showPath() {
    let path = AStarV2();
    drawPath(path);
    console.log(path);
}
function drawPath(path) {
    // path.forEach((p) => {
    //     document.querySelector(`#x${p[0]}y${p[1]}`).style.backgroundColor = "orange";
    // });
    // document.querySelector(`#x${path[0][0]}y${path[0][1]}`).style.backgroundColor = "green";
    // document.querySelector(`#x${path[path.length-1][0]}y${path[path.length-1][1]}`).style.backgroundColor = "red";
    console.log(path);
    for (let node in path) {
        node = path[node];
        console.log(node.totalCost);
        //document.querySelector(`#x${node.myPosition[0]}y${node.myPosition[1]}`).innerHTML = `${node.distanceDest} ${node.distanceStart}<br>${Math.floor(node.totalCost)}`;
        document.querySelector(`#x${node.myPosition[0]}y${node.myPosition[1]}`).style.backgroundColor = "blue";

    }
}
makeGrid(20, 20);
drawDestStart();
//showPath();

var hover = false;

function hoverObstycle(x,y) {
    if (!hover) return;
    setObstycle(x,y);
}

window.addEventListener("mousedown", (e) => {
    hover = true;
});

document.addEventListener("mouseup", (e) => {
    hover = false;
});