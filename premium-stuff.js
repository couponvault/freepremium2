// FreePremium - Premium Stuff JS

document.addEventListener("DOMContentLoaded", () => {
  // Initialize icons
  lucide.createIcons();

  // Mobile menu
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const menuIcon = document.getElementById("menuIcon");
  let isMenuOpen = false;

  menuToggle.addEventListener("click", () => {
    isMenuOpen = !isMenuOpen;
    navMenu.classList.toggle("active");
    if (isMenuOpen) {
      menuIcon.setAttribute("data-lucide", "x");
    } else {
      menuIcon.setAttribute("data-lucide", "menu");
    }
    lucide.createIcons();
  });
});
