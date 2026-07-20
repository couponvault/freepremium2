/**
 * Adsterra Hardcoded Ad Codes
 * 
 * Replace these placeholder strings with the actual script tags or direct links
 * provided by your Adsterra dashboard.
 */

const AD_CONFIG = {
  // 1. Popunder (Direct Link or Script Tag)
  // Usually this is a direct link you open in a new tab when someone clicks.
  // Paste your direct link URL here:
  popunderLink: "https://www.example.com/adsterra-popunder-link",
  
  // 2. Social Bar (Script Tag)
  // Paste the entire <script src="..."> tag here:
  socialBarScript: `<script type='text/javascript' src='//plexample.com/socialbar.js'></script>`,
  
  // 3. 728x90 Top Banner (Script Tag)
  bannerTop: `<div style="padding: 10px; background: #222; text-align: center; border: 1px dashed #444; width: 100%;">[Adsterra 728x90 Top Banner Placeholder]</div>`,
  
  // 4. 300x250 Square Banner (Script Tag)
  bannerSquare: `<script>
  atOptions = {
    'key' : '062a769776dccb3dfc5fc023c80325f9',
    'format' : 'iframe',
    'height' : 250,
    'width' : 300,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/062a769776dccb3dfc5fc023c80325f9/invoke.js"></script>`,

  // 5. Native Banner (Script Tag)
  nativeBanner: `<div style="padding: 10px; background: #222; text-align: center; border: 1px dashed #444; width: 100%;">[Adsterra Native Banner Placeholder]</div>`
};

// Global function to trigger a popunder ad on specific clicks
window.triggerPopunder = function() {
  if (!AD_CONFIG.popunderLink || AD_CONFIG.popunderLink === "") return;
  if (!sessionStorage.getItem("popunderTriggered")) {
    window.open(AD_CONFIG.popunderLink, '_blank');
    sessionStorage.setItem("popunderTriggered", "true");
  }
};

// Helper function to robustly inject Adsterra script tags (which often contain multiple <script> elements)
function injectHTMLWithScripts(container, htmlString) {
  // 1. Set the HTML
  container.innerHTML = htmlString;
  
  // 2. Find all injected scripts and re-evaluate them so the browser executes them
  const scripts = container.querySelectorAll('script');
  scripts.forEach(oldScript => {
    const newScript = document.createElement('script');
    Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    
    // Replace the old script with the newly created one to force execution
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Inject Social Bar
  if (AD_CONFIG.socialBarScript && AD_CONFIG.socialBarScript.trim() !== '') {
    const socialBarContainer = document.getElementById("adsterra-social-bar");
    if (socialBarContainer) injectHTMLWithScripts(socialBarContainer, AD_CONFIG.socialBarScript);
  }

  // Inject Banner Ads into placeholders
  const adSpaces = document.querySelectorAll('.adsterra-banner');
  adSpaces.forEach(space => {
    const adId = space.getAttribute('data-ad-id');
    if (AD_CONFIG[adId] && AD_CONFIG[adId].trim() !== '') {
      injectHTMLWithScripts(space, AD_CONFIG[adId]);
    }
  });
});
