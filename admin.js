// FreePremium Admin Logic
let editingVideoId = null;
let editingPremiumId = null;

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
