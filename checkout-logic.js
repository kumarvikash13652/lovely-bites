// checkout-logic.js

// 1. Firebase Ready hai ya nahi, check karne ka helper
async function getFirebase() {
    return new Promise((resolve) => {
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            resolve(firebase);
        } else {
            // Agar abhi load nahi hua, toh thoda wait karo
            const interval = setInterval(() => {
                if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
                    clearInterval(interval);
                    resolve(firebase);
                }
            }, 200);
        }
    });
}

// 2. Final Main Function
async function placeOrderAndPay() {
    // Input fields check karo
    const nameInput = document.getElementById('name')?.value;
    const addressInput = document.getElementById('address')?.value;
    const phoneInput = document.getElementById('phone')?.value;

    if (!nameInput || !addressInput || !phoneInput) {
        alert("Bhai, Name, Address aur Phone sab bharna zaroori hai!");
        return;
    }

    try {
        // Firebase ke ready hone ka wait karo
        const fb = await getFirebase();
        const db = fb.firestore();

        // Data pack karo
        const customerData = {
            name: nameInput,
            address: addressInput,
            phone: phoneInput,
            total: document.getElementById('order-total')?.innerText || "0",
            status: "pending",
            createdAt: fb.firestore.FieldValue.serverTimestamp()
        };

        // Firebase mein save karo
        const docRef = await db.collection("orders").add(customerData);
        
        console.log("Order saved successfully with ID: ", docRef.id);
        
        // Success page par redirect
        window.location.href = `success.html?orderId=${docRef.id}`;
        
    } catch (e) {
        console.error("Error saving order: ", e);
        alert("Error: " + e.message + ". Check karo ki Firebase init hua hai ya nahi.");
    }
}