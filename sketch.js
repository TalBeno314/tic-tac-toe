let cell;
let offset;

function setup() {
    let size = Math.min(windowWidth, windowHeight);
    createCanvas(size, size);
    cell = width / 3;
    offset = width / 20;
}
let turn = 0;

let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

function draw() {
    background(256);
    strokeWeight(6)
    stroke(0);
    for (let i = 1; i <= 3; i++) {
        line(i * width / 3, 0, i * width / 3, width);
        line(0, i * width / 3, height, i * width / 3);
    }

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

    gameOver(board, true);
}

function mouseClicked() {
    console.log(turn);
    let j = floor(mouseY / cell);
    let i = floor(mouseX / cell);
    if ((turn % 2 == 0) && !gameOver(board)[0]) {
        if (board[i][j] == '') {
            board[i][j] = 'X';
            turn++;
        }

        ai();
    }
}


function gameOver(board, isReal) {
    stroke(255, 0, 0);
    strokeWeight(6);
    let game = [false, 'tie'];
    for (let i = 0; i <= 2; i++) {
        if (board[i][0] === board[i][1] && board[i][0] === board[i][2] && (board[i][0] === 'X' || board[i][0] === 'O')) {
            game[0] = true;
            game[1] = board[i][0];
            if (isReal) {
                line(i * cell + cell / 2, offset, i * cell + cell / 2, width - offset);
                break;
            }
        } else if (board[0][i] === board[1][i] && board[0][i] === board[2][i] && (board[0][i] === 'X' || board[0][i] === 'O')) {
            game[0] = true;
            game[1] = board[0][i];
            if (isReal) {
                line(offset, i * cell + cell / 2, height - offset, i * cell + cell / 2);
                break;
            }
        }
    }

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

    return game;
}

function ai() {
    if (!gameOver(board, false)[0]) {
        let move = minimax(board, 8 - turn, true)[1];

        board[move[0]][move[1]] = 'O';
        turn++;
    }
}

function minimax(board, depth, maximizing) {
    if (depth == -1 || gameOver(board, false)[0]) {
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
                    let next = clone(board);
                    next[i][j] = 'O';
                    let eval = minimax(next, depth - 1, false);
                    if (eval > maxValue) {
                        maxValue = eval;
                        move = [i, j];
                    }
                }
            }
        }
        return [maxValue, move];
    } else {
        let minValue = +Infinity;
        for (let i = 0; i <= 2; i++) {
            for (let j = 0; j <= 2; j++) {
                if (board[i][j] == '') {
                    let next = clone(board);
                    next[i][j] = 'X';
                    let eval = minimax(next, depth - 1, true)[0];
                    if (eval < minValue) {
                        minValue = eval;
                    }
                }
            }
        }
        return minValue;
    }
}

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