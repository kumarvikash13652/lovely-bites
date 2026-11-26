function escapeInvoiceText(value) {
    return String(value ?? '').replace(/[&<>"']/g, function (ch) {
        return {
            '&': '&',
            '<': '<',
            '>': '>',
            '"': '"',
            "'": '''
        }[ch];
    });
}

function invRound2(num) {
    const n = Number(num);
    if (!isFinite(n) || isNaN(n)) return 0;
    return Math.round((n + Number.EPSILON) * 100) / 100;
}

function invNormalizeKey(val) {
    return String(val || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
}

function parseTaxPercentValue(raw) {
    if (raw === undefined || raw === null || raw === "") return null;
    if (typeof raw === "number") {
        return isFinite(raw) && raw >= 0 && raw <= 100 ? invRound2(raw) : null;
    }
    const match = String(raw).trim().match(/(\d+(?:\.\d+)?)/);
    if (!match) return null;
    const num = Number(match[1]);
    return !isNaN(num) && isFinite(num) && num >= 0 && num <= 100 ? invRound2(num) : null;
}

async function fetchProductTaxRatesMap() {
    const mapByKey = new Map();

    const indexProductDoc = (docId, p) => {
        if (!p || typeof p !== "object") return;
        const rate = parseTaxPercentValue(
            p.taxPercent ?? p.tax_percent ?? p.gstRate ?? p.gst_rate ?? p.gstPercent ?? p.gst_percent
        );
        if (rate === null) return;

        const keys = [
            docId,
            p.id,
            p.productId,
            p.product_id,
            p.sku,
            p.productSku,
            p.product_sku,
            p.code,
            p.name,
            p.productName,
            p.product_name,
            p.title
        ]
            .filter(Boolean)
            .map((k) => String(k).trim().toLowerCase());

        for (const k of keys) {
            mapByKey.set(k, rate);
            mapByKey.set(invNormalizeKey(k), rate);
        }
    };

    try {
        if (window.firebase && typeof window.firebase.firestore === "function") {
            const snap = await window.firebase.firestore().collection("products").get();
            snap.forEach((doc) => indexProductDoc(doc.id, doc.data()));
            return mapByKey;
        }
    } catch (_) {}

    try {
        if (window.__lbFirestoreMod && window.__lbFirestoreDb) {
            const { collection, getDocs } = window.__lbFirestoreMod;
            const snap = await getDocs(collection(window.__lbFirestoreDb, "products"));
            snap.forEach((doc) => indexProductDoc(doc.id, doc.data()));
            return mapByKey;
        }
    } catch (_) {}

    return mapByKey;
}

function resolveItemTaxRateFromMap(item, order, rateMap, idx) {
    const directRate = parseTaxPercentValue(
        item?.taxPercent ?? item?.tax_percent ?? item?.gstRate ?? item?.gst_rate ?? item?.gstPercent ?? item?.gst_percent
    );
    if (directRate !== null) return directRate;

    if (Array.isArray(order?.taxBreakup?.itemTaxRates) && order.taxBreakup.itemTaxRates[idx] !== undefined) {
        const fromBreakup = parseTaxPercentValue(order.taxBreakup.itemTaxRates[idx]);
        if (fromBreakup !== null) return fromBreakup;
    }

    const candidates = [
        item?.id,
        item?.productId,
        item?.product_id,
        item?.sku,
        item?.productSku,
        item?.product_sku,
        item?.code,
        item?.productName,
        item?.product_name,
        item?.name,
        item?.title
    ]
        .filter(Boolean)
        .map((c) => String(c).trim().toLowerCase());

    for (const c of candidates) {
        if (rateMap.has(c)) return rateMap.get(c);
        const nc = invNormalizeKey(c);
        if (rateMap.has(nc)) return rateMap.get(nc);
    }

    const orderRate = parseTaxPercentValue(order?.taxPercent ?? order?.gstRate ?? order?.gstPercent);
    return orderRate !== null ? orderRate : 0;
}

async function downloadOrderPdfInvoice(orderId) {
    const store = window.ordersStore || window.ordersById || {};
    const order = store[orderId];

    if (!order) {
        alert("Invoice data nahi mila. Page refresh karke dobara try karein.");
        return;
    }

    const rateMap = await fetchProductTaxRatesMap();
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

    const rawItems = Array.isArray(order.items) ? order.items : [];
    const fallbackTotal = invRound2(order.totalAmount || order.total || 0);

    let itemsRowsHtml = "";
    let computedTaxable = 0;
    let computedTax = 0;
    let computedTotal = 0;

    if (rawItems.length > 0) {
        const rawSubtotal = rawItems.reduce((sum, item) => {
            const qty = Math.max(1, Number(item.qty || item.quantity || 1));
            const unitPrice = Number(item.price ?? item.rrp ?? item.mrp ?? 0);
            return sum + (isNaN(unitPrice) || unitPrice < 0 ? 0 : unitPrice * qty);
        }, 0);

        const targetTotal = fallbackTotal > 0 ? fallbackTotal : invRound2(rawSubtotal);
        const scaleFactor = rawSubtotal > 0 ? targetTotal / rawSubtotal : 0;
        let allocatedTotal = 0;

        rawItems.forEach(function (item, idx) {
            const qty = Math.max(1, Number(item.qty || item.quantity || 1));
            const unitPrice = Number(item.price ?? item.rrp ?? item.mrp ?? 0);
            const safeUnitPrice = isNaN(unitPrice) || unitPrice < 0 ? 0 : unitPrice;
            const taxRate = resolveItemTaxRateFromMap(item, order, rateMap, idx);

            let lineTotal;
            if (idx === rawItems.length - 1) {
                lineTotal = invRound2(Math.max(0, targetTotal - allocatedTotal));
            } else {
                lineTotal = rawSubtotal > 0
                    ? invRound2(safeUnitPrice * qty * scaleFactor)
                    : (idx === 0 ? targetTotal : 0);
                allocatedTotal = invRound2(allocatedTotal + lineTotal);
            }

            const lineTaxable = taxRate > 0 ? invRound2(lineTotal / (1 + taxRate / 100)) : invRound2(lineTotal);
            const lineTax = invRound2(Math.max(0, lineTotal - lineTaxable));
            const halfTaxRate = invRound2(taxRate / 2);
            const halfTaxAmt = invRound2(lineTax / 2);

            computedTaxable = invRound2(computedTaxable + lineTaxable);
            computedTax = invRound2(computedTax + lineTax);
            computedTotal = invRound2(computedTotal + lineTotal);

            const safeName = escapeInvoiceText(item.productName || item.name || item.title || `Item ${idx + 1}`);
            const safeSku = escapeInvoiceText(item.sku || item.productSku || item.id || "");

            itemsRowsHtml += `
                <tr>
                    <td>${idx + 1}</td>
                    <td>
                        <div><strong>${safeName}</strong></div>
                        <div style="font-size:11px;color:#555;">
                            ${safeSku ? `SKU/ID: ${safeSku} | ` : ""}GST ${taxRate}% (CGST ${halfTaxRate}%: ₹${halfTaxAmt.toFixed(2)} + SGST ${halfTaxRate}%: ₹${halfTaxAmt.toFixed(2)})
                        </div>
                    </td>
                    <td style="text-align:center;">${qty}</td>
                    <td style="text-align:right;">₹${lineTaxable.toFixed(2)}</td>
                    <td style="text-align:right;">₹${lineTax.toFixed(2)} (${taxRate}%)</td>
                    <td style="text-align:right;">₹${lineTotal.toFixed(2)}</td>
                </tr>
            `;
        });
    } else {
        const singleRate = parseTaxPercentValue(order?.taxBreakup?.gstRatePercent ?? order?.taxPercent) ?? 0;
        computedTotal = fallbackTotal;
        computedTaxable = singleRate > 0 ? invRound2(computedTotal / (1 + singleRate / 100)) : computedTotal;
        computedTax = invRound2(Math.max(0, computedTotal - computedTaxable));

        itemsRowsHtml = `
            <tr>
                <td>1</td>
                <td>Order Items</td>
                <td style="text-align:center;">1</td>
                <td style="text-align:right;">₹${computedTaxable.toFixed(2)}</td>
                <td style="text-align:right;">₹${computedTax.toFixed(2)} (${singleRate}%)</td>
                <td style="text-align:right;">₹${computedTotal.toFixed(2)}</td>
            </tr>
        `;
    }

    const useSavedBreakup = order && order.taxBreakup && typeof order.taxBreakup === "object"
        && order.taxBreakup.subtotal !== undefined
        && order.taxBreakup.totalTaxAmount !== undefined;

    const finalTaxableAmount = useSavedBreakup ? invRound2(order.taxBreakup.subtotal) : computedTaxable;
    const finalTaxAmount = useSavedBreakup ? invRound2(order.taxBreakup.totalTaxAmount) : computedTax;
    const finalTotalAmount = useSavedBreakup && order.taxBreakup.grandTotal !== undefined
        ? invRound2(order.taxBreakup.grandTotal)
        : (fallbackTotal > 0 ? fallbackTotal : computedTotal);
    const finalCgstAmount = useSavedBreakup && order.taxBreakup.cgstAmount !== undefined
        ? invRound2(order.taxBreakup.cgstAmount)
        : invRound2(finalTaxAmount / 2);
    const finalSgstAmount = useSavedBreakup && order.taxBreakup.sgstAmount !== undefined
        ? invRound2(order.taxBreakup.sgstAmount)
        : invRound2(finalTaxAmount - finalCgstAmount);

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
  .summary-box { width: 320px; margin-left: auto; font-size: 13px; }
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
          <th style="text-align:right;">Tax</th>
          <th style="text-align:right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRowsHtml}
      </tbody>
    </table>

    <div class="summary-box">
      <div class="summary-line"><span>Taxable Amount:</span><span>₹${finalTaxableAmount.toFixed(2)}</span></div>
      <div class="summary-line"><span>CGST:</span><span>₹${finalCgstAmount.toFixed(2)}</span></div>
      <div class="summary-line"><span>SGST:</span><span>₹${finalSgstAmount.toFixed(2)}</span></div>
      <div class="summary-line"><span>Total Tax:</span><span>₹${finalTaxAmount.toFixed(2)}</span></div>
      <div class="summary-line summary-total"><span>Total Paid:</span><span>₹${finalTotalAmount.toFixed(2)}</span></div>
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
