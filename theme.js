// ==========================================
// 1. INJECT GLOBAL STYLES FOR THE NAVIGATION BAR
// ==========================================
const navStyles = document.createElement('style');
navStyles.innerHTML = `
    /* Navigation Core Container Layout */
    .nav-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 1200px;
        margin: 0 auto;
        padding: 10px 20px 0 20px;
        position: relative;
        width: 100%;
    }
    
    .nav-menu {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        gap: 30px;
        align-items: center;
    }
    
    .nav-item {
        position: relative;
    }
    
    .nav-link {
        text-decoration: none;
        color: var(--text-dark);
        font-weight: 700;
        font-size: 1rem;
        padding: 15px 0;
        display: block;
        cursor: pointer;
        user-select: none;
    }
    
    .nav-link:hover {
        color: var(--brand-red);
    }

    /* Desktop Mega Sub-Menu Box Style - Right-Edge Anchored to Prevent Screen Spill */
    .mega-menu {
        position: absolute;
        top: 100%;
        right: 0; /* Changed from left:0 to anchor it safely inside the screen bounds */
        left: auto;
        background: #ffffff;
        box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        border-radius: 12px;
        padding: 20px;
        display: flex;
        gap: 15px;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease;
        border-top: 4px solid var(--brand-red);
        min-width: 580px;
        z-index: 99999;
        transform: translateY(15px);
        pointer-events: none;
    }
    
    /* Hover Triggers for Desktop Only (Screens larger than 768px) */
    @media (min-width: 769px) {
        .nav-item:hover .mega-menu {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
            pointer-events: auto;
        }
    }
    
    /* Sub-menu Item Style Cards */
    .mega-item {
        flex: 1;
        text-align: center;
        text-decoration: none;
        color: var(--text-dark);
        padding: 12px 8px;
        border-radius: 8px;
        background: var(--bg-cream);
        display: block;
    }
    
    .mega-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        background: #fff;
    }
    
    .mega-img {
        width: 100%;
        height: 75px;
        object-fit: contain;
        margin-bottom: 8px;
        border-radius: 6px;
    }
    
    .mega-item span {
        display: block;
        font-weight: 800;
        font-size: 0.85rem;
        color: var(--brand-blue);
    }

    /* Mobile Responsive Burger Button Trigger */
    .burger-btn {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        padding: 10px;
        z-index: 100001;
    }
    
    .burger-bar {
        display: block;
        width: 25px;
        height: 3px;
        margin: 5px auto;
        background-color: var(--text-dark);
        transition: all 0.3s ease;
    }

    /* Mobile Engine Breakpoint Rules */
    @media (max-width: 768px) {
        .burger-btn {
            display: block;
        }
        
        /* Transform Burger Button into X Shape when open */
        .burger-btn.active .burger-bar:nth-child(2) { opacity: 0; }
        .burger-btn.active .burger-bar:nth-child(1) { transform: translateY(8px) rotate(45deg); background-color: var(--brand-red); }
        .burger-btn.active .burger-bar:nth-child(3) { transform: translateY(-8px) rotate(-45deg); background-color: var(--brand-red); }
        
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 0;
            flex-direction: column;
            background-color: #ffffff;
            width: 85%;
            max-width: 320px;
            height: 100vh;
            padding: 100px 24px 30px 24px;
            gap: 10px;
            box-shadow: 10px 0 30px rgba(0,0,0,0.15);
            transition: left 0.3s ease;
            align-items: flex-start;
            overflow-y: auto;
            z-index: 100000;
        }
        
        .nav-menu.active {
            left: 0;
        }

        .nav-item {
            width: 100%;
        }
        
        /* Mobile Dropdown Reset Mechanics */
        .mega-menu {
            position: relative;
            top: 0;
            left: 0;
            right: auto;
            transform: none !important;
            min-width: 100% !important;
            max-width: 100%;
            display: none; /* Controlled strictly by JS toggle */
            opacity: 1;
            visibility: visible;
            flex-direction: column;
            padding: 10px;
            box-shadow: none;
            background: var(--bg-cream);
            gap: 8px;
            border-top: none;
            border-left: 3px solid var(--brand-red);
            border-radius: 6px;
            margin-top: 5px;
            pointer-events: auto;
        }
        
        /* Class forced dynamically via mobile click handler */
        .mega-menu.mobile-open {
            display: flex !important;
        }
        
        .mega-item {
            display: flex !important;
            align-items: center;
            text-align: left;
            gap: 15px;
            padding: 10px;
            width: 100%;
        }
        
        .mega-img {
            width: 45px;
            height: 45px;
            margin-bottom: 0;
        }
        
        /* Caret indicator logic for sub-menu visibility tracking */
        .nav-item-has-submenu > .nav-link::after {
            content: " ▾";
            font-size: 0.85rem;
            display: inline-block;
            transition: transform 0.2s ease;
        }

        .nav-item-has-submenu.open-caret > .nav-link::after {
            transform: rotate(180deg);
        }
    }
`;
document.head.appendChild(navStyles);


// ==========================================
// 2. INJECT GLOBAL LANGUAGE BAR & RESPONSIVE HEADER
// ==========================================
document.getElementById("global-header").innerHTML = `
    <div class="lang-bar">
        <button class="lang-btn" onclick="location.reload()">English</button>
        <button class="lang-btn" onclick="changeLanguage('hi')">हिंदी</button>
        <div id="google_translate_element"></div>
    </div>

    <header>
        <div class="gstin-top-right">K L ENTERPRISE | GSTIN: 10JQBPK5246N1ZO</div>
        
        <div class="nav-wrapper">
            <!-- Brand Logo Frame -->
            <div class="logo">
                <a href="index.html"><img src="https://i.ibb.co/mFyGcMzs/Whats-App-Image-2026-04-21-at-12-22-57-removebg-preview.png" alt="Lovely Bites Logo"></a>
            </div>

            <!-- Mobile Drawer Button Container -->
            <button class="burger-btn" id="mobile-burger-trigger" aria-label="Toggle Navigation">
                <span class="burger-bar"></span>
                <span class="burger-bar"></span>
                <span class="burger-bar"></span>
            </button>

            <!-- Navigation Architecture Link Targets -->
            <ul class="nav-menu" id="navigation-drawer-menu">
                <li class="nav-item"><a href="index.html" class="nav-link">Home</a></li>
                <li class="nav-item"><a href="index.html" class="nav-link">About Us</a></li>
                
                <!-- Dynamic Multi-tier Dropdown Sub-menu Container -->
                <li class="nav-item nav-item-has-submenu" id="submenu-parent-wrapper">
                    <span class="nav-link" id="submenu-toggle-item">Our Products</span>
                    <div class="mega-menu" id="product-mega-dropdown">
                        
                        <a href="makhana.html" class="mega-item">
                            <img src="https://i.ibb.co/wFcZdWZw/Gemini-Generated-Image-4ltfp64ltfp64ltf.png" alt="Makhana" class="mega-img">
                            <span>Makhana</span>
                        </a>
                        
                        <a href="makhana.html" class="mega-item">
                            <img src="https://i.ibb.co/JRrFnCxs/Gemini-Generated-Image-gqn9ebgqn9ebgqn9.png" alt="Sattu" class="mega-img">
                            <span>Sattu</span>
                        </a>
                        
                        <a href="makhana.html" class="mega-item">
                            <img src="https://i.ibb.co/KzNPtkxb/Gemini-Generated-Image-9e5mv89e5mv89e5m.png" alt="Murmura" class="mega-img">
                            <span>Murmura</span>
                        </a>
                        
                        <a href="makhana.html" class="mega-item">
                            <img src="https://i.ibb.co/zHX9kbvs/Gemini-Generated-Image-h9bbalh9bbalh9bb.png" alt="Katarni Poha" class="mega-img">
                            <span>Katarni Poha</span>
                        </a>

                    </div>
                </li>
                
                <li class="nav-item"><a href="index.html" class="nav-link">Contact Us</a></li>
            </ul>
        </div>
    </header>
`;


// ==========================================
// 3. INJECT GLOBAL FOOTER COMPONENT
// ==========================================
document.getElementById("global-footer").innerHTML = `
    <footer>
        <div class="footer-container">
            <div class="footer-col">
                <h5>Quality & Certification</h5>
                <p><strong>FSSAI: 20426290000095</strong></p>
                <img src="https://i.ibb.co/ds7NhrHf/New-Project-5.png" alt="MSME Member" class="msme-logo">
            </div>

            <div class="footer-col">
                <h5>Shop Online</h5>
                <p>Find us on Marketplaces:</p>
                <div class="footer-platforms">
                    <a href="#" class="platform-link"><img src="https://i.ibb.co/hRB8h7zS/Amazon-Logo-White-PNG.png" alt="Amazon"></a>
                    <a href="#" class="platform-link"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Meesho_logo.png/250px-Meesho_logo.png" alt="Meesho"></a>
                    <a href="#" class="platform-link"><img src="https://i.ibb.co/HT14SWjR/tradeindia-logo-rounded-glossy-icon-with-transparent-background-free-png.webp" alt="TradeIndia"></a>
                </div>
            </div>

            <div class="footer-col">
                <h5>Contact Us</h5>
                <p>Shiv Kala Bhawan, Maharshi Menhi Nagar, Madhepura, Bihar 852113</p>
                <p>Email: support@lovelybites.online</p>
            </div>

            <div class="footer-bottom">
                &copy; 2026 Lovely Bites. All Rights Reserved.
            </div>
        </div>
    </footer>
`;


// ==========================================
// 4. INTERACTION SCRIPTS (BURGER & INTERACTIVE RESPONSIVE DROPDOWN CONTROLLER)
// ==========================================
const burgerBtn = document.getElementById('mobile-burger-trigger');
const navMenu = document.getElementById('navigation-drawer-menu');
const submenuToggle = document.getElementById('submenu-toggle-item');
const submenuParent = document.getElementById('submenu-parent-wrapper');
const megaMenu = document.getElementById('product-mega-dropdown');

// Toggle core navigation drawer menu layout on mobile instances
burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Toggle mobile execution engine specifically on lower breakpoints safely
submenuToggle.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        megaMenu.classList.toggle('mobile-open');
        submenuParent.classList.toggle('open-caret');
    }
});

// Auto close drawers when specific relative links inside get clicked
document.querySelectorAll('.nav-link, .mega-item').forEach(link => {
    link.addEventListener('click', (e) => {
        // Prevent link execution closure if user is just trying to open products on mobile
        if(link.id === 'submenu-toggle-item' && window.innerWidth <= 768) {
            return;
        }
        burgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
        megaMenu.classList.remove('mobile-open');
        submenuParent.classList.remove('open-caret');
    });
});


// ==========================================
// 5. GOOGLE TRANSLATE FUNCTIONALITY CORE INTEGRATION
// ==========================================
function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
}

function changeLanguage(lang) {
    var selectField = document.querySelector("select.goog-te-combo");
    if (selectField) {
        selectField.value = lang;
        selectField.dispatchEvent(new Event('change'));
    }
}


// ==========================================
// 6. GLOBAL PRODUCT IMAGE CAROUSEL/SLIDER LOGIC 
// ==========================================
function changeImage(btn, direction) {
    const container = btn.parentElement;
    const images = JSON.parse(container.getAttribute('data-images'));
    let currentIndex = parseInt(container.getAttribute('data-index'));
    const imgElement = container.querySelector('img');

    currentIndex += direction;

    if (currentIndex >= images.length) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = images.length - 1;
    }

    container.setAttribute('data-index', currentIndex);
    imgElement.src = images[currentIndex];
}


// ==========================================
// 7. EXTERNAL SCRIPT EXTRACTIONS (SAFE ASYNC APPEND LAYER)
// ==========================================
const transScript = document.createElement('script');
transScript.type = 'text/javascript';
transScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
document.body.appendChild(transScript);