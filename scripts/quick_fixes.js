const fs = require('fs');

// 1. Fix "Free Premium" in index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace('<title>FreePremium - Watch Free Premium Porn Videos', '<title>Free Premium Adult Videos & HD Tube - FreePremium');
indexHtml = indexHtml.replace('<h1 style="font-size: 1.5rem; color: hsl(var(--text-primary)); margin-bottom: 20px;">Premium Adult Videos & Free HD Porn - FreePremium</h1>', '<h2 style="font-size: 1.5rem; color: hsl(var(--text-primary)); margin-bottom: 20px;">Free Premium Adult Videos & HD Porn Tube</h2>');
indexHtml = indexHtml.replace('Welcome to <strong>FreePremium</strong>, your', 'Welcome to <strong>Free Premium</strong> (FreePremium), your');
fs.writeFileSync('index.html', indexHtml);
console.log('Updated index.html keywords');

// 2. Fix views in storage.js
let storageJs = fs.readFileSync('storage.js', 'utf8');
const originalGetVideos = `async function getVideos() {
  if (!supabaseClient) return DEFAULT_VIDEOS;
  const { data, error } = await supabaseClient.from('videos').select('*').order('created_at', { ascending: false });
  if (error || !data || data.length === 0) return DEFAULT_VIDEOS;
  return data;
}`;

const newGetVideos = `async function getVideos() {
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
}`;

if (storageJs.includes(originalGetVideos)) {
  storageJs = storageJs.replace(originalGetVideos, newGetVideos);
  fs.writeFileSync('storage.js', storageJs);
  console.log('Updated storage.js views generator');
} else {
  console.log('Could not find original getVideos in storage.js');
}

// 3. Update category.js title injection for Free Premium keyword
let catJs = fs.readFileSync('category.js', 'utf8');
catJs = catJs.replace('document.getElementById("catSeoH2").textContent = "Best " + niceName + " Videos & Free HD Porn";', 'document.getElementById("catSeoH2").textContent = "Best " + niceName + " Videos & Free Premium HD Porn";');
fs.writeFileSync('category.js', catJs);
console.log('Updated category.js keywords');

