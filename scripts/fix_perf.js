const fs = require('fs');
const path = require('path');

function replaceInFiles(pattern, replacement, ext = '.html') {
  const files = fs.readdirSync('.').filter(f => f.endsWith(ext));
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const newContent = content.replace(pattern, replacement);
    if (content !== newContent) {
      fs.writeFileSync(file, newContent);
      console.log('Updated ' + file);
    }
  });
}

// Fix 1: Logo width and height
replaceInFiles(/<img src="\/assets\/logo\.jpg" alt="FreePremium Logo" style="height: 44px; border-radius: 8px; object-fit: contain;">/g, '<img src="/assets/logo.jpg" alt="FreePremium Logo" width="150" height="44" style="height: 44px; border-radius: 8px; object-fit: contain;">');

// Fix 2: iframe title in watch.html
let watchHtml = fs.readFileSync('watch.html', 'utf8');
watchHtml = watchHtml.replace('<iframe id="videoEmbed" allowfullscreen', '<iframe id="videoEmbed" title="Video Player" allowfullscreen');
fs.writeFileSync('watch.html', watchHtml);

// Fix 3: CLS on index.html homeCategoryList
let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace('id="homeCategoryList" class="cat-modal-list" style="', 'id="homeCategoryList" class="cat-modal-list" style="min-height: 40px; ');
fs.writeFileSync('index.html', indexHtml);

// Fix 4: width/height on thumbnails in JS files
function fixJSThumbnails() {
  const files = fs.readdirSync('.').filter(f => f.endsWith('.js'));
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/<img (class="video-thumb" )?src="\$\{escapeHTML\(video\.thumbnail\)\}" alt="\$\{escapeHTML\(video\.title\)\}" loading="lazy">/g, '<img $1src="${escapeHTML(video.thumbnail)}" alt="${escapeHTML(video.title)}" loading="lazy" width="320" height="180">');
    // Also catch search.js and premium-category.js which might use different classes
    content = content.replace(/<img src="\$\{escapeHTML\(item\.thumbnail\)\}" alt="Thumbnail" class="thumbnail" style="object-fit: cover;"( loading="lazy")?>/g, '<img src="${escapeHTML(item.thumbnail)}" alt="Thumbnail" class="thumbnail" style="object-fit: cover;" loading="lazy" width="320" height="180">');
    content = content.replace(/<img src="\$\{escapeHTML\(p\.thumbnail\)\}" alt="thumb" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">/g, '<img src="${escapeHTML(p.thumbnail)}" alt="thumb" width="50" height="50" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">');
    content = content.replace(/<img src="\$\{escapeHTML\(v\.thumbnail\)\}" alt="thumb" style="width: 50px; height: 35px; object-fit: cover; border-radius: 4px;">/g, '<img src="${escapeHTML(v.thumbnail)}" alt="thumb" width="50" height="35" style="width: 50px; height: 35px; object-fit: cover; border-radius: 4px;">');
    // Related thumb in watch.js
    content = content.replace(/<img src="\$\{escapeHTML\(v\.thumbnail\)\}" alt="\$\{escapeHTML\(v\.title\)\}" class="related-thumb" loading="lazy">/g, '<img src="${escapeHTML(v.thumbnail)}" alt="${escapeHTML(v.title)}" class="related-thumb" loading="lazy" width="120" height="67">');
    
    fs.writeFileSync(file, content);
  });
}
fixJSThumbnails();
console.log('JS files updated');
