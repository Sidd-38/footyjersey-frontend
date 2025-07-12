// main.js - FootyJersey Frontend Logic

const apiBase = "https://footyjersey-api.onrender.com/api";
 // change this to your deployed backend when live

// Page toggle logic
function showPage(id) {
  const pages = ["login-page", "register-page", "products-page", "cart-page", "checkout-page", "confirmation-page"];
  pages.forEach(p => document.getElementById(p).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// Sample products (with local image path)
const products = [
    // National Teams
    { id: 1, name: "Argentina 2024 Jersey", price: 3999, image: "images/argentina.jpeg" },
    { id: 2, name: "Portugal 2024 Jersey", price: 3899, image: "images/portugal.jpeg" },
    { id: 3, name: "Spain 2024 Jersey", price: 3799, image: "images/spain.jpeg" },
    { id: 4, name: "France 2024 Jersey", price: 4099, image: "images/france.jpeg" },
    { id: 5, name: "England 2024 Jersey", price: 3999, image: "images/england.jpeg" },
    { id: 6, name: "Brazil 2024 Jersey", price: 4199, image: "images/brazil.jpeg" },
  
    // Club Jerseys
    { id: 7, name: "Manchester United Home Jersey", price: 3599, image: "images/manutd.jpeg" },
    { id: 8, name: "Manchester City Jersey", price: 3199, image: "images/mancity.jpeg" },
    { id: 9, name: "Liverpool Jersey", price: 2999, image: "images/liv.jpeg" },
    { id: 10, name: "Paris Saint-Germain Jersey", price: 3499, image: "images/psg.jpeg" },
    { id: 11, name: "Barcelona Jersey", price: 3499, image: "images/bar.jpeg" },
    { id: 12, name: "Real Madrid Jersey", price: 3599, image: "images/rm.jpeg" },
  ];

let cart = [];

function buyNow(id) {
  addToCart(id);
  renderCart();
  showPage("checkout-page");
}

function renderProducts() {
  const list = document.getElementById("product-list");
  list.innerHTML = "";
  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "bg-white p-4 rounded shadow";
    card.innerHTML = `
      <img src="${p.image}" class="w-full h-48 object-contain mb-2 rounded bg-white">
      <h3 class="text-lg font-semibold">${p.name}</h3>
      <p class="text-blue-600 font-bold">₹${p.price}</p>
      <div class="mt-2 flex gap-2">
        <button onclick="addToCart(${p.id})" class="bg-blue-600 text-white flex-1 py-1 rounded">🛒 Add</button>
        <button onclick="buyNow(${p.id})" class="bg-green-600 text-white flex-1 py-1 rounded">Buy Now</button>
      </div>
    `;
    list.appendChild(card);
  });
}

function addToCart(id) {
  const item = products.find(p => p.id === id);
  cart.push(item);
  alert("Added to cart!");
}

function renderCart() {
  const div = document.getElementById("cart-items");
  div.innerHTML = "";
  if (cart.length === 0) {
    div.innerHTML = "<p class='text-gray-500'>Your cart is empty.</p>";
    return;
  }
  cart.forEach((item, index) => {
    div.innerHTML += `<div class='flex justify-between items-center border-b py-2'>
      <div>${item.name}</div>
      <div>₹${item.price}</div>
    </div>`;
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const shippingCost = 200;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shippingCost + tax;

  div.innerHTML += `
    <div class='mt-4 border-t pt-4'>
      <div class='flex justify-between'><span>Subtotal:</span><span>₹${subtotal}</span></div>
      <div class='flex justify-between'><span>Shipping:</span><span>₹${shippingCost}</span></div>
      <div class='flex justify-between'><span>Tax:</span><span>₹${tax}</span></div>
      <div class='flex justify-between font-bold'><span>Total:</span><span>₹${total}</span></div>
    </div>
  `;
}

async function registerUser(name, email, password) {
  const res = await fetch(`${apiBase}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });
  if (!res.ok) throw new Error("Registration failed");
  return await res.json();
}

async function loginUser(email, password) {
  const res = await fetch(`${apiBase}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error("Login failed");
  return await res.json();
}

async function placeOrder(orderData) {
  const res = await fetch(`${apiBase}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData)
  });
  if (!res.ok) throw new Error("Order failed");
  return await res.json();
}

// Handlers
const registerForm = document.getElementById("register-form");
registerForm.addEventListener("submit", async e => {
  e.preventDefault();
  try {
    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const user = await registerUser(name, email, password);
    localStorage.setItem("currentUser", JSON.stringify(user));
    renderProducts();
    showPage("products-page");
  } catch (err) {
    alert(err.message);
  }
});

const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", async e => {
  e.preventDefault();
  try {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const user = await loginUser(email, password);
    localStorage.setItem("currentUser", JSON.stringify(user));
    renderProducts();
    showPage("products-page");
  } catch (err) {
    alert("Invalid login");
  }
});

document.getElementById("checkout-btn").addEventListener("click", () => {
  renderCart();
  showPage("checkout-page");
});

document.getElementById("place-order-btn").addEventListener("click", async () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const shipping = {
    firstName: document.getElementById("first-name").value,
    lastName: document.getElementById("last-name").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    state: document.getElementById("state").value,
    zip: document.getElementById("zip").value,
    phone: document.getElementById("phone").value
  };
  const payment = {
    cardNumber: document.getElementById("card-number").value,
    cardName: document.getElementById("card-name").value
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const shippingCost = 200;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shippingCost + tax;

  const orderData = {
    userId: user._id,
    items: cart,
    shipping,
    payment,
    subtotal,
    shippingCost,
    tax,
    total,
    status: "processing"
  };

  try {
    await placeOrder(orderData);

    // Render ordered items in confirmation page
    const confirmDiv = document.getElementById("order-summary");
    confirmDiv.innerHTML = cart.map(item =>
      `<div class="flex justify-between border-b py-2">
         <span>${item.name}</span>
         <span>₹${item.price}</span>
       </div>`).join("");

    cart = [];
    showPage("confirmation-page");
  } catch (err) {
    alert("Order failed: " + err.message);
  }
});
