/**
 * Adsterra Hardcoded Ad Codes
 * 
 * Replace these placeholder strings with the actual script tags or direct links
 * provided by your Adsterra dashboard.
 */

const AD_CONFIG = {
  // 1. Popunder (Script Tag)
  popunderScript: `<script src="https://pl30448435.effectivecpmnetwork.com/c0/99/35/c099352fb0c635419a5e72484491cac9.js"></script>`,
  
  // 2. Social Bar (Script Tag)
  socialBarScript: `<script src="https://pl30448437.effectivecpmnetwork.com/f9/6b/46/f96b46e79f041ce3076b315113015169.js"></script>`,
  
  // 3. 728x90 Top Banner (Script Tag)
  bannerTop: `<script>
  atOptions = {
    'key' : 'ea7fc7a87012695922a4920ca9353921',
    'format' : 'iframe',
    'height' : 90,
    'width' : 728,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/ea7fc7a87012695922a4920ca9353921/invoke.js"></script>`,
  
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
  nativeBanner: `<script async="async" data-cfasync="false" src="https://pl30448436.effectivecpmnetwork.com/856af2dadd676850d875e9bf3398a62f/invoke.js"></script>
<div id="container-856af2dadd676850d875e9bf3398a62f"></div>`
};

// Global function to trigger a popunder ad on specific clicks
window.triggerPopunder = function() {
  // Deprecated: We are now injecting the popunder script globally
  // so Adsterra handles the popunder behavior automatically.
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
  // Inject Popunder
  if (AD_CONFIG.popunderScript && AD_CONFIG.popunderScript.trim() !== '') {
    const popContainer = document.createElement("div");
    popContainer.id = "adsterra-popunder-container";
    popContainer.style.display = "none";
    document.body.appendChild(popContainer);
    injectHTMLWithScripts(popContainer, AD_CONFIG.popunderScript);
  }

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
