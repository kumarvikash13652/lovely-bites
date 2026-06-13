async function placeOrderAndPay() {
    console.log("Button click hua!");

    const name = document.getElementById('name')?.value;
    const address = document.getElementById('address')?.value;
    const phone = document.getElementById('phone')?.value;

    if (!name || !address || !phone) {
        alert("Bhai, saari details bharo!");
        return;
    }

    try {
        const db = firebase.firestore();
        const docRef = await db.collection("orders").add({
            name: name,
            address: address,
            phone: phone,
            total: document.getElementById('order-total')?.innerText || "0",
            status: "pending",
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        window.location.href = `success.html?orderId=${docRef.id}`;
    } catch (e) {
        console.error("Error saving:", e);
        alert("Error: " + e.message);
    }
}