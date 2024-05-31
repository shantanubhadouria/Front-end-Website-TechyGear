document.addEventListener('DOMContentLoaded', function () {
    const user = JSON.parse(localStorage.getItem('user'));
    const accountNavItem = document.getElementById('account-nav-item');

    if (user) {
        accountNavItem.innerHTML = `
            <div class="dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="accountDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img src="/images/account_icon.png" alt="Account" style="width:24px;height:24px;"> Account
                </a>
                <div class="dropdown-menu dropdown-menu-right account-dropdown" aria-labelledby="accountDropdown">
                    <a class="dropdown-item" href="#" id="personal-info-btn">Personal Information</a>
                    <a class="dropdown-item" href="#" id="order-history-btn">Order History</a>
                    <a class="dropdown-item" href="#" id="sign-out-btn">Sign Out</a>
                </div>
            </div>
        `;
        
        document.getElementById('personal-info-btn').addEventListener('click', function() {
            document.getElementById('modal-name').innerText = `Name: ${user.name}`;
            document.getElementById('modal-email').innerText = `Email: ${user.email}`;
            document.getElementById('info-modal').style.display = 'block';
        });

        document.getElementById('order-history-btn').addEventListener('click', function() {
            const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
            const modalHistory = document.getElementById('modal-history');
            modalHistory.innerHTML = '';
            orderHistory.forEach(order => {
                const orderDiv = document.createElement('div');
                orderDiv.className = 'order';
                orderDiv.innerHTML = `
                    <img src="${order.image}" alt="${order.name}">
                    <p><strong>${order.name}</strong></p>
                    <p>Quantity: ${order.quantity}</p>
                    <p>Price: £${order.price.toFixed(2)}</p>
                    <p>Total: £${(order.price * order.quantity).toFixed(2)}</p>
                `;
                modalHistory.appendChild(orderDiv);
            });
            document.getElementById('history-modal').style.display = 'block';
        });

        document.getElementById('sign-out-btn').addEventListener('click', function() {
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
    }

    loadProducts();
    loadCart();
});

function loadProducts() {
    const productList = document.getElementById('product-list');
    const products = [
        { id: 1, name: 'Galaxy S24 Ultra', price: '£1,049.99', image: '/images/galaxy_s24ultra.jpg' },
        { id: 2, name: 'Macbook M2', price: '£1,099.99', image: '/images/laptop.jpg' },
        { id: 3, name: 'HUAWEI Watch 4 Pro', price: '£449.99', image: '/images/huawei_watch.jpg' },
        { id: 4, name: 'Bose QuietComfort Ultra Wireless Noise Cancelling Headphone', price: '£449.99', image: '/images/bose_headphones.jpg' }
    ];

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item col-md-3 col-sm-6 mb-4';
        productItem.innerHTML = `
            <div class="card">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">Description here...</p>
                    <p class="card-text">${product.price}</p>
                    <div class="btn-group">
                        <a href="#" class="btn btn-primary">View Details</a>
                        <a href="#" class="btn btn-secondary add-to-cart" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">Add to Cart</a>
                    </div>
                </div>
            </div>
        `;
        productList.appendChild(productItem);

        setTimeout(() => {
            productItem.classList.add('visible');
        }, 100);
    });
}

function addToCart(name, price, image) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(product => product.name === name);
    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showAddedToCartMessage(name);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartIcon = document.querySelector('.nav-item a[href="cart.html"]');
    cartIcon.textContent = `Cart (${cartCount})`;
}

function showAddedToCartMessage(productName) {
    const message = document.getElementById('added-to-cart-message');
    message.textContent = `${productName} has been added to the cart!`;
    message.classList.add('show');
    setTimeout(() => {
        message.classList.remove('show');
    }, 3000);
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        renderCart();
    }
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <p>${item.name}</p>
            <p>${item.price}</p>
            <p>Quantity: ${item.quantity}</p>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex !== -1) {
        if (cart[productIndex].quantity > 1) {
            cart[productIndex].quantity -= 1;
        } else {
            cart.splice(productIndex, 1);
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.card');
    const scrollPosition = window.scrollY + window.innerHeight;
    productCards.forEach(card => {
        if (card.getBoundingClientRect().top + window.scrollY < scrollPosition) {
            card.classList.add('show');
        }
    });

    document.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + window.innerHeight;
        productCards.forEach(card => {
            if (card.getBoundingClientRect().top + window.scrollY < scrollPosition) {
                card.classList.add('show');
            }
        });
    });

    const welcomeMessage = document.getElementById('welcome-message');
    const userName = localStorage.getItem('userName');
    if (userName) {
        welcomeMessage.textContent = `Welcome to TechyGear, ${userName}!`;
        welcomeMessage.classList.add('show');
        setTimeout(() => {
            welcomeMessage.classList.remove('show');
        }, 5000);
    }

    updateCartCount();

    const accountNavItem = document.getElementById('account-nav-item');
    const userEmail = localStorage.getItem('userEmail');
    if (userName && userEmail) {
        accountNavItem.innerHTML = `
            <div class="dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="accountDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img src="/images/account_icon.png" alt="Account" style="width:24px;height:24px;"> Account
                </a>
                <div class="dropdown-menu dropdown-menu-right account-info" aria-labelledby="accountDropdown">
                    <h5>Account Information</h5>
                    <p id="account-name">Name: ${userName}</p>
                    <p id="account-email">Email: ${userEmail}</p>
                    <h5>Order History</h5>
                    <div id="order-history"></div>
                    <a class="dropdown-item" href="#" id="sign-out">Sign Out</a>
                </div>
            </div>
        `;

        const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
        const orderHistoryContainer = document.getElementById('order-history');
        orderHistoryContainer.innerHTML = '';
        orderHistory.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order';
            orderDiv.innerHTML = `
                <img src="${order.image}" alt="${order.name}">
                <p><strong>${order.name}</strong></p>
                <p>Quantity: ${order.quantity}</p>
                <p>Price: £${order.price.toFixed(2)}</p>
                <p>Total: £${(order.price * order.quantity).toFixed(2)}</p>
            `;
            orderHistoryContainer.appendChild(orderDiv);
        });

        document.getElementById('sign-out').addEventListener('click', function() {
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            const productCard = button.closest('.card');
            const image = productCard.querySelector('.card-img-top').src;
            addToCart(name, price, image);
        });
    });

    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', function() {
            this.classList.add('bounce');
            setTimeout(() => {
                this.classList.remove('bounce');
            }, 300);
        });
    });

    const emailInput = document.querySelector('input[type="email"]');
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            const email = emailInput.value;
            const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            emailInput.setCustomValidity(valid ? '' : 'Please enter a valid email address.');
        });
    }
});

function closeInfoModal() {
    document.getElementById('info-modal').style.display = 'none';
}

function closeHistoryModal() {
    document.getElementById('history-modal').style.display = 'none';
}
