function dec(arr) { return arr.join(''); }

const AD_CONFIG = {
  popunderScript: dec(['<script src="https://pl30448435.', 'effectivecpmnetwork', '.com/c0/99/35/c099352fb0c635419a5e72484491cac9.js"></script>']),
  socialBarScript: dec(['<script src="https://pl30448437.', 'effectivecpmnetwork', '.com/f9/6b/46/f96b46e79f041ce3076b315113015169.js"></script>']),
  
  bannerTop: dec([
    '<script>',
    '  atOptions = {',
    "    'key' : 'ea7fc7a87012695922a4920ca9353921',",
    "    'format' : 'iframe',",
    "    'height' : 90,",
    "    'width' : 728,",
    "    'params' : {}",
    '  };',
    '</script>',
    '<script src="https://www.', 'highperformanceformat', '.com/ea7fc7a87012695922a4920ca9353921/invoke.js"></script>'
  ]),
  
  bannerSquare: dec([
    '<script>',
    '  atOptions = {',
    "    'key' : '062a769776dccb3dfc5fc023c80325f9',",
    "    'format' : 'iframe',",
    "    'height' : 250,",
    "    'width' : 300,",
    "    'params' : {}",
    '  };',
    '</script>',
    '<script src="https://www.', 'highperformanceformat', '.com/062a769776dccb3dfc5fc023c80325f9/invoke.js"></script>'
  ]),
  
  nativeBanner: dec([
    '<script async="async" data-cfasync="false" src="https://pl30448436.', 'effectivecpmnetwork', '.com/856af2dadd676850d875e9bf3398a62f/invoke.js"></script>',
    '<div id="container-856af2dadd676850d875e9bf3398a62f"></div>'
  ])
};

window.triggerPopunder = function() {};

function injectHTMLWithScripts(container, htmlString) {
  container.innerHTML = htmlString;
  const scripts = container.querySelectorAll('script');
  scripts.forEach(oldScript => {
    const newScript = document.createElement('script');
    Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}

function injectAdIframe(container, htmlString, width, height) {
  const iframe = document.createElement('iframe');
  iframe.style.width = width ? width : '100%';
  iframe.style.height = height ? height : '100%';
  iframe.style.border = 'none';
  iframe.style.overflow = 'hidden';
  iframe.scrolling = 'no';
  iframe.srcdoc = `<!DOCTYPE html><html><head><style>body{margin:0;padding:0;display:flex;justify-content:center;align-items:center;}</style></head><body>${htmlString}</body></html>`;
  container.innerHTML = '';
  container.appendChild(iframe);
}

document.addEventListener("DOMContentLoaded", () => {
  if (AD_CONFIG.popunderScript && AD_CONFIG.popunderScript.trim() !== '') {
    const popContainer = document.createElement("div");
    popContainer.id = "adsterra-popunder-container";
    popContainer.style.display = "none";
    document.body.appendChild(popContainer);
    injectHTMLWithScripts(popContainer, AD_CONFIG.popunderScript);
  }

  if (AD_CONFIG.socialBarScript && AD_CONFIG.socialBarScript.trim() !== '') {
    const socialBarContainer = document.getElementById("adsterra-social-bar");
    if (socialBarContainer) injectHTMLWithScripts(socialBarContainer, AD_CONFIG.socialBarScript);
  }

  const adSpaces = document.querySelectorAll('.adsterra-banner');
  adSpaces.forEach(space => {
    const adId = space.getAttribute('data-ad-id');
    if (AD_CONFIG[adId] && AD_CONFIG[adId].trim() !== '') {
      let width = '100%';
      let height = '100%';
      if (adId === 'bannerTop') { width = '728px'; height = '90px'; }
      if (adId === 'bannerSquare') { width = '300px'; height = '250px'; }
      injectAdIframe(space, AD_CONFIG[adId], width, height);
    }
  });
});
