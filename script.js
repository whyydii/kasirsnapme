// Data katalog dan addons
const catalogItems = [ /* sama seperti sebelumnya */ ];
const addonItems = [ /* sama seperti sebelumnya */ ];
const minumanItems = [ /* sama seperti sebelumnya */ ];
const snackItems = [ /* sama seperti sebelumnya */ ];

// Referensi element
const containerCatalog = document.getElementById('catalog');
const containerAddon = document.getElementById('addons');
const containerMinuman = document.getElementById('minuman');
const containerSnack = document.getElementById('snack');
const totalPriceEl = document.getElementById('totalPrice');
const receiptEl = document.getElementById('receipt');
const btnGenerateReceipt = document.getElementById('generateReceipt');

// Format angka
function formatRupiah(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Membuat input item jumlah
function createItemInput(item, container) {
    const label = document.createElement('label');
    label.htmlFor = item.id;

    const nameSpan = document.createElement('span');
    nameSpan.textContent = item.name;

    const priceSpan = document.createElement('span');
    priceSpan.className = 'price';
    priceSpan.textContent = `Rp ${formatRupiah(item.price)}`;

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.min = 0;
    qtyInput.id = item.id;
    qtyInput.name = 'item';
    qtyInput.value = 0;
    qtyInput.dataset.price = item.price;
    qtyInput.classList.add('qty-input');

    label.appendChild(nameSpan);
    label.appendChild(priceSpan);
    label.appendChild(qtyInput);

    container.appendChild(label);
}

// Render produk
catalogItems.forEach(i => createItemInput(i, containerCatalog));
addonItems.forEach(i => createItemInput(i, containerAddon));
minumanItems.forEach(i => createItemInput(i, containerMinuman));
snackItems.forEach(i => createItemInput(i, containerSnack));

// Hitung total
function updateTotal() {
    const inputs = document.querySelectorAll('input[name="item"]');
    let total = 0;
    inputs.forEach(inp => {
        const qty = parseInt(inp.value);
        const price = parseInt(inp.dataset.price);
        if (qty > 0) total += qty * price;
    });
    totalPriceEl.textContent = formatRupiah(total);
}

// Event listener
document.body.addEventListener('input', e => {
    if (e.target.name === 'item') {
        updateTotal();
        receiptEl.style.display = 'none';
    }
});

// Generate teks nota
function generateReceiptText() {
    const inputs = document.querySelectorAll('input[name="item"]');
    const allItems = [...catalogItems, ...addonItems, ...minumanItems, ...snackItems];
    let text = '=== Nota Pembayaran SnapMe Studio ===\n\n';
    let total = 0;
    let adaIsi = false;

    inputs.forEach(inp => {
        const qty = parseInt(inp.value);
        if (qty > 0) {
            const item = allItems.find(i => i.id === inp.id);
            const subTotal = qty * item.price;
            text += `${item.name} x ${qty}:\tRp ${formatRupiah(subTotal)}\n`;
            total += subTotal;
            adaIsi = true;
        }
    });

    if (!adaIsi) {
        alert('Mohon pilih minimal satu item untuk membuat nota.');
        return null;
    }

    text += '\n----------------------------\n';
    text += `TOTAL:\tRp ${formatRupiah(total)}\n`;
    text += '\nTerima kasih telah menggunakan layanan SnapMe Studio!';
    return text;
}

// Generate PDF
btnGenerateReceipt.addEventListener('click', () => {
    const receiptText = generateReceiptText();
    if (receiptText === null) return;
    receiptEl.textContent = receiptText;
    receiptEl.style.display = 'block';

    const jsPDF = window.jspdf.jsPDF;
    const doc = new jsPDF();
    doc.setFont("courier", "normal");
    doc.setFontSize(12);
    doc.text(receiptText, 10, 10);
    doc.save(`nota-snapme-${Date.now()}.pdf`);
});

// Inisialisasi
updateTotal();
