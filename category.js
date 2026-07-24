/**
 * ========================================================================
 *   FreePremium - Category Page Controller
 * ========================================================================
 * Handles dynamic category routing, filtering, sorting, and rendering.
 */

// ── Category Definitions ──
const CATEGORIES = {
  trending: {
    title: "Trending",
    desc: "The hottest streams everyone is watching right now. Updated every hour based on real-time engagement.",
    icon: "flame",
    gradient: "linear-gradient(135deg, #ff6b35 0%, #f7c948 100%)",
    bgColor: "rgba(255, 107, 53, 0.08)"
  },
  popular: {
    title: "Popular",
    desc: "All-time most viewed and highest rated streams on the platform. Community favorites that never get old.",
    icon: "star",
    gradient: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
    bgColor: "rgba(168, 85, 247, 0.08)"
  },
  featured: {
    title: "Featured",
    desc: "Handpicked by the FreePremium editorial team. Premium content curated for the best viewing experience.",
    icon: "award",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    bgColor: "rgba(16, 185, 129, 0.08)"
  },
  hd: {
    title: "HD Quality",
    desc: "Crystal clear high-definition streams. Only the sharpest video quality makes it to this collection.",
    icon: "monitor",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
    bgColor: "rgba(59, 130, 246, 0.08)"
  },
  amateur: {
    title: "Amateur",
    desc: "Fresh indie creators and rising talent. Discover new voices and unique content before it goes viral.",
    icon: "video",
    gradient: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
    bgColor: "rgba(236, 72, 153, 0.08)"
  }
};

// ── Video Database with Tags ──
// Initialized via storage.js

// ── State ──
let currentSort = "latest";
let searchQuery = "";
let currentCatKey = "trending";

// ── DOM Elements ──
const videoGrid = document.getElementById("videoGrid");
const catNavContainer = document.getElementById("catNavContainer");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");

// ── Initialize ──
document.addEventListener("DOMContentLoaded", async () => {
  // Read category from URL
  const urlParams = new URLSearchParams(window.location.search);
  currentCatKey = (urlParams.get("cat") || "trending").toLowerCase();

  // Populate hero & page meta
  await populateCategoryHero(currentCatKey);

  // Render category navigation chips
  renderCategoryNav();

  // Render video grid
  renderVideos();

  // (Search listener moved to storage.js for global Enter-to-search behavior)

  // Sort buttons
  document.querySelectorAll(".sort-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".sort-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentSort = btn.dataset.sort;
      renderVideos();
    });
  });

  // Mobile menu
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const menuIcon = document.getElementById("menuIcon");
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    menuIcon.setAttribute("data-lucide", isOpen ? "x" : "menu");
    lucide.createIcons();
  });

  // Mobile search
  const mobileSearchToggle = document.getElementById("mobileSearchToggle");
  const searchContainer = document.getElementById("searchContainer");
  const isMobile = window.innerWidth <= 768;
  if (isMobile) mobileSearchToggle.style.display = "block";

  window.addEventListener("resize", () => {
    const mobile = window.innerWidth <= 768;
    mobileSearchToggle.style.display = mobile ? "block" : "none";
    if (!mobile) searchContainer.classList.remove("active");
  });

  mobileSearchToggle.addEventListener("click", () => {
    const isActive = searchContainer.classList.toggle("active");
    if (isActive) searchInput.focus();
  });


  // Page transitions
  document.addEventListener("click", (e) => {
    const link = e.target.closest(".video-card, .logo, .nav-link, .cat-chip-link");
    if (link) {
      const targetUrl = link.getAttribute("href");
      if (targetUrl && targetUrl !== "#") {
        e.preventDefault();
        const appContainer = document.querySelector(".app-container");
        appContainer.classList.add("fade-out");
        setTimeout(() => { window.location.href = targetUrl; }, 220);
      }
    }
  });

  lucide.createIcons();
});

async function populateCategoryHero(catKey) {
  let cat = CATEGORIES[catKey];
  if (!cat) {
    // Generate a fallback for dynamic custom categories
    cat = {
      title: catKey.charAt(0).toUpperCase() + catKey.slice(1),
      desc: "",
      icon: "hash",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)",
      bgColor: "rgba(59, 130, 246, 0.08)"
    };
  }
  const heroIcon = document.getElementById("catHeroIcon");
  const heroBg = document.getElementById("catHeroBg");

  document.title = `${cat.title} Category - FreePremium`;
  document.getElementById("metaTitle").content = document.title;
  document.getElementById("ogTitle").content = document.title;
  
  const shortDesc = (cat.desc || `Browse premium videos in the ${cat.title} category on FreePremium.`).substring(0, 155);
  document.getElementById("metaDesc").content = shortDesc;
  document.getElementById("ogDesc").content = shortDesc;
  document.getElementById("catHeroTitle").textContent = cat.title;
  document.getElementById("catHeroDesc").textContent = cat.desc;
  document.getElementById("gridTitle").textContent = `${cat.title} Videos`;

  // Set hero gradient background
  heroBg.style.background = cat.gradient;

  // Set icon
  heroIcon.style.background = cat.bgColor;
  heroIcon.style.borderColor = cat.gradient.includes("#") ? "rgba(255,255,255,0.15)" : "transparent";
  heroIcon.querySelector("i").setAttribute("data-lucide", cat.icon);

  // Count videos in this category
  const filtered = await getFilteredVideos();
  const count = filtered.length;
  document.getElementById("catVideoCount").innerHTML = `<i data-lucide="film" style="width: 14px; height: 14px;"></i> ${count} Videos`;

  // Highlight active nav link
  document.querySelectorAll(".nav-link").forEach(link => {
    const href = link.getAttribute("href");
    if (href && href.includes(`cat=${catKey}`)) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// ── Render Category Navigation ──
function renderCategoryNav() {
  const catKeys = Object.keys(CATEGORIES);
  catNavContainer.innerHTML = catKeys.map(key => {
    const cat = CATEGORIES[key];
    const isActive = key === currentCatKey;
    return `
      <a href="category.html?cat=${encodeURIComponent(key)}" class="category-chip cat-chip-link ${isActive ? 'active' : ''}" style="${isActive ? `background: ${cat.gradient}; border-color: transparent;` : ''}">
        ${escapeHTML(cat.title)}
      </a>
    `;
  }).join("");
}

// ── Get Filtered Videos ──
async function getFilteredVideos() {
  const vids = await getVideos();
  return vids.filter(video => {
    let cats = [];
    if (Array.isArray(video.categories)) cats = video.categories;
    else if (typeof video.categories === 'string') {
      try { cats = JSON.parse(video.categories); } catch(e) { cats = []; }
    }
    
    let tags = [];
    if (Array.isArray(video.tags)) tags = video.tags;
    else if (typeof video.tags === 'string') {
      try { tags = JSON.parse(video.tags); } catch(e) { tags = []; }
    }
    
    const title = video.title || "";
    const creator = video.creator || "";

    const matchesCat = tags.some(t => (t||"").toLowerCase() === currentCatKey) ||
                       cats.some(c => (c||"").toLowerCase() === currentCatKey);
                       
    const matchesSearch = !searchQuery ||
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cats.some(c => (c||"").toLowerCase().includes(searchQuery.toLowerCase())) ||
      creator.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesCat && matchesSearch;
  });
}

// ── Sort Videos ──
function parseViewCount(viewStr) {
  if (!viewStr || typeof viewStr !== 'string') return 0;
  const cleaned = viewStr.toLowerCase().replace(/views?/g, '').replace(/,/g, '').trim();
  if (cleaned.endsWith('m')) return parseFloat(cleaned) * 1000000;
  if (cleaned.endsWith('k')) return parseFloat(cleaned) * 1000;
  return parseInt(cleaned, 10) || 0;
}

function sortVideos(videos) {
  const sorted = [...videos];
  switch (currentSort) {
    case "latest":
      sorted.sort((a, b) => {
        const dateA = new Date(a.created_at || a.date || 0);
        const dateB = new Date(b.created_at || b.date || 0);
        return dateB - dateA;
      });
      break;
    case "popular":
      sorted.sort((a, b) => parseViewCount(b.views) - parseViewCount(a.views));
      break;
    case "az":
      sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
      break;
  }
  return sorted;
}

// ── Render Video Grid ──
let currentPage = 1;
const ITEMS_PER_PAGE = 12;

async function renderVideos(append = false) {
  const filtered = await getFilteredVideos();
  const sorted = sortVideos(filtered);

  // Update count
  document.getElementById("catVideoCount").innerHTML = `<i data-lucide="film" style="width: 14px; height: 14px;"></i> ${sorted.length} Videos`;

  if (sorted.length === 0) {
    videoGrid.style.display = "none";
    emptyState.style.display = "flex";
    lucide.createIcons();
    
    const btn = document.getElementById("catLoadMoreBtn");
    if (btn) btn.style.display = "none";
    return;
  }

  videoGrid.style.display = "grid";
  emptyState.style.display = "none";

  if (!append) currentPage = 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedVideos = sorted.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
  let loadMoreBtn = document.getElementById("catLoadMoreBtn");
  if (!loadMoreBtn) {
    loadMoreBtn = document.createElement("button");
    loadMoreBtn.id = "catLoadMoreBtn";
    loadMoreBtn.className = "primary-btn";
    loadMoreBtn.style = "margin: 32px auto; display: block; background: #3b82f6;";
    loadMoreBtn.innerHTML = '<i data-lucide="plus-circle"></i> Load More';
    loadMoreBtn.addEventListener("click", () => {
      currentPage++;
      renderVideos(true);
    });
    videoGrid.parentNode.insertBefore(loadMoreBtn, videoGrid.nextSibling);
  }

  if (startIndex + ITEMS_PER_PAGE >= sorted.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "block";
  }

  lucide.createIcons();
  if(window.injectBanners) window.injectBanners();
}
