// Ye script har page par <script src="cart-loader.js"></script> ki tarah load kar do
function injectCart() {
    fetch('cart-sidebar.html')
        .then(response => response.text())
        .then(data => {
            const div = document.createElement('div');
            div.innerHTML = data;
            document.body.appendChild(div);
        });
}
injectCart();

function toggleSidebar() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}