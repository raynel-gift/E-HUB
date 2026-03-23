// ============================================================
// products.js — E-Shop | All JavaScript
// ============================================================

// --- PRODUCT DATA ---
const products = [
  { id: 1, name: "Blankets",     price: 30000, category: "beddings",  image: "images/blankets.jpeg" },
  { id: 2, name: "Cloth",        price: 25000,  category: "clothings", image: "images/cloth.jpeg" },
  { id: 3, name: "Clothes Rack", price: 45000,  category: "clothings", image: "images/clothes-rack.jpeg" },
  { id: 4, name: "Sport Wear",   price: 40000,  category: "sports",    image: "images/sport89.jpeg" },
  { id: 5, name: "Gym Wear",     price: 60000,   category: "sports",    image: "images/gim.jpeg" },
  { id: 6, name: "Work Out Set", price: 42000,   category: "sports",    image: "images/work.jpeg" },
  { id: 7, name: "Free Style",   price: 38000,   category: "clothings", image: "images/free.PNG" },
  { id: 8, name: "duvet covers", price: 50000,  category: "beddings", image: "images/blankents.jpeg"},
];

// --- CART HELPERS ---
const getCart  = () => { try { return JSON.parse(localStorage.getItem("cart")) || []; } catch { return []; } };
const saveCart = (cart) => { try { localStorage.setItem("cart", JSON.stringify(cart)); } catch (e) { console.error(e); } };

function updateCartCounter() {
  const el = document.getElementById("cart-counter");
  if (!el) return;
  const total = getCart().reduce((s, i) => s + i.quantity, 0);
  el.textContent = total;
  el.style.display = total > 0 ? "inline-flex" : "none";
}

// --- ADD TO CART ---
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const cart = getCart();
  const found = cart.find(i => i.id === id);
  found ? found.quantity++ : cart.push({ ...product, quantity: 1 });
  saveCart(cart);
  updateCartCounter();
  const btn = document.querySelector(`.add-btn[data-id="${id}"]`);
  if (btn) {
    btn.textContent = "✔ Added!";
    btn.style.background = "#198754";
    setTimeout(() => { btn.textContent = "🛒 Add to Cart"; btn.style.background = ""; }, 1500);
  }
}

// --- INDEX PAGE ---
function  renderProducts(list) {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  grid.innerHTML = list.length ? list.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}" onerror="this.alt='No image'">
      <div class="info">
        <h3>${p.name}</h3>
        <p class="category">${p.category}</p>
        <div class="price">UGX ${p.price.toLocaleString()}</div>
        <button class="add-btn" data-id="${p.id}">🛒 Add to Cart</button>
      </div>
    </div>`).join("") : "<p class='empty-cart'>No products found.</p>";
  grid.querySelectorAll(".add-btn").forEach(btn =>
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.id)))
  );
}

function initIndexPage() {
  if (!document.getElementById("productGrid")) return;
  renderProducts(products);
  const search = document.getElementById("searchInput");
  const filter = document.getElementById("categoryFilter");
  const run = () => renderProducts(products.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase().trim()) &&
    (!filter.value || p.category === filter.value)
  ));
  search?.addEventListener("input", run);
  filter?.addEventListener("change", run);
}

// --- CART PAGE ---
function renderCart() {
  const container = document.getElementById("cartItems");
  const totalEl   = document.getElementById("totalPrice");
  if (!container) return;
  const cart = getCart();
  if (!cart.length) {
    container.innerHTML = `<p class="empty-cart" style="text-align:center; margin:2rem 0;">
      Cart is empty. <a href="index.html">Continue shopping</a></p>`;
    if (totalEl) totalEl.textContent = "0";
    return;
  }
  let total = 0;
  container.innerHTML = cart.map(item => {
    const sub = item.price * item.quantity;
    total += sub;
    return `
    <div class="product-card" style="display:flex; align-items:center; gap:1.5rem; margin-bottom:1rem;">
      <img src="${item.image}" alt="${item.name}" style="width:120px;height:120px;object-fit:cover;border-radius:8px;" onerror="this.alt='No image'">
      <div style="flex:1;">
        <h3>${item.name}</h3>
        <p class="category">${item.category}</p>
        <div class="price">UGX ${item.price.toLocaleString()} × ${item.quantity} = UGX ${sub.toLocaleString()}</div>
        <div style="margin:.5rem 0;">
          <button class="quantity-btn" data-id="${item.id}" data-action="decrease">−</button>
          <span style="margin:0 .5rem;">${item.quantity}</span>
          <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
        </div>
        <button class="remove-btn" data-id="${item.id}" style="color:red;background:none;border:1px solid red;padding:.3rem .8rem;border-radius:4px;cursor:pointer;">Remove</button>
      </div>
    </div>`;
  }).join("");
  if (totalEl) totalEl.textContent = total.toLocaleString();
  updateCartCounter();
  container.querySelectorAll(".quantity-btn").forEach(btn =>
    btn.addEventListener("click", () => {
      const cart = getCart(), item = cart.find(i => i.id === Number(btn.dataset.id));
      if (!item) return;
      item.quantity = btn.dataset.action === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
      saveCart(cart); renderCart();
    })
  );
  container.querySelectorAll(".remove-btn").forEach(btn =>
    btn.addEventListener("click", () => {
      saveCart(getCart().filter(i => i.id !== Number(btn.dataset.id))); renderCart();
    })
  );
}

// --- CHECKOUT PAGE ---
function initCheckoutPage() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;
  const cart = getCart();
  const summary = document.getElementById("orderSummary");
  if (summary) {
    if (!cart.length) { summary.innerHTML = "<p style='color:red'>Cart is empty. <a href='index.html'>Go shopping</a></p>"; return; }
    let total = 0;
    summary.innerHTML = "<h3>Order Summary</h3>" +
      cart.map(i => { const l = i.price * i.quantity; total += l;
        return `<div style="display:flex;justify-content:space-between;margin:.4rem 0;"><span>${i.name} × ${i.quantity}</span><span>UGX ${l.toLocaleString()}</span></div>`;
      }).join("") +
      `<hr><div style="display:flex;justify-content:space-between;font-weight:700;"><span>Total</span><span>UGX ${total.toLocaleString()}</span></div>`;
  }
  form.addEventListener("submit", e => {
    e.preventDefault();
    document.querySelectorAll(".error").forEach(el => el.style.display = "none");
    const name    = document.getElementById("name").value.trim();
    const email   = document.getElementById("email").value.trim();
    const phone   = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    let valid = true;
    if (!name)                                          { document.getElementById("nameError").style.display    = "block"; valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))    { document.getElementById("emailError").style.display   = "block"; valid = false; }
    if (!/^[0-9]{9,15}$/.test(phone))                  { document.getElementById("phoneError").style.display   = "block"; valid = false; }
    if (!address)                                       { document.getElementById("addressError").style.display = "block"; valid = false; }
    if (!valid) return;
    localStorage.removeItem("cart");
    updateCartCounter();
    alert("✅ Order placed!Thank you for shopping with us.");
    window.location.href = "index.html";
  });
}

// --- INIT ---
document.addEventListener("DOMContentLoaded", () => {
  updateCartCounter();
  initIndexPage();
  renderCart();
  initCheckoutPage();
});
