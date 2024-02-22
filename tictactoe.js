const playerX = 'x'
const playerO = 'circle'
const winningNumbers = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
]
let xWinCount = 0;
let oWinCount = 0;
const cellElements = document.querySelectorAll('[data-cell]')
const boardElement = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
const winningMessageTextElement = document.getElementById('winningMessageText')
let isPlayer_O_Turn = false
let gameIsActive = true; 

startGame()

restartButton.addEventListener('click', startGame)

function startGame() {
    gameIsActive = true;
    isPlayer_O_Turn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(playerX, playerO, 'highlight'); 
        cell.removeEventListener('click', handleCellClick);
        cell.addEventListener('click', handleCellClick, { once: true });
    });
    setBoardHoverClass();
    winningMessageElement.classList.remove('show');
}


function handleCellClick(e) {
    if (!gameIsActive) return; 

    const cell = e.target;
    const currentClass = isPlayer_O_Turn ? playerO : playerX;
    placeMark(cell, currentClass);
    const winningCombination = checkWin(currentClass);
    if (winningCombination) {
        gameIsActive = false; // Deactivate game on win
        setTimeout(() => endGame(false, winningCombination), 2000);
        highlightWinningCells(winningCombination);
    } else if (isDraw()) {
        gameIsActive = false; // Deactivate game on draw
        setTimeout(() => endGame(true), 2000);
    } else {
        swapTurns();
        setBoardHoverClass();
    }
}


function isDraw() {
	return [...cellElements].every(cell => {
		return cell.classList.contains(playerX) || cell.classList.contains(playerO)
	})
}

function placeMark(cell, currentClass) {
	cell.classList.add(currentClass)
}

function swapTurns() {
	isPlayer_O_Turn = !isPlayer_O_Turn
}

function setBoardHoverClass() {
	boardElement.classList.remove(playerX)
	boardElement.classList.remove(playerO)
	if (isPlayer_O_Turn) {
		boardElement.classList.add(playerO)
	} else {
		boardElement.classList.add(playerX)
	}
}

function checkWin(currentClass) {
    return winningNumbers.find(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    }) || null;
}


function triggerConfetti() {
    // This function will create a lot of confetti using the canvas-confetti library
    confetti({
        particleCount: 1000,
        spread: 100,
        origin: { y: 0.6 }
    });
}

function updateWinCounter(winner) {
    if (winner === "X") {
        xWinCount++;
        document.getElementById('xWins').innerText = `X Wins: ${xWinCount}`;
    } else if (winner === "O") {
        oWinCount++;
        document.getElementById('oWins').innerText = `O Wins: ${oWinCount}`;
    }
}

function endGame(draw, winningCombination = []) {
    if (!draw) {
        let winner = isPlayer_O_Turn ? "O" : "X";
        updateWinCounter(winner); // Update the win counter with the correct winner
        winningMessageTextElement.innerText = `Player ${winner} Wins!`;
    } else {
        winningMessageTextElement.innerText = "It's a Draw!";
    }
    setTimeout(() => winningMessageElement.classList.add('show'), 2000);
}


function highlightWinningCells(winningCombination) {
    winningCombination.forEach(index => {
        cellElements[index].classList.add('highlight');
    });
}