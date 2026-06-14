window.addEventListener('load', () => {
    // 1. Sidebar ka Structure inject karna
    const sidebarHtml = `
        <div id="cart-sidebar" class="sidebar">
            <div class="sidebar-header">
                <h3 style="margin-top:0;">Your Cart</h3>
                <button onclick="toggleSidebar()">Close</button>
            </div>
            <div id="cart-container" style="padding: 10px 0;"></div>
            <button onclick="window.location.href='checkout.html'" style="width:100%; padding:10px; background:#e31e24; color:white; border:none; border-radius:5px; cursor:pointer;">Checkout</button>
        </div>
        <style>
            .sidebar { position: fixed; right: -350px; top: 0; width: 300px; height: 100%; background: white; z-index: 9999; transition: 0.3s; padding: 20px; box-shadow: -2px 0 5px rgba(0,0,0,0.2); overflow-y: auto; }
            .sidebar.active { right: 0; }
            .cart-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee; font-size: 14px; }
            .cart-btns button { padding: 5px 10px; cursor: pointer; }
        </style>
    `;
    document.body.insertAdjacentHTML('beforeend', sidebarHtml);

    // 2. Navbar mein Cart Link inject karna
    // Check karo: tumhare <ul> ki class kya hai. Agar class 'navbar-nav' nahi hai, toh use yahan badalna.
    const navList = document.querySelector('ul'); 
    if (navList) {
        const cartLi = document.createElement('li');
        cartLi.className = "nav-item";
        cartLi.style.cursor = 'pointer';
        cartLi.innerHTML = `<span class="nav-link">🛒 Cart (<span id="cart-count">0</span>)</span>`;
        cartLi.onclick = toggleSidebar;
        navList.appendChild(cartLi);
    }

    // 3. Real-time Cart Data Fetch (Firestore)
    const user = firebase.auth().currentUser;
    if (user) {
        firebase.firestore().collection("users").doc(user.uid).collection("cart")
            .onSnapshot(snapshot => {
                const container = document.getElementById('cart-container');
                const countSpan = document.getElementById('cart-count');
                container.innerHTML = "";
                let totalCount = 0;

                snapshot.forEach(doc => {
                    const item = doc.data();
                    totalCount += parseInt(item.qty);
                    container.innerHTML += `
                        <div class="cart-item">
                            <div><strong>${item.productName}</strong><br>₹${item.price} x ${item.qty}</div>
                            <div class="cart-btns">
                                <button onclick="updateQty('${doc.id}', ${item.qty - 1})">-</button>
                                <button onclick="updateQty('${doc.id}', ${item.qty + 1})">+</button>
                                <button onclick="deleteItem('${doc.id}')" style="color:red;">X</button>
                            </div>
                        </div>
                    `;
                });
                countSpan.innerText = totalCount;
            });
    }
});

// Sidebar Toggle
function toggleSidebar() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}

// Qty Update
function updateQty(id, newQty) {
    const user = firebase.auth().currentUser;
    if(newQty <= 0) { deleteItem(id); return; }
    firebase.firestore().collection("users").doc(user.uid).collection("cart").doc(id).update({ qty: newQty });
}

// Delete Item
function deleteItem(id) {
    const user = firebase.auth().currentUser;
    firebase.firestore().collection("users").doc(user.uid).collection("cart").doc(id).delete();
}
