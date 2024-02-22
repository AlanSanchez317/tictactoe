// Player identifiers
const playerX = 'x'
const playerO = 'circle'
// Winning combinations based on the index of cells in a 3x3 grid
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
// Initialize win counters for both players
let xWinCount = 0;
let oWinCount = 0;
// Query selectors to access the DOM elements
const cellElements = document.querySelectorAll('[data-cell]')
const boardElement = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
const winningMessageTextElement = document.getElementById('winningMessageText')
// Game state variables
let isPlayer_O_Turn = false
let gameIsActive = true; 

// Start the game when the page loads
startGame()

// Add event listener to the restart button to reset the game
restartButton.addEventListener('click', startGame)

// Initializes the game, setting up the board and resetting any game state
function startGame() {
    gameIsActive = true;
    isPlayer_O_Turn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(playerX, playerO, 'highlight'); // Clear all cell marks and highlights
        cell.removeEventListener('click', handleCellClick);
        cell.addEventListener('click', handleCellClick, { once: true }); // Add event listener once to prevent multiple clicks
    });
    setBoardHoverClass();
    winningMessageElement.classList.remove('show'); // Hide the winning message if visible
}

// Handles cell click events, places marks, checks for win or draw
function handleCellClick(e) {
    if (!gameIsActive) return; // Ignore clicks if the game is not active

    const cell = e.target;
    const currentClass = isPlayer_O_Turn ? playerO : playerX;
    placeMark(cell, currentClass); // Place the player's mark on the clicked cell
    const winningCombination = checkWin(currentClass);
    if (winningCombination) {
        gameIsActive = false; // Stop the game on win
        setTimeout(() => endGame(false, winningCombination), 2000); // Delay the end game actions
        highlightWinningCells(winningCombination); // Highlight winning cells
    } else if (isDraw()) {
        gameIsActive = false; // Stop the game on draw
        setTimeout(() => endGame(true), 2000); // Delay the end game actions for draw
    } else {
        swapTurns(); // Change player turns
        setBoardHoverClass(); // Update the hover class based on the current player
    }
}

// Checks if all cells are filled, indicating a draw
function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(playerX) || cell.classList.contains(playerO)
    })
}

// Adds the current player's class to the clicked cell
function placeMark(cell, currentClass) {
    cell.classList.add(currentClass)
}

// Switches the turn to the other player
function swapTurns() {
    isPlayer_O_Turn = !isPlayer_O_Turn
}

// Sets the hover class on the board based on the current player
function setBoardHoverClass() {
    boardElement.classList.remove(playerX)
    boardElement.classList.remove(playerO)
    if (isPlayer_O_Turn) {
        boardElement.classList.add(playerO)
    } else {
        boardElement.classList.add(playerX)
    }
}

// Checks if the current player has a winning combination
function checkWin(currentClass) {
    return winningNumbers.find(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    }) || null;
}

// Triggers a confetti effect (requires confetti.js library)
function triggerConfetti() {
    confetti({
        particleCount: 1000,
        spread: 100,
        origin: { y: 0.6 }
    });
}

// Updates the win counter for the victorious player
function updateWinCounter(winner) {
    if (winner === "X") {
        xWinCount++;
        document.getElementById('xWins').innerText = `X Wins: ${xWinCount}`;
    } else if (winner === "O") {
        oWinCount++;
        document.getElementById('oWins').innerText = `O Wins: ${oWinCount}`;
    }
}

// Handles the end of the game, showing the winning message and updating counters
function endGame(draw, winningCombination = []) {
    if (!draw) {
        let winner = isPlayer_O_Turn ? "O" : "X";
        updateWinCounter(winner); // Call to update the win counter with the correct winner
        winningMessageTextElement.innerText = `Player ${winner} Wins!`;
		triggerConfetti();
    } else {
        winningMessageTextElement.innerText = "It's a Draw!";
    }
    setTimeout(() => winningMessageElement.classList.add('show'), 2000); // Delay showing the winning message
}

// Highlights the cells that contributed to the win
function highlightWinningCells(winningCombination) {
    winningCombination.forEach(index => {
        cellElements[index].classList.add('highlight');
    });
}
