const AD_CONFIG = {
  popunderLink: "",
  socialBarScript: atob("PHNjcmlwdCBzcmM9Imh0dHBzOi8vcGwzMDQ0ODQzNy5lZmZlY3RpdmVjcG1uZXR3b3JrLmNvbS9mOS82Yi80Ni9mOTZiNDZlNzlmMDQxY2UzMDc2YjMxNTExMzAxNTE2OS5qcyI+PC9zY3JpcHQ+"),
  bannerTop: atob("PHNjcmlwdD4KICBhdE9wdGlvbnMgPSB7CiAgICAna2V5JyA6ICdlYTdmYzdhODcwMTI2OTU5MjJhNDkyMGNhOTM1MzkyMScsCiAgICAnZm9ybWF0JyA6ICdpZnJhbWUnLAogICAgJ2hlaWdodCcgOiA5MCwKICAgICd3aWR0aCcgOiA3MjgsCiAgICAncGFyYW1zJyA6IHt9CiAgfTsKPC9zY3JpcHQ+CjxzY3JpcHQgc3JjPSJodHRwczovL3d3dy5oaWdocGVyZm9ybWFuY2Vmb3JtYXQuY29tL2VhN2ZjN2E4NzAxMjY5NTkyMmE0OTIwY2E5MzUzOTIxL2ludm9rZS5qcyI+PC9zY3JpcHQ+"),
  bannerSquare: atob("PHNjcmlwdD4KICBhdE9wdGlvbnMgPSB7CiAgICAna2V5JyA6ICcwNjJhNzY5Nzc2ZGNjYjNkZmM1ZmMwMjNjODAzMjVmOScsCiAgICAnZm9ybWF0JyA6ICdpZnJhbWUnLAogICAgJ2hlaWdodCcgOiAyNTAsCiAgICAnd2lkdGgnIDogMzAwLAogICAgJ3BhcmFtcycgOiB7fQogIH07Cjwvc2NyaXB0Pgo8c2NyaXB0IHNyYz0iaHR0cHM6Ly93d3cuaGlnaHBlcmZvcm1hbmNlZm9ybWF0LmNvbS8wNjJhNzY5Nzc2ZGNjYjNkZmM1ZmMwMjNjODAzMjVmOS9pbnZva2UuanMiPjwvc2NyaXB0Pg=="),
  nativeBanner: atob("PHNjcmlwdCBhc3luYz0iYXN5bmMiIGRhdGEtY2Zhc3luYz0iZmFsc2UiIHNyYz0iaHR0cHM6Ly9wbDMwNDQ4NDM2LmVmZmVjdGl2ZWNwbW5ldHdvcmsuY29tLzg1NmFmMmRhZGQ2NzY4NTBkODc1ZTliZjMzOThhNjJmL2ludm9rZS5qcyI+PC9zY3JpcHQ+CjxkaXYgaWQ9ImNvbnRhaW5lci04NTZhZjJkYWRkNjc2ODUwZDg3NWU5YmYzMzk4YTYyZiI+PC9kaXY+")
};

window.triggerPopunder = function() {
  if (!AD_CONFIG.popunderLink || AD_CONFIG.popunderLink === "") return;
  if (!sessionStorage.getItem("popunderTriggered")) {
    window.open(AD_CONFIG.popunderLink, '_blank');
    sessionStorage.setItem("popunderTriggered", "true");
  }
};

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

document.addEventListener("DOMContentLoaded", () => {
  if (AD_CONFIG.socialBarScript && AD_CONFIG.socialBarScript.trim() !== '') {
    const socialBarContainer = document.getElementById("adsterra-social-bar");
    if (socialBarContainer) injectHTMLWithScripts(socialBarContainer, AD_CONFIG.socialBarScript);
  }

  const adSpaces = document.querySelectorAll('.adsterra-banner');
  adSpaces.forEach(space => {
    const adId = space.getAttribute('data-ad-id');
    if (AD_CONFIG[adId] && AD_CONFIG[adId].trim() !== '') {
      injectHTMLWithScripts(space, AD_CONFIG[adId]);
    }
  });
});
