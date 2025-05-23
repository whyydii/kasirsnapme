// Data katalog dan addons
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

// Referensi element
const containerCatalog = document.getElementById('catalog');
const containerAddon = document.getElementById('addons');
const containerMinuman = document.getElementById('minuman');
const containerSnack = document.getElementById('snack');
const totalPriceEl = document.getElementById('totalPrice');
const receiptEl = document.getElementById('receipt');
const btnGenerateReceipt = document.getElementById('generateReceipt');

// Format angka dengan ribuan titik
function formatRupiah(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Membuat checkbox item
function createCheckbox(item, container) {
    const label = document.createElement('label');
    label.htmlFor = item.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = item.id;
    checkbox.name = 'item';
    checkbox.value = item.id;
    checkbox.dataset.price = item.price;

    const nameSpan = document.createElement('span');
    nameSpan.textContent = item.name;

    const priceSpan = document.createElement('span');
    priceSpan.className = 'price';
    priceSpan.textContent = `Rp ${formatRupiah(item.price)}`;

    label.appendChild(checkbox);
    label.appendChild(nameSpan);
    label.appendChild(priceSpan);

    container.appendChild(label);
}

// Render semua list produk dan addons
catalogItems.forEach(i => createCheckbox(i, containerCatalog));
addonItems.forEach(i => createCheckbox(i, containerAddon));
minumanItems.forEach(i => createCheckbox(i, containerMinuman));
snackItems.forEach(i => createCheckbox(i, containerSnack));

// Update total harga
function updateTotal() {
    const checked = document.querySelectorAll('input[name="item"]:checked');
    let total = 0;
    checked.forEach(chk => {
        total += parseInt(chk.dataset.price);
    });
    totalPriceEl.textContent = formatRupiah(total);
}

// Event listener checkbox untuk update total dan sembunyikan receipt jika ada perubahan
document.body.addEventListener('change', e => {
    if (e.target.name === 'item') {
        updateTotal();
        receiptEl.style.display = 'none';
    }
});

// Fungsi bikin nota dalam bentuk string
function generateReceiptText() {
    const checkedItems = [...document.querySelectorAll('input[name="item"]:checked')];
    if (checkedItems.length === 0) {
        alert('Mohon pilih minimal satu paket atau add-on untuk membuat nota.');
        return null;
    }
    const allItems = [...catalogItems, ...addonItems, ...minumanItems, ...snackItems];
    let text = '=== Nota Pembayaran SnapMe Studio ===\n\n';
    let total = 0;
    checkedItems.forEach(chk => {
        const id = chk.value;
        const item = allItems.find(i => i.id === id);
        if (item) {
            text += `${item.name}:\tRp ${formatRupiah(item.price)}\n`;
            total += item.price;
        }
    });
    text += '\n----------------------------\n';
    text += `TOTAL:\tRp ${formatRupiah(total)}\n`;
    text += '\nTerima kasih telah menggunakan layanan SnapMe Studio!';
    return text;
}

// Generate nota dan tampilkan di halaman
btnGenerateReceipt.addEventListener('click', () => {
    const receiptText = generateReceiptText();
    if (receiptText === null) return;
    receiptEl.textContent = receiptText;
    receiptEl.style.display = 'block';

    // Buat dan trigger download file PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(receiptText, 10, 10);
    doc.save(`nota-snapme-${Date.now()}.pdf`);
});

// Inisialisasi total pertama kali
updateTotal();
