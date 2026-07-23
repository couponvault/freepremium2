// FreePremium Admin Logic
let editingVideoId = null;
let editingPremiumId = null;

// =========================================================================
// Smart SEO Keyword Spinner Engine (32 Lakh+ unique combinations)
// =========================================================================
const SEO_POOLS = {
  quality: ["HD", "4K", "Full HD", "1080p", "Ultra HD", "High Quality", "Premium", "Exclusive", "Top Rated", "Best", "Viral", "Trending", "Popular", "Featured", "Handpicked", "Curated", "Uncut", "Uncensored", "Raw", "Verified"],
  adjective: ["Hot", "Sexy", "Naughty", "Wild", "Passionate", "Sensual", "Steamy", "Intense", "Real", "Beautiful", "Stunning", "Gorgeous", "Busty", "Thick", "Petite", "Curvy", "Slim", "Natural", "Exotic", "Innocent", "Dirty", "Kinky", "Nasty", "Filthy"],
  action: {
    Lesbian: ["Scissoring", "Kissing", "Strapon Play", "Tribbing", "Fingering", "Licking", "Oral", "Seduction", "First Time", "Massage", "Oil Play", "Bath Together"],
    MILF: ["Seduction", "Cheating", "Stepmom Fantasy", "Cougar Hunt", "Bedroom Scene", "Solo Play", "Teaching", "Caught in Act", "Afternoon Delight", "Neighbor Visit"],
    Amateur: ["Homemade", "First Time on Camera", "Real Couple", "POV", "Selfie Style", "Webcam", "Behind the Scenes", "Casting", "Audition", "Spontaneous", "Hidden Camera Style"],
    Mature: ["Solo Play", "Bedroom Confession", "Cougar Fantasy", "Lingerie Show", "Seduction", "Office Affair", "Experienced Lover", "Afternoon Session"],
    Transgender: ["Solo", "Threesome", "First Date", "Transformation", "Lingerie Show", "POV", "Couple Scene", "Amateur Debut", "Webcam Show", "Casting"],
    Anal: ["First Time", "Deep", "Rough", "Slow Sensual", "Oil Massage", "Toys", "POV", "Amateur", "Gaping", "Double", "Creampie"],
    Threesome: ["FFM", "MMF", "College Party", "Surprise Third", "Best Friends", "Strangers Meet", "Hotel Room", "Birthday Gift", "Double Team", "Amateur Group"],
    Hentai: ["Uncensored", "Schoolgirl", "Monster", "Tentacle", "Fantasy World", "Elf", "Demon Girl", "Sister", "Teacher", "Nurse", "Maid", "Princess"],
    Cosplay: ["Anime Girl", "Superhero", "Maid Outfit", "School Uniform", "Nurse", "Cat Girl", "Bunny Girl", "Gamer Girl", "Elf Princess", "Witch"],
    Femboy: ["Solo", "Cute", "Trap", "Crossdress", "Lingerie", "Webcam", "First Time", "Shy", "Amateur", "POV"],
    Roleplay: ["Boss Secretary", "Doctor Patient", "Teacher Student", "Stranger", "Pizza Delivery", "Plumber", "Step Family", "Landlord Tenant", "Hitchhiker", "Interview"],
    Cuckold: ["Watching Wife", "Bull Takes Over", "Husband Films", "Shared Wife", "First Time Sharing", "Hotel Room", "Interracial Bull", "Clean Up", "Phone Call"],
    Hotwife: ["Date Night", "First Bull", "Husband Watches", "Hotel Meet", "Tinder Date", "Shared Fantasy", "Confession", "Text Messages"],
    VR: ["180 Degree", "360 Experience", "POV Immersive", "Virtual Date", "VR Massage", "Virtual Girlfriend", "First Person", "Interactive"],
    Latina: ["Thick Booty", "Spicy", "Dancing", "Passionate", "Amateur Homemade", "Big Ass", "Twerk", "Outdoor", "Beach", "Colombian", "Brazilian"],
    Interracial: ["BBC", "Big Black", "First Time", "Cuckold", "Wife Shared", "Amateur", "College", "Rough", "Passionate", "Hotel Room"],
    _default: ["Solo Play", "Hardcore", "Softcore", "POV", "Compilation", "Behind Scenes", "Debut", "Interview", "Audition", "Webcam"]
  },
  countryLabel: {
    US: ["American", "US", "USA"],
    UK: ["British", "UK", "English"],
    CA: ["Canadian", "Canada"],
    AU: ["Australian", "Aussie"],
    DE: ["German", "Deutsche"],
    FR: ["French", "Française"],
    JP: ["Japanese", "Japan", "JAV"],
    ES: ["Spanish", "Española"],
    IT: ["Italian", "Italiana"],
    global: ["International", "Worldwide", "Global"]
  },
  suffix: ["Online Free", "Stream Now", "Watch Free", "Full Video", "No Sign Up", "Instant Play", "New Upload", "Latest", "Daily Update", "Just Released", "Fresh Upload", "Today", "This Week", "2026"],
  descTemplates: [
    "Watch this {quality} {adjective} {niche} {action} video featuring {countryAdj} performers. Stream {niche} content in {qualityTag} quality — {suffix}.",
    "Enjoy {quality} {niche} {action} scene with {adjective} {countryAdj} stars. Best free {niche} videos available to {suffix}.",
    "Discover the hottest {adjective} {niche} content — {action} in stunning {qualityTag}. Featuring top {countryAdj} talent. {suffix}!",
    "{quality} {niche} video: {adjective} {countryAdj} {action} scene you won't forget. Free to stream, no signup needed. {suffix}.",
    "Top trending {niche} content: Watch {adjective} {countryAdj} performers in a {action} scene. {qualityTag} quality, {suffix}.",
    "Exclusive {adjective} {niche} {action} featuring verified {countryAdj} amateurs. Streaming in {qualityTag} — {suffix}.",
    "Premium {niche} scene: {adjective} {action} with stunning {countryAdj} stars. {qualityTag} resolution, completely free. {suffix}.",
    "New {niche} upload: {adjective} {countryAdj} {action} in crystal clear {qualityTag}. Don't miss this one — {suffix}!"
  ]
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateSEO(country, quality, niche) {
  const allNiches = Object.keys(SEO_POOLS.action).filter(k => k !== '_default');
  const finalNiche = niche === 'random' ? pickRandom(allNiches) : niche;
  const allQualities = SEO_POOLS.quality;
  const finalQuality = quality === 'random' ? pickRandom(allQualities) : quality;
  const allCountries = Object.keys(SEO_POOLS.countryLabel);
  const finalCountry = country === 'random' ? pickRandom(allCountries) : country;
  
  const adj = pickRandom(SEO_POOLS.adjective);
  const actions = SEO_POOLS.action[finalNiche] || SEO_POOLS.action._default;
  const action = pickRandom(actions);
  const countryAdj = pickRandom(SEO_POOLS.countryLabel[finalCountry] || ["International"]);
  const suffix = pickRandom(SEO_POOLS.suffix);
  
  const titlePatterns = [
    `${finalQuality} ${adj} ${finalNiche} ${action} - ${countryAdj} ${suffix}`,
    `${adj} ${countryAdj} ${finalNiche} ${action} | ${finalQuality} ${suffix}`,
    `Best ${finalQuality} ${finalNiche} ${action} - ${adj} ${countryAdj} Video`,
    `${countryAdj} ${adj} ${finalNiche} - ${action} in ${finalQuality}`,
    `Watch ${adj} ${finalNiche} ${action} | ${countryAdj} ${finalQuality} ${suffix}`,
    `${finalQuality} ${countryAdj} ${finalNiche} ${action} Video - ${suffix}`,
    `${adj} ${finalNiche} ${action} Featuring ${countryAdj} Stars - ${finalQuality}`,
    `Trending ${finalNiche}: ${adj} ${countryAdj} ${action} | ${finalQuality}`
  ];
  const title = pickRandom(titlePatterns);
  
  const descTemplate = pickRandom(SEO_POOLS.descTemplates);
  const description = descTemplate
    .replace(/\{quality\}/g, finalQuality)
    .replace(/\{qualityTag\}/g, finalQuality)
    .replace(/\{adjective\}/g, adj.toLowerCase())
    .replace(/\{niche\}/g, finalNiche)
    .replace(/\{action\}/g, action)
    .replace(/\{countryAdj\}/g, countryAdj)
    .replace(/\{suffix\}/g, suffix);
  
  return { title, description, suggestedNiche: finalNiche };
}

async function uploadToSupabaseStorage(file, inputElem, btnElem) {
  if (!supabaseClient) {
    alert("Database connection not ready!");
    return;
  }
  
  const originalBtnText = btnElem.innerHTML;
  btnElem.innerHTML = '<i data-lucide="loader" style="width: 18px; height: 18px; animation: spin 1s linear infinite;"></i> Uploading...';
  if(typeof lucide !== 'undefined') lucide.createIcons();
  
  try {
    const fileName = Date.now() + "_" + file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const { data, error } = await supabaseClient.storage.from('thumbnails').upload(fileName, file);
    
    if (error) {
      alert("Image upload failed: " + error.message);
    } else {
      const { data: publicUrlData } = supabaseClient.storage.from('thumbnails').getPublicUrl(fileName);
      inputElem.value = publicUrlData.publicUrl;
    }
  } catch (e) {
    alert("Image upload failed.");
  } finally {
    btnElem.innerHTML = originalBtnText;
    if(typeof lucide !== 'undefined') lucide.createIcons();
  }
}
document.addEventListener("DOMContentLoaded", () => {
  // Tabs Logic
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");
  
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));
      
      btn.classList.add("active");
      const targetId = btn.getAttribute("data-tab");
      document.getElementById(targetId).classList.add("active");
    });
  });

  renderAdminCategories();

  // Smart SEO Generator Button
  const generateSeoBtn = document.getElementById("generateSeoBtn");
  if (generateSeoBtn) {
    generateSeoBtn.addEventListener("click", () => {
      const country = document.getElementById("seoCountry").value;
      const quality = document.getElementById("seoQuality").value;
      const niche = document.getElementById("seoNiche").value;
      
      const result = generateSEO(country, quality, niche);
      
      // Fill Title field
      document.getElementById("vTitle").value = result.title;
      
      // Fill Description field
      document.getElementById("vDesc").value = result.description;
      
      // Flash green on title to show it was generated
      const titleField = document.getElementById("vTitle");
      titleField.style.borderColor = "#10b981";
      titleField.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.2)";
      const descField = document.getElementById("vDesc");
      descField.style.borderColor = "#10b981";
      descField.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.2)";
      setTimeout(() => {
        titleField.style.borderColor = "";
        titleField.style.boxShadow = "";
        descField.style.borderColor = "";
        descField.style.boxShadow = "";
      }, 2000);
      
      // Button animation
      generateSeoBtn.textContent = "✅ Generated!";
      setTimeout(() => {
        generateSeoBtn.innerHTML = '<i data-lucide="wand-2" style="width: 16px; height: 16px;"></i> Generate SEO Title & Description';
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }, 1500);
    });
  }
  
  const addCategoryForm = document.getElementById("addCategoryForm");
  const addVideoForm = document.getElementById("addVideoForm");
  
  // ImgBB triggers
  const triggerFileInput = document.getElementById("triggerFileInput");
  const vFileInput = document.getElementById("vFileInput");
  const vThumbUrl = document.getElementById("vThumbUrl");
  
  if (triggerFileInput && vFileInput) {
    triggerFileInput.addEventListener("click", () => vFileInput.click());
    vFileInput.addEventListener("change", (e) => {
      if (e.target.files[0]) uploadToSupabaseStorage(e.target.files[0], vThumbUrl, triggerFileInput);
    });
  }

  const triggerPremiumFileInput = document.getElementById("triggerPremiumFileInput");
  const pFileInput = document.getElementById("pFileInput");
  const pThumbUrl = document.getElementById("pThumbUrl");
  
  if (triggerPremiumFileInput && pFileInput) {
    triggerPremiumFileInput.addEventListener("click", () => pFileInput.click());
    pFileInput.addEventListener("change", (e) => {
      if (e.target.files[0]) uploadToSupabaseStorage(e.target.files[0], pThumbUrl, triggerPremiumFileInput);
    });
  }
  
  // Category Form Submit
  addCategoryForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newCatInput = document.getElementById("newCatInput");
    const val = newCatInput.value.trim();
    
    if(val) {
      const cats = getCategories();
      if(!cats.includes(val)) {
        cats.push(val);
        await saveCategories(cats);
        renderAdminCategories();
        showSuccess();
      }
      newCatInput.value = "";
    }
  });

  // Video Form Submit
  addVideoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const vTitle = document.getElementById("vTitle").value.trim();
    const checkedBoxes = document.querySelectorAll("#categoryCheckboxes input[type='checkbox']:checked");
    const vCategories = Array.from(checkedBoxes).map(cb => cb.value);
    
    if (vCategories.length === 0) {
      alert("Please select at least one category.");
      return;
    }
    
    const vCreator = document.getElementById("vCreator").value.trim();
    const vDuration = document.getElementById("vDuration").value.trim();
    const vViews = document.getElementById("vViews").value.trim();
    const finalThumbUrl = document.getElementById("vThumbUrl").value.trim();
    const vEmbed = document.getElementById("vEmbed").value.trim();
    const vDesc = document.getElementById("vDesc").value.trim();
    
    if(!finalThumbUrl) {
      alert("Please provide a thumbnail image URL or upload one.");
      return;
    }
    
    const newVideo = {
      id: editingVideoId ? editingVideoId : "vid-" + Date.now(),
      title: vTitle,
      creator: vCreator,
      categories: vCategories,
      duration: vDuration,
      views: vViews,
      thumbnail: finalThumbUrl,
      embedUrl: vEmbed,
      description: vDesc,
      created_at: editingVideoId ? undefined : new Date() // let supabase handle if existing
    };
    if (editingVideoId) delete newVideo.created_at;
    
    const submitBtn = addVideoForm.querySelector('button[type="submit"]');
    submitBtn.textContent = "Saving...";
    submitBtn.disabled = true;

    const success = await upsertVideo(newVideo);
    if (success) {
      showSuccess();
      addVideoForm.reset();
      editingVideoId = null;
      submitBtn.textContent = "Upload Video";
      renderAdminManageLists();
      document.querySelector('.tab-btn[data-tab="content-manager"]').click();
    }
    
    submitBtn.disabled = false;
  });

  // Auto-Extract Embed URL from pasted iframe code
  const vEmbedField = document.getElementById("vEmbed");
  if (vEmbedField) {
    vEmbedField.addEventListener("paste", (e) => {
      setTimeout(() => {
        let val = vEmbedField.value.trim();
        
        // Check if pasted content contains an iframe tag
        if (val.includes("<iframe") || val.includes("&lt;iframe")) {
          // Decode HTML entities if any
          val = val.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
          
          // Extract src attribute from iframe
          const srcMatch = val.match(/src\s*=\s*["']([^"']+)["']/i);
          if (srcMatch && srcMatch[1]) {
            vEmbedField.value = srcMatch[1];
            
            // Flash green border to show success
            vEmbedField.style.borderColor = "#10b981";
            vEmbedField.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.2)";
            setTimeout(() => {
              vEmbedField.style.borderColor = "";
              vEmbedField.style.boxShadow = "";
            }, 2000);
          }
        }
      }, 50); // Small delay to let paste complete
    });
  }
});

function renderAdminCategories() {
  const cats = getCategories();
  
  // Expose deleteCategory globally
  window.deleteCategory = async function(catName) {
    if (confirm(`Are you sure you want to delete the category "${catName}"?`)) {
      let currentCats = getCategories();
      currentCats = currentCats.filter(c => c !== catName);
      await saveCategories(currentCats);
      renderAdminCategories();
    }
  };

  // Render tags
  const list = document.getElementById("categoriesList");
  list.innerHTML = cats.map(cat => `<span class="category-tag" style="display:inline-flex;align-items:center;gap:4px;">${escapeHTML(cat)} <button onclick="deleteCategory('${cat.replace(/'/g, "\\'")}')" style="background:none;border:none;color:white;cursor:pointer;font-weight:bold;font-size:16px;padding:0 4px;margin-left:4px;" title="Delete category">&times;</button></span>`).join("");
  
  // Render select dropdown options
  const checkboxContainer = document.getElementById("categoryCheckboxes");
  if (checkboxContainer) {
    checkboxContainer.innerHTML = cats.map(cat => `
      <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; color: hsl(var(--text-primary)); font-size: 0.95rem; margin-bottom: 0;">
        <input type="checkbox" name="vCategory" value="${escapeHTML(cat)}" class="cat-checkbox" style="width: 16px; height: 16px;">
        ${escapeHTML(cat)}
      </label>
    `).join("");
    
    // Add logic to limit to 10 checkboxes
    const checkboxes = checkboxContainer.querySelectorAll(".cat-checkbox");
    checkboxes.forEach(cb => {
      cb.addEventListener("change", () => {
        const checkedCount = checkboxContainer.querySelectorAll(".cat-checkbox:checked").length;
        if (checkedCount >= 10) {
          checkboxes.forEach(box => {
            if (!box.checked) box.disabled = true;
          });
        } else {
          checkboxes.forEach(box => box.disabled = false);
        }
      });
    });
  }
  
  // Call shared nav render if present on this page
  if(typeof renderNavCategories === "function") {
    renderNavCategories();
  }
}

function showSuccess() {
  const msg = document.getElementById("successMsg");
  msg.style.display = "block";
  setTimeout(() => {
    msg.style.display = "none";
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  const addPremiumForm = document.getElementById("addPremiumForm");
  if (addPremiumForm) {
    addPremiumForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const newItem = {
        id: editingPremiumId ? editingPremiumId : "item_" + Date.now(),
        title: document.getElementById("pTitle").value.trim(),
        type: document.getElementById("pType").value,
        subtitle: document.getElementById("pSubtitle").value.trim(),
        thumbnail: document.getElementById("pThumbUrl").value.trim(),
        downloadUrl: document.getElementById("pDownloadUrl").value.trim(),
        description: document.getElementById("pDesc").value.trim(),
        created_at: editingPremiumId ? undefined : new Date()
      };
      if (editingPremiumId) delete newItem.created_at;
      
      const submitBtn = addPremiumForm.querySelector('button[type="submit"]');
      submitBtn.textContent = "Saving...";
      submitBtn.disabled = true;

      const success = await upsertItem(newItem);
      if (success) {
        addPremiumForm.reset();
        editingPremiumId = null;
        submitBtn.textContent = "Publish Premium Stuff";
        showSuccess();
        renderAdminManageLists();
        document.querySelector('.tab-btn[data-tab="content-manager"]').click();
      }
      
      submitBtn.disabled = false;
    });
  }
  
  const seoForm = document.getElementById("seoForm");
  const seoInput = document.getElementById("seoKeywordsInput");
  
  if (seoForm && seoInput) {
    // Load existing custom keywords
    const existingKeywords = getCustomSEOKeywords();
    if (existingKeywords) {
      seoInput.value = existingKeywords;
    }
    
    // Save on submit
    seoForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const val = seoInput.value.trim();
      await saveCustomSEOKeywords(val);
      showSuccess();
    });
  }
  
  renderAdminManageLists();
});

async function renderAdminManageLists() {
  const vList = document.getElementById("adminVideosList");
  const pList = document.getElementById("adminPremiumList");
  
  if (vList) {
    const videos = await getVideos();
    if (videos.length === 0) {
      vList.innerHTML = '<div style="color: hsl(var(--text-muted)); font-size: 0.9rem;">No videos uploaded yet.</div>';
    } else {
      vList.innerHTML = videos.map(v => `
        <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 8px;">
          <div style="display: flex; align-items: center; gap: 12px; overflow: hidden;">
            <img src="${escapeHTML(v.thumbnail)}" alt="thumb" style="width: 50px; height: 35px; object-fit: cover; border-radius: 4px;">
            <span style="font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(v.title)}</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <button onclick="editAdminVideo('${escapeHTML(v.id)}')" style="background: #3b82f6; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; flex-shrink: 0;">Edit</button>
            <button onclick="deleteAdminVideo('${escapeHTML(v.id)}')" style="background: #ef4444; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; flex-shrink: 0;">Delete</button>
          </div>
        </div>
      `).join("");
    }
  }
  
  if (pList) {
    const items = await getItems();
    if (items.length === 0) {
      pList.innerHTML = '<div style="color: hsl(var(--text-muted)); font-size: 0.9rem;">No premium items uploaded yet.</div>';
    } else {
      pList.innerHTML = items.map(p => `
        <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 8px;">
          <div style="display: flex; align-items: center; gap: 12px; overflow: hidden;">
            <img src="${escapeHTML(p.thumbnail)}" alt="thumb" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
            <span style="font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(p.title)}</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <button onclick="editAdminPremium('${escapeHTML(p.id)}')" style="background: #3b82f6; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; flex-shrink: 0;">Edit</button>
            <button onclick="deleteAdminPremium('${escapeHTML(p.id)}')" style="background: #ef4444; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; flex-shrink: 0;">Delete</button>
          </div>
        </div>
      `).join("");
    }
  }
}

window.deleteAdminVideo = async function(id) {
  if (confirm("Are you sure you want to delete this video?")) {
    let videos = await getVideos();
    videos = videos.filter(v => v.id !== id);
    if(supabaseClient) await supabaseClient.from('videos').delete().eq('id', id);
    else await saveVideos(videos);
    renderAdminManageLists();
  }
};

window.deleteAdminPremium = async function(id) {
  if (confirm("Are you sure you want to delete this premium item?")) {
    let items = await getItems();
    items = items.filter(i => i.id !== id);
    if(supabaseClient) await supabaseClient.from('premium_items').delete().eq('id', id);
    else await saveItems(items);
    renderAdminManageLists();
  }
};

window.editAdminVideo = async function(id) {
  const videos = await getVideos();
  const video = videos.find(v => v.id === id);
  if (!video) return;

  editingVideoId = id;
  document.getElementById("vTitle").value = video.title || '';
  document.getElementById("vCreator").value = video.creator || '';
  document.getElementById("vDuration").value = video.duration || '';
  document.getElementById("vViews").value = video.views || '';
  document.getElementById("vThumbUrl").value = video.thumbnail || '';
  document.getElementById("vEmbed").value = video.embedUrl || '';
  document.getElementById("vDesc").value = video.description || '';

  // Check categories
  const checkboxes = document.querySelectorAll("#categoryCheckboxes input[type='checkbox']");
  checkboxes.forEach(cb => {
    cb.checked = video.categories && video.categories.includes(cb.value);
  });

  const submitBtn = document.querySelector('#addVideoForm button[type="submit"]');
  submitBtn.textContent = "Update Video";

  document.querySelector('.tab-btn[data-tab="tab-video"]').click();
};

window.editAdminPremium = async function(id) {
  const items = await getItems();
  const item = items.find(i => i.id === id);
  if (!item) return;

  editingPremiumId = id;
  document.getElementById("pTitle").value = item.title || '';
  if (item.type) document.getElementById("pType").value = item.type;
  document.getElementById("pSubtitle").value = item.subtitle || '';
  document.getElementById("pThumbUrl").value = item.thumbnail || '';
  document.getElementById("pDownloadUrl").value = item.downloadUrl || '';
  document.getElementById("pDesc").value = item.description || '';

  const submitBtn = document.querySelector('#addPremiumForm button[type="submit"]');
  submitBtn.textContent = "Update Premium Item";

  document.querySelector('.tab-btn[data-tab="tab-premium"]').click();
};

// CSV Bulk Import Logic
document.addEventListener("DOMContentLoaded", () => {
  const triggerCsvUpload = document.getElementById("triggerCsvUpload");
  const csvFileInput = document.getElementById("csvFileInput");
  const csvStatus = document.getElementById("csvStatus");

  if (triggerCsvUpload && csvFileInput) {
    triggerCsvUpload.addEventListener("click", () => csvFileInput.click());

    csvFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async function(evt) {
        const text = evt.target.result;
        try {
          const videosToAdd = parseCSVToVideos(text);
          if (videosToAdd.length > 0) {
            const currentVideos = await getVideos();
            const newVideos = [...videosToAdd, ...currentVideos];
            await saveVideos(newVideos);
            renderAdminManageLists();
            
            csvStatus.innerHTML = `<span style="color: #10b981;"><i data-lucide="check-circle" style="width: 14px; height: 14px;"></i> Successfully imported ${videosToAdd.length} videos!</span>`;
            lucide.createIcons();
            csvFileInput.value = ""; // Reset
          } else {
            csvStatus.innerHTML = `<span style="color: #ef4444;">No valid rows found in CSV.</span>`;
          }
        } catch (err) {
          csvStatus.innerHTML = `<span style="color: #ef4444;">Error parsing CSV: ${err.message}</span>`;
        }
      };
      reader.readAsText(file);
    });
  }

  // Bulk Image Uploader Logic
  const triggerBulkImgUpload = document.getElementById("triggerBulkImgUpload");
  const bulkImgInput = document.getElementById("bulkImgInput");
  const bulkImgStatus = document.getElementById("bulkImgStatus");
  const bulkImgResult = document.getElementById("bulkImgResult");

  if (triggerBulkImgUpload && bulkImgInput) {
    triggerBulkImgUpload.addEventListener("click", () => bulkImgInput.click());

    bulkImgInput.addEventListener("change", async (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      const originalBtnText = triggerBulkImgUpload.innerHTML;
      triggerBulkImgUpload.innerHTML = '<i data-lucide="loader" style="width: 18px; height: 18px; animation: spin 1s linear infinite;"></i> Uploading...';
      triggerBulkImgUpload.disabled = true;
      lucide.createIcons();
      bulkImgResult.value = "";
      
      let successCount = 0;
      let urls = [];

      for (let i = 0; i < files.length; i++) {
        bulkImgStatus.innerText = `Uploading image ${i + 1} of ${files.length}...`;
        const formData = new FormData();
        formData.append("image", files[i]);
        
        try {
          const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: "POST",
            body: formData
          });
          const data = await res.json();
          if (data.success) {
            urls.push(data.data.url);
            successCount++;
          } else {
            urls.push(`Failed: ${files[i].name}`);
          }
        } catch (err) {
          urls.push(`Error: ${files[i].name}`);
        }
      }

      bulkImgStatus.innerHTML = `<span style="color: #10b981;">Uploaded ${successCount}/${files.length} images!</span>`;
      bulkImgResult.value = urls.join("\n");
      
      triggerBulkImgUpload.innerHTML = originalBtnText;
      triggerBulkImgUpload.disabled = false;
      lucide.createIcons();
      bulkImgInput.value = ""; // Reset
    });
  }

  // Ads Form Logic
  const adsForm = document.getElementById("adsForm");
  if (adsForm) {
    // Load existing codes
    const existingAds = JSON.parse(localStorage.getItem("freepremium_ad_codes")) || {};
    if(existingAds.popunder) document.getElementById("adPopunder").value = existingAds.popunder;
    if(existingAds.socialbar) document.getElementById("adSocialbar").value = existingAds.socialbar;
    if(existingAds["banner-top"]) document.getElementById("adBannerTop").value = existingAds["banner-top"];
    if(existingAds["banner-square"]) document.getElementById("adBannerSquare").value = existingAds["banner-square"];

    adsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const ads = {
        popunder: document.getElementById("adPopunder").value,
        socialbar: document.getElementById("adSocialbar").value,
        "banner-top": document.getElementById("adBannerTop").value,
        "banner-square": document.getElementById("adBannerSquare").value
      };
      localStorage.setItem("freepremium_ad_codes", JSON.stringify(ads));
      
      const successMsg = document.getElementById("successMsg");
      successMsg.innerText = "Ad Codes Saved Successfully!";
      successMsg.style.display = "block";
      setTimeout(() => successMsg.style.display = "none", 3000);
    });
  }
});

function parseCSVToVideos(csvText) {
  // Very basic CSV parser. Split by newline, then split by comma.
  // Assumes: Title, Categories, Creator, Duration, Views, Thumbnail, Embed, Description
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return []; // need header and at least one row

  const newVideos = [];
  
  // Skip header row (index 0)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Split by comma but respect quotes (basic regex for CSV)
    const matches = line.match(/(?:^|,)(?:"([^"]*)"|([^,]*))/g);
    if (!matches) continue;
    
    const row = matches.map(m => {
      let val = m.startsWith(",") ? m.substring(1) : m;
      val = val.trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1);
      }
      return val;
    });

    if (row.length < 2) continue; // Skip empty/malformed rows

    // Title, Categories, Creator, Duration, Views, Thumbnail, Embed, Description
    const title = row[0] || "Untitled";
    const categoriesRaw = row[1] || "All";
    const creator = row[2] || "Unknown Creator";
    const duration = row[3] || "0:00";
    const views = row[4] || "0 views";
    const thumbnail = row[5] || "assets/hero_spotlight.png";
    const embedUrl = row[6] || "";
    const description = row[7] || "";

    const categories = categoriesRaw.split("|").map(c => c.trim()).filter(c => c);

    newVideos.push({
      id: "vid-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      title,
      categories,
      duration,
      views,
      thumbnail,
      creator,
      embedUrl,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      description
    });
  }
  
  return newVideos;
}
