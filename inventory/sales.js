let products = JSON.parse(localStorage.getItem('products') || '[]');

// DOM References
const productForm = document.getElementById('productForm');
const productTableBody = document.getElementById('productTableBody');

// Charts
let stockChart, salesChart;

// Add Product
productForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    const stock = parseInt(document.getElementById('stock').value);
    const price = parseFloat(document.getElementById('price').value);
    const sales = parseInt(document.getElementById('sales').value);

    products.push({ stock, price, sales });
    localStorage.setItem('products', JSON.stringify(products));

    productForm.reset();
    updateTable();
    updateGraphs();
});

// Populate Table
function updateTable() {
    productTableBody.innerHTML = '';

    products.forEach((product) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          
            <td>${product.stock}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.sales}</td>
        `;
        productTableBody.appendChild(row);
    });
}

// Update Graphs
function updateGraphs() {
    const labels = products.map((product) => product.productName);
    const stockData = products.map((product) => product.stock);
    const salesData = products.map((product) => product.sales);

    // Stock Chart
    if (stockChart) stockChart.destroy();
    stockChart = new Chart(document.getElementById('stockChart'), {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Stock Count',
                    data: stockData,
                    backgroundColor: '#3498db',
                    borderColor: '#2980b9',
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true, position: 'top' },
            },
            scales: {
                y: { beginAtZero: true },
            },
        },
    });

    // Sales Chart
    if (salesChart) salesChart.destroy();
    salesChart = new Chart(document.getElementById('salesChart'), {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Sales',
                    data: salesData,
                    backgroundColor: 'rgba(46, 204, 113, 0.2)',
                    borderColor: '#2ecc71',
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true, position: 'top' },
            },
            scales: {
                y: { beginAtZero: true },
            },
        },
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    updateTable();
    updateGraphs();
});
