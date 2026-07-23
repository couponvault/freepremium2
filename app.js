/**
 * ========================================================================
 *   FreePremium - Premium Video Directory Logic
 * ========================================================================
 */

// 1. Storage initialized via storage.js

// State Variables
let searchQuery = "";

// DOM Elements
const videoGrid = document.getElementById("videoGrid");
const searchInput = document.getElementById("searchInput");
const searchContainer = document.getElementById("searchContainer");
const navMenu = document.getElementById("navMenu");
const menuToggle = document.getElementById("menuToggle");
const menuIcon = document.getElementById("menuIcon");
const mobileSearchToggle = document.getElementById("mobileSearchToggle");
const adminBtn = document.getElementById("adminBtn");

// 2. Initialize App
document.addEventListener("DOMContentLoaded", () => {
  // Render Initial Video Grid
  renderVideos();

  // (Search listener moved to storage.js for global Enter-to-search behavior)

  // Mobile Menu Navigation Toggle
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    menuIcon.setAttribute("data-lucide", isOpen ? "x" : "menu");
    lucide.createIcons();
  });

  // Mobile Search Bar Toggle
  // Checks if element exists/is shown
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    mobileSearchToggle.style.display = "block";
  }

  window.addEventListener("resize", () => {
    const mobile = window.innerWidth <= 768;
    mobileSearchToggle.style.display = mobile ? "block" : "none";
    if (!mobile) {
      searchContainer.classList.remove("active");
    }
  });

  mobileSearchToggle.addEventListener("click", () => {
    const isActive = searchContainer.classList.toggle("active");
    if (isActive) {
      searchInput.focus();
    }
  });

  // Admin Shortcut Announcement (Step Placeholder)
  if (adminBtn) {
    adminBtn.addEventListener("click", () => {
      alert("Admin Panel integration is coming in a subsequent step! Get ready to manage links easily.");
    });
  }

  // Global exit navigation page transitions
  document.addEventListener("click", (e) => {
    const link = e.target.closest(".video-card, .hero-btn, .logo, .nav-link, .collection-card");
    if (link) {
      const targetUrl = link.getAttribute("href");
      if (targetUrl && targetUrl !== "#") {
        e.preventDefault();
        
        let delay = 220;
        
        // Show loading spinner on the clicked video card
        if (link.classList.contains("video-card")) {
          const playIcon = link.querySelector(".play-icon-glow i");
          if (playIcon) {
            playIcon.setAttribute("data-lucide", "loader");
            playIcon.style.animation = "spin 1s linear infinite";
            playIcon.parentElement.style.transform = "scale(1)";
            playIcon.parentElement.style.opacity = "1";
            link.querySelector(".play-overlay").style.opacity = "1";
            lucide.createIcons();
            delay = 600; // Let them see the spinner
          }
        }

        const appContainer = document.querySelector(".app-container");
        appContainer.classList.add("fade-out");
        setTimeout(() => {
          window.location.href = targetUrl;
        }, delay);
      }
    }
  });

  // Initial Lucide Icons Render
  lucide.createIcons();
});
// 5. Render Video Grid with Smooth Transition/Filter Logic
let currentPage = 1;
const ITEMS_PER_PAGE = 12;

async function renderVideos(append = false) {
  // Filter videos
  const allVideos = await getVideos();
  const filteredVideos = allVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery) ||
                          (video.categories && video.categories.some(c => c.toLowerCase().includes(searchQuery))) ||
                          video.creator.toLowerCase().includes(searchQuery);
    return matchesSearch;
  });

  // Handle empty search/category state
  if (filteredVideos.length === 0) {
    videoGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 0; color: hsl(var(--text-secondary));">
        <i data-lucide="video-off" style="width: 48px; height: 48px; margin-bottom: 12px; opacity: 0.5;"></i>
        <p style="font-size: 1.1rem; font-weight: 500;">No videos found</p>
        <p style="font-size: 0.85rem; color: hsl(var(--text-muted)); margin-top: 4px;">Try refining your search keyword or category filter.</p>
      </div>
    `;
    lucide.createIcons();
    
    const btn = document.getElementById("homeLoadMoreBtn");
    if (btn) btn.style.display = "none";
    return;
  }

  if (!append) currentPage = 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedVideos = filteredVideos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  let html = "";
  paginatedVideos.forEach((video, index) => {
    // Inject banner ad every 4 videos
    if (index > 0 && index % 4 === 0) {
      html += `
        <div class="video-card ad-card adsterra-banner" data-ad-id="banner-square">
        </div>
      `;
    }
    
    html += `
      <a href="interstitial.html?target=watch.html?v=${encodeURIComponent(video.id)}" class="video-card" data-id="${escapeHTML(video.id)}">
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
    `;
  });

  if (append) {
    videoGrid.insertAdjacentHTML("beforeend", html);
  } else {
    videoGrid.innerHTML = html;
  }

  // Load More Button Logic
  let loadMoreBtn = document.getElementById("homeLoadMoreBtn");
  if (!loadMoreBtn) {
    loadMoreBtn = document.createElement("button");
    loadMoreBtn.id = "homeLoadMoreBtn";
    loadMoreBtn.className = "primary-btn";
    loadMoreBtn.style = "margin: 32px auto; display: block; background: #3b82f6;";
    loadMoreBtn.innerHTML = '<i data-lucide="plus-circle"></i> Load More';
    loadMoreBtn.addEventListener("click", () => {
      currentPage++;
      renderVideos(true);
    });
    videoGrid.parentNode.insertBefore(loadMoreBtn, videoGrid.nextSibling);
  }

  if (startIndex + ITEMS_PER_PAGE >= filteredVideos.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "block";
  }

  lucide.createIcons();
  
  if(window.injectBanners) window.injectBanners();
}
