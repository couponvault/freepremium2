// FreePremium - Premium Category Rendering

document.addEventListener("DOMContentLoaded", async () => {
  // Mobile menu
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const menuIcon = document.getElementById("menuIcon");
  let isMenuOpen = false;

  if (menuToggle) {
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

  // Render logic
  const urlParams = new URLSearchParams(window.location.search);
  const typeFilter = urlParams.get("type");
  
  const pageTitle = document.getElementById("pageTitle");
  const itemsGrid = document.getElementById("itemsGrid");
  const emptyState = document.getElementById("emptyState");
  
  const typeMap = {
    "apk": { title: "Mod APKs", icon: "smartphone" },
    "movie": { title: "Exclusive Movies", icon: "film" },
    "drama": { title: "Web Series", icon: "tv" }
  };
  
  if (typeFilter && typeMap[typeFilter]) {
    pageTitle.innerHTML = `<i data-lucide="${typeMap[typeFilter].icon}" style="color: #ec4899;"></i> ${typeMap[typeFilter].title}`;
    
    // Dynamic SEO
    document.title = `${typeMap[typeFilter].title} - FreePremium`;
    document.getElementById("metaTitle").content = document.title;
    document.getElementById("ogTitle").content = document.title;
    
  } else {
    pageTitle.innerHTML = `<i data-lucide="alert-circle" style="color: #ef4444;"></i> Unknown Category`;
  }
  
  const allItems = typeof getItems === "function" ? await getItems() : [];
  const filteredItems = allItems.filter(item => item.type === typeFilter);
  
  let currentPage = 1;
  const ITEMS_PER_PAGE = 12;

  function renderItems(append = false) {
    if (filteredItems.length === 0) {
      emptyState.style.display = "block";
      
      const btn = document.getElementById("premLoadMoreBtn");
      if (btn) btn.style.display = "none";
      return;
    } else {
      emptyState.style.display = "none";
    }

    if (!append) currentPage = 1;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const html = paginatedItems.map(item => `
      <div class="video-card">
        <div class="thumbnail-container">
          <img src="${item.thumbnail}" alt="Thumbnail" class="thumbnail" style="object-fit: cover;" loading="lazy">
          ${item.subtitle ? `<div class="duration-badge">${item.subtitle}</div>` : ''}
        </div>
        <div class="card-details">
          <h3 class="card-title">${item.title}</h3>
          ${item.description ? `<span class="card-description" style="font-size: 0.8rem; color: #a1a1aa; margin-top: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4;">${escapeHTML(item.description)}</span>` : ''}
          <div style="margin-top: 12px;">
            <a href="details.html?id=${item.id}" class="primary-btn" style="display: block; text-align: center; text-decoration: none; background: #ec4899;">
              ${item.type === 'apk' ? 'Download APK' : 'Watch Online / Download'}
            </a>
          </div>
        </div>
      </div>
    `).join("");

    if (append) {
      itemsGrid.insertAdjacentHTML("beforeend", html);
    } else {
      itemsGrid.innerHTML = html;
    }

    let loadMoreBtn = document.getElementById("premLoadMoreBtn");
    if (!loadMoreBtn) {
      loadMoreBtn = document.createElement("button");
      loadMoreBtn.id = "premLoadMoreBtn";
      loadMoreBtn.className = "primary-btn";
      loadMoreBtn.style = "margin: 32px auto; display: block; background: #ec4899;";
      loadMoreBtn.innerHTML = '<i data-lucide="plus-circle"></i> Load More';
      loadMoreBtn.addEventListener("click", () => {
        currentPage++;
        renderItems(true);
      });
      itemsGrid.parentNode.insertBefore(loadMoreBtn, itemsGrid.nextSibling);
    }

    if (startIndex + ITEMS_PER_PAGE >= filteredItems.length) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "block";
    }

    lucide.createIcons();
  }

  renderItems();
  
  // Inject Schema Markup if APK
  if (typeFilter === "apk" && filteredItems.length > 0) {
    const schemas = filteredItems.map(item => ({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": item.title,
      "operatingSystem": "ANDROID",
      "applicationCategory": "GameApplication",
      "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "USD"
      }
    }));
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemas);
    document.head.appendChild(script);
  }
  
  lucide.createIcons();
});
