let products = []; // Array to store products

function createDeleteButton(item) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('deleteButton');
    deleteButton.addEventListener('click', function () {
        products = products.filter(product => product !== item);
        renderProductList();
    });
    return deleteButton;
}

function createEditButton(item) {
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('editButton');
    editButton.addEventListener('click', function () {
        const newPrice = parseFloat(prompt('Enter the new price (IDR):'));
        if (!isNaN(newPrice)) {
            item.price = newPrice;
            renderProductList();
        } else {
            alert('Please enter a valid price.');
        }
    });
    return editButton;
}

function addProduct() {
    const productName = document.getElementById('productName').value;
    const productPrice = parseFloat(document.getElementById('productPrice').value);
    const productWeight = parseInt(document.getElementById('productWeight').value);

    if (productName && !isNaN(productPrice) && !isNaN(productWeight) && productWeight > 0) {
        const newProduct = {
            id: Date.now(), // Unique identifier (timestamp for simplicity)
            name: productName,
            price: productPrice,
            weight: productWeight,
        };

        products.push(newProduct);
        renderProductList();
    } else {
        alert('Please enter valid product name, price, and weight.');
    }
}

function prorateDiscount() {
    const totalDiscount = parseFloat(document.getElementById('totalDiscount').value);

    if (!isNaN(totalDiscount) && totalDiscount > 0 && products.length > 0) {
        const totalProductPrice = products.reduce((total, product) => total + product.price, 0);
        products.forEach(product => {
            const discountForProduct = (totalDiscount * (product.price / totalProductPrice)).toFixed(2);
            product.price -= parseFloat(discountForProduct);
        });
        renderProductList();
    } else {
        alert('Please enter a valid total discount and add products.');
    }
}


function distributeAdditionalFee() {
    const additionalFee = parseFloat(document.getElementById('additionalFee').value);
    const totalWeight = products.reduce((total, product) => total + product.weight, 0);

    if (!isNaN(additionalFee) && additionalFee > 0 && products.length > 0) {
        products.forEach(product => {
            const feeForProduct = (additionalFee * (product.weight / totalWeight)).toFixed(2);
            product.price += parseFloat(feeForProduct);
        });
        renderProductList();
    } else {
        alert('Please enter a valid additional fee and add products.');
    }
}

function getTotalProductPrice() {
    const total = products.reduce((sum, product) => sum + product.price, 0);
    document.getElementById('totalProductPrice').textContent = `Total Product Price: IDR ${total.toLocaleString('id-ID')}`;
}

function renderProductList() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach(function (item) {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name}: IDR ${item.price.toLocaleString('id-ID')} | Weight: ${item.weight}`;

        const deleteButton = createDeleteButton(item);
        const editButton = createEditButton(item);

        listItem.appendChild(deleteButton);
        listItem.appendChild(editButton);
        productList.appendChild(listItem);
    });
}

function showProductTable() {
    const popup = window.open('', 'Product Table', 'width=600,height=400');

    const currentUrl = window.location.href;
    const currentDirectory = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);
    const cssFileName = 'styles.css'; // Replace 'styles.css' with your CSS file name

    const head = popup.document.head;
    const link = popup.document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = currentDirectory + cssFileName;
    head.appendChild(link);

    const table = popup.document.createElement('table');
    table.style.maxWidth = '100%';

    const totalProductPrice = products.reduce((total, product) => total + product.price, 0);

    // Create table header
    const headerRow = popup.document.createElement('tr');
    const nameHeader = popup.document.createElement('th');
    nameHeader.textContent = 'Product Name';
    headerRow.appendChild(nameHeader);

    const weightHeader = popup.document.createElement('th');
    weightHeader.textContent = 'Weight';
    headerRow.appendChild(weightHeader);

    const priceHeader = popup.document.createElement('th');
    priceHeader.textContent = 'Price (IDR)';
    headerRow.appendChild(priceHeader);

    table.appendChild(headerRow);

    // Populate table rows with product details
    products.forEach(product => {
        const row = popup.document.createElement('tr');

        const nameCell = popup.document.createElement('td');
        nameCell.textContent = product.name;
        row.appendChild(nameCell);

        const weightCell = popup.document.createElement('td');
        weightCell.textContent = product.weight;
        row.appendChild(weightCell);

        const priceCell = popup.document.createElement('td');
        priceCell.textContent = `IDR ${product.price.toLocaleString('id-ID')}`;
        row.appendChild(priceCell);

        table.appendChild(row);
    });

    // Create and append summary row for total product price
    const summaryRow = popup.document.createElement('tr');
    const summaryLabelCell = popup.document.createElement('td');
    summaryLabelCell.textContent = 'Total Product Price:';
    summaryLabelCell.colSpan = 2;
    summaryRow.appendChild(summaryLabelCell);

    const summaryTotalCell = popup.document.createElement('td');
    summaryTotalCell.textContent = `IDR ${totalProductPrice.toLocaleString('id-ID')}`;
    summaryRow.appendChild(summaryTotalCell);

    table.appendChild(summaryRow);

    popup.document.body.style.margin = '0';
    popup.document.body.style.padding = '10px';

    popup.document.body.appendChild(table);

    // Create a button to show the table image
    const showImageButton = popup.document.createElement('button');
    showImageButton.textContent = 'Show Table as Image';
    showImageButton.addEventListener('click', () => {
        html2canvas(table).then(canvas => {
            const imgData = canvas.toDataURL('image/png');

            // Add a note above the image
            const note = popup.document.createElement('div');
            note.textContent = 'Note: This table is displayed as an image and can be shared.';
            note.style.backgroundColor = '#f5f5f5';
            note.style.padding = '10px';
            note.style.marginBottom = '10px';
            popup.document.body.appendChild(note);

            // Show the table image below the button
            const img = popup.document.createElement('img');
            img.src = imgData;
            img.style.width = '100%'; // Adjust the width as needed
            img.style.maxWidth = '100%'; // Ensure image responsiveness
            img.style.height = 'auto';
            popup.document.body.appendChild(img);
        });
    });

    popup.document.body.appendChild(showImageButton);
}



document.getElementById('addProductButton').addEventListener('click', addProduct);
document.getElementById('prorateButton').addEventListener('click', prorateDiscount);
document.getElementById('distributeButton').addEventListener('click', distributeAdditionalFee);
document.getElementById('getTotalPriceButton').addEventListener('click', getTotalProductPrice);
document.getElementById('showTableButton').addEventListener('click', showProductTable);