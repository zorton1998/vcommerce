document.addEventListener('DOMContentLoaded', function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const updateCartCount = () => {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    };

    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    };

    // Handle adding to cart
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    if (addToCartButtons) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-id');
                const productName = button.getAttribute('data-name');
                const productPrice = parseFloat(button.getAttribute('data-price'));

                const existingProduct = cart.find(item => item.id === productId);

                if (existingProduct) {
                    existingProduct.quantity += 1;
                } else {
                    const product = {
                        id: productId,
                        name: productName,
                        price: productPrice,
                        quantity: 1
                    };
                    cart.push(product);
                }

                saveCart();
                alert(`${productName} has been added to the cart.`);
                window.dataLayer.push({ ecommerce: null });
                window.dataLayer.push({
                    event: "add_to_cart",
                    ecommerce: {
                      creative_name:productName,
                      creative_slot: "featured_app_1",
                      promotion_id: "P_12345",
                      promotion_name: "Summer Sale",
                      items: [
                      {
                        item_id: "SKU_12345",
                        item_name: "Stan and Friends Tee",
                        affiliation: "Google Merchandise Store",
                        coupon: "SUMMER_FUN",
                        discount: 2.22,
                        index: 0,
                        item_brand: "Google",
                        item_category: "Apparel",
                        item_category2: "Adult",
                        item_category3: "Shirts",
                        item_category4: "Crew",
                        item_category5: "Short sleeve",
                        item_list_id: "related_products",
                        item_list_name: "Related Products",
                        item_variant: "green",
                        location_id: "ChIJIQBpAG2ahYAR_6128GcTUEo",
                        price: 10.01,
                        quantity: 3
                      }
                      ]
                    }
                  });

            });
        });
    }

    // Handle displaying cart items
    const cartItemsDiv = document.getElementById('cart-items');
    if (cartItemsDiv) {
        let total = 0;
        cartItemsDiv.innerHTML = '';
        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <img src="https://via.placeholder.com/150" alt="${item.name}">
                <div class="cart-item-details">
                    <h2>${item.name}</h2>
                    <p class="price">$${item.price.toFixed(2)} x ${item.quantity}</p>
                    <p class="subtotal">Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button class="remove-item" data-index="${index}"  data-name="${item.name}" data-price="${item.price.toFixed(2)} x ${item.quantity}">Remove</button>
            `;
            cartItemsDiv.appendChild(itemDiv);
            total += item.price * item.quantity;
        });

        document.getElementById('cart-total').innerText = total.toFixed(2);

        const removeItemButtons = document.querySelectorAll('.remove-item');
        removeItemButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                cart.splice(index, 1);
                saveCart();
                location.reload(); // Reload the page to update the cart display
            });
        });

        document.getElementById('checkout-button').addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
            } else {
                window.location.href = 'checkout.html';
            }
        });
    }

    // Handle checkout form
    const checkoutForm = document.getElementById('checkout-form');
    const paymentOptions = document.getElementById('payment-options');
    if (checkoutForm) {
        const paymentMethodSelect = document.getElementById('payment-method');
        const upiFields = document.getElementById('upi-fields');
        const cardFields = document.getElementById('card-fields');
        const netBankingFields = document.getElementById('net-banking-fields');

        const showPaymentFields = (method) => {
            upiFields.style.display = method === 'upi' ? 'block' : 'none';
            cardFields.style.display = method === 'card' ? 'block' : 'none';
            netBankingFields.style.display = method === 'net-banking' ? 'block' : 'none';
        };

        paymentMethodSelect.addEventListener('change', (event) => {
            showPaymentFields(event.target.value);
        });

        // Set default payment method and display its fields
        showPaymentFields(paymentMethodSelect.value);

        checkoutForm.addEventListener('submit', (event) => {
            event.preventDefault();
            checkoutForm.style.display = 'none';
            paymentOptions.style.display = 'block';
        });

        document.getElementById('payment-success').addEventListener('click', () => {
            localStorage.removeItem('cart');
            window.location.href = 'thankyou.html?status=success';
        });

        document.getElementById('payment-failure').addEventListener('click', () => {
            window.location.href = 'thankyou.html?status=failure';
        });
    }

    // Handle thank you page
    const thankYouMessage = document.getElementById('thank-you-message');
    if (thankYouMessage) {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');
        if (status === 'success') {
            thankYouMessage.innerText = 'Thank you for your purchase!';
        } else {
            thankYouMessage.innerText = 'Your payment failed. Please try again.';
        }
    }

    updateCartCount();
});
