document.addEventListener("DOMContentLoaded", async () => {
  let itemId = new URLSearchParams(window.location.search).get("id");
  if (!itemId && window.location.pathname.startsWith("/download/")) {
    itemId = window.location.pathname.split("/download/")[1];
  }
  
  if (!itemId) {
    document.getElementById("itemTitle").innerText = "Invalid Link";
    document.getElementById("itemSubtitle").innerText = "Error";
    document.getElementById("btnText").innerText = "Not Found";
    return;
  }

  // Get item from localStorage/database
  const items = await getItems();
  const item = items.find(i => i.id === itemId);

  if (!item) {
    document.getElementById("itemTitle").innerText = "File Not Found";
    document.getElementById("itemSubtitle").innerText = "Error";
    document.getElementById("btnText").innerText = "Not Found";
    return;
  }

  // Set SEO Meta Tags
  document.title = `${item.title} - Free Download`;
  
  // Set UI Details
  document.getElementById("itemTitle").innerText = item.title;
  document.getElementById("itemSubtitle").innerText = item.subtitle || (item.type === 'apk' ? 'Mod APK' : 'Premium');
  document.getElementById("itemThumb").src = item.thumbnail || 'assets/mod_apks_bg.jpg';
  
  const descEl = document.getElementById("itemDescription");
  if (descEl) {
    descEl.textContent = item.description || "No specific features or description provided for this item.";
  }
  
  // Determine Button Text based on Type
  let finalBtnText = "Download File";
  let finalBtnIcon = "download";
  if (item.type === "apk") {
    finalBtnText = "Download APK";
  } else if (item.type === "movie" || item.type === "drama") {
    finalBtnText = "Watch Online / Download";
    finalBtnIcon = "play-circle";
  }
  
  // Start Timer Logic
  let timeLeft = 10; // 10 seconds wait
  const btnEl = document.getElementById("finalDownloadBtn");
  const btnTextEl = document.getElementById("btnText");
  const btnIconEl = document.getElementById("btnIcon");
  
  btnTextEl.innerText = `Please wait ${timeLeft}s...`;
  
  const timer = setInterval(() => {
    timeLeft--;
    if (timeLeft > 0) {
      btnTextEl.innerText = `Please wait ${timeLeft}s...`;
    } else {
      clearInterval(timer);
      
      // Update Button to Ready State
      btnEl.classList.add("ready");
      btnTextEl.innerText = finalBtnText;
      btnIconEl.setAttribute("data-lucide", finalBtnIcon);
      btnIconEl.style.animation = "none"; // stop spinning
      
      btnEl.href = item.downloadUrl;
      btnEl.target = "_blank"; // Open in new tab so they stay on this page with ads
      
      lucide.createIcons();
    }
  }, 1000);
});
