// freepremium Shared Storage & Categories Logic

// Global Redirects: Force HTTPS and non-www
if (window.location.hostname.startsWith('www.') || window.location.protocol === 'http:') {
  const newHost = window.location.hostname.replace(/^www\./, '');
  window.location.replace('https://' + newHost + window.location.pathname + window.location.search + window.location.hash);
}
// Global HTML Escaper to prevent XSS
function escapeHTML(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

const DEFAULT_VIDEOS = [
  {
    id: "vid-1",
    title: "Nova Sector: The Last Frontier (Official Cinematic Trailer)",
    categories: ["Sci-Fi", "Gaming"],
    duration: "2:45",
    views: "1.2M views",
    thumbnail: "assets/hero_spotlight.png",
    creator: "Apex Studios",
    embedUrl: "",
    date: "May 20, 2026",
    description: "Welcome to the official launch cinematic of Nova Sector. Embark on a breathtaking sci-fi adventure exploring the deepest reaches of the outer rim. Experience cinematic gameplay and live visual effects streaming right now. Directed by Apex Studios Creative Team. Music scored by retro-orchestral masters."
  },
  {
    id: "vid-2",
    title: "Cyberpunk 2077 - Dark Web Netrunning & Cyberware Guide",
    categories: ["Gaming", "Tech"],
    duration: "14:20",
    views: "340K views",
    thumbnail: "assets/thumb_cyberpunk.png",
    creator: "NeoGamer",
    embedUrl: "",
    date: "May 18, 2026",
    description: "An in-depth breakdown of the most overpowered Netrunning systems and cyberware combos in the latest cyberpunk update. We cover RAM allocation, quickhack queues, and where to acquire legendary grade tier-5 operating decks. Subscribe for more builds!"
  },
  {
    id: "vid-3",
    title: "Synthwave Retro Beats - 24/7 Midnight Chill Sunset Mix",
    categories: ["Music"],
    duration: "1:05:00",
    views: "890K views",
    thumbnail: "assets/thumb_synthwave.png",
    creator: "RetroWave Records",
    embedUrl: "",
    date: "May 25, 2026",
    description: "Sit back and lose yourself in the ultimate retro synthwave experience. Tailored specifically for late-night drives, intense programming sessions, or just winding down. Featuring curated music from leading artists in the synth and chillwave community."
  },
  {
    id: "vid-4",
    title: "Quantum Computing & Neural Networks: The Future of AI",
    categories: ["Tech", "Sci-Fi"],
    duration: "18:40",
    views: "120K views",
    thumbnail: "assets/thumb_quantum.png",
    creator: "TechHorizon",
    embedUrl: "",
    date: "May 12, 2026",
    description: "How close are we to quantum supremacy? In this episode of TechHorizon, we analyze how qubits, superposition, and quantum entanglement are supercharging machine learning algorithms to build tomorrow's superintelligent systems."
  },
  {
    id: "vid-5",
    title: "Deep Space Exploration: Secrets of the Nebula",
    categories: ["Sci-Fi"],
    duration: "10:15",
    views: "520K views",
    thumbnail: "assets/hero_spotlight.png",
    creator: "Galactic TV",
    embedUrl: "",
    date: "May 5, 2026",
    description: "Join us as we explore the deepest nebulas in the known universe using the latest telescope arrays. Witness the birth of stars and the violent collisions of galaxies."
  },
  {
    id: "vid-6",
    title: "Lo-Fi Coding Session - 4K Rainy Night",
    categories: ["Music", "Tech"],
    duration: "2:00:00",
    views: "2.1M views",
    thumbnail: "assets/thumb_synthwave.png",
    creator: "CodeBeats",
    embedUrl: "",
    date: "April 30, 2026",
    description: "Immersive lo-fi beats paired with high-fidelity visuals of a rainy neon city. The perfect background companion for deep work, coding, and studying."
  },
  {
    id: "vid-7",
    title: "Ultimate 100-Player Battle Royale Finale",
    categories: ["Gaming"],
    duration: "45:30",
    views: "8.4M views",
    thumbnail: "assets/thumb_cyberpunk.png",
    creator: "ApexStudios",
    embedUrl: "",
    date: "May 22, 2026",
    description: "The grand finale of the world's biggest battle royale tournament. Watch the top 100 players duke it out for the ultimate prize in an ever-shrinking arena."
  },
  {
    id: "vid-8",
    title: "AI Agentic Workflows: Building the Coding Assistants of Tomorrow",
    categories: ["Tech", "Amateur"],
    duration: "22:15",
    views: "98K views",
    thumbnail: "assets/thumb_quantum.png",
    creator: "Cognitive Labs",
    embedUrl: "",
    date: "May 28, 2026",
    description: "A practical walkthrough on designing robust, multi-agent pipelines with dynamic routing, recursive error self-correction, and tool invocation limits. We showcase real production benchmarks."
  }
];

const DEFAULT_CATEGORIES = [
  "Trending", "Popular", "Featured", "HD Quality", "Amateur", "Sci-Fi", "Gaming", "Music", "Tech"
];

// Obfuscated Supabase Keys (Base64) to prevent easy scraping
const O_URL = 'aHR0cHM6Ly9ia291eWRoa3NraXpxY3Z4dXJleS5zdXBhYmFzZS5jbw==';
const O_KEY = 'ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW1KcmIzVjVaR2hyYzJ0cGVuRmpkbmgxY21WNUlpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUzT0RRMU16TXlPRGtzSW1WNGNDSTZNakV3TURFd09USTRPWDAuMVd1RDM4WU5qcUtWajhqdGxuVEJIQ0x4RjNnNmJYYy04d1VReklIQW0ybw==';

const SUPABASE_URL = atob(O_URL);
const SUPABASE_KEY = atob(O_KEY);

let supabaseClient = null;
if (window.supabase) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

function initStorage() {
  let existingCats;
  try {
    existingCats = JSON.parse(localStorage.getItem("freepremium_categories"));
  } catch(e) {
    existingCats = null;
  }
  
  if (!existingCats || !Array.isArray(existingCats)) {
    existingCats = [...DEFAULT_CATEGORIES];
  } else {
    DEFAULT_CATEGORIES.forEach(cat => {
      if (!existingCats.includes(cat)) {
        existingCats.push(cat);
      }
    });
  }
  
  localStorage.setItem("freepremium_categories", JSON.stringify(existingCats));
}

async function getVideos() {
  if (!supabaseClient) return DEFAULT_VIDEOS;
  const { data, error } = await supabaseClient.from('videos').select('*').order('created_at', { ascending: false });
  if (error || !data || data.length === 0) return DEFAULT_VIDEOS;
  return data.map(v => {
    if (!v.views || v.views === "0" || String(v.views).trim() === "") {
      const hash = v.id.split("").reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
      const fakeViews = (Math.abs(hash) % 899) + 100;
      v.views = fakeViews + "K views";
    }
    return v;
  });
}

// Global variables to hold loaded config so synchronous getters don't break old code
let CACHED_CATEGORIES = DEFAULT_CATEGORIES;
let CACHED_KEYWORDS = "";

async function fetchSiteSettings() {
  if (!supabaseClient) return;
  const { data, error } = await supabaseClient.from('site_settings').select('*');
  if (error || !data) return;
  
  let catsUpdated = false;
  let wordsUpdated = false;
  
  data.forEach(row => {
    if (row.id === 'categories') {
      try {
        const parsed = JSON.parse(row.value);
        if (Array.isArray(parsed)) {
          CACHED_CATEGORIES = parsed;
          localStorage.setItem("freepremium_categories", row.value);
          catsUpdated = true;
        }
      } catch(e) {}
    }
    if (row.id === 'seo_keywords') {
      CACHED_KEYWORDS = row.value;
      localStorage.setItem("freepremium_seo_keywords", row.value);
      wordsUpdated = true;
    }
  });

  // Re-render things if they changed
  if (catsUpdated) renderNavCategories();
  if (wordsUpdated) injectSEOMetadata();
}

function getCategories() {
  const localCats = localStorage.getItem("freepremium_categories");
  if (localCats) {
    try { 
      const parsed = JSON.parse(localCats);
      if (Array.isArray(parsed)) return parsed;
    } catch(e) {}
  }
  if (Array.isArray(CACHED_CATEGORIES)) return CACHED_CATEGORIES;
  return DEFAULT_CATEGORIES;
}

async function saveCategories(cats) {
  CACHED_CATEGORIES = cats;
  localStorage.setItem("freepremium_categories", JSON.stringify(cats));
  if (supabaseClient) {
    await supabaseClient.from('site_settings').upsert({ id: 'categories', value: JSON.stringify(cats), updated_at: new Date() });
  }
}

async function saveVideos(vids) {
  if (!supabaseClient) return;
  // Only insert/upsert provided videos (not the whole array)
  const { data, error } = await supabaseClient.from('videos').upsert(vids);
  if (error) {
    console.error('Supabase saveVideos error:', error);
    alert('Failed to save video: ' + error.message);
  }
}

// Insert or update a single video (used by admin form)
async function upsertVideo(video) {
  if (!supabaseClient) { alert('Database not connected!'); return false; }
  const { data, error } = await supabaseClient.from('videos').upsert([video]);
  if (error) {
    console.error('Supabase upsertVideo error:', error);
    alert('Failed to save video: ' + error.message);
    return false;
  }
  return true;
}

async function getItems() {
  if (!supabaseClient) return [];
  const { data, error } = await supabaseClient.from('premium_items').select('*').order('created_at', { ascending: false });
  if (error) return [];
  return data;
}

async function saveItems(items) {
  if (!supabaseClient) return;
  const { data, error } = await supabaseClient.from('premium_items').upsert(items);
  if (error) {
    console.error('Supabase saveItems error:', error);
    alert('Failed to save item: ' + error.message);
  }
}

// Insert or update a single premium item (used by admin form)
async function upsertItem(item) {
  if (!supabaseClient) { alert('Database not connected!'); return false; }
  const { data, error } = await supabaseClient.from('premium_items').upsert([item]);
  if (error) {
    console.error('Supabase upsertItem error:', error);
    alert('Failed to save item: ' + error.message);
    return false;
  }
  return true;
}

function renderNavCategories() {
  const cats = getCategories();
  
  // Try to render into the Modal List
  const modalList = document.getElementById("categoryModalList");
  if(modalList) {
    modalList.innerHTML = cats.map(cat => `
      <a href="category.html?cat=${encodeURIComponent(cat)}" class="cat-modal-item">${escapeHTML(cat)}</a>
    `).join("");
  }

  // Try to render into the Homepage List
  const homeList = document.getElementById("homeCategoryList");
  if(homeList) {
    const VISIBLE_COUNT = 12; // Show 12 items initially (approx 2-3 rows depending on screen)
    
    homeList.innerHTML = cats.map((cat, index) => `
      <a href="category.html?cat=${encodeURIComponent(cat)}" class="cat-modal-item ${index >= VISIBLE_COUNT ? 'hidden-cat' : ''}" style="${index >= VISIBLE_COUNT ? 'display: none;' : ''}">${escapeHTML(cat)}</a>
    `).join("");

    if (cats.length > VISIBLE_COUNT) {
      homeList.innerHTML += `<button id="toggleCategoriesBtn" style="background: none; border: none; color: hsl(var(--primary)); cursor: pointer; font-size: 0.9rem; font-weight: 600; padding: 8px 16px; border-radius: 24px; border: 1px dashed hsl(var(--primary));">See More <i data-lucide="chevron-down" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-left:4px;"></i></button>`;
      
      // Delay slightly to ensure DOM is updated before adding event listener
      setTimeout(() => {
        const toggleBtn = document.getElementById("toggleCategoriesBtn");
        const hiddenCats = document.querySelectorAll('.hidden-cat');
        if (toggleBtn) {
          let isExpanded = false;
          toggleBtn.addEventListener("click", () => {
            isExpanded = !isExpanded;
            hiddenCats.forEach(el => {
              el.style.display = isExpanded ? "inline-block" : "none";
            });
            if (isExpanded) {
              toggleBtn.innerHTML = `See Less <i data-lucide="chevron-up" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-left:4px;"></i>`;
            } else {
              toggleBtn.innerHTML = `See More <i data-lucide="chevron-down" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-left:4px;"></i>`;
            }
            if(window.lucide) window.lucide.createIcons();
          });
        }
      }, 50);
    }
  }
}

function getCustomSEOKeywords() {
  const words = localStorage.getItem("freepremium_seo_keywords");
  return words || CACHED_KEYWORDS;
}

async function saveCustomSEOKeywords(keywords) {
  CACHED_KEYWORDS = keywords;
  localStorage.setItem("freepremium_seo_keywords", keywords);
  if (supabaseClient) {
    await supabaseClient.from('site_settings').upsert({ id: 'seo_keywords', value: keywords, updated_at: new Date() });
  }
}

function injectSEOMetadata() {
  // 1. Inject Custom Keywords
  const custom = getCustomSEOKeywords();
  if (custom) {
    let metaTag = document.querySelector('meta[name="keywords"]');
    if (metaTag) {
      const existing = metaTag.getAttribute("content") || "";
      // Avoid duplicate appending
      if (!existing.includes(custom)) {
         metaTag.setAttribute("content", custom + ", " + existing);
      }
    } else {
      metaTag = document.createElement('meta');
      metaTag.name = "keywords";
      metaTag.content = custom;
      document.head.appendChild(metaTag);
    }
  }
  
  // 2. Inject Canonical Tag (Clean and enforce HTTPS)
  let canonicals = document.querySelectorAll('link[rel="canonical"]');
  // Remove all existing conflicting canonicals first
  canonicals.forEach(c => c.remove());
  
  const canonical = document.createElement('link');
  canonical.rel = "canonical";
  // Force canonical to use https://freepremium.online
  let path = window.location.pathname;
  let search = window.location.search; // Important for watch.html?v=XYZ
  let canonicalUrl = `https://freepremium.online${path}${search}`;
  canonical.href = canonicalUrl;
  document.head.appendChild(canonical);
}

// Auto-init and render nav categories on load
initStorage();
document.addEventListener("DOMContentLoaded", () => {
  fetchSiteSettings(); // Fetch from Supabase on load
  
  renderNavCategories();
  injectSEOMetadata();
  
  // Modal toggle logic
  const modalBtn = document.getElementById("categoriesModalBtn");
  const modalOverlay = document.getElementById("categoryModalOverlay");
  const closeModalBtn = document.getElementById("closeCatModal");
  
  if (modalBtn && modalOverlay) {
    modalBtn.addEventListener("click", () => {
      renderNavCategories(); // Fetch latest from local memory before opening
      modalOverlay.style.display = "flex";
    });
  }
  
  if (closeModalBtn && modalOverlay) {
    closeModalBtn.addEventListener("click", () => {
      modalOverlay.style.display = "none";
    });
  }
  
  // Click outside to close
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.style.display = "none";
      }
    });
  }
  
  // Global Search Logic (Redirects on Enter)
  const globalSearchInput = document.getElementById("searchInput");
  if (globalSearchInput) {
    globalSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const val = globalSearchInput.value.trim();
        if (val) {
          window.location.href = "search.html?q=" + encodeURIComponent(val);
        }
      }
    });
  }

  // Age Gate Logic
  const isVerified = localStorage.getItem("freepremium_age_verified");
  if (isVerified !== "true" && window.location.pathname.indexOf('admin.html') === -1) {
    const ageGateOverlay = document.createElement("div");
    ageGateOverlay.style.position = "fixed";
    ageGateOverlay.style.top = "0";
    ageGateOverlay.style.left = "0";
    ageGateOverlay.style.width = "100%";
    ageGateOverlay.style.height = "100%";
    ageGateOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.95)";
    ageGateOverlay.style.backdropFilter = "blur(10px)";
    ageGateOverlay.style.zIndex = "999999";
    ageGateOverlay.style.display = "flex";
    ageGateOverlay.style.alignItems = "center";
    ageGateOverlay.style.justifyContent = "center";
    
    ageGateOverlay.innerHTML = `
      <div style="background: hsl(var(--bg-card)); padding: 40px; border-radius: 16px; border: 1px solid hsl(var(--border-color)); text-align: center; max-width: 400px; width: 90%;">
        <h2 style="color: #ef4444; margin-bottom: 16px; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <i data-lucide="alert-triangle"></i> 18+ Caution
        </h2>
        <p style="color: hsl(var(--text-muted)); margin-bottom: 24px; font-size: 1rem; line-height: 1.5;">
          This website contains content that is only suitable for adults. By entering, you confirm that you are 18 years of age or older.
        </p>
        <div style="display: flex; gap: 12px; flex-direction: column;">
          <button id="ageGateYes" style="background: linear-gradient(135deg, #3b82f6, #ec4899); color: white; border: none; padding: 14px; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer;">Yes, I am 18+ (Enter)</button>
          <button id="ageGateNo" style="background: transparent; color: hsl(var(--text-secondary)); border: 1px solid hsl(var(--border-color)); padding: 14px; border-radius: 8px; font-size: 1rem; cursor: pointer;">No, Exit</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(ageGateOverlay);
    if(window.lucide) window.lucide.createIcons();
    
    document.getElementById("ageGateYes").addEventListener("click", () => {
      localStorage.setItem("freepremium_age_verified", "true");
      ageGateOverlay.remove();
    });
    
    document.getElementById("ageGateNo").addEventListener("click", () => {
      window.location.href = "https://www.google.com";
    });
  }

  // Global Disclaimer Logic
  if (window.location.pathname.indexOf('admin.html') === -1) {
    // Create Modal
    const disclaimerOverlay = document.createElement("div");
    disclaimerOverlay.style.position = "fixed";
    disclaimerOverlay.style.top = "0";
    disclaimerOverlay.style.left = "0";
    disclaimerOverlay.style.width = "100%";
    disclaimerOverlay.style.height = "100%";
    disclaimerOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
    disclaimerOverlay.style.backdropFilter = "blur(5px)";
    disclaimerOverlay.style.zIndex = "999999";
    disclaimerOverlay.style.display = "none";
    disclaimerOverlay.style.alignItems = "center";
    disclaimerOverlay.style.justifyContent = "center";

    disclaimerOverlay.innerHTML = `
      <div style="background: hsl(var(--bg-card)); padding: 30px; border-radius: 12px; border: 1px solid hsl(var(--border-color)); max-width: 500px; width: 90%; position: relative;">
        <button id="closeDisclaimer" style="position: absolute; top: 15px; right: 15px; background: none; border: none; color: hsl(var(--text-secondary)); cursor: pointer; font-size: 1.5rem;">&times;</button>
        <h2 style="color: white; margin-bottom: 20px; font-size: 1.3rem; display: flex; align-items: center; gap: 8px;">
          <i data-lucide="shield-alert" style="width: 20px; height: 20px; color: #3b82f6;"></i> Legal Disclaimer
        </h2>
        <div style="color: hsl(var(--text-muted)); font-size: 0.9rem; line-height: 1.6; max-height: 60vh; overflow-y: auto; padding-right: 10px;">
          <p style="margin-bottom: 12px;"><strong style="color: #ec4899;">Important Notice:</strong> All views, likes, and video contents displayed on this website are embedded directly from main third-party websites. These are not real views or stats generated by our servers.</p>
          <p style="margin-bottom: 12px;">FreePremium functions strictly as an automated indexing platform and search engine. We do not host, upload, or store any media files, adult videos, or APK files on our own servers. All content is automatically gathered and embedded from public non-affiliated third-party sources.</p>
          <p>By using this site, you acknowledge that FreePremium has no control over the content of these external links and is not responsible for their accuracy, copyright compliance, legality, or decency.</p>
        </div>
        <button id="acceptDisclaimer" style="margin-top: 24px; width: 100%; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; border: none; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer;">I Understand</button>
      </div>
    `;

    document.body.appendChild(disclaimerOverlay);
    if(window.lucide) window.lucide.createIcons();

    const closeModal = () => {
      disclaimerOverlay.style.display = "none";
    };

    // Hook into the header button if it exists (index.html)
    const headerBtn = document.getElementById("disclaimerHeaderBtn");
    if (headerBtn) {
      headerBtn.addEventListener("click", () => {
        disclaimerOverlay.style.display = "flex";
      });
    }

    const closeBtn = disclaimerOverlay.querySelector("#closeDisclaimer");
    const acceptBtn = disclaimerOverlay.querySelector("#acceptDisclaimer");

    closeBtn.addEventListener("click", closeModal);
    acceptBtn.addEventListener("click", closeModal);
    
    // Close on click outside
    disclaimerOverlay.addEventListener("click", (e) => {
      if (e.target === disclaimerOverlay) closeModal();
    });
  }
});

// Global Image Fallback (Fixes broken thumbnails due to adblockers, VPNs, or expired links)
document.addEventListener('error', function(e) {
  if (e.target.tagName && e.target.tagName.toLowerCase() === 'img') {
    if (!e.target.dataset.failed) {
      e.target.dataset.failed = "true";
      // A sleek, dark placeholder SVG
      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 400 300'%3E%3Crect width='100%25' height='100%25' fill='%23111827'/%3E%3Cpath d='M150 200 L200 140 L250 220 Z' fill='%23374151'/%3E%3Ccircle cx='250' cy='100' r='30' fill='%23374151'/%3E%3Ctext x='200' y='180' font-family='sans-serif' font-size='20' font-weight='bold' fill='%236b7280' text-anchor='middle' alignment-baseline='middle'%3EPreview Unavailable%3C/text%3E%3C/svg%3E";
      e.target.style.objectFit = "cover";
    }
  }
}, true); // Use capture phase to catch the error before it bubbles
