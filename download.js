document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get('id');
  
  if (!itemId) {
    document.getElementById("itemTitle").innerText = "Invalid Link";
    document.getElementById("countdown").innerText = "X";
    document.getElementById("countdown").style.borderColor = "#ef4444";
    document.getElementById("countdown").style.color = "#ef4444";
    return;
  }

  // Get item from localStorage
  const items = getItems();
  const item = items.find(i => i.id === itemId);

  if (!item) {
    document.getElementById("itemTitle").innerText = "File Not Found";
    document.getElementById("countdown").innerText = "X";
    document.getElementById("countdown").style.borderColor = "#ef4444";
    document.getElementById("countdown").style.color = "#ef4444";
    return;
  }

  // Set Title
  document.getElementById("itemTitle").innerText = `Downloading: ${item.title}`;
  
  // Start Timer
  let timeLeft = 10; // 10 seconds
  const countdownEl = document.getElementById("countdown");
  const btnEl = document.getElementById("finalDownloadBtn");
  
  const timer = setInterval(() => {
    timeLeft--;
    countdownEl.innerText = timeLeft;
    
    if (timeLeft <= 0) {
      clearInterval(timer);
      countdownEl.innerHTML = '<i data-lucide="check" style="width: 48px; height: 48px;"></i>';
      countdownEl.style.borderColor = "#10b981";
      countdownEl.style.color = "#10b981";
      countdownEl.style.background = "rgba(16, 185, 129, 0.1)";
      
      lucide.createIcons();
      
      btnEl.classList.add("ready");
      btnEl.innerHTML = '<i data-lucide="download" style="width: 24px; height: 24px;"></i> Download Now';
      btnEl.href = item.downloadUrl;
      btnEl.target = "_blank"; // Open in new tab so they stay on this page with ads
      lucide.createIcons();
      
      // Inject Popunder script explicitly here if needed, or rely on ads.js
    }
  }, 1000);
});
