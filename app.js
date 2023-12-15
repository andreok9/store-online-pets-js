
document.addEventListener('DOMContentLoaded', function () {
	const cartContainer = document.getElementById('cartContainer');
	const cartIcon = document.getElementById('cartIcon');
	let cartProducts = loadCartFromStorage();

	const cardProductContainers = document.querySelectorAll('.card-product');

	cardProductContainers.forEach(cardProductContainer => {
		cardProductContainer.addEventListener('click', function (ev) {
			if (ev.target.classList.contains('btnAddCart')) {
				const productId = ev.target.getAttribute('dataProductId');
				const product = cardProductContainer;

				if (product) {
					const infoProduct = {
						id: productId,
						title: product.querySelector('h3').textContent,
						price: parseFloat(product.querySelector('.price').textContent.replace('$', '')),
					};

					const exists = cartProducts.some(product => product.id === infoProduct.id);

					if (exists) {
						cartProducts = cartProducts.map(product => {
							if (product.id === infoProduct.id) {
								product.quantity++;
								return product;
							} else {
								return product;
							}
						});
					} else {
						infoProduct.quantity = 1;
						cartProducts.push(infoProduct);
					}

					saveCartToStorage();

					updateCart();
				}
			}
		});
	});

	function updateCart() {
		cartContainer.innerHTML = '';

		cartProducts.forEach(product => {
			const productElement = document.createElement('div');
			productElement.classList.add('cart-item');
			productElement.innerHTML = `
                <p>${product.title}</p>
                <p>Precio: $${product.price.toFixed(2)}</p>
                <p>Cantidad: ${product.quantity}</p>
                <button class="btnRemoveItem btn btn-outline-primary" dataProductId="${product.id}">X</button>
                <hr>
            `;
			cartContainer.appendChild(productElement);

		});

		const cartIsEmpty = cartProducts.length === 0;
		cartContainer.style.display = cartIsEmpty ? 'none' : 'block';

		const totalItems = cartProducts.reduce((total, product) => total + product.quantity, 0);

		cartIcon.innerHTML = `<i class="fas fa-shopping-basket"></i> ${totalItems}`;

		const checkoutButton = document.createElement('button');
		checkoutButton.id = 'checkoutButton';
		checkoutButton.className = 'btn btn-outline-primary';
		checkoutButton.textContent = 'Finalizar Compra';
		checkoutButton.disabled = cartIsEmpty;
		cartContainer.appendChild(checkoutButton);

		const removeButtons = document.querySelectorAll('.btnRemoveItem');
		removeButtons.forEach(button => {
			button.addEventListener('click', function (e) {
				const productId = e.target.getAttribute('dataProductId');
				cartProducts = cartProducts.filter(product => product.id !== productId);
				saveCartToStorage();
				updateCart();
			});
		});
		updateCheckoutButton();
	}

	function saveCartToStorage() {
		localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
	}

	function loadCartFromStorage() {
		const storedCart = localStorage.getItem('cartProducts');
		return storedCart ? JSON.parse(storedCart) : [];
	}


	function updateCheckoutButton() {
		checkoutButton.disabled = cartProducts.length === 0;

		checkoutButton.addEventListener('click', function () {
			alert('¡Compra finalizada!');
			cartProducts = [];
			saveCartToStorage();
			updateCart();
		});
	}

	updateCart();
});