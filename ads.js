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
  bannerSquare: `<div style="padding: 10px; background: #222; text-align: center; border: 1px dashed #444; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">[Adsterra 300x250 Square Banner Placeholder]</div>`,

  // 5. Native Banner (Script Tag)
  nativeBanner: `<div style="padding: 10px; background: #222; text-align: center; border: 1px dashed #444; width: 100%;">[Adsterra Native Banner Placeholder]</div>`
};

// Global function to trigger a popunder ad on specific clicks
window.triggerPopunder = function() {
  // If no link is provided, do nothing
  if (!AD_CONFIG.popunderLink || AD_CONFIG.popunderLink === "") return;
  
  // We use a simple window.open to simulate the popunder effect. 
  // True popunders require complex scripts (which you can also drop in the index.html head).
  // But for simple "Direct Links" from Adsterra, this works well.
  
  // Only trigger once per session to avoid annoying the user too much (optional)
  if (!sessionStorage.getItem("popunderTriggered")) {
    window.open(AD_CONFIG.popunderLink, '_blank');
    sessionStorage.setItem("popunderTriggered", "true");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  
  // Inject Social Bar
  if (AD_CONFIG.socialBarScript && AD_CONFIG.socialBarScript.trim() !== '') {
    const socialBarContainer = document.getElementById("adsterra-social-bar");
    if (socialBarContainer) {
      // For script tags to execute when injected via innerHTML, we must recreate the tag.
      // Easiest way is to just let the user replace the raw HTML string, but 
      // document.write scripts from Adsterra might fail this way. 
      // Instead, we create a script element if it's a src link.
      
      // Simple parse attempt:
      const match = AD_CONFIG.socialBarScript.match(/src=['"]([^'"]+)['"]/);
      if (match && match[1]) {
        const script = document.createElement('script');
        script.src = match[1];
        script.type = 'text/javascript';
        document.body.appendChild(script);
      } else {
        socialBarContainer.innerHTML = AD_CONFIG.socialBarScript;
      }
    }
  }

  // Inject Banner Ads into placeholders
  const adSpaces = document.querySelectorAll('.adsterra-banner');
  adSpaces.forEach(space => {
    const adId = space.getAttribute('data-ad-id');
    if (AD_CONFIG[adId] && AD_CONFIG[adId].trim() !== '') {
      
      const match = AD_CONFIG[adId].match(/src=['"]([^'"]+)['"]/);
      if (match && match[1]) {
        const script = document.createElement('script');
        script.src = match[1];
        script.type = 'text/javascript';
        space.appendChild(script);
      } else {
        space.innerHTML = AD_CONFIG[adId];
      }
    }
  });
});
