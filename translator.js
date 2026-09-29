// translator.js

const translations = {
    "en": {
        "Home": "Home",
        "Products": "Products",
        "My Orders": "My Orders",
        "Login": "Login",
        "Logout": "Logout",
        "Cart": "Cart",
        "Choose Your Language": "Choose Your Language"
    },
    "hi": {
        "Home": "होम",
        "Products": "उत्पाद",
        "My Orders": "मेरे ऑर्डर्स",
        "Login": "लॉग इन",
        "Logout": "लॉग आउट",
        "Cart": "कार्ट",
        "Choose Your Language": "अपनी भाषा चुनें"
    },
    "ta": {
        "Home": "முகப்பு",
        "Products": "தயாரிப்புகள்",
        "My Orders": "எனது ஆர்டர்கள்",
        "Login": "உள்நுழைய",
        "Logout": "வெளியேறு",
        "Cart": "வண்டி",
        "Choose Your Language": "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்"
    },
    "ml": {
        "Home": "ഹോം",
        "Products": "ഉൽപ്പന്നങ്ങൾ",
        "My Orders": "എന്റെ ഓർഡറുകൾ",
        "Login": "ലോഗിൻ",
        "Logout": "പുറത്തുകടക്കുക",
        "Cart": "കാർട്ട്",
        "Choose Your Language": "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക"
    },
    "kn": {
        "Home": "ಮುಖಪುಟ",
        "Products": "ಉತ್ಪನ್ನಗಳು",
        "My Orders": "ನನ್ನ ಆರ್ಡರ್‌ಗಳು",
        "Login": "ಲಾಗಿನ್",
        "Logout": "ಲಾಗ್ ಔಟ್",
        "Cart": "ಕಾರ್ಟ್",
        "Choose Your Language": "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ"
    }
};

// 1. Automatically Language Modal Create karo aur DOM mein inject karo
function createLanguageModal() {
    if (localStorage.getItem('selected_lang')) return; // Agar pehle se select hai toh popup mat dikhao

    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'auto-lang-modal';
    modalOverlay.style.cssText = "position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; justify-content:center; align-items:center; z-index:999999; backdrop-filter: blur(4px);";

    modalOverlay.innerHTML = `
        <div style="background:white; padding:30px; border-radius:16px; text-align:center; max-width:400px; width:90%; box-shadow: 0 15px 35px rgba(0,0,0,0.2);">
            <h3 style="margin-top:0; margin-bottom:8px; color:#2d2926; font-size: 22px; font-weight:800;">Choose Your Language</h3>
            <p style="margin-bottom:22px; font-size:13px; color:#666;">अपनी भाषा चुनें / ഭാഷ തിരഞ്ഞെടുക്കുക / ভাষা বেছে নিন</p>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                <button onclick="selectAndApplyLang('en')" style="padding:12px; background:#0054a6; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; font-size:14px;">English</button>
                <button onclick="selectAndApplyLang('hi')" style="padding:12px; background:#e31e24; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; font-size:14px;">हिंदी</button>
                <button onclick="selectAndApplyLang('ta')" style="padding:12px; background:#f58220; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; font-size:14px;">தமிழ்</button>
                <button onclick="selectAndApplyLang('ml')" style="padding:12px; background:#28a745; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; font-size:14px;">മലയാളം</button>
                <button onclick="selectAndApplyLang('kn')" style="padding:12px; background:#6f42c1; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; font-size:14px; grid-column: span 2;">ಕನ್ನಡ</button>
            </div>
        </div>
    `;
    document.body.appendChild(modalOverlay);
}

// 2. Language Select karne par popup hatega aur translate hoga
function selectAndApplyLang(lang) {
    localStorage.setItem('selected_lang', lang);
    const modal = document.getElementById('auto-lang-modal');
    if (modal) modal.remove();
    applyTranslation(lang);
}

// 3. Text Replacement Engine
function applyTranslation(lang) {
    if (!translations[lang]) return;

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node = walker.nextNode()) {
        let text = node.nodeValue.trim();
        if (text && translations[lang][text]) {
            node.nodeValue = node.nodeValue.replace(text, translations[lang][text]);
        }
    }
}

// 4. Page Load hote hi check karo
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selected_lang');
    if (savedLang) {
        applyTranslation(savedLang);
    } else {
        createLanguageModal();
    }
});
