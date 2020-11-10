let cell;
let offset;

function setup() {
    let size = Math.min(windowWidth, windowHeight);
    let canvas = createCanvas(size, size);
    canvas.position(windowWidth / 2 - size / 2, size / 5);
    let button = createButton('reset');
    button.position(size * 0.4 + windowWidth / 2 - size / 2, size + size * 0.07 + size / 5);
    button.size(size * 0.2, size * 0.1);
    button.style('font-size: ' + size * 0.07 + 'px; color: white; border-color: white; background-color: black; border-width: 5px');
    button.mousePressed(reset);
    cell = width / 3;
    offset = width / 20;
}

let turn = 0;

//creating an empty board
let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

function draw() {
    background(0);
    strokeWeight(6)
    stroke(255);
    noFill();

    //drawing the board
    for (let i = 1; i <= 2; i++) {
        line(i * width / 3, 0, i * width / 3, width);
        line(0, i * width / 3, height, i * width / 3);
    }

    //drawing X and O
    for (let i = 0; i <= 2; i++) {
        for (let j = 0; j <= 2; j++) {
            switch (board[i][j]) {
                case 'O':
                    circle(i * cell + cell / 2, j * cell + cell / 2, cell - offset);
                    break;
                case 'X':
                    line(i * cell + offset, j * cell + offset, (i + 1) * cell - offset, (j + 1) * cell - offset);
                    line((i + 1) * cell - offset, j * cell + offset, i * cell + offset, (j + 1) * cell - offset);
                    break;
            }
        }
    }

    //calling a function to check if the game is over
    //true, indicates that it is the main board
    gameOver(board, true);
}

function mouseClicked() {
    //calculating click position on board
    let j = floor(mouseY / cell);
    let i = floor(mouseX / cell);
    if ((turn % 2 == 0) && !gameOver(board)[0]) {
        if (board[i][j] == '') {
            //addin the X to the board
            board[i][j] = 'X';
            turn++;

            //calling the ai function
            ai();
        }
    }
}


function gameOver(board, isReal) {
    //a function to check if the game is over
    stroke(255, 0, 0);
    strokeWeight(6);
    let game = [false, 'tie'];
    for (let i = 0; i <= 2; i++) {
        if (board[i][0] === board[i][1] && board[i][0] === board[i][2] && (board[i][0] === 'X' || board[i][0] === 'O')) {
            //cehcling horizontal
            game[0] = true; //telling that the game is over
            game[1] = board[i][0]; //telling who won
            if (isReal) {
                //if the board is the main board
                //this will draw lies over the three winning cells.
                line(i * cell + cell / 2, offset, i * cell + cell / 2, width - offset);
                break;
            }
        } else if (board[0][i] === board[1][i] && board[0][i] === board[2][i] && (board[0][i] === 'X' || board[0][i] === 'O')) {
            //checking vertical
            game[0] = true;
            game[1] = board[0][i];
            if (isReal) {
                line(offset, i * cell + cell / 2, height - offset, i * cell + cell / 2);
                break;
            }
        }
    }

    //cecking diagonals
    if (board[1][1] === board[0][0] && board[1][1] === board[2][2] && (board[1][1] === 'X' || board[1][1] === 'O')) {
        game[0] = true;
        game[1] = board[1][1];
        if (isReal) {
            line(offset, offset, width - offset, height - offset);
        }
    } else if (board[1][1] === board[0][2] && board[1][1] === board[2][0] && (board[1][1] === 'X' || board[1][1] === 'O')) {
        game[0] = true;
        game[1] = board[1][1];
        if (isReal) {
            line(width - offset, offset, offset, height - offset);
        }
    }

    //returning if the game is over, and who won.
    //if no one won, the function will return [false, 'tie'];
    return game;
}

function ai() {
    if (!gameOver(board, false)[0] && turn < 9) {
        //calling the minimax function
        //minimax returns an array, [score of move, [move]]
        let move = minimax(board, 8 - turn, true)[1];

        //addin O to the board, using the move given by minimax
        board[move[0]][move[1]] = 'O';
        turn++;
    }
}

function minimax(board, depth, maximizing) {
    if (depth == -1 || gameOver(board, false)[0]) {
        //if the board is full, or the game is over, the function will return depends on who wins.
        let score;
        if (gameOver(board, false)[1] == 'X') {
            score = -1;
        } else if (gameOver(board, false)[1] == 'O') {
            score = 1
        } else if (gameOver(board, false)[1] == 'tie') {
            score = 0;
        }

        return [score];
    }

    if (maximizing) {
        let maxValue = -Infinity;
        let move;
        for (let i = 0; i <= 2; i++) {
            for (let j = 0; j <= 2; j++) {
                if (board[i][j] == '') {
                    //going through every empty cell on the board
                    let next = clone(board); //creating a copy of the board
                    next[i][j] = 'O'; //adding O to the empty cell
                    let eval = minimax(next, depth - 1, false); //calling minimax on the child.
                    if (eval > maxValue) {
                        //if the value of the child is bigger than the max value
                        //the max value will be replaced
                        maxValue = eval;
                        //saving the move that leads to max value
                        move = [i, j];
                    }
                }
            }
        }
        //returning the value and the move captured
        return [maxValue, move];
    } else {
        let minValue = +Infinity;
        for (let i = 0; i <= 2; i++) {
            for (let j = 0; j <= 2; j++) {
                if (board[i][j] == '') {
                    //going through every empty cell of the board
                    let next = clone(board); //creating a copy
                    next[i][j] = 'X'; //adding 'X' to the empty cell
                    let eval = minimax(next, depth - 1, true)[0]; //calling minimax on the child
                    if (eval < minValue) {
                        //replacing minimum value with a new, smaller one.
                        //no need to save move on this one
                        //as this is not the move the AI would do.
                        minValue = eval;
                    }
                }
            }
        }
        //returning the maximum value
        return minValue;
    }
}

//a function that clones an array
//because "array = ogArray" would make a pointer and not clone it.
function clone(board) {
    var newArray = [];

    for (var i = 0; i < board.length; i++) {
        newArray[i] = board[i].slice();
    }

    return newArray;
}

function reset() {
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    turn = 0;
}