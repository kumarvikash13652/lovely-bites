window.addEventListener('load', () => {
    // 1. Sidebar HTML inject karna
    const sidebarHtml = `
        <div id="cart-sidebar" class="sidebar">
            <div class="sidebar-header">
                <h3>Your Cart</h3>
                <button onclick="toggleSidebar()">Close</button>
            </div>
            <div id="cart-container"></div>
            <button onclick="window.location.href='checkout.html'">Checkout</button>
        </div>
        <style>
            .sidebar { position: fixed; right: -350px; top: 0; width: 350px; height: 100%; background: white; z-index: 9999; transition: 0.3s; padding: 20px; box-shadow: -2px 0 5px rgba(0,0,0,0.2); }
            .sidebar.active { right: 0; }
        </style>
    `;
    document.body.insertAdjacentHTML('beforeend', sidebarHtml);

    // 2. Navbar mein Cart Icon inject karna 
    // Yahan apni sahi class daal dena (jaise .navbar, .header, etc.)
    const navbar = document.querySelector('.navbar'); 
    if (navbar) {
        const cartIcon = document.createElement('div');
        cartIcon.style.cursor = 'pointer';
        cartIcon.style.margin = '0 15px';
        cartIcon.innerHTML = `<span>🛒 Cart</span>`;
        cartIcon.onclick = toggleSidebar;
        navbar.appendChild(cartIcon);
    }
});

// 3. Sidebar Toggle Function
function toggleSidebar() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}