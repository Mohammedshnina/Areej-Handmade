const STORAGE_KEY = "areejBasket";

function loadBasket() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveBasket(basket) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(basket));
}

function refreshAllBasketUI() {
  updateNavCount();
  renderDrawer();
  renderBasketPage();
  renderCheckoutPage();
}

function updateNavCount() {
  const el = document.getElementById("basketCountNav");
  if (!el) return;
  const basket = loadBasket();
  el.textContent = basket.length;
}

/* ---------- Drawer (side panel) ---------- */

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
      nameSpan.textContent = item.name || "Item";

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.textContent = "Remove";
      removeBtn.className = "basket-remove";
      removeBtn.addEventListener("click", () => {
        const b = loadBasket();
        b.splice(index, 1);
        saveBasket(b);
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

  if (!drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add("open");
    overlay.classList.add("show");
    renderDrawer();
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    overlay.classList.remove("show");
  }

  if (openBtn) openBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);
}

/* ---------- Basket page (basket.html) ---------- */

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
      nameSpan.textContent = item.name || "Item";

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.textContent = "Remove";
      removeBtn.className = "basket-remove";
      removeBtn.addEventListener("click", () => {
        const b = loadBasket();
        b.splice(index, 1);
        saveBasket(b);
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

/* ---------- Checkout page (checkout.html) ---------- */

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
      nameSpan.textContent = item.name || "Item";

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
    // could use the values later if you want
    window.location.href = "order-success.html";
  });
}

/* ---------- Add to basket buttons (on any page) ---------- */

function setupAddButtons() {
  const buttons = document.querySelectorAll(".add-to-basket");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-name") || "Item";
      const basket = loadBasket();
      basket.push({ name });
      saveBasket(basket);
      refreshAllBasketUI();
    });
  });
}

/* ---------- INIT ---------- */

document.addEventListener("DOMContentLoaded", () => {
  setupDrawerTriggers();
  setupAddButtons();
  setupCheckoutForm();
  refreshAllBasketUI();
});
