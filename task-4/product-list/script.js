const products = [
  { name: "Smartphone", category: "electronics", price: 15000, rating: 4.5, image: "https://via.placeholder.com/200x150?text=Smartphone" },
  { name: "Laptop", category: "electronics", price: 25000, rating: 4.7, image: "https://via.placeholder.com/200x150?text=Laptop" },
  { name: "T-shirt", category: "clothing", price: 1500, rating: 4.2, image: "https://via.placeholder.com/200x150?text=T-shirt" },
  { name: "Jeans", category: "clothing", price: 3000, rating: 4.4, image: "https://via.placeholder.com/200x150?text=Jeans" },
  { name: "Book: JavaScript Guide", category: "books", price: 30, rating: 4.8, image: "https://via.placeholder.com/200x150?text=Book" },
  { name: "Garden Hose", category: "home", price: 50, rating: 4.1, image: "https://via.placeholder.com/200x150?text=Hose" },
  { name: "Headphones", category: "electronics", price: 3000, rating: 4.6, image: "https://via.placeholder.com/200x150?text=Headphones" },
  { name: "Sneakers", category: "clothing", price: 2500, rating: 4.3, image: "https://via.placeholder.com/200x150?text=Sneakers" },
  { name: "Tablet", category: "electronics", price: 20000, rating: 4.4, image: "https://via.placeholder.com/200x150?text=Tablet" },
  { name: "Cookbook", category: "books", price: 20, rating: 4.0, image: "https://via.placeholder.com/200x150?text=Cookbook" },
  { name: "Lamp", category: "home", price: 35, rating: 4.2, image: "https://via.placeholder.com/200x150?text=Lamp" },
  { name: "Mouse", category: "electronics", price: 500, rating: 4.1, image: "https://via.placeholder.com/200x150?text=Mouse" },
];

const productList = document.getElementById('product-list');
const searchInput = document.getElementById('search');
const filterSelect = document.getElementById('filter');
const sortSelect = document.getElementById('sort');
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentPage = 1;
const itemsPerPage = 6;

function updateCartCount() {
  cartCount.textContent = cart.length;
  localStorage.setItem('cart', JSON.stringify(cart));
}

function displayProducts(items) {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = items.slice(start, end);

  productList.innerHTML = paginatedItems.map((p, index) => `
    <div class="card">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <h3>${p.name}</h3>
      <p>Category: ${p.category}</p>
      <p class="price">Price: ₹${p.price}</p>
      <p class="rating">${'⭐'.repeat(Math.floor(p.rating))} ${p.rating}</p>
      <button class="add-to-cart" onclick="addToCart(${start + index})">Add to Cart</button>
    </div>
  `).join('');

  updatePagination(items.length);
}

function updatePagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
}

function filterAndSort() {
  let filtered = [...products];

  // Search
  const searchTerm = searchInput.value.toLowerCase();
  if (searchTerm) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
  }

  // Filter
  if (filterSelect.value !== "all") {
    filtered = filtered.filter(p => p.category === filterSelect.value);
  }

  // Sort
  if (sortSelect.value === "price-asc") filtered.sort((a,b) => a.price - b.price);
  if (sortSelect.value === "price-desc") filtered.sort((a,b) => b.price - a.price);
  if (sortSelect.value === "rating") filtered.sort((a,b) => b.rating - a.rating);
  if (sortSelect.value === "name") filtered.sort((a,b) => a.name.localeCompare(b.name));

  currentPage = 1;
  displayProducts(filtered);
}

function addToCart(index) {
  const product = products[index];
  const existing = cart.find(item => item.name === product.name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartCount();
  alert(`${product.name} added to cart!`);
}

function showCart() {
  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <span>${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}</span>
      <button onclick="removeFromCart(${index})">Remove</button>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = total.toFixed(2);
  cartModal.style.display = 'block';
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  showCart();
}

function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  alert('Checkout successful! (This is a demo)');
  cart = [];
  updateCartCount();
  cartModal.style.display = 'none';
}

// Event listeners
searchInput.addEventListener('input', filterAndSort);
filterSelect.addEventListener('change', filterAndSort);
sortSelect.addEventListener('change', filterAndSort);
cartBtn.addEventListener('click', showCart);
checkoutBtn.addEventListener('click', checkout);

prevPageBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    filterAndSort();
  }
});

nextPageBtn.addEventListener('click', () => {
  const filtered = getFilteredProducts();
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    filterAndSort();
  }
});

function getFilteredProducts() {
  let filtered = [...products];
  const searchTerm = searchInput.value.toLowerCase();
  if (searchTerm) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
  }
  if (filterSelect.value !== "all") {
    filtered = filtered.filter(p => p.category === filterSelect.value);
  }
  return filtered;
}

// Modal close
document.querySelector('.close').addEventListener('click', () => {
  cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === cartModal) {
    cartModal.style.display = 'none';
  }
});

window.onload = () => {
  displayProducts(products);
  updateCartCount();
};
