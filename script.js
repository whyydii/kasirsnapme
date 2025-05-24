// ====================
// Data Item
// ====================
const catalogItems = [
    { id: 'basic', name: 'Studio Basic', price: 50000 },
    { id: 'basicTirai', name: 'Basic Tirai', price: 60000 },
    { id: 'spotLight', name: 'Spot Light', price: 50000 },
    { id: 'mrtStudio', name: 'MRT Studio', price: 50000 },
    { id: 'photoBox', name: 'Photobox', price: 60000 },
];

const addonItems = [
    { id: 'A', name: 'Cetak Foto Tipe A', price: 10000 },
    { id: 'B', name: 'Cetak Foto Tipe B', price: 15000 },
    { id: 'C', name: 'Cetak Foto Tipe C', price: 10000 },
    { id: 'D', name: 'Cetak Foto Tipe D', price: 15000 },
];

const minumanItems = [
    { id: 'aqua', name: 'Aqua', price: 4000 },
    { id: 'pucukHarum', name: 'Pucuk Harum', price: 5000 },
    { id: 'frutea', name: 'Frutea', price: 5000 },
    { id: 'floridina', name: 'Floridina', price: 4000 },
    { id: 'cocaCola', name: 'Coca Cola', price: 5000 },
    { id: 'sprite', name: 'Sprite', price: 5000 },
    { id: 'susuUltra', name: 'Susu Ultra', price: 5000 },
    { id: 'milku', name: 'Milku', price: 5000 },
    { id: 'pocari', name: 'Pocari', price: 8000 },
    { id: 'goodday', name: 'Goodday', price: 8000 },
    { id: 'golda', name: 'Golda', price: 5000 },
    { id: 'chimory', name: 'Chimory', price: 8000 },
    { id: 'tehKotak', name: 'Teh Kotak', price: 5000 },
];

const snackItems = [
    { id: 'chitato', name: 'Chitato', price: 2500 },
    { id: 'chikiBall', name: 'Chiki Ball', price: 2500 },
    { id: 'bengBeng', name: 'Beng Beng', price: 2500 },
    { id: 'tanggo', name: 'Tanggo', price: 2500 },
];

// ====================
// Referensi Elemen HTML
// ====================
const containerCatalog = document.getElementById('catalog');
const containerAddon = document.getElementById('addons');
const containerMinuman = document.getElementById('minuman');
const containerSnack = document.getElementById('snack');
const totalPriceEl = document.getElementById('totalPrice');
const receiptEl = document.getElementById('receipt');
const btnGenerateReceipt = document.getElementById('generateReceipt');
const inputCustomerName = document.getElementById('customerName');
const selectPaymentMethod = document.getElementById('paymentMethod');

// ====================
// Fungsi Utilitas
// ====================
function formatRupiah(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getCurrentDate() {
    return new Date().toLocaleDateString("id-ID", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function createItemInput(item, container) {
    const label = document.createElement('label');
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

function renderAllItems() {
    catalogItems.forEach(item => createItemInput(item, containerCatalog));
    addonItems.forEach(item => createItemInput(item, containerAddon));
    minumanItems.forEach(item => createItemInput(item, containerMinuman));
    snackItems.forEach(item => createItemInput(item, containerSnack));
}

function updateTotal() {
    const inputs = document.querySelectorAll('input[name="item"]');
    let total = 0;

    inputs.forEach(input => {
        const qty = parseInt(input.value);
        const price = parseInt(input.dataset.price);
        if (qty > 0) {
            total += qty * price;
        }
    });

    totalPriceEl.textContent = formatRupiah(total);
}

// ========== Nota Text ========== //
function generateReceiptText(name, method) {
    const inputs = document.querySelectorAll('input[name="item"]');
    const allItems = [...catalogItems, ...addonItems, ...minumanItems, ...snackItems];

    let text = '=== Nota Pembayaran SnapMe Studio ===\n\n';
    text += `Nama Customer : ${name}\n`;
    text += `Metode Bayar  : ${method}\n`;
    text += `Tanggal       : ${getCurrentDate()}\n\n`;

    let total = 0;
    let adaItem = false;

    text += 'Item                          Total\n';
    text += '-'.repeat(42) + '\n';

    inputs.forEach(input => {
        const qty = parseInt(input.value);
        if (qty > 0) {
            const item = allItems.find(i => i.id === input.id);
            const subTotal = qty * item.price;
            const namaItem = `${item.name} x ${qty}`.padEnd(30);
            const hargaItem = `Rp ${formatRupiah(subTotal)}`.padStart(10);
            text += `${namaItem}${hargaItem}\n`;
            total += subTotal;
            adaItem = true;
        }
    });

    if (!adaItem) return null;

    text += '-'.repeat(42) + '\n';
    text += `TOTAL`.padEnd(30) + `Rp ${formatRupiah(total)}\n\n`;
    text += 'Snap Me Self Photo, Where moments come alive';

    return text;
}

// ========== Local Storage Transaksi ========== //
function saveTransaction(data) {
    let transactions = JSON.parse(localStorage.getItem('salesData')) || [];
    transactions.push(data);
    localStorage.setItem('salesData', JSON.stringify(transactions));
}

function getAllTransactions() {
    return JSON.parse(localStorage.getItem('salesData')) || [];
}

function clearTransactions() {
    localStorage.removeItem('salesData');
}

function exportToCSV() {
    const transactions = getAllTransactions();
    if (transactions.length === 0) return alert('Tidak ada data untuk diekspor.');

    let csv = 'Nama Customer,Tanggal,Pembayaran,Item,Qty,Harga,Subtotal,Total\n';

    transactions.forEach(tr => {
        tr.items.forEach(item => {
            csv += `${tr.customer},${tr.date},${tr.method},${item.name},${item.qty},${item.price},${item.subTotal},${tr.total}\n`;
        });
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'penjualan_snapme.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function showTransactionHistory() {
    const historyContainer = document.getElementById('historyContainer');
    const transactions = getAllTransactions();
    historyContainer.innerHTML = '';

    if (transactions.length === 0) {
        historyContainer.innerHTML = '<p>Tidak ada transaksi tersimpan.</p>';
        return;
    }

    let totalSemua = 0;
    transactions.forEach((tr, index) => {
        let html = `<div class="history-card">
            <h4>Transaksi #${index + 1}</h4>
            <p><strong>Nama:</strong> ${tr.customer}</p>
            <p><strong>Tanggal:</strong> ${tr.date}</p>
            <p><strong>Pembayaran:</strong> ${tr.method}</p>
            <ul>`;

        tr.items.forEach(item => {
            html += `<li>${item.name} x ${item.qty} = Rp ${formatRupiah(item.subTotal)}</li>`;
        });

        html += `</ul><p><strong>Total:</strong> Rp ${formatRupiah(tr.total)}</p></div>`;
        totalSemua += tr.total;
        historyContainer.innerHTML += html;
    });

    historyContainer.innerHTML += `<div class="total-box">TOTAL PEMASUKAN: Rp ${formatRupiah(totalSemua)}</div>`;
}

// ====================
// Event Listener
// ====================
document.body.addEventListener('input', e => {
    if (e.target.name === 'item') {
        updateTotal();
        receiptEl.style.display = 'none';
    }
});

btnGenerateReceipt.addEventListener('click', () => {
    const name = inputCustomerName.value.trim();
    const method = selectPaymentMethod.value;

    if (!name) {
        alert('Silakan masukkan nama customer terlebih dahulu.');
        return;
    }

    if (!method) {
        alert('Silakan pilih metode pembayaran terlebih dahulu.');
        return;
    }

    const inputs = document.querySelectorAll('input[name="item"]');
    const items = [];
    let total = 0;

    inputs.forEach(input => {
        const qty = parseInt(input.value);
        if (qty > 0) {
            const price = parseInt(input.dataset.price);
            const itemName = [...catalogItems, ...addonItems, ...minumanItems, ...snackItems].find(i => i.id === input.id).name;
            const subTotal = qty * price;
            items.push({ id: input.id, name: itemName, qty, price, subTotal });
            total += subTotal;
        }
    });

    if (items.length === 0) {
        alert('Mohon pilih minimal satu item untuk membuat nota.');
        return;
    }

    const receiptText = generateReceiptText(name, method);
    receiptEl.textContent = receiptText;
    receiptEl.style.display = 'block';

    saveTransaction({
        customer: name,
        method,
        date: getCurrentDate(),
        total,
        items
    });

    const jsPDF = window.jspdf.jsPDF;
    const doc = new jsPDF();
    doc.setFont("courier", "normal");
    doc.setFontSize(12);
    doc.text(receiptText, 10, 10);
    doc.save(`nota-snapme-${Date.now()}.pdf`);
});

// ====================
// Inisialisasi
// ====================
renderAllItems();
updateTotal();
