const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart');

let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let currentPlayer = 'X'; // El jugador siempre es "X", la máquina es "O"

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Manejo de clics en las celdas
function handleCellClick(event) {
    const clickedCell = event.target;
    const cellIndex = clickedCell.getAttribute('data-index');

    if (board[cellIndex] !== '' || !gameActive) {
        return;
    }

    board[cellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkResult();

    if (gameActive) {
        setTimeout(machineTurn, 500); // Espera medio segundo para que juegue la máquina
    }
}

// Turno de la máquina con lógica
function machineTurn() {
    if (!gameActive) return;

    // 1. Ver si la máquina puede ganar
    let bestMove = findBestMove('O');
    if (bestMove !== -1) {
        board[bestMove] = 'O';
        cells[bestMove].textContent = 'O';
        checkResult();
        return;
    }

    // 2. Ver si el jugador puede ganar y bloquearlo
    bestMove = findBestMove('X');
    if (bestMove !== -1) {
        board[bestMove] = 'O';
        cells[bestMove].textContent = 'O';
        checkResult();
        return;
    }

    // 3. Si no hay urgencia, elige una celda vacía
    let emptyCells = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            emptyCells.push(i);
        }
    }

    if (emptyCells.length > 0) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[randomIndex] = 'O';
        cells[randomIndex].textContent = 'O';
        checkResult();
    }
}

// Función para encontrar la mejor jugada (ya sea ganar o bloquear)
function findBestMove(player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        let values = [board[a], board[b], board[c]];

        // Si el jugador tiene dos en línea y la tercera está vacía, devuelve el índice vacío
        if (values.filter(val => val === player).length === 2 && values.includes('')) {
            return values.indexOf('') === 0 ? a : values.indexOf('') === 1 ? b : c;
        }
    }
    return -1; // No hay movimientos ganadores ni bloqueos necesarios
}

// Verificar si hay ganador o empate
function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        message.textContent = `Player ${currentPlayer} has won!`;
        gameActive = false;
        return;
    }

    if (!board.includes('')) {
        message.textContent = 'Tie!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Reiniciar el juego
function restartGame() {
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    message.textContent = '';
    cells.forEach(cell => cell.textContent = '');
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
