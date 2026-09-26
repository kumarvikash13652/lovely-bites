async function placeOrderAndPay() {
    console.log("Button click hua!");

    // 1. Data capture check (Matching checkout.html IDs)
    const name = document.getElementById('name')?.value;
    const email = document.getElementById('email')?.value;
    const address1 = document.getElementById('address1')?.value;
    const address2 = document.getElementById('address2')?.value;
    const city = document.getElementById('city')?.value;
    const pincode = document.getElementById('pincode')?.value;
    const phone = document.getElementById('phone')?.value;
    const paymentMethod = document.getElementById('paymentMethod')?.value || "cod";

    console.log("Form Values:", { name, email, address1, city, phone, paymentMethod });

    if (!name || !email || !address1 || !city || !pincode || !phone) {
        alert("Bhai, saari details bharo!");
        return;
    }

    if (!authUser) {
        alert("Pehle login karo!");
        window.location.href = "login.html";
        return;
    }

    try {
        const db = firebase.firestore();
        
        // Fetch cart items to calculate total and save items
        const cartRef = db.collection("users").doc(authUser.uid).collection("cart");
        const cartSnapshot = await cartRef.get();

        if (cartSnapshot.empty) {
            alert("Aapka cart khaali hai!");
            return;
        }

        let orderItems = [], totalAmount = 0;
        cartSnapshot.forEach(doc => {
            const item = doc.data();
            const subtotal = parseFloat(item.price) * parseInt(item.qty);
            orderItems.push({ productName: item.productName, qty: item.qty, price: item.price });
            totalAmount += subtotal;
        });

        const orderData = {
            userId: authUser.uid,
            name: name,
            email: email,
            phone: phone,
            address: `${address1}, ${address2}, ${city} - ${pincode}`,
            items: orderItems,
            total: totalAmount,
            paymentMethod: paymentMethod,
            paymentStatus: paymentMethod === "cod" ? "Pending" : "Success",
            status: "Pending",
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        console.log("Database mein bheja ja raha data:", orderData);

        // Save order to Firestore
        const docRef = await db.collection("orders").add(orderData);
        console.log("Order successfully likha gaya! ID:", docRef.id);
        
        // Clear User Cart
        const batch = db.batch();
        cartSnapshot.forEach(doc => batch.delete(doc.ref));
        await batch.commit();

        // Redirect to Success Page
        window.location.href = `success.html?orderId=${docRef.id}`;

    } catch (e) {
        console.error("Error saving to database:", e);
        alert("Error: " + e.message);
    }
}
