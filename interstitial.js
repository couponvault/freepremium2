document.addEventListener("DOMContentLoaded", () => {
  // Extract target URL from query parameter
  const params = new URLSearchParams(window.location.search);
  const target = params.get('target');
  
  if (!target) {
    window.location.href = 'index.html';
    return;
  }

  const countdownEl = document.getElementById("countdown");
  const skipBtn = document.getElementById("skipBtn");
  
  // Clean Target Route Construction
  // E.g. target=/watch/vid-1234
  const finalDestination = target;
  
  skipBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (skipBtn.classList.contains("ready")) {
      window.location.href = finalDestination;
    }
  });

  let timeLeft = 5;
  countdownEl.innerText = timeLeft;

  const timer = setInterval(() => {
    timeLeft--;
    if (timeLeft > 0) {
      countdownEl.innerText = timeLeft;
    } else {
      clearInterval(timer);
      countdownEl.style.display = "none";
      skipBtn.classList.add("ready");
      // Optional: Auto redirect after 5 seconds instead of waiting for click
      window.location.href = finalDestination;
    }
  }, 1000);
});
