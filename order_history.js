document.addEventListener('DOMContentLoaded', function () {
    // Load order history from localStorage or backend
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];

    const orderHistoryDiv = document.getElementById('order-history');
    if (orderHistory.length === 0) {
        orderHistoryDiv.innerHTML = '<p>No order history available.</p>';
    } else {
        orderHistory.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.classList.add('order');

            orderDiv.innerHTML = `
                <h3>Order ID: ${order.id}</h3>
                <p>Products: ${order.products.join(', ')}</p>
                <p>Payment Method: ${order.paymentMethod}</p>
                <p>Shipping Address: ${order.shippingAddress}</p>
                <hr>
            `;

            orderHistoryDiv.appendChild(orderDiv);
        });
    }
});
