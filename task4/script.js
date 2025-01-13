// Global Variables
const productsContainer = document.getElementById('products-container');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const productContainer = document.getElementById('product-container');
let cart = JSON.parse(localStorage.getItem('cart')) || []; // Load cart from localStorage

// Fetch products from API (for ecom.html)
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        productsContainer.innerHTML = '<p>Failed to load products. Please try again later.</p>';
    }
}

// Display products on the ecom.html page
function displayProducts(products) {
    if (!productsContainer) return;

    productsContainer.innerHTML = '';
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}" loading="lazy">
            <h3>${product.title}</h3>
            <div class="product-rating">
                ${'★'.repeat(Math.floor(product.rating.rate))}${'☆'.repeat(5 - Math.floor(product.rating.rate))}
                <span>(${product.rating.rate})</span>
            </div>
            <p class="price">$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id}, '${product.title.replace(/'/g, "\\'")}', ${product.price}, '${product.image}')">
                Add to Cart
            </button>
            <button onclick="viewProductDetail(${product.id})">View Details</button>
        `;
        productsContainer.appendChild(productElement);
    });
}

// View product detail
function viewProductDetail(id) {
    window.location.href = `product.html?id=${id}`;
}

// Fetch and display product details
async function fetchProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    try {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }
        const product = await response.json();
        displayProductDetail(product);
    } catch (error) {
        console.error('Error:', error);
        productContainer.innerHTML = '<p>Failed to load product details. Please try again later.</p>';
    }
}



// Display product details
function displayProductDetail(product) {
    const rating = parseFloat(product.rating.rate) || 0;

    productContainer.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="fixed-size-image">
        <h2>${product.title}</h2>
        <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
        <p><strong>Category:</strong> ${product.category}</p>
        <p><strong>Description:</strong> ${product.description}</p>
        <div class="product-rating">
            ${'★'.repeat(Math.floor(rating))}${'☆'.repeat(5 - Math.floor(rating))} 
            <span>(${rating.toFixed(1)})</span>
        </div>
        <button class="button" onclick="addToCart(${product.id}, '${product.title.replace(/'/g, "\\'")}', ${product.price}, '${product.image}')">
            Add to Cart
        </button>
    `;
}

// Checkout function
function checkout() {
    if (cart.length > 0) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCart();
        document.getElementById('checkout-message').style.display = 'block';
        setTimeout(() => {
            document.getElementById('checkout-message').style.display = 'none';
        }, 2000);
    }
}


// Add product to cart
function addToCart(id, title, price, image) {
    const product = { id, title, price, image };
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to localStorage
    updateCartCount();
    showCartMessage();
    if (cartItemsContainer) {
        updateCart(); // Update cart display if we're on the cart page
    }
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Show cart message
function showCartMessage() {
    const cartMessage = document.getElementById('cart-message');
    if (cartMessage) {
        cartMessage.style.display = 'block';
        setTimeout(() => {
            cartMessage.style.display = 'none';
        }, 2000);
    }
}

// Update cart display
function updateCart() {
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p id="empty-cart-message">Your cart is empty.</p>';
        if (cartTotal) cartTotal.textContent = '0.00';
        return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-info">
                <p class="cart-item-title">${item.title}</p>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            </div>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItemElement);
        total += item.price;
    });

    if (cartTotal) {
        cartTotal.textContent = total.toFixed(2);
    }
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart
    updateCartCount();
    updateCart();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    if (productsContainer) {
        fetchProducts();
    }

    if (cartItemsContainer) {
        updateCart();
    }

    if (productContainer) {
        fetchProductDetail();
    }
});