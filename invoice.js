function escapeInvoiceText(value) {
    return String(value ?? '').replace(/[&<>"']/g, function (ch) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[ch];
    });
}

function downloadOrderPdfInvoice(orderId) {
    const store = window.ordersStore || window.ordersById || {};
    const order = store[orderId];

    if (!order) {
        alert("Invoice data nahi mila. Page refresh karke dobara try karein.");
        return;
    }

    const displayOrderId = order.orderNumber || order.numericOrderId || order.orderId || String(orderId).substring(0, 10);

    let dateStr = "Recent";
    if (order.createdAt && typeof order.createdAt.toDate === "function") {
        dateStr = order.createdAt.toDate().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    } else if (order.timestamp && typeof order.timestamp.toDate === "function") {
        dateStr = order.timestamp.toDate().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    const totalAmountNum = Number(order.totalAmount || order.total || 0);
    const taxableAmount = totalAmountNum / 1.05;
    const taxAmount = totalAmountNum - taxableAmount;

    let itemsRowsHtml = "";
    if (Array.isArray(order.items) && order.items.length > 0) {
        order.items.forEach(function (item, idx) {
            const qty = Number(item.qty || item.quantity || 1);
            const lineTotal = Number(item.price || 0) * qty;
            const lineTaxable = lineTotal / 1.05;
            const lineTax = lineTotal - lineTaxable;

            itemsRowsHtml += `
                <tr>
                    <td>${idx + 1}</td>
                    <td>${escapeInvoiceText(item.productName || item.name || "Product")}</td>
                    <td style="text-align:center;">${qty}</td>
                    <td style="text-align:right;">₹${lineTaxable.toFixed(2)}</td>
                    <td style="text-align:right;">₹${lineTax.toFixed(2)}</td>
                    <td style="text-align:right;">₹${lineTotal.toFixed(2)}</td>
                </tr>
            `;
        });
    } else {
        itemsRowsHtml = `
            <tr>
                <td>1</td>
                <td>Order Items</td>
                <td style="text-align:center;">1</td>
                <td style="text-align:right;">₹${taxableAmount.toFixed(2)}</td>
                <td style="text-align:right;">₹${taxAmount.toFixed(2)}</td>
                <td style="text-align:right;">₹${totalAmountNum.toFixed(2)}</td>
            </tr>
        `;
    }

    const customerGstinHtml = order.customerGstin
        ? `<p style="margin:3px 0;"><strong>Customer GSTIN:</strong> ${escapeInvoiceText(order.customerGstin)}</p>`
        : "";

    const invoiceWin = window.open("", "_blank");
    if (!invoiceWin) {
        alert("Popup block hai. PDF invoice ke liye browser mein popup allow karein.");
        return;
    }

    const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Invoice #${escapeInvoiceText(displayOrderId)} - Lovely Bites</title>
<style>
  body { font-family: Arial, sans-serif; margin: 24px; color: #222; background: #fff; }
  .inv-card { max-width: 780px; margin: 0 auto; border: 1px solid #ddd; padding: 24px; border-radius: 8px; }
  .inv-top { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e31e24; padding-bottom: 14px; margin-bottom: 16px; gap: 14px; }
  .brand-box { display: flex; align-items: center; gap: 12px; }
  .brand-box img { height: 56px; width: auto; }
  .inv-meta { text-align: right; font-size: 13px; }
  .party-row { display: flex; justify-content: space-between; gap: 20px; font-size: 13px; margin-bottom: 18px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px; }
  th, td { border: 1px solid #ddd; padding: 8px; }
  th { background: #f7f7f7; text-align: left; }
  .summary-box { width: 310px; margin-left: auto; font-size: 13px; }
  .summary-line { display: flex; justify-content: space-between; padding: 4px 0; }
  .summary-total { font-weight: bold; font-size: 15px; border-top: 1px solid #333; margin-top: 6px; padding-top: 8px; color: #e31e24; }
  .inv-footer { margin-top: 20px; padding-top: 12px; border-top: 1px dashed #ccc; font-size: 12px; color: #444; }
  @media print { .no-print { display: none; } body { margin: 0; } .inv-card { border: none; padding: 0; } }
</style>
</head>
<body>
  <div class="no-print" style="max-width:780px;margin:0 auto 12px auto;text-align:right;">
    <button id="printPdfActionBtn" style="background:#0054a6;color:#fff;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;font-weight:bold;">Save / Print PDF</button>
  </div>
  <div class="inv-card">
    <div class="inv-top">
      <div class="brand-box">
        <img src="https://i.ibb.co/mFyGcMzs/Whats-App-Image-2026-04-21-at-12-22-57-removebg-preview.png" alt="Lovely Bites">
        <div>
          <h2 style="margin:0;color:#0054a6;">Lovely Bites</h2>
          <div style="font-size:12px;">K L ENTERPRISE</div>
          <div style="font-size:12px;">GSTIN: <strong>10JQBPK5246N1ZO</strong> | FSSAI: <strong>20426290000095</strong></div>
          <div style="font-size:12px;">Shiv Kala Bhawan, Maharshi Menhi Nagar, Madhepura, Bihar 852113</div>
          <div style="font-size:12px;">Email: support@lovelybites.online | Phone: +91 9546773070</div>
        </div>
      </div>
      <div class="inv-meta">
        <div><strong>INVOICE</strong></div>
        <div>Order ID: <strong>#${escapeInvoiceText(displayOrderId)}</strong></div>
        <div>Date: ${escapeInvoiceText(dateStr)}</div>
        <div>Status: ${escapeInvoiceText(order.paymentStatus || order.orderStatus || "Paid")}</div>
      </div>
    </div>

    <div class="party-row">
      <div style="width:48%;">
        <strong>Billed / Shipped To:</strong>
        <p style="margin:4px 0;"><strong>${escapeInvoiceText(order.customerName || "N/A")}</strong></p>
        <p style="margin:3px 0;">Phone: ${escapeInvoiceText(order.customerPhone || "N/A")}</p>
        <p style="margin:3px 0;">Address: ${escapeInvoiceText(order.shippingAddress || order.address || "N/A")}</p>
        ${customerGstinHtml}
      </div>
      <div style="width:48%;text-align:right;">
        <strong>Payment Details:</strong>
        <p style="margin:4px 0;">Method: ${escapeInvoiceText((order.paymentMethod || "Online").toUpperCase())}</p>
        <p style="margin:3px 0;">Status: ${escapeInvoiceText((order.paymentStatus || "Paid").toUpperCase())}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Item</th>
          <th style="text-align:center;">Qty</th>
          <th style="text-align:right;">Taxable</th>
          <th style="text-align:right;">Tax (5%)</th>
          <th style="text-align:right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRowsHtml}
      </tbody>
    </table>

    <div class="summary-box">
      <div class="summary-line"><span>Taxable Amount:</span><span>₹${taxableAmount.toFixed(2)}</span></div>
      <div class="summary-line"><span>Tax (5%):</span><span>₹${taxAmount.toFixed(2)}</span></div>
      <div class="summary-line summary-total"><span>Total Paid:</span><span>₹${totalAmountNum.toFixed(2)}</span></div>
    </div>

    <div class="inv-footer">
      <p style="margin:0 0 4px 0;font-weight:bold;color:#b7171c;">This order is non-refundable.</p>
      <p style="margin:0;">Lovely Bites (K L ENTERPRISE) | Shiv Kala Bhawan, Maharshi Menhi Nagar, Madhepura, Bihar 852113 | support@lovelybites.online | +91 9546773070</p>
    </div>
  </div>
</body>
</html>`;

    invoiceWin.document.open();
    invoiceWin.document.write(htmlDoc);
    invoiceWin.document.close();

    const printBtn = invoiceWin.document.getElementById("printPdfActionBtn");
    if (printBtn) {
        printBtn.onclick = function () {
            invoiceWin.print();
        };
    }

    setTimeout(function () {
        try {
            invoiceWin.focus();
            invoiceWin.print();
        } catch (err) {}
    }, 300);
}
