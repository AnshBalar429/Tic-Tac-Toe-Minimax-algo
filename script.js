var Gboard;
const Human='0';
const Ai="X";
const winingComb=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [2,4,6],
    [0,3,6],
    [2,5,8],
    [1,4,7],
]
const cell = document.querySelectorAll('.cell');
startGame();

function startGame(){
    document.querySelector('.endgame').style.display="none";
    Gboard=Array.from(Array(9).keys())
    for (var i=0;i<cell.length;i++){
        cell[i].innerText=" ";
        cell[i].style.removeProperty('background-color');
        cell[i].addEventListener('click',turnClick,false);
    }
}
function turnClick(square){
    if(typeof Gboard[square.target.id]== 'number'){
    turn(square.target.id,Human);
    if(!checkTie()) turn(bestSpot(),Ai);
    }
}
function turn(squareId,player){
    Gboard[squareId]=player;
    document.getElementById(squareId).innerText=player;
    let gameWon = checkWin(Gboard,player);
    if(gameWon) gameOver(gameWon);
}

function checkWin(board,player){
    let plays=board.reduce((a,e,i) => 
    (e===player)? a.concat(i) : a,[]);
    let gameWon=null;
    for(let [index,win] of winingComb.entries()){
        if(win.every(ele => plays.indexOf(ele) > -1 )){
            gameWon={index: index , player: player}
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon){
    for(let index of winingComb[gameWon.index]){
        document.getElementById(index).style.backgroundColor=
        gameWon.player== Human ?"lightblue" : "red";
    }
    for (var i=0;i<cell.length;i++){
        cell[i].removeEventListener('click',turnClick,false);
    }
    declareWinner(gameWon.player==Human?"You won!":"You lose."); ;
}

function declareWinner(who){
    document.querySelector(".endgame").style.display="flex"
    document.querySelector(".endgame .text").innerText=who;
}

function emptySquares(){
    return Gboard.filter( x => typeof x == 'number' );
}
function bestSpot(){
    return minimax(Gboard,Ai).index;
}

function checkTie(){
    if (emptySquares().length==0){
        for (var i=0;i<cell.length;i++){
            cell[i].style.backgroundColor="lightgreen"
            cell[i].removeEventListener('click',turnClick,false);
        }
        declareWinner("Tie Game!");
        return true;
    }   
    return false;
}
function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, Human)) {
		return {score: -10};
	} else if (checkWin(newBoard, Ai)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
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
	if(player === Ai) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}