document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openBasket");
  const closeBtn = document.getElementById("closeBasket");
  const overlay = document.getElementById("basketOverlay");
  const drawer = document.getElementById("basketDrawer");

  if (!openBtn || !closeBtn || !overlay || !drawer) return;

  function openDrawer() {
    drawer.classList.add("open");
    overlay.classList.add("show");
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    overlay.classList.remove("show");
  }

  openBtn.addEventListener("click", openDrawer);
  closeBtn.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);
});
