var Gboard;
var possibleAiMoves = [];
const Human = '0';
const Ai = "X";
const winingComb = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [2, 5, 8],
    [1, 4, 7],
];
const cell = document.querySelectorAll('.cell');
startGame();

function startGame() {
    document.querySelector('.endgame').style.display = "none";
    Gboard = Array.from(Array(9).keys());
    for (var i = 0; i < cell.length; i++) {
        cell[i].innerText = " ";
        cell[i].style.removeProperty('background-color');
        cell[i].addEventListener('click', turnClick, false);
    }
    document.getElementById('aiPredictionDisplay').innerHTML = ""; // Clear AI prediction display
}

function turnClick(square) {
    if (typeof Gboard[square.target.id] == 'number') {
        turn(square.target.id, Human);
        if (!checkTie()) showPossibleAIMoves(); // Show AI predictions before AI makes its move
        if (!checkTie()) turn(bestSpot(), Ai);
    }
}

function turn(squareId, player) {
    Gboard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(Gboard, player);
    if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winingComb.entries()) {
        if (win.every(ele => plays.indexOf(ele) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winingComb[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player == Human ? "lightblue" : "red";
    }
    for (var i = 0; i < cell.length; i++) {
        cell[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == Human ? "You won!" : "You lose.");
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "flex";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
    return Gboard.filter(x => typeof x == 'number');
}

function bestSpot() {
    return minimax(Gboard, Ai).index;
}

function checkTie() {
    if (emptySquares().length == 0) {
        for (var i = 0; i < cell.length; i++) {
            cell[i].style.backgroundColor = "lightgreen";
            cell[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!");
        return true;
    }
    return false;
}

// AI prediction logic
function showPossibleAIMoves() {
    const aiBoardStates = emptySquares().map((index, i) => {
        let boardCopy = [...Gboard];
        boardCopy[index] = Ai; // Simulate AI move
        return { board: boardCopy, moveNumber: i + 1 }; // Track the move number
    });

    let aiPredictionDisplay = document.getElementById("aiPredictionDisplay");
    aiPredictionDisplay.innerHTML = ""; // Clear previous predictions

    aiBoardStates.forEach(stateObj => {
        let boardStateDiv = document.createElement("div");
        boardStateDiv.classList.add("board-state");

        // Create a label for each AI prediction
        let predictionLabel = document.createElement("p");
        predictionLabel.innerText = `AI Prediction ${stateObj.moveNumber}`;
        predictionLabel.style.fontWeight = "bold";
        predictionLabel.style.color = "#61dafb";

        boardStateDiv.appendChild(predictionLabel); // Append label

        let table = document.createElement("table");
        for (let i = 0; i < 3; i++) {
            let row = document.createElement("tr");
            for (let j = 0; j < 3; j++) {
                let cell = document.createElement("td");
                cell.innerText = stateObj.board[i * 3 + j] === Ai ? "X" : stateObj.board[i * 3 + j] === Human ? "O" : "";
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        boardStateDiv.appendChild(table);
        aiPredictionDisplay.appendChild(boardStateDiv);
    });
}

// Minimax AI implementation
function minimax(newBoard, player) {
    var availSpots = emptySquares(newBoard);

    if (checkWin(newBoard, Human)) {
        return { score: -10 };
    } else if (checkWin(newBoard, Ai)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == Ai) {
            var result = minimax(newBoard, Human);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, Ai);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;
        moves.push(move);
    }

    var bestMove;
    if (player === Ai) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    }
    return bestMove;
}
