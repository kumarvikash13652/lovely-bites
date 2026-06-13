async function placeOrderAndPay() {
    console.log("Button click hua!");

    // 1. Data capture check
    const name = document.getElementById('name')?.value;
    const address = document.getElementById('address')?.value;
    const phone = document.getElementById('phone')?.value;
    const total = document.getElementById('order-total')?.innerText || "0";

    console.log("Form Values:", { name, address, phone, total });

    if (!name || !address || !phone) {
        alert("Bhai, saari details bharo!");
        return;
    }

    try {
        const db = firebase.firestore();
        const orderData = {
            name: name,
            address: address,
            phone: phone,
            total: total,
            status: "pending",
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        console.log("Database mein bheja ja raha data:", orderData);

        const docRef = await db.collection("orders").add(orderData);
        
        console.log("Order successfully likha gaya! ID:", docRef.id);
        
        window.location.href = `success.html?orderId=${docRef.id}`;
    } catch (e) {
        console.error("Error saving to database:", e);
        alert("Error: " + e.message);
    }
}