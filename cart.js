// --- Storage key for localStorage ---
const STORAGE_KEY = "areejBasket";

/* ========== Helpers: load/save basket ========== */

function loadBasket() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveBasket(basket) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(basket));
}

/* ========== Global UI refresh ========== */

function refreshAllBasketUI() {
  updateNavCount();
  renderDrawer();
  renderBasketPage();
  renderCheckoutPage();
}

/* ========== Nav basket count ========== */

function updateNavCount() {
  const el = document.getElementById("basketCountNav");
  if (!el) return;
  const basket = loadBasket();
  el.textContent = basket.length;
}

/* ========== Basket drawer (side panel) ========== */

function renderDrawer() {
  const itemsEl = document.getElementById("drawerItems");
  const emptyEl = document.getElementById("drawerEmpty");
  const countEl = document.getElementById("drawerCount");

  if (!itemsEl || !emptyEl || !countEl) return;

  const basket = loadBasket();
  itemsEl.innerHTML = "";

  if (basket.length === 0) {
    emptyEl.style.display = "block";
  } else {
    emptyEl.style.display = "none";
    basket.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "drawer-item-row";

      const nameSpan = document.createElement("span");
      let label = item.name || "Item";
      if (item.color) label += ` (${item.color})`;
      nameSpan.textContent = label;

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.textContent = "Remove";
      removeBtn.className = "basket-remove";
      removeBtn.addEventListener("click", () => {
        const current = loadBasket();
        current.splice(index, 1);
        saveBasket(current);
        refreshAllBasketUI();
      });

      li.appendChild(nameSpan);
      li.appendChild(removeBtn);
      itemsEl.appendChild(li);
    });
  }

  countEl.textContent = basket.length;
}

function setupDrawerTriggers() {
  const openBtn = document.getElementById("openBasket");
  const closeBtn = document.getElementById("closeBasket");
  const overlay = document.getElementById("basketOverlay");
  const drawer = document.getElementById("basketDrawer");

  if (!drawer || !overlay || !openBtn || !closeBtn) return;

  function openDrawer() {
    drawer.classList.add("open");
    overlay.classList.add("show");
    renderDrawer();
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    overlay.classList.remove("show");
  }

  openBtn.addEventListener("click", openDrawer);
  closeBtn.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);
}

/* ========== Toast (bottom‑right message) ========== */

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// On items.html#added → show toast once
function checkAddedHashToast() {
  if (window.location.hash === "#added") {
    showToast("Item added to basket");
    history.replaceState(null, "", window.location.pathname);
  }
}

/* ========== Popup for colours + description ========== */

function setupAddButtons() {
  const buttons = document.querySelectorAll(".add-to-basket");

  // popup elements (only exist on pages where you added them)
  const overlay = document.getElementById("popupOverlay");
  const popup = document.getElementById("popup");
  const popupColor = document.getElementById("popupColor");
  const popupDesc = document.getElementById("popupDesc");
  const popupCancel = document.getElementById("popupCancel");
  const popupAdd = document.getElementById("popupAdd");

  const popupAvailable =
    overlay && popup && popupColor && popupDesc && popupCancel && popupAdd;

  let pendingItem = null;

  function openPopup(name) {
    if (!popupAvailable) {
      // Fallback: no popup on this page, just add quickly
      const basket = loadBasket();
      basket.push({ name });
      saveBasket(basket);
      refreshAllBasketUI();
      showToast("Item added to basket");
      return;
    }

    pendingItem = name;
    popupColor.value = "";
    popupDesc.value = "";

    overlay.classList.add("show");
    popup.classList.add("show");
  }

  function closePopup() {
    if (!popupAvailable) return;
    overlay.classList.remove("show");
    popup.classList.remove("show");
    pendingItem = null;
  }

  if (popupAvailable) {
    popupCancel.addEventListener("click", closePopup);
    overlay.addEventListener("click", closePopup);

    popupAdd.addEventListener("click", () => {
      if (!pendingItem) return;

      const basket = loadBasket();
      basket.push({
        name: pendingItem,
        color: popupColor.value.trim(),
        description: popupDesc.value.trim(),
      });

      saveBasket(basket);
      refreshAllBasketUI();
      closePopup();

      // Redirect to items page with flag for toast
      window.location.href = "items.html#added";
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-name") || "Item";
      openPopup(name);
    });
  });
}

/* ========== Basket page (basket.html) ========== */

function renderBasketPage() {
  const itemsEl = document.getElementById("basketPageItems");
  const emptyEl = document.getElementById("basketPageEmpty");
  const countEl = document.getElementById("basketPageCount");
  const clearBtn = document.getElementById("clearBasketBtn");

  if (!itemsEl || !emptyEl || !countEl) return;

  const basket = loadBasket();
  itemsEl.innerHTML = "";

  if (basket.length === 0) {
    emptyEl.style.display = "block";
  } else {
    emptyEl.style.display = "none";
    basket.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "basket-item-row";

      const nameSpan = document.createElement("span");
      let label = item.name || "Item";
      if (item.color) label += ` (${item.color})`;
      nameSpan.textContent = label;

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.textContent = "Remove";
      removeBtn.className = "basket-remove";
      removeBtn.addEventListener("click", () => {
        const current = loadBasket();
        current.splice(index, 1);
        saveBasket(current);
        refreshAllBasketUI();
      });

      li.appendChild(nameSpan);
      li.appendChild(removeBtn);
      itemsEl.appendChild(li);
    });
  }

  countEl.textContent = basket.length;

  if (clearBtn) {
    clearBtn.onclick = () => {
      saveBasket([]);
      refreshAllBasketUI();
    };
  }
}

/* ========== Checkout page (checkout.html) ========== */

function renderCheckoutPage() {
  const itemsEl = document.getElementById("checkoutItems");
  const emptyEl = document.getElementById("checkoutEmpty");
  const countEl = document.getElementById("checkoutCount");

  if (!itemsEl || !emptyEl || !countEl) return;

  const basket = loadBasket();
  itemsEl.innerHTML = "";

  if (basket.length === 0) {
    emptyEl.style.display = "block";
  } else {
    emptyEl.style.display = "none";
    basket.forEach((item) => {
      const li = document.createElement("li");
      li.className = "basket-item-row";

      const nameSpan = document.createElement("span");
      let label = item.name || "Item";
      if (item.color) label += ` (${item.color})`;
      nameSpan.textContent = label;

      li.appendChild(nameSpan);
      itemsEl.appendChild(li);
    });
  }

  countEl.textContent = basket.length;
}

function setupCheckoutForm() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    window.location.href = "order-success.html";
  });
}

/* ========== Init ========== */

document.addEventListener("DOMContentLoaded", () => {
  setupDrawerTriggers();
  setupAddButtons();
  setupCheckoutForm();
  refreshAllBasketUI();
  checkAddedHashToast();
});
