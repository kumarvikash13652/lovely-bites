window.addEventListener('load', () => {
    // 1. Sidebar ka Structure
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
        </style>
    `;
    document.body.insertAdjacentHTML('beforeend', sidebarHtml);

    // 2. Navbar Cart Link
    const navList = document.querySelector('ul'); 
    if (navList) {
        const cartLi = document.createElement('li');
        cartLi.className = "nav-item";
        cartLi.style.cursor = 'pointer';
        cartLi.innerHTML = `<span class="nav-link">🛒 Cart (<span id="cart-count">0</span>)</span>`;
        cartLi.onclick = toggleSidebar;
        navList.appendChild(cartLi);
    

    // My Orders Link
        const ordersLi = document.createElement('li');
        ordersLi.className = "nav-item";
        ordersLi.innerHTML = `<a href="orders.html" class="nav-link">📦 My Orders</a>`;
        navList.appendChild(ordersLi);
    }

    // 3. FIX: Auth State ka wait karo, tabhi cart load karo
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            firebase.firestore().collection("users").doc(user.uid).collection("cart")
                .onSnapshot(snapshot => {
                    const container = document.getElementById('cart-container');
                    const countSpan = document.getElementById('cart-count');
                    if (!container) return; // Agar container load nahi hua
                    
                    container.innerHTML = "";
                    let totalCount = 0;

                    snapshot.forEach(doc => {
                        const item = doc.data();
                        totalCount += parseInt(item.qty);
                        container.innerHTML += `
                            <div class="cart-item">
                                <div><strong>${item.productName}</strong><br>₹${item.price} x ${item.qty}</div>
                                <div>
                                    <button onclick="updateQty('${doc.id}', ${item.qty - 1})">-</button>
                                    <button onclick="updateQty('${doc.id}', ${item.qty + 1})">+</button>
                                    <button onclick="deleteItem('${doc.id}')" style="color:red; border:none; background:none; cursor:pointer;">X</button>
                                </div>
                            </div>
                        `;
                    });
                    countSpan.innerText = totalCount;
                });
        } else {
            console.log("User not logged in, cart empty.");
        }
    });
});

function toggleSidebar() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}

function updateQty(id, newQty) {
    const user = firebase.auth().currentUser;
    if (!user) return;
    if(newQty <= 0) { deleteItem(id); return; }
    firebase.firestore().collection("users").doc(user.uid).collection("cart").doc(id).update({ qty: newQty });
}

function deleteItem(id) {
    const user = firebase.auth().currentUser;
    if (!user) return;
    firebase.firestore().collection("users").doc(user.uid).collection("cart").doc(id).delete();
}