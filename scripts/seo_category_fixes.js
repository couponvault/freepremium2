const fs = require('fs');

// 1. Update category.html
let html = fs.readFileSync('category.html', 'utf8');

if (!html.includes('catSeoContent')) {
  // Inject SEO section right before the Global Footer Ad / </main>
  const seoSection = `
      <!-- Dynamic Category SEO & FAQ -->
      <section class="category-seo-section" style="padding: 40px 20px; background: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.05); margin-top: 40px;">
        <div style="max-width: 1000px; margin: 0 auto;">
          <h2 id="catSeoH2" style="font-size: 1.3rem; color: hsl(var(--text-primary)); margin-bottom: 20px;">Watch Free Adult Videos</h2>
          <div id="catSeoText" style="color: hsl(var(--text-secondary)); font-size: 0.9rem; line-height: 1.6; margin-bottom: 30px;">
            <!-- Injected via JS -->
          </div>
          
          <h3 style="font-size: 1.1rem; color: hsl(var(--text-primary)); margin-bottom: 15px;">Frequently Asked Questions</h3>
          <div id="catFaqContainer" style="display: flex; flex-direction: column; gap: 10px;">
            <!-- Injected via JS -->
          </div>
        </div>
      </section>
  `;
  
  html = html.replace('<!-- Global Footer Ad -->', seoSection + '\n      <!-- Global Footer Ad -->');
  fs.writeFileSync('category.html', html);
  console.log('Updated category.html with SEO container.');
}

// 2. Update category.js
let js = fs.readFileSync('category.js', 'utf8');

if (!js.includes('injectCategorySEO')) {
  const seoFunc = `
function injectCategorySEO(catName) {
  const niceName = catName.charAt(0).toUpperCase() + catName.slice(1);
  
  // 1. Dynamic Intro Text
  document.getElementById("catSeoH2").textContent = "Best " + niceName + " Videos & Free HD Porn";
  document.getElementById("catSeoText").innerHTML = \`<p style="margin-bottom: 15px;">Looking for the best free <strong>\${niceName} videos</strong>? You've come to the right place. FreePremium offers an exclusive collection of high-definition adult videos spanning across the \${niceName} category. Our catalog is updated daily with top-rated studio releases and verified amateur uploads.</p>
  <p>Unlike other tube sites, we provide a seamless, ad-light experience. Enjoy blazing fast streaming of \${niceName} content in full HD without paying a dime. Explore our extensive grid above and find exactly what satisfies your cravings.</p>\`;

  // 2. Dynamic FAQs
  const faqs = [
    { q: "Are these " + niceName + " videos free to watch?", a: "Yes, 100%. FreePremium is completely free. You can stream our entire collection of " + niceName + " videos in HD without any credit card or subscription." },
    { q: "How often do you add new " + niceName + " content?", a: "We update our " + niceName + " category daily. Our automated systems fetch the best, most popular new releases so you always have fresh content to enjoy." },
    { q: "Can I watch these videos on my mobile phone?", a: "Absolutely. Our platform is fully responsive and optimized for mobile devices, ensuring a perfect viewing experience for " + niceName + " videos on any screen size." }
  ];

  const faqContainer = document.getElementById("catFaqContainer");
  faqContainer.innerHTML = '';
  
  faqs.forEach((faq, index) => {
    const qDiv = document.createElement('div');
    qDiv.style.background = 'rgba(255,255,255,0.03)';
    qDiv.style.border = '1px solid rgba(255,255,255,0.05)';
    qDiv.style.borderRadius = '8px';
    qDiv.style.padding = '15px';
    
    qDiv.innerHTML = \`<h4 style="color: hsl(var(--text-primary)); font-size: 0.95rem; margin-bottom: 8px;">\${faq.q}</h4>
    <p style="color: hsl(var(--text-secondary)); font-size: 0.85rem; line-height: 1.5;">\${faq.a}</p>\`;
    
    faqContainer.appendChild(qDiv);
  });
}
`;
  
  js += seoFunc;
  
  // Call the function inside the DOMContentLoaded block where cat is determined
  js = js.replace('document.getElementById("catHeroTitle").textContent = cat.title;', 'document.getElementById("catHeroTitle").textContent = cat.title;\n  injectCategorySEO(cat.title);');
  
  // Also optimize the Title/Meta CTR
  js = js.replace('document.title = `${cat.title} Category - FreePremium`;', 'document.title = `Watch ${cat.title} Videos - Free HD Porn | FreePremium`;');
  js = js.replace('document.title = niceName + " Videos - FreePremium";', 'document.title = `Watch ${niceName} Videos - Free HD Porn | FreePremium`;');
  
  fs.writeFileSync('category.js', js);
  console.log('Updated category.js with SEO injection.');
}
