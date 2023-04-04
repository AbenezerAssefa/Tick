/*eslint-disable*/
let firstPlayer = 'X';
let currentPlayer = firstPlayer;
let gameState = '';
let numberOfMoves = 0;
let board = ['', '', '', '', '', '', '', '', ''];

const Reset = document.getElementById('btnreset');
const winReset = document.getElementById('winbtnreset');

const initializeGame = () => {
  board = ['', '', '', '', '', '', '', '', ''];
  numberOfMoves = 0;
  firstPlayer = firstPlayer === 'X' ? 'O' : 'X';
  currentPlayer = firstPlayer;
  gameState = '';
  localStorage.clear();
};

// Event handler for the reset button and win notification

const displayWinnerOverlay = (winner) => {
  const container = document.getElementById('container');
  const overlay = document.getElementById('overlay');
  const message = document.getElementById('winner-message');

  container.classList.add('disabled');
  overlay.style.display = 'flex';
  message.innerHTML = `${winner} WIN'S 🥳!, ARE YOU READY FOR THE NEXT ROUND?`;
  
  const timer = setTimeout(() => {
    overlay.style.display = 'none';
    message.innerHTML = '';
    container.classList.remove('disabled');
  }, 60000);

  // Event handler for the reset button
  winReset.addEventListener('click', () => {
    clearTimeout(timer); // Clear the timeout
    overlay.style.display = 'none';
    message.innerHTML = '';
    container.classList.remove('disabled');
  });
};

// Event handler and notification for tie game
const displayTieOverlay = () => {
  const container = document.getElementById('container');
  const overlay = document.getElementById('overlay');
  const message = document.getElementById('winner-message');

  container.classList.add('disabled');
  overlay.style.display = 'flex';
  message.innerHTML = 'TIE LUCKY YOU!, ARE YOU READY FOR THE NEXT ROUND?';

  const timer = setTimeout(() => {
    overlay.style.display = 'none';
    message.innerHTML = '';
    container.classList.remove('disabled');
  }, 60000);

  // Event handler for the reset button
  winReset.addEventListener('click', () => {
    clearTimeout(timer); // Clear the timeout
    overlay.style.display = 'none';
    message.innerHTML = '';
    container.classList.remove('disabled');
  });
};

// Function to update the counts and the HTML elements
const updateScore = (winner) => {
  if (winner === 'X') {
    xCount += 1;
    xCountEl.innerText = xCount;
  } else if (winner === 'O') {
    oCount += 1;
    oCountEl.innerText = oCount;
  }
};

const checkforWin = () => {
  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < winningConditions.length; i++) {
    const winCondition = winningConditions[i];
    const a = board[winCondition[0]];
    const b = board[winCondition[1]];
    const c = board[winCondition[2]];
    if (a === '' || b === '' || c === '') {
      continue;
    }
    if (a === b && b === c) {
      const winner = a;
      updateScore(winner);
      gameState = `${winner} wins`;
      initializeGame();
      refreshBoard();
      refreshStorage();
      switchFirstPlayer();
      displayWinnerOverlay(winner);
      return winner;
    }
  }
  return null;
};

const checkForTie = () => {
  if (numberOfMoves === 9 && gameState === '') {
    gameState = 'Tie';
    refreshStorage();
    displayTieOverlay();
    initializeGame();
    switchFirstPlayer();
  }
};

// check for win or tie
const win = checkforWin();
const tie = checkForTie();
if (win || tie) {
  endGame(win);
} else {
  switchPlayer();
}

function switchFirstPlayer() {
  firstPlayer = firstPlayer === 'X' ? 'O' : 'X';
  currentPlayer = firstPlayer;
}

function switchPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

const playerX = 'X';
const playerO = 'O';

const takeTurn = (index) => {
  if (board[index] === '') {
    board[index] = playerX;
    numberOfMoves++;

    // Check for win or tie after each move
    const winner = checkforWin();
    if (winner) {
      gameState = `${winner} wins`;
      initializeGame();
      refreshBoard();
      refreshStorage();
      switchFirstPlayer();
      return; // exit the function early to prevent further execution
    } if (numberOfMoves === 9) {
      gameState = 'Tie';
      displayTieOverlay();
      initializeGame();
      refreshBoard();
      refreshStorage();
      switchFirstPlayer();
      return;
    }

    // Update the board with the new move
    refreshBoard();
    // Update the local storage
    refreshStorage();

    // Let the computer make its move using minimax
    const computerIndex = getComputerMove();
    board[computerIndex] = playerO;
    numberOfMoves++;

    // Check for win or tie after each move
    const computerWinner = checkforWin();
    if (computerWinner) {
      gameState = `${computerWinner} wins`;
      document.innerHTML = `${computerWinner} wins`;
      initializeGame();
      refreshBoard();
      refreshStorage();
      switchFirstPlayer();
      return; // exit the function early to prevent further execution
    } if (numberOfMoves === 9) {
      gameState = 'Tie';
      displayTieOverlay();
      initializeGame();
      refreshBoard();
      refreshStorage();
      switchFirstPlayer();
    }

    // Update the board with the computer's move
    refreshBoard();
    // Update the local storage
    refreshStorage();
    // Switch players
    switchPlayer();
  }
};

const refreshBoard = () => {
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].textContent = board[i];
  }

  if (gameState !== '') {
    alert(gameState);
  }
};


const refreshStorage = () => {
  localStorage.setItem('board', JSON.stringify(board));
  localStorage.setItem('numberOfMoves', numberOfMoves);
  localStorage.setItem('firstPlayer', firstPlayer);
  localStorage.setItem('gameState', gameState);
};

const clickActivate = () => {
  document.innerHTML = 'game starts';
};

const startGame = () => {
  clickActivate();
};

const container = document.getElementById('container');
const boxes = document.getElementsByClassName('box');

// Add click event listeners to each box
for (let i = 0; i < boxes.length; i++) {
  boxes[i].addEventListener('click', () => {
    takeTurn(i);
  });
}

// Load saved game from local storage
const savedBoard = localStorage.getItem('board');
if (savedBoard) {
  board = JSON.parse(savedBoard);
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].textContent = board[i];
  }
}

// Initialize the count for X and O to zero
let xCount = 0;
let oCount = 0;

// Get the elements for X and O counts
const xCountEl = document.getElementById('x-count');
const oCountEl = document.getElementById('o-count');

startGame();

const humanPlayer = 'X';
const aiPlayer = 'O';

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const checkForWin = (board, player) => {
  for (let i = 0; i < winConditions.length; i++) {
    const [a, b, c] = winConditions[i];
    if (board[a] === player && board[b] === player && board[c] === player) {
      return true;
    }
  }
  return false;
};

const getAvailableMoves = (board) => {
  const moves = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      moves.push(i);
    }
  }
  return moves;
};

const minimax = (board, player, depth, n) => {
  // Check if the game is over or the maximum depth has been reached
  if (checkForWin(board, humanPlayer)) {
    return { score: -10 };
  } if (checkForWin(board, aiPlayer)) {
    return { score: 10 };
  } if (getAvailableMoves(board).length === 0 || depth === 0) {
    return { score: 0 };
  }

  // Reduce the maximum depth by 1
  depth--;

  // Generate all possible moves
  const moves = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      const move = {};
      move.index = i;
      board[i] = player;

      if (player === aiPlayer) {
        const result = minimax(board, humanPlayer, depth - 1, n);
        move.score = result.score;
      } else {
        const result = minimax(board, aiPlayer, depth - 1, n);
        move.score = result.score;
      }

      board[i] = '';
      moves.push(move);
    }
  }

  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  }

  // Randomly select one of the best moves
  const bestMoves = moves.filter((move) => move.score === bestMove.score);
  const topMoves = bestMoves.slice(0, n);
  const selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)];
  return selectedMove;
};

const getComputerMove = () => {
  const selectedMove = minimax(board, aiPlayer, 10, 2);
  return selectedMove.index;
};

// // Example usage:
// // Make a move
board[4] = humanPlayer;

// Get the best move for the computer
const computerMove = getComputerMove();
board[computerMove] = aiPlayer;

// Event handler for the reset button
Reset.addEventListener('click', () => {
  initializeGame();
  refreshBoard();
  refreshStorage();
});

