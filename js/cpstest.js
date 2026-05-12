    const clickArea = document.getElementById('clickArea');
    const timeDisplay = document.getElementById('time');
    const clicksDisplay = document.getElementById('clicks');
    const cpsDisplay = document.getElementById('cps');
    const resetBtn = document.getElementById('resetBtn');
    const durationSelect = document.getElementById('durationSelect');

    let clicks = 0;
    let started = false;
    let finished = false;
    let startTime = 0;
    let timerInterval = null;
    let duration = Number(durationSelect.value);

    function updateDisplays(timeLeft = duration) {
      const elapsed = started ? Math.min((Date.now() - startTime) / 1000, duration) : 0;
      const currentCps = elapsed > 0 ? (clicks / elapsed).toFixed(2) : '0.00';

      timeDisplay.textContent = `${timeLeft.toFixed(1)}s`;
      clicksDisplay.textContent = clicks;
      cpsDisplay.textContent = currentCps;
    }

    function finishTest() {
      clearInterval(timerInterval);
      finished = true;
      started = false;
      const finalCps = (clicks / duration).toFixed(2);
      timeDisplay.textContent = '0.0s';
      cpsDisplay.textContent = finalCps;
      clickArea.textContent = `Finished! CPS: ${finalCps}`;
      clickArea.classList.add('finished');
    }

    function startTest() {
      started = true;
      finished = false;
      startTime = Date.now();
      clickArea.classList.remove('finished');
      clickArea.textContent = 'Keep clicking!';

      timerInterval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const timeLeft = Math.max(duration - elapsed, 0);
        updateDisplays(timeLeft);

        if (timeLeft <= 0) {
          finishTest();
        }
      }, 50);
    }

    function resetTest() {
      clearInterval(timerInterval);
      clicks = 0;
      started = false;
      finished = false;
      duration = Number(durationSelect.value);
      clickArea.textContent = 'Click here to start';
      clickArea.classList.remove('finished');
      updateDisplays(duration);
    }

    clickArea.addEventListener('click', () => {
      if (finished) return;

      if (!started) {
        startTest();
      }

      clicks += 1;
      clicksDisplay.textContent = clicks;

      const elapsed = Math.max((Date.now() - startTime) / 1000, 0.001);
      cpsDisplay.textContent = (clicks / elapsed).toFixed(2);
    });

    resetBtn.addEventListener('click', resetTest);

    durationSelect.addEventListener('change', resetTest);

    resetTest();