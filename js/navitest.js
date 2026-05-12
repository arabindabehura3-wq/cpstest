const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const statusText = document.getElementById("status");
const timeText = document.getElementById("time");
const bestText = document.getElementById("best");
const resetBtn = document.getElementById("resetBtn");

const rows = 12;
const cols = 12;
const cellSize = 40;

canvas.width = cols * cellSize;
canvas.height = rows * cellSize;
canvas.style.width = `${canvas.width}px`;
canvas.style.height = `${canvas.height}px`;

let maze = [];
let stack = [];
let trail = [];
let gameStarted = false;
let gameOver = false;
let startTime = 0;
let timer = null;
let bestTime = null;

const startCell = { row: 0, col: 0 };
const finishCell = { row: rows - 1, col: cols - 1 };
canvas.addEventListener("mousemove", event => {
  const pos = getMousePosition(event);

  // START the game ONLY when entering start square
  if (!gameStarted && !gameOver && isInsideCell(pos, startCell)) {
    gameStarted = true;
    statusText.textContent = "Go!";
    startTimer();
    return; // IMPORTANT: prevents instant loss on same frame
  }

  // Ignore everything if not started
  if (!gameStarted || gameOver) return;
    trail.push(pos);
    drawMaze();
    drawTrail();
  // Now check for walls
  if (hitWall(pos)) {
    loseGame();
    return;
  }

  // Check win
  if (isInsideCell(pos, finishCell)) {
    winGame();
  }
});
function createGrid() {
  maze = [];

  for (let row = 0; row < rows; row++) {
    let line = [];

    for (let col = 0; col < cols; col++) {
      line.push({
        row,
        col,
        visited: false,
        walls: {
          top: true,
          right: true,
          bottom: true,
          left: true
        }
      });
    }

    maze.push(line);
  }
}
function drawTrail() {
  if (trail.length < 2) return;

  ctx.strokeStyle = "red";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(trail[0].x, trail[0].y);

  for (let i = 1; i < trail.length; i++) {
    ctx.lineTo(trail[i].x, trail[i].y);
  }

  ctx.stroke();
}
function getCell(row, col) {
  if (row < 0 || col < 0 || row >= rows || col >= cols) {
    return null;
  }

  return maze[row][col];
}

function getNeighbors(cell) {
  const neighbors = [];

  const top = getCell(cell.row - 1, cell.col);
  const right = getCell(cell.row, cell.col + 1);
  const bottom = getCell(cell.row + 1, cell.col);
  const left = getCell(cell.row, cell.col - 1);

  if (top && !top.visited) neighbors.push(top);
  if (right && !right.visited) neighbors.push(right);
  if (bottom && !bottom.visited) neighbors.push(bottom);
  if (left && !left.visited) neighbors.push(left);

  return neighbors;
}

function removeWalls(current, next) {
  const rowDiff = current.row - next.row;
  const colDiff = current.col - next.col;

  if (rowDiff === 1) {
    current.walls.top = false;
    next.walls.bottom = false;
  } else if (rowDiff === -1) {
    current.walls.bottom = false;
    next.walls.top = false;
  }

  if (colDiff === 1) {
    current.walls.left = false;
    next.walls.right = false;
  } else if (colDiff === -1) {
    current.walls.right = false;
    next.walls.left = false;
  }
}

function generateMaze() {
  createGrid();

  let current = maze[0][0];
  current.visited = true;
  stack = [current];

  while (stack.length > 0) {
    current = stack[stack.length - 1];

    const neighbors = getNeighbors(current);

    if (neighbors.length > 0) {
      const randomIndex = Math.floor(Math.random() * neighbors.length);
      const next = neighbors[randomIndex];

      next.visited = true;
      removeWalls(current, next);
      stack.push(next);
    } else {
      stack.pop();
    }
  }
}

function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#111827";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "white";
  ctx.lineWidth = 4;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = maze[row][col];

      const x = col * cellSize;
      const y = row * cellSize;

      ctx.beginPath();

      if (cell.walls.top) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + cellSize, y);
      }

      if (cell.walls.right) {
        ctx.moveTo(x + cellSize, y);
        ctx.lineTo(x + cellSize, y + cellSize);
      }

      if (cell.walls.bottom) {
        ctx.moveTo(x, y + cellSize);
        ctx.lineTo(x + cellSize, y + cellSize);
      }

      if (cell.walls.left) {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + cellSize);
      }

      ctx.stroke();
    }
  }

  ctx.fillStyle = "#22c55e";
  ctx.fillRect(6, 6, cellSize - 12, cellSize - 12);

  ctx.fillStyle = "#facc15";
  ctx.fillRect(
    finishCell.col * cellSize + 6,
    finishCell.row * cellSize + 6,
    cellSize - 12,
    cellSize - 12
  );

    "FINISH",
    finishCell.col * cellSize + cellSize / 2,
    finishCell.row * cellSize + cellSize / 2
}

function getMousePosition(event) {
  const rect = canvas.getBoundingClientRect();

  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height
  };
}

function isInsideCell(pos, cell) {
  const x = cell.col * cellSize;
  const y = cell.row * cellSize;

  return (
    pos.x >= x &&
    pos.x <= x + cellSize &&
    pos.y >= y &&
    pos.y <= y + cellSize
  );
}

function hitWall(pos) {
  const row = Math.floor(pos.y / cellSize);
  const col = Math.floor(pos.x / cellSize);

  const cell = getCell(row, col);

  if (!cell) return true;

  const x = col * cellSize;
  const y = row * cellSize;

  const margin = 5;

  if (cell.walls.top && pos.y - y < margin) return true;
  if (cell.walls.right && x + cellSize - pos.x < margin) return true;
  if (cell.walls.bottom && y + cellSize - pos.y < margin) return true;
  if (cell.walls.left && pos.x - x < margin) return true;

  return false;
}

function startTimer() {
  startTime = Date.now();

  timer = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    timeText.textContent = `${elapsed.toFixed(2)}s`;
  }, 10);
}

function stopTimer() {
  clearInterval(timer);
}

function loseGame() {
  if (!gameStarted || gameOver) return;

  gameStarted = false;
  gameOver = true;
  stopTimer();
  trail = [];
  drawMaze();
  statusText.textContent = "You lost!";
}

function winGame() {
  if (!gameStarted || gameOver) return;

  gameStarted = false;
  gameOver = true;
  stopTimer();

  const finalTime = (Date.now() - startTime) / 1000;

  statusText.textContent = "You won!";
  timeText.textContent = `${finalTime.toFixed(2)}s`;

  if (bestTime === null || finalTime < bestTime) {
    bestTime = finalTime;
    bestText.textContent = `${bestTime.toFixed(2)}s`;
  }
}

canvas.addEventListener("mousemove", event => {
  const pos = getMousePosition(event);

  if (!gameStarted && !gameOver && isInsideCell(pos, startCell)) {
    gameStarted = true;
    statusText.textContent = "Go!";
    startTimer();
  }

  if (!gameStarted || gameOver) return;

  if (hitWall(pos)) {
    loseGame();
    return;
  }

  if (isInsideCell(pos, finishCell)) {
    winGame();
  }
});

function resetGame() {
  stopTimer();

  gameStarted = false;
  gameOver = false;

  statusText.textContent = "Ready";
  timeText.textContent = "0.00s";

  generateMaze();
  drawMaze();
}

resetBtn.addEventListener("click", resetGame);

resetGame();