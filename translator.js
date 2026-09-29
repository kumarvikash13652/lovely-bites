// translator.js

// 1. Dictionary (Aap yahan apne words aur unke translations daal sakte hain)
const translations = {
    "en": {
        "Home": "Home",
        "Products": "Products",
        "My Orders": "My Orders",
        "Login": "Login",
        "Logout": "Logout",
        "Cart": "Cart"
    },
    "hi": {
        "Home": "होम",
        "Products": "उत्पाद",
        "My Orders": "मेरे ऑर्डर्स",
        "Login": "लॉग इन",
        "Logout": "लॉग आउट",
        "Cart": "कार्ट"
    },
    "ta": {
        "Home": "முகப்பு",
        "Products": "தயாரிப்புகள்",
        "My Orders": "எனது ஆர்டர்கள்",
        "Login": "உள்நுழைய",
        "Logout": "வெளியேறு",
        "Cart": "வண்டி"
    },
    "ml": {
        "Home": "ഹോം",
        "Products": "ഉൽപ്പന്നങ്ങൾ",
        "My Orders": "എന്റെ ഓർഡറുകൾ",
        "Login": "ലോഗിൻ",
        "Logout": "പുറത്തുകടക്കുക",
        "Cart": "കാർട്ട്"
    },
    "kn": {
        "Home": "ಮುಖಪುಟ",
        "Products": "ಉತ್ಪನ್ನಗಳು",
        "My Orders": "ನನ್ನ ಆರ್ಡರ್‌ಗಳು",
        "Login": "ಲಾಗಿನ್",
        "Logout": "ಲಾಗ್ ಔಟ್",
        "Cart": "ಕಾರ್ಟ್"
    }
};

// 2. Language Change Function
function changeLanguage(lang) {
    localStorage.setItem('selected_lang', lang);
    applyTranslation(lang);
}

// 3. Automatic Text Replacement Engine (Bina HTML badle)
function applyTranslation(lang) {
    if (!translations[lang]) return;

    // Page ke saare text nodes ko scan karo
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node = walker.nextNode()) {
        let text = node.nodeValue.trim();
        if (text && translations[lang][text]) {
            node.nodeValue = node.nodeValue.replace(text, translations[lang][text]);
        }
    }
}

// 4. Page Load hote hi check karo ki kaun si language saved hai
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selected_lang');
    if (savedLang) {
        applyTranslation(savedLang);
    }
});
