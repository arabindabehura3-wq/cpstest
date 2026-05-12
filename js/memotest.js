const statusText = document.getElementById("status");
const scoreText = document.getElementById("score");
const bestText = document.getElementById("best");
const grid = document.getElementById("memoryGrid");
const resetBtn = document.getElementById("resetBtn");

let pattern = [];
let playerPattern = [];
let level = 1;
let bestLevel = 0;
let acceptingInput = false;

function createGrid() {
  grid.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const square = document.createElement("button");
    square.classList.add("memory-square");
    square.dataset.index = i;

    square.addEventListener("click", () => {
      handlePlayerClick(i);
    });

    grid.appendChild(square);
  }
}

function flashSquare(index) {
  const square = grid.children[index];
  square.classList.add("active");

  setTimeout(() => {
    square.classList.remove("active");
  }, 400);
}

function generatePattern() {
  pattern = [];

  for (let i = 0; i < level; i++) {
    pattern.push(Math.floor(Math.random() * 9));
  }
}

function showPattern() {
  acceptingInput = false;
  playerPattern = [];
  statusText.textContent = "Memorize...";

  pattern.forEach((index, i) => {
    setTimeout(() => {
      flashSquare(index);
    }, i * 700);
  });

  setTimeout(() => {
    acceptingInput = true;
    statusText.textContent = "Your turn!";
  }, pattern.length * 700);
}

function handlePlayerClick(index) {
  if (!acceptingInput) return;

  flashSquare(index);
  playerPattern.push(index);

  const currentIndex = playerPattern.length - 1;

  if (playerPattern[currentIndex] !== pattern[currentIndex]) {
    loseGame(index);
    return;
  }

  if (playerPattern.length === pattern.length) {
    level++;
    scoreText.textContent = level;

    if (level > bestLevel) {
      bestLevel = level;
      bestText.textContent = bestLevel;
    }

    statusText.textContent = "Correct!";

    setTimeout(() => {
      startRound();
    }, 900);
  }
}

function loseGame(wrongIndex) {
  acceptingInput = false;

  const wrongSquare = grid.children[wrongIndex];
  wrongSquare.classList.add("wrong");

  statusText.textContent = "Wrong pattern!";

  setTimeout(() => {
    wrongSquare.classList.remove("wrong");

    level = 1;
    scoreText.textContent = level;

    resetGame();
  }, 700);
}

function startRound() {
  generatePattern();
  showPattern();
}

function resetGame() {
  level = 1;
  pattern = [];
  playerPattern = [];
  acceptingInput = false;

  scoreText.textContent = level;
  statusText.textContent = "Get ready...";

  setTimeout(() => {
    startRound();
  }, 700);
}

resetBtn.addEventListener("click", resetGame);

createGrid();
resetGame();