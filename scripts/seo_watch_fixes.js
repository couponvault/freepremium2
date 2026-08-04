const fs = require('fs');

let watchJs = fs.readFileSync('watch.js', 'utf8');

// Enhance Fallback Description
if (!watchJs.includes('seoFallbackDesc')) {
  const seoFallbackDescStr = `
  const firstCat = (vidCats.length > 0) ? vidCats[0] : "Premium";
  const seoFallbackDesc = "Watch " + video.title + " free HD adult video. Explore the best " + firstCat + " content exclusively on FreePremium. Our collection features high-quality streaming, verified models, and daily updates. No credit cards, just instant access to premium adult entertainment.";
  document.getElementById("videoDescription").textContent = video.description || seoFallbackDesc;
  `;
  
  // Replace the old description setter
  watchJs = watchJs.replace('document.getElementById("videoDescription").textContent = video.description || "No description provided for this premium stream.";', seoFallbackDescStr);
  
  // Enhance Image Alt Text in related videos
  watchJs = watchJs.replace(/alt="\$\{escapeHTML\(v\.title\)\}"/g, 'alt="${escapeHTML(v.title)} free adult video thumbnail"');
  
  // Fix CTR titles
  watchJs = watchJs.replace('document.title = `Watch ${video.title} - FreePremium`;', 'document.title = `Watch ${video.title} - Free HD Porn | FreePremium`;');
  watchJs = watchJs.replace('document.title = `FreePremium - Watch ${video.title}`;', 'document.title = `Watch ${video.title} - Free HD Porn | FreePremium`;');
  
  fs.writeFileSync('watch.js', watchJs);
  console.log('watch.js optimized for UX and SEO');
}
