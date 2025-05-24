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

// Referensi elemen
const containerCatalog = document.getElementById('catalog');
const containerAddon = document.getElementById('addons');
const containerMinuman = document.getElementById('minuman');
const containerSnack = document.getElementById('snack');
const totalPriceEl = document.getElementById('totalPrice');
const receiptEl = document.getElementById('receipt');
const btnGenerateReceipt = document.getElementById('generateReceipt');
const inputCustomerName = document.getElementById('customerName');

// Format angka
function formatRupiah(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Ambil tanggal saat ini
function getCurrentDate() {
    return new Date().toLocaleDateString("id-ID", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Buat input jumlah
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

// Render item ke tampilan
function renderAllItems() {
    catalogItems.forEach(item => createItemInput(item, containerCatalog));
    addonItems.forEach(item => createItemInput(item, containerAddon));
    minumanItems.forEach(item => createItemInput(item, containerMinuman));
    snackItems.forEach(item => createItemInput(item, containerSnack));
}

// Hitung total harga
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

// Generate isi nota
function generateReceiptText(name) {
    const inputs = document.querySelectorAll('input[name="item"]');
    const allItems = [...catalogItems, ...addonItems, ...minumanItems, ...snackItems];
    let text = '=== Nota Pembayaran SnapMe Studio ===\n\n';
    text += `Nama Customer: ${name}\n`;
    text += `Tanggal: ${getCurrentDate()}\n\n`;

    let total = 0;
    let adaItem = false;

    inputs.forEach(input => {
        const qty = parseInt(input.value);
        if (qty > 0) {
            const item = allItems.find(i => i.id === input.id);
            const subTotal = qty * item.price;
            text += `${item.name} x ${qty}:\tRp ${formatRupiah(subTotal)}\n`;
            total += subTotal;
            adaItem = true;
        }
    });

    if (!adaItem) return null;

    text += '\n----------------------------\n';
    text += `TOTAL:\tRp ${formatRupiah(total)}\n\n`;
    text += 'Terima kasih telah menggunakan layanan SnapMe Studio!';
    return text;
}

// Event: input jumlah
document.body.addEventListener('input', e => {
    if (e.target.name === 'item') {
        updateTotal();
        receiptEl.style.display = 'none';
    }
});

// Event: klik tombol buat nota
btnGenerateReceipt.addEventListener('click', () => {
    const name = inputCustomerName.value.trim();
    if (name === '') {
        alert('Silakan masukkan nama customer terlebih dahulu.');
        return;
    }

    const receiptText = generateReceiptText(name);
    if (!receiptText) {
        alert('Mohon pilih minimal satu item untuk membuat nota.');
        return;
    }

    receiptEl.textContent = receiptText;
    receiptEl.style.display = 'block';

    // Generate PDF
    const jsPDF = window.jspdf.jsPDF;
    const doc = new jsPDF();
    doc.setFont("courier", "normal");
    doc.setFontSize(12);
    doc.text(receiptText, 10, 10);
    doc.save(`nota-snapme-${Date.now()}.pdf`);
});

// Inisialisasi awal
renderAllItems();
updateTotal();
