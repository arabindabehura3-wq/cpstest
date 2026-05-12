const clickArea = document.getElementById('clickArea');
const statusDisplay = document.getElementById('time');
const reactionDisplay = document.getElementById('clicks');
const bestDisplay = document.getElementById('cps');
const resetBtn = document.getElementById('resetBtn');
const difficultySelect = document.getElementById('durationSelect');

let gameState = 'ready';
let timeoutId = null;
let greenTime = 0;
let bestTime = null;

function getDelay() {
  const difficulty = difficultySelect.value;

  if (difficulty === 'easy') {
    return Math.floor(Math.random() * 2000) + 2000;
  }

  if (difficulty === 'hard') {
    return Math.floor(Math.random() * 4000) + 1000;
  }

  return Math.floor(Math.random() * 3000) + 1500;
}

function setButtonColor(type) {
  if (type === 'green') {
    clickArea.style.background = 'green';
  } else if (type === 'red') {
    clickArea.style.background = 'red';
  } else {
    clickArea.style.background = 'grey';
  }
}

function startGame() {
  gameState = 'waiting';
  reactionDisplay.textContent = '--';
  statusDisplay.textContent = 'Wait...';
  clickArea.textContent = 'Wait for green...';
  clickArea.classList.remove('finished');
  setButtonColor('red');

  timeoutId = setTimeout(() => {
    gameState = 'green';
    greenTime = Date.now();
    statusDisplay.textContent = 'Click!';
    clickArea.textContent = 'CLICK NOW!';
    setButtonColor('green');
  }, getDelay());
}

function finishGame() {
  const reactionTime = Date.now() - greenTime;
  gameState = 'finished';

  reactionDisplay.textContent = `${reactionTime}ms`;
  statusDisplay.textContent = 'Done';
  clickArea.textContent = `Your time: ${reactionTime}ms`;
  clickArea.classList.add('finished');

  if (bestTime === null || reactionTime < bestTime) {
    bestTime = reactionTime;
    bestDisplay.textContent = `${bestTime}ms`;
  }
}

function clickedTooEarly() {
  clearTimeout(timeoutId);
  gameState = 'early';
  statusDisplay.textContent = 'Too early';
  reactionDisplay.textContent = 'Failed';
  clickArea.textContent = 'Too soon! Click reset.';
  setButtonColor('red');
}

function resetGame() {
  clearTimeout(timeoutId);
  gameState = 'ready';
  greenTime = 0;
  statusDisplay.textContent = 'Ready';
  reactionDisplay.textContent = '--';
  clickArea.textContent = 'Click to start';
  clickArea.classList.remove('finished');
  setButtonColor('blue');
}

clickArea.addEventListener('click', () => {
  if (gameState === 'ready' || gameState === 'finished' || gameState === 'early') {
    startGame();
    return;
  }

  if (gameState === 'waiting') {
    clickedTooEarly();
    return;
  }

  if (gameState === 'green') {
    finishGame();
  }
});

resetBtn.addEventListener('click', resetGame);
difficultySelect.addEventListener('change', resetGame);

resetGame();