const $ = require('jquery');
const _ = require('ramda');

// [Int] -> [Int]
function merge(row) {
    function combine(arr) {
        for (let i=0, j=i+1; j<arr.length; i++,j++) {
            if (arr[i] === arr[j]) {
                arr[i] *= 2;
                arr[j] = 0;
                i++;
                j++;
            }
        }
        return _.filter(x => x !== 0, arr);
    }
    let merged = combine(_.filter(x => x !== 0, row))
    let padding =  _.repeat(0, row.length - merged.length)
    return _.concat(merged, padding)
}

// Grid : [[]]
// Grid -> Grid
const moveLeft = grid => grid.map(merge)
const moveRight = grid => moveLeft(grid.map(_.reverse)).map(_.reverse)
const moveUp = grid => _.transpose(moveLeft(_.transpose(grid)))
const moveDown = grid =>  _.transpose(moveRight(_.transpose(grid)))

// Grid -> [(Int, Int)]
const getZeroes = grid => {
    let singleRow = n => _.zip(_.repeat(n, 4), [0,1,2,3])
    let coordinates = _.unnest(_.map(singleRow, [0,1,2,3]))
    return _.filter(([row, col]) => grid[row][col] === 0, coordinates)
}

// [Int] -> [Int] -> [Int] -> [Int]
const concat = (l1, l2, l3) => {
    return _.concat(_.concat(l1, l2), l3)
}

// Grid -> (Int, Int) -> Int -> Grid
const setSquare = (grid, [row, col], val) => {
    let pre = _.take(row, grid)
    let mid = concat(_.take(col, grid[row]), [val], _.drop(col + 1, grid[row]))
    let post = _.drop(row + 1, grid)
    return _.concat(_.append(mid, pre), post)
}

// Grid -> Bool           
const canMove = grid => {
    let directions = [moveLeft(grid), moveRight(grid), moveUp(grid), moveDown(grid)]
    let allChoices = _.map(_.compose(_.length, getZeroes), directions)
    return _.sum(allChoices) > 0
}

// [a] -> Int
const choose = arr => {
    let i = Math.floor(Math.random() * (_.length(arr)))
    return arr[i]
}

// Grid -> Grid
const addTile = grid => {
    let candidates = getZeroes(grid)
    let pick = choose(candidates)
    let val = choose([2,2,2,2,2,2,4])
    // showNumber(pick[0], pick[1], val)
    return setSquare(grid, pick, val)
}

// Grid -> Bool
const check2048 = grid => _.length(_.filter(x => x === 2048, _.flatten(grid))) !== 0

const start = () => addTile(addTile(_.repeat([0,0,0,0], 4)));



const root = document.getElementById("root");
for (let i=0; i<4; i++) {
    for (let j=0; j<4; j++) {
        const d = document.createElement("div");
        d.className = "grid-cell";
        d.id = "grid-cell-" + i + "-" + j;
        root.appendChild(d);
    }
}


const l = console.log;


const rootStyle = document.getElementById("root").style;
rootStyle.width = "460px";
rootStyle.height = "460px";
rootStyle.padding = "20px";
rootStyle.margin = "5px auto";
rootStyle.top = "50px";
rootStyle.backgroundColor = "rgba(139,185,202,0.5)";
rootStyle.borderRadius = "10px";
rootStyle.position = "relative";

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

// Grid -> Html msg
const render = grid => {
    $(".number-cell").remove();
    for(let i= 0 ;i< 4; i++) {
        for (let j = 0; j < 4; j++) {
            const d = document.createElement("div");
            d.className = "number-cell";
            root.appendChild(d);
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

let grid = start();
render(grid);

document.onkeydown = function(event) {
    if (event.keyCode == 37) {
        grid = addTile(moveLeft(grid));
    } else if (event.keyCode == 38) {
        grid = addTile(moveUp(grid));
    } else if (event.keyCode == 39) {
        grid = addTile(moveRight(grid));
    } else if (event.keyCode == 40) {
        grid = addTile(moveDown(grid));
    } else {
    }
    render(grid);
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


