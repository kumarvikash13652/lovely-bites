window.addEventListener('load', () => {
    // 1. Sidebar Inject karo (Ye to hamesha hoga)
    if (!document.getElementById('cart-sidebar')) {
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
                .sidebar { position: fixed; right: -350px; top: 0; width: 300px; height: 100%; background: white; z-index: 9999; transition: 0.3s; padding: 20px; box-shadow: -2px 0 5px rgba(0,0,0,0.2); }
                .sidebar.active { right: 0; }
            </style>
        `;
        document.body.insertAdjacentHTML('beforeend', sidebarHtml);
    }

    // 2. MutationObserver: Jab tak 'ul' nahi milega, ye wait karega
    const observer = new MutationObserver((mutations, obs) => {
        const navList = document.querySelector('ul'); // Yahan apni sahi class ya tag use karo
        if (navList) {
            // Check karo kahin pehle se toh nahi add hua
            if (!document.getElementById('cart-link')) {
                const cartLi = document.createElement('li');
                cartLi.id = "cart-link"; // ID de di taaki double na ho
                cartLi.className = "nav-item";
                cartLi.style.cursor = 'pointer';
                cartLi.innerHTML = `<span class="nav-link">🛒 Cart (<span id="cart-count">0</span>)</span>`;
                cartLi.onclick = toggleSidebar;
                navList.appendChild(cartLi);
            }
            obs.disconnect(); // Kaam ho gaya, observer band
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
});

function toggleSidebar() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}
