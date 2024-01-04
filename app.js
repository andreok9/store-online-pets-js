document.addEventListener('DOMContentLoaded', function () {
    const cartIcon = document.getElementById('cartIcon');
    let cartContainerStore = createCartContainer();
    let cartProducts = loadCartFromStorage();
    let checkoutButton = createCheckoutButton();

    loadProductsFromJson();

    function loadProductsFromJson() {
        fetch('./products.json')
            .then(response => response.json())
            .then(products => {
                displayProducts(products);
                setupProductEventListeners(products);
            })
            .catch(error => console.error('Error al agregar el producto:', error));
    }

    function showToast(message, type = 'success') {
        Toastify({
            text: message,
            duration: 3000,
            newWindow: true,
            gravity: "top",
            position: "right",
            backgroundColor: type === 'error' ? '#cc0000' : '#6aa84f',
            stopOnFocus: true,
        }).showToast();
    }

    function createCartContainer() {
        const container = document.createElement('div');
        container.id = 'cartContainerStore';
        container.style.display = 'none';
        document.body.appendChild(container);
        return container;
    }

    function displayProducts(products) {
        const productSection = document.getElementById('productContainer');

        products.forEach(product => {
            const productContainer = document.createElement('div');
            productContainer.classList.add('card-product');
            productContainer.id = `product${product.id}`;

            const containerImg = document.createElement('div');
            containerImg.classList.add('container-img');
            containerImg.innerHTML = `<img src="${product.image}" alt="${product.name}">`;

            const contentCardProduct = document.createElement('div');
            contentCardProduct.classList.add('contentCardProduct');

            const stars = document.createElement('div');
            stars.classList.add('stars');

            const title = document.createElement('h3');
            title.textContent = product.name;

            const description = document.createElement('p');
            description.textContent = product.description;

            const basketButton = document.createElement('button');
            basketButton.classList.add('card-p');
            basketButton.innerHTML = '<i class="fa-solid fa-basket-shopping"></i>';

            const addButton = document.createElement('button');
            addButton.classList.add('btnAddCart', 'btn', 'btn-info');
            addButton.setAttribute('dataProductId', product.id);
            addButton.textContent = 'Agregar al carrito';

            const price = document.createElement('p');
            price.classList.add('price');
            price.textContent = `$${product.price.toFixed(2)}`;

            contentCardProduct.appendChild(stars);
            contentCardProduct.appendChild(title);
            contentCardProduct.appendChild(description);
            contentCardProduct.appendChild(basketButton);
            contentCardProduct.appendChild(addButton);
            contentCardProduct.appendChild(price);

            productContainer.appendChild(containerImg);
            productContainer.appendChild(contentCardProduct);

            productSection.appendChild(productContainer);
        });
    }

    function setupProductEventListeners(products) {
        const cardProductContainers = document.querySelectorAll('.card-product');

        cardProductContainers.forEach(cardProductContainer => {
            cardProductContainer.addEventListener('click', function (ev) {
                if (ev.target.classList.contains('btnAddCart')) {
                    const productId = ev.target.getAttribute('dataProductId');
                    const product = products.find(p => p.id === productId);

                    if (product) {
                        const infoProduct = {
                            id: productId,
                            title: product.name,
                            price: parseFloat(String(product.price).replace('$', '')),
                            quantity: 1,
                        };

                        const existingProduct = cartProducts.find(p => p.id === infoProduct.id);

                        if (existingProduct) {
                            existingProduct.quantity++;
                        } else {
                            cartProducts.push(infoProduct);
                        }

                        saveCartToStorage();
                        updateCart();
                        showToast(`${product.name} agregado al carrito`);
                    }
                }
            });
        });

        updateCart();
    }

    function updateCart() {
        cartContainerStore.innerHTML = '';

        cartProducts.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('cartItem');
            productElement.innerHTML = `
                <p>${product.title}</p>
                <p>Precio: $${product.price.toFixed(2)}</p>
                <p>Cantidad: ${product.quantity}</p>
                <button class="btnRemoveItem btn btn-outline-primary" data-product-id="${product.id}">X</button>
                <hr>
            `;
            cartContainerStore.appendChild(productElement);
        });


        if (cartProducts.length > 0) {
            cartContainerStore.style.display = 'block';
            createCheckoutButton();
        } else {
            cartContainerStore.style.display = 'none';
        }


        const totalItems = cartProducts.reduce((total, product) => total + product.quantity, 0);
        cartIcon.innerHTML = `<i class="fas fa-shopping-basket"></i> ${totalItems}`;

        const removeButtons = document.querySelectorAll('.btnRemoveItem');
        removeButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                const productId = e.target.getAttribute('data-product-id');
                cartProducts = cartProducts.filter(product => product.id !== productId);
                saveCartToStorage();
                updateCart();
            });
        });
    }

    function createCheckoutButton() {
        const link = document.createElement('a');
        link.id = 'checkoutButton';
        link.classList.add('btn', 'btn-primary');
        link.textContent = 'Pagar';
        link.setAttribute('href', './pages/form.html');
        cartContainerStore.appendChild(link);
        updateCheckoutButton(link);
        return link;
    }

    function updateCheckoutButton(button) {
        button.addEventListener('click', function () {
            saveCartToStorage();
            updateCart();
        });

    };


    function saveCartToStorage() {
        localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
    }

    function loadCartFromStorage() {
        const storedCart = localStorage.getItem('cartProducts');
        return storedCart ? JSON.parse(storedCart) : [];
    }

    updateCart();

    function openPaymentForm() {
        const paymentForm = document.getElementById('paymentForm');
        if (paymentForm) {
            paymentForm.style.display = 'block';
        }
    }

    async function processPayment() {
        const spinner = document.createElement('div');
        spinner.id = 'paymentSpinner';
        spinner.style.display = 'block';
        document.body.appendChild(spinner);

        await new Promise(resolve => setTimeout(resolve, 2000));

        spinner.style.display = 'none';
        await Swal.fire({
            icon: 'info',
            title: '¡Procesando tu pago...!',
            text: 'Un momento',
            showConfirmButton: false,
            timer: 3000
        });
    }

    const processPaymentButton = document.getElementById('processPayment');
    if (processPaymentButton) {
        processPaymentButton.addEventListener('click', processPayment);
    }

    const cartLink = document.getElementById('cartIcon');
    if (cartLink) {
        cartLink.addEventListener('click', openPaymentForm);
    }

    function completePurchase() {
        Swal.fire({
            icon: 'success',
            title: '¡Pago procesado con éxito!',
            text: 'Gracias por su compra.',
            showConfirmButton: false,
            timer: 3000
        });
    }

});
