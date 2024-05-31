// cart.js

document.addEventListener("DOMContentLoaded", function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
    displayOrderSummary();

    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.innerText = cartCount;
        }
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const productImage = this.getAttribute('data-image');

            const existingProduct = cart.find(item => item.name === productName);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push({ name: productName, price: productPrice, image: productImage, quantity: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            showAlert('Product added to cart!', 'success');
            displayOrderSummary();
        });
    });

    function displayOrderSummary() {
        const cartContainer = document.getElementById('cart-items');
        const orderSummary = document.querySelector('.order-summary');
        if (!cartContainer || !orderSummary) return;

        cartContainer.innerHTML = '';

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Your cart is empty.</p>';
            document.getElementById('cart-total').innerText = '0.00';
            orderSummary.style.display = 'none';
            return;
        }

        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div>
                    <h5>${item.name}</h5>
                    <p>£${item.price.toFixed(2)} x ${item.quantity}</p>
                    <button class="btn btn-danger remove-from-cart" data-name="${item.name}">Remove</button>
                </div>
            `;
            cartContainer.appendChild(cartItem);
        });

        document.getElementById('cart-total').innerText = total.toFixed(2);
        orderSummary.style.display = 'block';
    }

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-from-cart')) {
            const productName = event.target.getAttribute('data-name');

            cart = cart.map(item => {
                if (item.name === productName) {
                    if (item.quantity > 1) {
                        item.quantity -= 1;
                    } else {
                        return null;
                    }
                }
                return item;
            }).filter(item => item !== null);

            localStorage.setItem('cart', JSON.stringify(cart));
            displayOrderSummary();
            updateCartCount();
        }
    });

    if (document.getElementById('cart-items')) {
        displayOrderSummary();
    }

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(event) {
            if (cart.length === 0) {
                event.preventDefault();
                showAlert('Your cart is empty!', 'danger');
                return;
            }
            localStorage.setItem('cartProducts', JSON.stringify(cart));
            window.location.href = 'checkout.html';
        });
    }

    document.querySelectorAll('.buy-now').forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const productImage = this.getAttribute('data-image');

            const product = { name: productName, price: productPrice, image: productImage, quantity: 1 };
            localStorage.setItem('buyNowProduct', JSON.stringify(product));
            window.location.href = 'checkout.html';
        });
    });

    function showAlert(message, type) {
        const alertPlaceholder = document.createElement('div');
        alertPlaceholder.className = `alert alert-${type} alert-dismissible fade show`;
        alertPlaceholder.role = 'alert';
        alertPlaceholder.innerHTML = `
            ${message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        `;
        document.body.appendChild(alertPlaceholder);
        setTimeout(() => {
            alertPlaceholder.remove();
        }, 3000);
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const accountNavItem = document.getElementById('account-nav-item');
    if (user) {
        accountNavItem.innerHTML = `<a href="account.html">Account</a>`;
    }
});
