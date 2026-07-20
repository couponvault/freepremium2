// freepremium Shared Storage & Categories Logic

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

const SUPABASE_URL = 'https://bkouydhkskizqcvxurey.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrb3V5ZGhrc2tpenFjdnh1cmV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1MzMyODksImV4cCI6MjEwMDEwOTI4OX0.1WuD38YNjqKVj8jtlnTBHCLxF3g6bXc-8wUQzIHAm2o';

let supabase = null;
if (window.supabase) {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

function initStorage() {
  let existingCats = JSON.parse(localStorage.getItem("freepremium_categories"));
  if (!existingCats || !Array.isArray(existingCats)) {
    existingCats = [];
  }
  
  let updated = false;
  DEFAULT_CATEGORIES.forEach(cat => {
    if (!existingCats.includes(cat)) {
      existingCats.push(cat);
      updated = true;
    }
  });
  
  if (updated || !localStorage.getItem("freepremium_categories")) {
    localStorage.setItem("freepremium_categories", JSON.stringify(existingCats));
  }
}

async function getVideos() {
  if (!supabase) return DEFAULT_VIDEOS;
  const { data, error } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
  if (error || !data || data.length === 0) return DEFAULT_VIDEOS;
  return data;
}

function getCategories() {
  return JSON.parse(localStorage.getItem("freepremium_categories") || "[]");
}

function saveCategories(cats) {
  localStorage.setItem("freepremium_categories", JSON.stringify(cats));
}

async function saveVideos(vids) {
  if (!supabase) return;
  // Upsert allows insert and update
  await supabase.from('videos').upsert(vids);
}

async function getItems() {
  if (!supabase) return [];
  const { data, error } = await supabase.from('premium_items').select('*').order('created_at', { ascending: false });
  if (error) return [];
  return data;
}

async function saveItems(items) {
  if (!supabase) return;
  await supabase.from('premium_items').upsert(items);
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
}

function getCustomSEOKeywords() {
  const words = localStorage.getItem("freepremium_seo_keywords");
  return words ? JSON.parse(words) : "";
}

function saveCustomSEOKeywords(keywords) {
  localStorage.setItem("freepremium_seo_keywords", JSON.stringify(keywords));
}

function injectSEOMetadata() {
  // 1. Inject Custom Keywords
  const custom = getCustomSEOKeywords();
  if (custom) {
    let metaTag = document.querySelector('meta[name="keywords"]');
    if (metaTag) {
      const existing = metaTag.getAttribute("content") || "";
      metaTag.setAttribute("content", custom + ", " + existing);
    } else {
      metaTag = document.createElement('meta');
      metaTag.name = "keywords";
      metaTag.content = custom;
      document.head.appendChild(metaTag);
    }
  }
  
  // 2. Inject Canonical Tag
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = "canonical";
    // Strip hash or search params from URL to create clean canonical
    let canonicalUrl = window.location.href.split('#')[0];
    canonical.href = canonicalUrl;
    document.head.appendChild(canonical);
  }
}

// Auto-init and render nav categories on load
initStorage();
document.addEventListener("DOMContentLoaded", () => {
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
});
