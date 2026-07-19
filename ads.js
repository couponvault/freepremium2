// Adsterra Ads Injection Script

document.addEventListener("DOMContentLoaded", () => {
  // We will pull the raw script tags from localStorage that the admin saved.
  // Note: For security, injecting raw script tags requires specific handling (like document.write or createElement).
  // For now, this is a placeholder system until Adsterra scripts are provided.
  
  const adsterraCodes = JSON.parse(localStorage.getItem('freepremium_ad_codes')) || {};

  // Inject Popunder
  if (adsterraCodes.popunder && adsterraCodes.popunder.trim() !== '') {
    // Usually popunders are just a script tag in the head or body
    try {
      const script = document.createElement('script');
      script.innerHTML = adsterraCodes.popunder; // Or src depending on what Adsterra gives
      document.body.appendChild(script);
    } catch(e) { console.error("Error injecting popunder", e); }
  }

  // Inject Social Bar
  if (adsterraCodes.socialbar && adsterraCodes.socialbar.trim() !== '') {
    try {
      const script = document.createElement('script');
      script.innerHTML = adsterraCodes.socialbar;
      document.body.appendChild(script);
    } catch(e) { console.error("Error injecting social bar", e); }
  }

  // Inject Banner Ads into placeholders
  const adSpaces = document.querySelectorAll('.adsterra-banner');
  adSpaces.forEach(space => {
    const adId = space.getAttribute('data-ad-id');
    if (adsterraCodes[adId] && adsterraCodes[adId].trim() !== '') {
      // Typically Adsterra provides a script tag for banners
      space.innerHTML = adsterraCodes[adId];
      // Note: If the string is a <script src="...">, innerHTML doesn't execute it. 
      // A more robust injector would parse the string and recreate the script tag.
    }
  });
});
