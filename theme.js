// theme.js ke sabse upar ye daalo
if (window.location.pathname.includes('checkout.html')) {
    console.log("Checkout page detected, skipping UI injection.");
} else {
    // Tumhara baaki ka pura code yahan rahega
    // (Header/Footer injection, etc.)
}


// Header aur Footer ko inject karne ka safe tareeka
function injectUI(id, html) {
    const element = document.getElementById(id);
    if (element) {
        element.innerHTML = html;
    }
}



// ==========================================
// 1. STYLES & UI INJECTION
// ==========================================
const navStyles = document.createElement('style');
navStyles.innerHTML = `
    .nav-wrapper { display: flex; align-items: center; justify-content: space-between; max-width: 1200px; margin: 0 auto; padding: 10px 20px 0 20px; position: relative; width: 100%; }
    .nav-menu { display: flex; list-style: none; margin: 0; padding: 0; gap: 30px; align-items: center; }
    .nav-item { position: relative; }
    .nav-link { text-decoration: none; color: var(--text-dark); font-weight: 700; font-size: 1rem; padding: 15px 0; display: block; cursor: pointer; user-select: none; }
    .nav-link:hover { color: var(--brand-red); }
    .mega-menu { position: absolute; top: 100%; right: 0; left: auto; background: #ffffff; box-shadow: 0 15px 35px rgba(0,0,0,0.15); border-radius: 12px; padding: 20px; display: flex; gap: 15px; opacity: 0; visibility: hidden; transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease; border-top: 4px solid var(--brand-red); min-width: 580px; z-index: 99999; transform: translateY(15px); pointer-events: none; }
    @media (min-width: 769px) { .nav-item:hover .mega-menu { opacity: 1; visibility: visible; transform: translateY(0); pointer-events: auto; } }
    .mega-item { flex: 1; text-align: center; text-decoration: none; color: var(--text-dark); padding: 12px 8px; border-radius: 8px; background: var(--bg-cream); display: block; }
    .mega-item:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.08); background: #fff; }
    .mega-img { width: 100%; height: 75px; object-fit: contain; margin-bottom: 8px; border-radius: 6px; }
    .mega-item span { display: block; font-weight: 800; font-size: 0.85rem; color: var(--brand-blue); }
    .burger-btn { display: none; background: none; border: none; cursor: pointer; padding: 10px; z-index: 100001; }
    .burger-bar { display: block; width: 25px; height: 3px; margin: 5px auto; background-color: var(--text-dark); transition: all 0.3s ease; }
    @media (max-width: 768px) {
        .burger-btn { display: block; }
        .burger-btn.active .burger-bar:nth-child(2) { opacity: 0; }
        .burger-btn.active .burger-bar:nth-child(1) { transform: translateY(8px) rotate(45deg); background-color: var(--brand-red); }
        .burger-btn.active .burger-bar:nth-child(3) { transform: translateY(-8px) rotate(-45deg); background-color: var(--brand-red); }
        .nav-menu { position: fixed; left: -100%; top: 0; flex-direction: column; background-color: #ffffff; width: 85%; max-width: 320px; height: 100vh; padding: 100px 24px 30px 24px; gap: 10px; box-shadow: 10px 0 30px rgba(0,0,0,0.15); transition: left 0.3s ease; align-items: flex-start; overflow-y: auto; z-index: 100000; }
        .nav-menu.active { left: 0; }
        .nav-item { width: 100%; }
        .mega-menu { position: relative; top: 0; left: 0; right: auto; transform: none !important; min-width: 100% !important; display: none; opacity: 1; visibility: visible; flex-direction: column; padding: 10px; box-shadow: none; background: var(--bg-cream); gap: 8px; border-top: none; border-left: 3px solid var(--brand-red); margin-top: 5px; pointer-events: auto; }
        .mega-menu.mobile-open { display: flex !important; }
        .mega-item { display: flex !important; align-items: center; text-align: left; gap: 15px; padding: 10px; width: 100%; }
        .mega-img { width: 45px; height: 45px; margin-bottom: 0; }
        .nav-item-has-submenu > .nav-link::after { content: " ▾"; font-size: 0.85rem; display: inline-block; transition: transform 0.2s ease; }
        .nav-item-has-submenu.open-caret > .nav-link::after { transform: rotate(180deg); }
    }
    .auth-btn { background: var(--brand-red); color: #fff; border: none; padding: 8px 20px; border-radius: 20px; font-weight: 700; cursor: pointer; transition: 0.3s; margin-left: 10px; }
    .auth-btn:hover { background: #b7171c; }
`;
document.head.appendChild(navStyles);

document.getElementById("global-header").innerHTML = `
    <div class="lang-bar"><button class="lang-btn" onclick="location.reload()">English</button><button class="lang-btn" onclick="changeLanguage('hi')">हिंदी</button><div id="google_translate_element"></div></div>
    <header>
        <div class="gstin-top-right">K L ENTERPRISE | GSTIN: 10JQBPK5246N1ZO</div>
        <div class="nav-wrapper">
            <div class="logo"><a href="index.html"><img src="https://i.ibb.co/mFyGcMzs/Whats-App-Image-2026-04-21-at-12-22-57-removebg-preview.png"></a></div>
            <button class="burger-btn" id="mobile-burger-trigger"><span class="burger-bar"></span><span class="burger-bar"></span><span class="burger-bar"></span></button>
            <ul class="nav-menu" id="navigation-drawer-menu">
                <li class="nav-item"><a href="index.html" class="nav-link">Home</a></li>
                <li class="nav-item"><a href="index.html" class="nav-link">About Us</a></li>
                <li class="nav-item nav-item-has-submenu" id="submenu-parent-wrapper">
                    <span class="nav-link" id="submenu-toggle-item">Our Products</span>
                    <div class="mega-menu" id="product-mega-dropdown">
                        <a href="makhana.html" class="mega-item"><img src="https://i.ibb.co/wFcZdWZw/Gemini-Generated-Image-4ltfp64ltfp64ltf.png" class="mega-img"><span>Makhana</span></a>
                        <a href="makhana.html" class="mega-item"><img src="https://i.ibb.co/JRrFnCxs/Gemini-Generated-Image-gqn9ebgqn9ebgqn9.png" class="mega-img"><span>Sattu</span></a>
                        <a href="makhana.html" class="mega-item"><img src="https://i.ibb.co/KzNPtkxb/Gemini-Generated-Image-9e5mv89e5mv89e5m.png" class="mega-img"><span>Murmura</span></a>
                        <a href="makhana.html" class="mega-item"><img src="https://i.ibb.co/zHX9kbvs/Gemini-Generated-Image-h9bbalh9bbalh9bb.png" class="mega-img"><span>Katarni Poha</span></a>
                    </div>
                </li>
                <li class="nav-item"><a href="index.html" class="nav-link">Contact Us</a></li>
                <li class="nav-item"><button id="auth-btn" class="auth-btn">Login</button></li>
            </ul>
        </div>
    </header>`;

document.getElementById("global-footer").innerHTML = `
    <footer>
        <div class="footer-container">
            <div class="footer-col"><h5>Quality & Certification</h5><p><strong>FSSAI: 20426290000095</strong></p><img src="https://i.ibb.co/ds7NhrHf/New-Project-5.png" class="msme-logo"></div>
            <div class="footer-col"><h5>Shop Online</h5><p>Find us on Marketplaces:</p><div class="footer-platforms"><a href="#" class="platform-link"><img src="https://i.ibb.co/hRB8h7zS/Amazon-Logo-White-PNG.png"></a><a href="#" class="platform-link"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Meesho_logo.png/250px-Meesho_logo.png"></a><a href="#" class="platform-link"><img src="https://i.ibb.co/HT14SWjR/tradeindia-logo-rounded-glossy-icon-with-transparent-background-free-png.webp"></a></div></div>
            <div class="footer-col"><h5>Contact Us</h5><p>Shiv Kala Bhawan, Maharshi Menhi Nagar, Madhepura, Bihar 852113</p><p>Email: support@lovelybites.online</p></div>
            <div class="footer-bottom">&copy; 2026 Lovely Bites. All Rights Reserved.</div>
        </div>
    </footer>`;

// Event Listeners (UI)
document.getElementById('mobile-burger-trigger').addEventListener('click', () => {
    document.getElementById('navigation-drawer-menu').classList.toggle('active');
    document.getElementById('mobile-burger-trigger').classList.toggle('active');
});
document.getElementById('submenu-toggle-item').addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        e.preventDefault();
        document.getElementById('product-mega-dropdown').classList.toggle('mobile-open');
        document.getElementById('submenu-parent-wrapper').classList.toggle('open-caret');
    }
});

// ==========================================
// 2. FIREBASE & ADD TO CART LOGIC
// ==========================================
window.addToCart = async function(productName, price) {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        alert("Firebase load ho raha hai, 2 second ruko...");
        return;
    }
    try {
        const auth = firebase.auth();
        if (!auth.currentUser) await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        
        const qty = document.getElementById('pdp-qty') ? document.getElementById('pdp-qty').value : 1;
        await firebase.firestore().collection("users").doc(auth.currentUser.uid).collection("cart").add({
            productName, price, qty: parseInt(qty), timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        window.location.href = "checkout.html";
    } catch (e) { alert("Error: " + e.message); }
};

const scriptUrls = [
    "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js",
    "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js",
    "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"
];

let loaded = 0;
scriptUrls.forEach(url => {
    const s = document.createElement('script');
    s.src = url;
    s.onload = () => {
        loaded++;
        if (loaded === scriptUrls.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyDVE5gYyGCgAlfHw82Apna6DsMY9zE2bGs",
                authDomain: "lovelybites-e4d35.firebaseapp.com",
                projectId: "lovelybites-e4d35",
                storageBucket: "lovelybites-e4d35.firebasestorage.app",
                messagingSenderId: "650974633550",
                appId: "1:650974633550:web:14e277c8aef5db9ff4ed1f"
            });
            console.log("Firebase SDK loaded successfully.");
            const authBtn = document.getElementById('auth-btn');
            if(authBtn) {
                firebase.auth().onAuthStateChanged(u => authBtn.innerText = u ? "Logout" : "Login");
                authBtn.onclick = () => firebase.auth().currentUser ? firebase.auth().signOut() : firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
            }
        }
    };
    document.head.appendChild(s);
});