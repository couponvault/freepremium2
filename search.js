// FreePremium - Global Search Logic

document.addEventListener("DOMContentLoaded", () => {
  // Navigation Menu Logic
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const menuIcon = document.getElementById("menuIcon");
  const mobileSearchToggle = document.getElementById("mobileSearchToggle");
  const searchContainer = document.getElementById("searchContainer");
  const mainSearchInput = document.getElementById("searchInput");
  
  if (menuToggle) {
    let isMenuOpen = false;
    menuToggle.addEventListener("click", () => {
      isMenuOpen = !isMenuOpen;
      navMenu.classList.toggle("active");
      if (isMenuOpen) {
        menuIcon.setAttribute("data-lucide", "x");
      } else {
        menuIcon.setAttribute("data-lucide", "menu");
      }
      lucide.createIcons();
    });
  }
  
  if (mobileSearchToggle && searchContainer) {
    const isMobile = window.innerWidth <= 768;
    mobileSearchToggle.style.display = isMobile ? "block" : "none";
    
    window.addEventListener("resize", () => {
      const mobile = window.innerWidth <= 768;
      mobileSearchToggle.style.display = mobile ? "block" : "none";
      if (!mobile) searchContainer.classList.remove("active");
    });
    
    mobileSearchToggle.addEventListener("click", () => {
      const isActive = searchContainer.classList.toggle("active");
      if (isActive && mainSearchInput) mainSearchInput.focus();
    });
  }

  // Render logic
  const urlParams = new URLSearchParams(window.location.search);
  const q = urlParams.get("q");
  const pageTitle = document.getElementById("pageTitle");
  
  if (!q) {
    pageTitle.innerHTML = `<i data-lucide="search" style="color: #ec4899;"></i> Please enter a search term`;
    document.getElementById("emptyState").style.display = "block";
    lucide.createIcons();
    return;
  }
  
  const query = q.trim().toLowerCase();
  pageTitle.innerHTML = `Search Results for "${escapeHTML(q)}"`;
  
  // Dynamic SEO
  document.title = `Search Results for "${escapeHTML(q)}" - FreePremium`;
  document.getElementById("metaTitle").content = document.title;
  document.getElementById("ogTitle").content = document.title;
  
  // 1. Search Videos
  const allVideos = typeof getVideos === "function" ? getVideos() : [];
  const filteredVideos = allVideos.filter(video => {
    return video.title.toLowerCase().includes(query) ||
           video.creator.toLowerCase().includes(query) ||
           (video.categories && video.categories.some(c => c.toLowerCase().includes(query)));
  });
  
  // 2. Search Premium Items
  const allItems = typeof getItems === "function" ? getItems() : [];
  const filteredItems = allItems.filter(item => {
    return item.title.toLowerCase().includes(query) ||
           (item.description && item.description.toLowerCase().includes(query)) ||
           item.type.toLowerCase().includes(query);
  });
  
  const videoSection = document.getElementById("videoResultsSection");
  const videoGrid = document.getElementById("videoResultsGrid");
  const premiumSection = document.getElementById("premiumResultsSection");
  const premiumGrid = document.getElementById("premiumResultsGrid");
  const emptyState = document.getElementById("emptyState");
  
  let hasResults = false;
  
  // Render Videos
  if (filteredVideos.length > 0) {
    hasResults = true;
    videoSection.style.display = "block";
    videoGrid.innerHTML = filteredVideos.map(video => `
      <a href="watch.html?v=${encodeURIComponent(video.id)}" class="video-card" data-id="${escapeHTML(video.id)}">
        <div class="thumb-wrapper">
          <img class="video-thumb" src="${escapeHTML(video.thumbnail)}" alt="${escapeHTML(video.title)}" loading="lazy">
          <span class="video-duration">${escapeHTML(video.duration)}</span>
          <div class="play-overlay">
            <div class="play-icon-glow">
              <i data-lucide="play" style="fill: white; width: 18px; height: 18px; margin-left: 2px;"></i>
            </div>
          </div>
        </div>
        <div class="card-details">
          <div class="card-meta">
            <span class="card-views" style="margin-left: auto;">${escapeHTML(video.views)}</span>
          </div>
          <h3 class="card-title">${escapeHTML(video.title)}</h3>
          <span class="card-author">${escapeHTML(video.creator)}</span>
        </div>
      </a>
    `).join("");
  }
  
  // Render Premium
  if (filteredItems.length > 0) {
    hasResults = true;
    premiumSection.style.display = "block";
    
    // Convert type to title for the cards
    const typeNames = { "apk": "Mod APK", "movie": "Movie", "drama": "Web Series" };
    
    premiumGrid.innerHTML = filteredItems.map(item => `
      <div class="video-card">
        <div class="thumbnail-container">
          <img src="${escapeHTML(item.thumbnail)}" alt="Thumbnail" class="thumbnail" style="object-fit: cover;">
          <div class="duration-badge">${typeNames[item.type] || item.type} ${item.subtitle ? `· ${escapeHTML(item.subtitle)}` : ''}</div>
        </div>
        <div class="card-details">
          <h3 class="card-title">${escapeHTML(item.title)}</h3>
          ${item.description ? `<span class="card-creator">${escapeHTML(item.description)}</span>` : ''}
          <div style="margin-top: 12px;">
            <a href="${escapeHTML(item.downloadUrl)}" target="_blank" class="primary-btn" style="display: block; text-align: center; text-decoration: none; background: #ec4899;">Download / Get Link</a>
          </div>
        </div>
      </div>
    `).join("");
  }
  
  if (!hasResults) {
    emptyState.style.display = "block";
  }
  
  lucide.createIcons();
});
