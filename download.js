document.addEventListener("DOMContentLoaded", async () => {
  let itemId = new URLSearchParams(window.location.search).get("id");
  if (!itemId && window.location.pathname.startsWith("/download/")) {
    itemId = window.location.pathname.split("/download/")[1];
  }
  
  if (!itemId) {
    document.getElementById("itemTitle").innerText = "Invalid Link";
    document.getElementById("countdown").innerText = "X";
    document.getElementById("countdown").style.borderColor = "#ef4444";
    document.getElementById("countdown").style.color = "#ef4444";
    return;
  }

  // Get item from localStorage
  const items = await getItems();
  const item = items.find(i => i.id === itemId);

  if (!item) {
    document.getElementById("itemTitle").innerText = "File Not Found";
    document.getElementById("countdown").innerText = "X";
    document.getElementById("countdown").style.borderColor = "#ef4444";
    document.getElementById("countdown").style.color = "#ef4444";
    return;
  }

  // Set Title & Description
  document.getElementById("itemTitle").innerText = `Downloading: ${item.title}`;
  
  const descEl = document.getElementById("itemDescription");
  if (descEl) {
    descEl.textContent = item.description || "No specific features or description provided for this item.";
  }
  
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
