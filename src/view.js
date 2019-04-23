const _ = require('ramda');
const $ = require('jquery');

const root = document.getElementById("root");

const gridContainer = document.getElementById("grid");

for (let i=0; i<4; i++) {
    for (let j=0; j<4; j++) {
        const d = document.createElement("div");
        d.className = "grid-cell";
        d.id = "grid-cell-" + i + "-" + j;
        gridContainer.appendChild(d);
    }
}

let gridCell = document.getElementsByClassName("grid-cell");
_.forEach(g => {
    var s = g.style;
    s.height = "100px";
    s.width = "100px";
    s.backgroundColor = "rgba(147,201,235,0.5)";
    s.position = "absolute";
    s.borderRadius = "6px";
    }, gridCell);

const cellSapce=20;
const cellSideLength=100;

const getPos = i =>  cellSapce + i * (cellSapce + cellSideLength);

for(let i= 0 ;i< 4; i++) {
    for (let j = 0; j < 4; j++) {
        const gridCellStyle = document.getElementById("grid-cell-"+ i +"-" + j).style;
        gridCellStyle.top = getPos(i) + "px";
        gridCellStyle.left = getPos(j) + "px";
    }
}    


function getNumberBackgroundColor(number){
    switch(number){
        case 2:return"#eee4da";break;
        case 4:return"#ede0c8";break;
        case 8:return"#f2b179";break;
        case 16:return"#f59563";break;
        case 32:return"#f67e5f";break;
        case 64:return"#f65e3b";break;
        case 128:return"#edcf72";break;
        case 256:return"#edcc61";break;
        case 512:return"#9c0";break;
        case 1024:return"#33b5e5";break;
        case 2048:return"#09c";break;
        case 4096:return"#a6c";break;
        case 8192:return"#93c";break;
    }
    return "black";
}

function getNumberColor(number){
    if(number<=4)
        return "#776e65";
    return "white";
}

// Grid -> Html msg
const render = grid => {
    $(".number-cell").remove();
    for(let i= 0 ;i< 4; i++) {
        for (let j = 0; j < 4; j++) {
            const d = document.createElement("div");
            d.className = "number-cell";
            gridContainer.appendChild(d);
            d.borderRadius = "6px";
            d.style.position = "absolute";
            d.style.fontSize = grid[i][j] > 512 ? "40px" : "60px";
            d.style.fontFamily = "Arial";
            d.style.fontWeight = "bold";
            d.style.textAlign = "center";
            d.style.lineHeight = "100px";

            if (grid[i][j] != 0) {
                d.style.width = "100px";
                d.style.height = "100px";
                d.style.top = getPos(i) + "px";
                d.style.left = getPos(j) + "px";
                d.textContent = grid[i][j];
                d.style.backgroundColor = getNumberBackgroundColor(grid[i][j]);
                d.style.color = getNumberColor(grid[i][j]);
            }
        }
    }
}

const displayScore = score => {
    $("#score").text(score);
}    

module.exports.render = render;
module.exports.displayScore = displayScore;