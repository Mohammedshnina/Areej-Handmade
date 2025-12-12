// Simple cart using localStorage
const CART_KEY = "areejHandmadeCart";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(item) {
  const cart = loadCart();
  cart.push(item);
  saveCart(cart);
  showToast("Added to basket");
  renderDrawer();
}

function clearCart() {
  saveCart([]);
  renderDrawer();
}

function getCartTotals() {
  const cart = loadCart();
  let subtotal = 0;
  cart.forEach((item) => {
    subtotal += item.price || 0;
  });
  return { subtotal, count: cart.length };
}

// Drawer functions
function openBasketDrawer() {
  document.getElementById("basket-overlay")?.classList.add("open");
  document.getElementById("basket-drawer")?.classList.add("open");
  renderDrawer();
}

function closeBasketDrawer() {
  document.getElementById("basket-overlay")?.classList.remove("open");
  document.getElementById("basket-drawer")?.classList.remove("open");
}

function renderDrawer() {
  const list = document.getElementById("drawer-items");
  const summary = document.getElementById("drawer-summary");
  if (!list || !summary) return;

  const cart = loadCart();
  list.innerHTML = "";

  if (cart.length === 0) {
    list.innerHTML = "<li>Your basket is empty.</li>";
    summary.innerHTML = "";
    return;
  }

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} – £${item.price.toFixed(2)}`;
    list.appendChild(li);
  });

  const { subtotal, count } = getCartTotals();
  summary.innerHTML = `
    <p>Items: ${count}</p>
    <p><strong>Subtotal: £${subtotal.toFixed(2)}</strong></p>
  `;
}

// Toast
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

// Page helpers
function goToBasketPage() {
  window.location.href = "basket.html";
}

function goToCheckoutPage() {
  window.location.href = "checkout.html";
}

// If a page uses product buttons with data attributes
function addFromButton(btn) {
  const name = btn.getAttribute("data-name");
  const price = parseFloat(btn.getAttribute("data-price")) || 0;
  const id = btn.getAttribute("data-id");
  addToCart({ id, name, price });
}

// BASKET PAGE RENDER
function renderBasketPage() {
  const linesContainer = document.getElementById("basket-lines");
  const totalsContainer = document.getElementById("basket-totals");
  if (!linesContainer || !totalsContainer) return;

  const cart = loadCart();
  linesContainer.innerHTML = "";

  if (cart.length === 0) {
    linesContainer.innerHTML = `
      <div class="basket-empty-state">
        Your basket is empty. Browse our items to add something special.
      </div>
    `;
    totalsContainer.innerHTML = "";
    return;
  }

  cart.forEach((item, index) => {
    const line = document.createElement("div");
    line.className = "basket-line";
    line.innerHTML = `
      <div>
        <div class="basket-line-name">${item.name}</div>
        <div class="basket-line-meta">ID: ${item.id || "n/a"}</div>
      </div>
      <div class="basket-line-meta">£${item.price.toFixed(2)}</div>
      <div>
        <button class="btn small ghost" onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
    linesContainer.appendChild(line);
  });

  const { subtotal, count } = getCartTotals();
  const fee = subtotal * 0.03; // e.g. transaction fee 3%
  const total = subtotal + fee;

  totalsContainer.innerHTML = `
    <div class="checkout-summary-totals">
      <p>Items: ${count}</p>
      <p>Subtotal: £${subtotal.toFixed(2)}</p>
      <p>Estimated transaction fee: £${fee.toFixed(2)}</p>
      <p class="total-line">Estimated total: £${total.toFixed(2)}</p>
    </div>
    <p class="basket-summary-note">
      Transaction fees are estimates only. The final amount will be confirmed at checkout.
    </p>
    <button class="btn primary full-width" onclick="goToCheckoutPage()">Proceed to checkout</button>
  `;
}

function removeFromCart(index) {
  const cart = loadCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderBasketPage();
  renderDrawer();
}

// CHECKOUT PAGE
function renderCheckoutSummary() {
  const summaryEl = document.getElementById("checkout-summary");
  if (!summaryEl) return;
  const { subtotal, count } = getCartTotals();
  if (count === 0) {
    summaryEl.innerHTML = "<p>Your basket is empty.</p>";
    return;
  }
  const fee = subtotal * 0.03;
  const total = subtotal + fee;

  summaryEl.innerHTML = `
    <div class="checkout-summary-totals">
      <p>Items: ${count}</p>
      <p>Subtotal: £${subtotal.toFixed(2)}</p>
      <p>Estimated transaction fee: £${fee.toFixed(2)}</p>
      <p class="total-line">Total: £${total.toFixed(2)}</p>
    </div>
  `;
}

function applyDiscount(codeInput) {
  const code = codeInput.value.trim().toUpperCase();
  const msg = document.getElementById("discount-message");
  if (!msg) return;

  if (code === "AREEJ10") {
    msg.textContent = "Discount applied: 10% off will be reflected when you confirm the order.";
  } else if (code === "") {
    msg.textContent = "";
  } else {
    msg.textContent = "This code is not valid. Try AREJ10 or leave blank.";
  }
}

function submitCheckoutForm(event) {
  event.preventDefault();
  const successBox = document.getElementById("checkout-success");
  if (successBox) {
    successBox.style.display = "block";
    successBox.textContent =
      "Thank you! Your order has been submitted. We will contact you shortly with payment and delivery details.";
  }
  clearCart();
  renderCheckoutSummary();
}

// Init per page
document.addEventListener("DOMContentLoaded", () => {
  // update drawer if present
  renderDrawer();

  if (document.getElementById("basket-lines")) {
    renderBasketPage();
  }
  if (document.getElementById("checkout-summary")) {
    renderCheckoutSummary();
    const form = document.getElementById("checkout-form");
    if (form) {
      form.addEventListener("submit", submitCheckoutForm);
    }
  }
});
