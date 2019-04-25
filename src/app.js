const $ = require('jquery');
const _ = require('ramda');
const v = require('./view.js');

var score = 0;

// [Int] -> [Int] 当前提供合并一行的功能, 需要 从哪儿移动到哪儿: [(Int,Int,Int,Int)] 和 合并的值 Int
function merge(row) {
    function combine(arr) {
        for (let i=0, j=i+1; j<arr.length; i++,j++) {
            if (arr[i] === arr[j]) {
                arr[i] *= 2; 
                score += arr[i];
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
    let candidates = getZeroes(grid);
    let pick = choose(candidates);
    let val = choose([2,2,2,2,2,2,4]);
    v.showNumber(pick[0], pick[1], val);
    return setSquare(grid, pick, val);
}

// Grid -> Bool
const check2048 = grid => _.length(_.filter(x => x === 2048, _.flatten(grid))) !== 0

const start = () => addTile(addTile(_.repeat([0,0,0,0], 4)));

const keyDirection = {
    "37": moveLeft,
    "38": moveUp,
    "39": moveRight,
    "40": moveDown
}

const compare = (grid, keyCode) => {
    let newGrid = keyDirection[keyCode](grid);
    if (!_.equals(newGrid, grid)) {
        return addTile(newGrid);
    }
    return grid;
}

let grid = start();
v.render(grid);
v.displayScore(score / 4);

document.onkeydown = function(event) {
    if (!canMove(grid)) {
        alert("Game Over!");
        grid = start();
    } else if (check2048(grid)) {
        alert("You Win!");
        grid = start();
    } else {
        grid = compare(grid, event.keyCode);
    }

    v.displayScore(score / 4);
    v.render(grid);
}