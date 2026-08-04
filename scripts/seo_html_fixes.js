const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'admin.html' && f !== 'interstitial.html');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Add robots index, follow if missing
  if (!content.includes('<meta name="robots"')) {
    content = content.replace('</title>', '</title>\n  <meta name="robots" content="index, follow">');
  }

  // Add defer to all custom scripts (except those that shouldn't be deferred, but for our app, defer is fine)
  // We'll replace <script src="app.js"></script> with <script src="app.js" defer></script>
  content = content.replace(/<script src="([^"]+\.js)"><\/script>/g, (match, src) => {
    // Exclude external scripts like adsterra if any, but regex above only matches exact local looking scripts
    // Actually we only want to defer our main scripts
    if (src.includes('app.js') || src.includes('storage.js') || src.includes('watch.js') || src.includes('category.js') || src.includes('search.js') || src.includes('premium')) {
      return `<script src="${src}" defer></script>`;
    }
    return match;
  });
  
  // Clean up any rogue canonicals that might be hardcoded to prevent duplicates
  content = content.replace(/<link rel="canonical" [^>]*>/g, '');

  fs.writeFileSync(file, content);
  console.log('Optimized HTML for SEO: ' + file);
});
