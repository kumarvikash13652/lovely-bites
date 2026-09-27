// global-layout.js - Firestore se global settings aur Mega Menu fetch karne ke liye
import { db } from './firebase-config.js'; // Apne firebase config ka path check kar lena
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

async function loadGlobalConfig() {
    try {
        const docRef = doc(db, "settings", "global_config");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("Global Config Loaded:", data);

            // 1. Brand Name update karein agar DOM mein element ho
            const brandElements = document.querySelectorAll('.brand-name');
            brandElements.forEach(el => {
                if (data.brandName) el.textContent = data.brandName;
            });

            // 2. Logo update karein
            const logoElements = document.querySelectorAll('.brand-logo');
            logoElements.forEach(el => {
                if (data.logoUrl) el.src = data.logoUrl;
            });

            // 3. Mega Menu Links render karein
            renderMegaMenu(data.megaMenuLinks);

        } else {
            console.warn("No global_config document found!");
        }
    } catch (error) {
        console.error("Error loading global config:", error);
    }
}

function renderMegaMenu(links) {
    // Desktop aur Mobile dono ke mega menu containers ko target karein
    const megaMenuContainers = document.querySelectorAll('.mega-menu-container, .mobile-menu-links');
    
    if (!links || !Array.isArray(links)) return;

    megaMenuContainers.forEach(container => {
        container.innerHTML = ''; // Purana static content clear karein
        
        links.forEach(item => {
            const linkItem = document.createElement('a');
            linkItem.href = item.url || '#';
            linkItem.className = 'mega-menu-item flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-all';
            
            linkItem.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}" class="w-10 h-10 object-cover rounded-md shadow-sm">
                <span class="text-gray-800 font-medium text-sm">${item.name}</span>
            `;
            
            container.appendChild(linkItem);
        });
    });
}

// Page load hote hi function run hoga
document.addEventListener('DOMContentLoaded', () => {
    loadGlobalConfig();
});
