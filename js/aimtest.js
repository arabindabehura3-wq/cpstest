const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const statusText = document.getElementById("status");
const timeText = document.getElementById("time");
const bestText = document.getElementById("best");
const resetBtn = document.getElementById("resetBtn");

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

let ball = {
  x: canvas.width / getRandomFloat(1,4),
  y: canvas.height / getRandomFloat(1,4),
  radius: 35,
  vx: 2,
  vy: 2
};

let mouse = {
  x: 0,
  y: 0,
  inside: false
};

let gameStarted = false;
let gameOver = false;
let startTime = 0;
let bestTime = null;
let animationId = null;

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#111827";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();

  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  ctx.stroke();
}

function getMousePosition(event) {
  const rect = canvas.getBoundingClientRect();

  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height
  };
}

function isMouseOnBall() {
  const dx = mouse.x - ball.x;
  const dy = mouse.y - ball.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance <= ball.radius;
}

function updateBall() {
  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
    ball.vx *= -1;
  }

  if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
    ball.vy *= -1;
  }

  ball.x = Math.max(ball.radius, Math.min(canvas.width - ball.radius, ball.x));
  ball.y = Math.max(ball.radius, Math.min(canvas.height - ball.radius, ball.y));
}

function increaseSpeed() {
  ball.vx *= 1.002;
  ball.vy *= 1.002;
}

function updateTime() {
  const elapsed = (Date.now() - startTime) / 1000;
  timeText.textContent = `${elapsed.toFixed(2)}s`;
}

function gameLoop() {
  if (gameOver) return;

  updateBall();
  increaseSpeed();
  updateTime();
  drawGame();

  if (gameStarted && !isMouseOnBall()) {
    loseGame();
    return;
  }

  animationId = requestAnimationFrame(gameLoop);
}

function startGame() {
  if (gameStarted || gameOver) return;

  gameStarted = true;
  startTime = Date.now();
  statusText.textContent = "Go!";
  gameLoop();
}

function loseGame() {
  gameOver = true;
  gameStarted = false;
  cancelAnimationFrame(animationId);

  const finalTime = (Date.now() - startTime) / 1000;
  statusText.textContent = "You lost!";
  timeText.textContent = `${finalTime.toFixed(2)}s`;

  if (bestTime === null || finalTime > bestTime) {
    bestTime = finalTime;
    bestText.textContent = `${bestTime.toFixed(2)}s`;
  }
}

function resetGame() {
  cancelAnimationFrame(animationId);

  ball = {
    x: canvas.width / getRandomFloat(1,2),
    y: canvas.height / getRandomFloat(1,2),
    radius: 35,
    vx: 2,
    vy: 2
  };

  mouse = {
    x: 0,
    y: 0,
    inside: false
  };

  gameStarted = false;
  gameOver = false;
  startTime = 0;

  statusText.textContent = "Ready";
  timeText.textContent = "0.00s";

  drawGame();
}

canvas.addEventListener("mousemove", event => {
  mouse = getMousePosition(event);

  if (gameStarted && !isMouseOnBall()) {
    loseGame();
  }
});

canvas.addEventListener("click", event => {
  mouse = getMousePosition(event);

  if (!gameStarted && !gameOver && isMouseOnBall()) {
    startGame();
  }
});

resetBtn.addEventListener("click", resetGame);

resetGame();