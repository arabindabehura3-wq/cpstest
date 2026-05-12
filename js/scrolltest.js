const scrollArea = document.getElementById("scrollArea");
const timeText = document.getElementById("time");
const scrollsText = document.getElementById("scrolls");
const speedText = document.getElementById("speed");
const resetBtn = document.getElementById("resetBtn");

const duration = 5;

let scrollCount = 0;
let started = false;
let finished = false;
let startTime = 0;
let timer = null;

function startTest() {
  started = true;
  finished = false;
  startTime = Date.now();

  scrollArea.textContent = "Keep scrolling!";

  timer = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    const timeLeft = Math.max(duration - elapsed, 0);

    timeText.textContent = `${timeLeft.toFixed(1)}s`;

    const speed = elapsed > 0 ? scrollCount / elapsed : 0;
    speedText.textContent = `${speed.toFixed(1)}/s`;

    if (timeLeft <= 0) {
      finishTest();
    }
  }, 50);
}

function finishTest() {
  clearInterval(timer);

  started = false;
  finished = true;

  const finalSpeed = scrollCount / duration;

  timeText.textContent = "0.0s";
  speedText.textContent = `${finalSpeed.toFixed(1)}/s`;
  scrollArea.textContent = `Finished! Speed: ${finalSpeed.toFixed(1)}/s`;
}

function resetTest() {
  clearInterval(timer);

  scrollCount = 0;
  started = false;
  finished = false;
  startTime = 0;

  timeText.textContent = `${duration.toFixed(1)}s`;
  scrollsText.textContent = "0";
  speedText.textContent = "0/s";
  scrollArea.textContent = "Scroll here to start";
}

scrollArea.addEventListener("wheel", event => {
  event.preventDefault();

  if (finished) return;

  if (!started) {
    startTest();
  }

  scrollCount++;
  scrollsText.textContent = scrollCount;

  const elapsed = Math.max((Date.now() - startTime) / 1000, 0.001);
  const speed = scrollCount / elapsed;

  speedText.textContent = `${speed.toFixed(1)}/s`;
}, { passive: false });

resetBtn.addEventListener("click", resetTest);

resetTest();