/**
 * ========================================================================
 *   FreePremium - Video Watch Controller (External Embed Mode)
 * ========================================================================
 * This page uses EXTERNAL EMBED URLs via iframes.
 * FreePremium does NOT host or upload videos — it is a directory platform.
 */

// Shared Database (Client-Side Standalone)
// Shared Database initialized via storage.js

// Initialize Watch Page
document.addEventListener("DOMContentLoaded", async () => {
  // Extract video ID from query params or clean URL
  let videoId = new URLSearchParams(window.location.search).get("v");
  if (!videoId && window.location.pathname.startsWith("/watch/")) {
    videoId = window.location.pathname.split("/watch/")[1];
  }
  videoId = videoId || "vid-1"; // Default to first video

  // Find target video
  const videos = await getVideos();
  const video = videos.find(v => v.id === videoId) || videos[0];

  // Populate Page Elements
  populateVideoDetails(video);
  
  // Dynamic SEO Tags
  document.title = `Watch ${video.title} - FreePremium`;
  document.getElementById("metaTitle").content = document.title;
  document.getElementById("ogTitle").content = document.title;
  
  const shortDesc = (video.description || "Watch high-quality premium videos and streams for free.").substring(0, 155);
  document.getElementById("metaDesc").content = shortDesc;
  document.getElementById("ogDesc").content = shortDesc;
  document.getElementById("ogImage").content = video.thumbnail || "https://freepremium.com/assets/hero_spotlight.png";

  // Render Sidebar Related Suggestions
  renderRelatedVideos(video);

  // Initialize Navbar Mobile Menu toggles
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const menuIcon = document.getElementById("menuIcon");

  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    menuIcon.setAttribute("data-lucide", isOpen ? "x" : "menu");
    lucide.createIcons();
  });



  // Global exit navigation page transitions
  document.addEventListener("click", (e) => {
    const link = e.target.closest(".related-card, .logo, .nav-link");
    if (link) {
      const targetUrl = link.getAttribute("href");
      if (targetUrl && targetUrl !== "#") {
        e.preventDefault();
        const appContainer = document.querySelector(".app-container");
        appContainer.classList.add("fade-out");
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 220);
      }
    }
  });

  // Call Lucide Init
  lucide.createIcons();
});

// Populate HTML Elements
function populateVideoDetails(video) {
  document.title = `FreePremium - Watch ${video.title}`;

  const embedIframe = document.getElementById("videoEmbed");
  const placeholder = document.getElementById("playerPlaceholder");
  const placeholderBg = document.getElementById("placeholderBg");
  const placeholderTitle = document.getElementById("placeholderTitle");

  // Always start by showing the play placeholder
  embedIframe.style.display = "none";
  placeholder.style.display = "block";
  placeholderBg.src = video.thumbnail;
  placeholderTitle.textContent = "Click to play";
  placeholderTitle.style.display = "block";

  // When user clicks the placeholder, show the video
  placeholder.addEventListener("click", () => {
    if (!video.embedUrl || video.embedUrl.trim() === "") {
      const icon = placeholder.querySelector(".player-embed-icon i");
      if(icon) {
        icon.setAttribute("data-lucide", "alert-triangle");
        icon.style.animation = "none";
        icon.style.color = "#ef4444";
        lucide.createIcons();
      }
      placeholderTitle.textContent = "Video source missing (Update in Admin Panel)";
      return;
    }

    const icon = placeholder.querySelector(".player-embed-icon i");
    if(icon) {
      icon.setAttribute("data-lucide", "loader");
      icon.style.animation = "spin 1.5s linear infinite";
      lucide.createIcons();
    }
    placeholderTitle.textContent = "Loading stream...";
    
    setTimeout(() => {
      placeholder.style.display = "none";
      embedIframe.style.display = "block";
      embedIframe.src = video.embedUrl;
    }, 800); // slight fake loading delay for premium feel
  });

  document.getElementById("videoTitle").textContent = video.title;
  let vidCats = [];
  if (Array.isArray(video.categories)) vidCats = video.categories;
  else if (typeof video.categories === 'string') { try { vidCats = JSON.parse(video.categories); } catch(e) { vidCats = []; } }
  document.getElementById("videoCategory").innerHTML = vidCats.map(cat => 
    `<a href="category.html?cat=${encodeURIComponent((cat||"").toLowerCase())}" class="card-category" style="margin-right:8px; display:inline-block; text-decoration: none; cursor: pointer;">${escapeHTML(cat||"")}</a>`
  ).join("");
  document.getElementById("videoViews").innerHTML = `<i data-lucide="eye" style="width: 14px; height: 14px; display: inline; vertical-align: text-bottom; margin-right: 4px;"></i> ${escapeHTML(video.views)}`;
  document.getElementById("videoDate").innerHTML = `<i data-lucide="calendar" style="width: 14px; height: 14px; display: inline; vertical-align: text-bottom; margin-right: 4px;"></i> Released ${escapeHTML(video.date || 'recently')}`;
  document.getElementById("videoCreator").textContent = video.creator || "Unknown";
  document.getElementById("videoDescription").textContent = video.description || "No description provided for this premium stream.";

  // Create Avatar Initials
  const creatorName = video.creator || "Unknown";
  const creatorParts = creatorName.split(" ");
  const initials = creatorParts.map(p => p[0]).join("").toUpperCase().substring(0, 2);
  document.getElementById("creatorAvatar").textContent = initials;
  
  // Breadcrumbs
  const firstCat = (vidCats.length > 0) ? vidCats[0] : "All";
  document.getElementById("videoBreadcrumbs").innerHTML = `
    <a href="index.html" style="color: inherit; text-decoration: none;">Home</a> 
    <span style="margin: 0 4px;">/</span> 
    <a href="category.html?cat=${encodeURIComponent(firstCat.toLowerCase())}" style="color: inherit; text-decoration: none;">${escapeHTML(firstCat)}</a> 
    <span style="margin: 0 4px;">/</span> 
    <span style="color: hsl(var(--text-primary));">${escapeHTML(video.title)}</span>
  `;
  
  // Schema Markup (VideoObject)
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.title,
    "description": video.description || "Watch high-quality premium videos and streams for free.",
    "thumbnailUrl": [video.thumbnail || "https://freepremium.com/assets/hero_spotlight.png"],
    "uploadDate": new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": video.creator
    }
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
}

// Generate Related Recommendations Grid
async function renderRelatedVideos(currentVideo) {
  const relatedContainer = document.getElementById("relatedContainer");

  // Prioritize based on number of shared categories
  let currentCats = [];
  if (Array.isArray(currentVideo.categories)) currentCats = currentVideo.categories;
  else if (typeof currentVideo.categories === 'string') { try { currentCats = JSON.parse(currentVideo.categories); } catch(e) { currentCats = []; } }
  
  const allVideos = await getVideos();
  const related = allVideos.filter(v => v.id !== currentVideo.id)
                             .sort((a, b) => {
                                let aCats = Array.isArray(a.categories) ? a.categories : [];
                                let bCats = Array.isArray(b.categories) ? b.categories : [];
                                if (typeof a.categories === 'string') { try { aCats = JSON.parse(a.categories); } catch(e) {} }
                                if (typeof b.categories === 'string') { try { bCats = JSON.parse(b.categories); } catch(e) {} }
                                const aMatchCount = aCats.filter(c => currentCats.includes(c)).length;
                                const bMatchCount = bCats.filter(c => currentCats.includes(c)).length;
                                return bMatchCount - aMatchCount;
                              });

  // Render custom vertical card items in the sidebar
  relatedContainer.innerHTML = related.map(v => `
    <a href="watch.html?v=${encodeURIComponent(v.id)}" class="related-card">
      <div class="related-thumb-wrapper">
        <img src="${escapeHTML(v.thumbnail)}" alt="${escapeHTML(v.title)}" class="related-thumb" loading="lazy">
        <span class="related-duration">${escapeHTML(v.duration)}</span>
      </div>
      <div class="related-details">
        <h4 class="related-card-title">${escapeHTML(v.title)}</h4>
        <span class="related-creator">${escapeHTML(v.creator)}</span>
        <span class="related-views">${escapeHTML(v.views)}</span>
      </div>
    </a>
  `).join("");
}

