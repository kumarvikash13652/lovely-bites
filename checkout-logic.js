// checkout-logic.js

// Firebase se Order save karne ka function
window.saveOrderToFirebase = async function(orderDetails) {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert("Please login to place order!");
        return;
    }

    try {
        const db = firebase.firestore();
        await db.collection("orders").add({
            userId: user.uid,
            items: orderDetails.items,
            totalAmount: orderDetails.total,
            status: "pending",
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log("Order saved successfully!");
        // Yahan tum payment gateway ya success message trigger kar sakte ho
        alert("Order received! Proceeding to payment...");
    } catch (error) {
        console.error("Error saving order: ", error);
        alert("Something went wrong. Please try again.");
    }
};

// Payment trigger karne ka function
window.initiatePayment = function(amount) {
    // Yahan apna Payment Gateway (Razorpay/UPI) ka logic dalna
    console.log("Initiating payment for: ₹" + amount);
    // window.location.href = "payment-page-link";
};

function processMyOrder() {
    alert("Success! Button click ho gaya, ab logic chal raha hai.");
    console.log("Order processing started...");
}

async function saveOrderData(customerData) {
    const user = firebase.auth().currentUser;
    const db = firebase.firestore();

    // Order object banao
    const orderRef = await db.collection("orders").add({
        userId: user ? user.uid : "guest",
        customerName: customerData.name,
        address: customerData.address,
        phone: customerData.phone,
        items: customerData.cartItems,
        total: customerData.total,
        status: "pending", // Payment se pehle 'pending'
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    return orderRef.id; // Humne order ID return kar di
}


async function placeOrderAndPay() {
    // 1. Form se data uthao
    const customerData = {
        name: document.getElementById('name').value,
        address: document.getElementById('address').value,
        phone: document.getElementById('phone').value,
        total: document.getElementById('order-total').innerText, // Ya jo bhi variable hai
        cartItems: ["Makhana", "Sattu"] // Yahan apne cart ka logic dalna
    };

    // 2. Firebase mein save karo
    const db = firebase.firestore();
    try {
        const docRef = await db.collection("orders").add({
            ...customerData,
            status: "pending",
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // 3. Payment Option trigger karo (Jo tumne decide kiya hai)
        // Yahan tum UPI ya Cashfree trigger karoge
        // Payment success hone par ye line chalani hai:
        window.location.href = `success.html?orderId=${docRef.id}`;
        
    } catch (e) {
        alert("Order save nahi ho paaya: " + e.message);
    }
}

async function placeOrderAndPay() {
    // 1. User se details lo
    const nameInput = document.getElementById('name').value;
    const addressInput = document.getElementById('address').value;
    const phoneInput = document.getElementById('phone').value;

    if (!nameInput || !addressInput || !phoneInput) {
        alert("Bhai, saari details bharo!");
        return;
    }

    // 2. Data pack karo
    const customerData = {
        name: nameInput,
        address: addressInput,
        phone: phoneInput,
        total: document.getElementById('order-total').innerText,
        status: "pending",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    // 3. Firebase mein save karo
    const db = firebase.firestore();
    try {
        const docRef = await db.collection("orders").add(customerData);
        
        console.log("Order saved with ID: ", docRef.id);
        
        // 4. Redirect to success page with ID
        window.location.href = `success.html?orderId=${docRef.id}`;
        
    } catch (e) {
        console.error("Error saving order: ", e);
        alert("Order save nahi ho paaya: " + e.message);
    }
}