const fs = require('fs');

let watchJs = fs.readFileSync('watch.js', 'utf8');

// Inject JSON-LD function into watch.js
if (!watchJs.includes('injectVideoSchema')) {
  const schemaFunc = `
// Inject JSON-LD VideoObject Schema
function injectVideoSchema(video) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.title,
    "description": video.description || "Watch high-quality premium videos and streams for free.",
    "thumbnailUrl": [video.thumbnail],
    "uploadDate": new Date().toISOString(),
    "contentUrl": window.location.href,
    "embedUrl": window.location.href
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://freepremium.online/"
    },{
      "@type": "ListItem",
      "position": 2,
      "name": video.category || "Video",
      "item": "https://freepremium.online/category.html?cat=" + encodeURIComponent(video.category || "trending")
    },{
      "@type": "ListItem",
      "position": 3,
      "name": video.title
    }]
  };
  const scriptBread = document.createElement('script');
  scriptBread.type = 'application/ld+json';
  scriptBread.text = JSON.stringify(breadcrumb);
  document.head.appendChild(scriptBread);
}
`;
  watchJs += schemaFunc;
  
  // Call it after populateVideoDetails
  watchJs = watchJs.replace('populateVideoDetails(video);', 'populateVideoDetails(video);\n  injectVideoSchema(video);');
  
  // Fix ogImage domain if it exists
  watchJs = watchJs.replace('https://freepremium.com/assets/hero_spotlight.png', 'https://freepremium.online/assets/hero_spotlight.png');
  
  fs.writeFileSync('watch.js', watchJs);
  console.log('watch.js optimized with JSON-LD');
}

// Similarly for category.js
let catJs = fs.readFileSync('category.js', 'utf8');
if (!catJs.includes('document.title =')) {
  // We need to set title and meta desc dynamically
  const seoInjection = `
    // Dynamic SEO
    const niceName = catName.charAt(0).toUpperCase() + catName.slice(1);
    document.title = niceName + " Videos - FreePremium";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = "Watch the best free " + niceName + " videos online in high quality.";
`;
  catJs = catJs.replace('document.getElementById("categoryTitle").textContent =', seoInjection + '\n    document.getElementById("categoryTitle").textContent =');
  fs.writeFileSync('category.js', catJs);
  console.log('category.js optimized with dynamic meta');
}

// Similarly for search.js
let searchJs = fs.readFileSync('search.js', 'utf8');
if (!searchJs.includes('document.title =')) {
  const seoInjection = `
    // Dynamic SEO
    document.title = "Search Results for '" + searchQuery + "' - FreePremium";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = "Watch the best free videos online in high quality for '" + searchQuery + "'.";
`;
  searchJs = searchJs.replace('document.getElementById("searchQueryTitle").textContent =', seoInjection + '\n    document.getElementById("searchQueryTitle").textContent =');
  fs.writeFileSync('search.js', searchJs);
  console.log('search.js optimized with dynamic meta');
}
