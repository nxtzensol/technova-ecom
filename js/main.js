// TechVault - E-Commerce JavaScript

$(document).ready(function() {
    
    // Initialize cart from localStorage
    let cart = JSON.parse(localStorage.getItem('techvault_cart')) || [];
    updateCartCount();
    
    // Product data
    const products = [
        {
            id: 1,
            name: "UltraBook Pro 15",
            price: 1299.99,
            description: "High-performance laptop with Intel i7 processor, 16GB RAM, and 512GB SSD. Perfect for professionals and creators.",
            category: "Laptops",
            icon: "💻"
        },
        {
            id: 2,
            name: "Wireless Headphones X",
            price: 199.99,
            description: "Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality.",
            category: "Audio",
            icon: "🎧"
        },
        {
            id: 3,
            name: "Smart Watch Elite",
            price: 349.99,
            description: "Advanced smartwatch with health monitoring, GPS, and seamless smartphone integration.",
            category: "Wearables",
            icon: "⌚"
        },
        {
            id: 4,
            name: "4K Monitor Ultra",
            price: 599.99,
            description: "32-inch 4K UHD monitor with HDR support, perfect for gaming and professional work.",
            category: "Monitors",
            icon: "🖥️"
        },
        {
            id: 5,
            name: "Mechanical Keyboard RGB",
            price: 149.99,
            description: "Premium mechanical keyboard with customizable RGB lighting and tactile switches.",
            category: "Accessories",
            icon: "⌨️"
        },
        {
            id: 6,
            name: "Gaming Mouse Pro",
            price: 79.99,
            description: "High-precision gaming mouse with adjustable DPI and ergonomic design.",
            category: "Accessories",
            icon: "🖱️"
        },
        {
            id: 7,
            name: "Tablet Air 10",
            price: 499.99,
            description: "Lightweight tablet with stunning display and all-day battery life.",
            category: "Tablets",
            icon: "📱"
        },
        {
            id: 8,
            name: "Bluetooth Speaker Max",
            price: 129.99,
            description: "Portable Bluetooth speaker with 360-degree sound and waterproof design.",
            category: "Audio",
            icon: "🔊"
        }
    ];
    
    // Render products on homepage
    function renderProducts() {
        const productsGrid = $('.products-grid');
        if (productsGrid.length) {
            productsGrid.empty();
            products.forEach(product => {
                const productCard = `
                    <div class="product-card" data-product-id="${product.id}">
                        <div class="product-image">${product.icon}</div>
                        <div class="product-info">
                            <h3 class="product-name">${product.name}</h3>
                            <p class="product-description">${product.description}</p>
                            <div class="product-price">$${product.price.toFixed(2)}</div>
                            <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
                        </div>
                    </div>
                `;
                productsGrid.append(productCard);
            });
        }
    }
    
    // Render product detail page
    function renderProductDetail() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        
        if (productId) {
            const product = products.find(p => p.id === productId);
            if (product) {
                $('.detail-image').text(product.icon);
                $('.detail-name').text(product.name);
                $('.detail-price').text(`$${product.price.toFixed(2)}`);
                $('.detail-description').text(product.description);
                $('.add-to-cart-detail').data('product-id', product.id);
                document.title = `${product.name} - TechVault`;
            }
        }
    }
    
    // Render cart page
    function renderCartPage() {
        const cartItemsContainer = $('.cart-items');
        const cartSummaryContainer = $('.cart-summary');
        
        if (cartItemsContainer.length) {
            if (cart.length === 0) {
                cartItemsContainer.html(`
                    <div class="empty-cart">
                        <i>🛒</i>
                        <h2>Your cart is empty</h2>
                        <p>Start shopping to add items to your cart</p>
                        <a href="index.html" class="btn" style="margin-top: 1rem;">Continue Shopping</a>
                    </div>
                `);
                cartSummaryContainer.hide();
            } else {
                let cartHTML = `
                    <table class="cart-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody class="cart-items-body">
                `;
                
                let subtotal = 0;
                
                cart.forEach((item, index) => {
                    const product = products.find(p => p.id === item.id);
                    if (product) {
                        const itemTotal = product.price * item.quantity;
                        subtotal += itemTotal;
                        cartHTML += `
                            <tr>
                                <td><div class="cart-item-image">${product.icon}</div></td>
                                <td>${product.name}</td>
                                <td>$${product.price.toFixed(2)}</td>
                                <td>
                                    <input type="number" min="1" value="${item.quantity}" 
                                           class="quantity-input" data-index="${index}" 
                                           style="width: 60px; padding: 5px;">
                                </td>
                                <td>$${itemTotal.toFixed(2)}</td>
                                <td><button class="remove-btn" data-index="${index}">Remove</button></td>
                            </tr>
                        `;
                    }
                });
                
                cartHTML += `</tbody></table>`;
                cartItemsContainer.html(cartHTML);
                
                // Update summary
                const tax = subtotal * 0.1;
                const total = subtotal + tax;
                
                cartSummaryContainer.html(`
                    <div class="summary-row">
                        <span>Subtotal:</span>
                        <span>$${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Tax (10%):</span>
                        <span>$${tax.toFixed(2)}</span>
                    </div>
                    <div class="summary-row total-row">
                        <span>Total:</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>
                    <a href="checkout.html" class="btn" style="width: 100%; text-align: center; margin-top: 1rem;">Proceed to Checkout</a>
                `);
            }
        }
    }
    
    // Render checkout page
    function renderCheckoutPage() {
        const orderItemsContainer = $('.order-items');
        
        if (cart.length === 0) {
            window.location.href = 'index.html';
            return;
        }
        
        if (orderItemsContainer.length) {
            let orderHTML = '';
            let subtotal = 0;
            
            cart.forEach(item => {
                const product = products.find(p => p.id === item.id);
                if (product) {
                    const itemTotal = product.price * item.quantity;
                    subtotal += itemTotal;
                    orderHTML += `
                        <div class="order-item">
                            <span>${product.name} x ${item.quantity}</span>
                            <span>$${itemTotal.toFixed(2)}</span>
                        </div>
                    `;
                }
            });
            
            const tax = subtotal * 0.1;
            const total = subtotal + tax;
            
            orderItemsContainer.html(orderHTML);
            $('.order-subtotal').text(`$${subtotal.toFixed(2)}`);
            $('.order-tax').text(`$${tax.toFixed(2)}`);
            $('.order-total').text(`$${total.toFixed(2)}`);
        }
    }
    
    // Add to cart function
    function addToCart(productId, quantity = 1) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ id: productId, quantity: quantity });
        }
        
        saveCart();
        updateCartCount();
        showToast('Product added to cart!');
    }
    
    // Remove from cart
    function removeFromCart(index) {
        cart.splice(index, 1);
        saveCart();
        updateCartCount();
        renderCartPage();
        showToast('Item removed from cart');
    }
    
    // Update cart quantity
    function updateQuantity(index, quantity) {
        if (quantity < 1) {
            removeFromCart(index);
            return;
        }
        cart[index].quantity = quantity;
        saveCart();
        renderCartPage();
    }
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('techvault_cart', JSON.stringify(cart));
    }
    
    // Update cart count display
    function updateCartCount() {
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        $('.cart-count').text(totalCount);
    }
    
    // Show toast notification
    function showToast(message) {
        const toast = $(`<div class="toast">${message}</div>`);
        $('body').append(toast);
        
        setTimeout(() => {
            toast.fadeOut(300, function() {
                $(this).remove();
            });
        }, 2000);
    }
    
    // Handle checkout form submission
    function handleCheckout(e) {
        e.preventDefault();
        
        // Simple validation
        const requiredFields = $('.checkout-form input[required], .checkout-form select[required]');
        let isValid = true;
        
        requiredFields.each(function() {
            if (!$(this).val().trim()) {
                isValid = false;
                $(this).css('border-color', '#e74c3c');
            } else {
                $(this).css('border-color', '#ecf0f1');
            }
        });
        
        if (!isValid) {
            showToast('Please fill in all required fields');
            return;
        }
        
        // Generate order number
        const orderNumber = 'TV' + Date.now();
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartCount();
        
        // Redirect to confirmation
        window.location.href = `confirmation.html?order=${orderNumber}`;
    }
    
    // Event Listeners
    
    // Product card click (navigate to detail)
    $(document).on('click', '.product-card', function(e) {
        if (!$(e.target).hasClass('add-to-cart-btn')) {
            const productId = $(this).data('product-id');
            window.location.href = `product-detail.html?id=${productId}`;
        }
    });
    
    // Add to cart buttons
    $(document).on('click', '.add-to-cart-btn', function(e) {
        e.stopPropagation();
        const productId = $(this).data('product-id');
        addToCart(productId);
    });
    
    // Add to cart on detail page
    $(document).on('click', '.add-to-cart-detail', function() {
        const productId = $(this).data('product-id');
        const quantity = parseInt($('.quantity-input-detail').val()) || 1;
        addToCart(productId, quantity);
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 500);
    });
    
    // Remove from cart
    $(document).on('click', '.remove-btn', function() {
        const index = $(this).data('index');
        removeFromCart(index);
    });
    
    // Update quantity in cart
    $(document).on('change', '.quantity-input', function() {
        const index = $(this).data('index');
        const quantity = parseInt($(this).val());
        updateQuantity(index, quantity);
    });
    
    // Checkout form submission
    $('.checkout-form').on('submit', handleCheckout);
    
    // Cart icon click
    $('.cart-icon').on('click', function() {
        window.location.href = 'cart.html';
    });
    
    // Navigation active state
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    $(`nav a[href="${currentPage}"]`).addClass('active');
    
    // Initialize pages
    renderProducts();
    renderProductDetail();
    renderCartPage();
    renderCheckoutPage();
    
    // Display order number on confirmation page
    const urlParams = new URLSearchParams(window.location.search);
    const orderNumber = urlParams.get('order');
    if (orderNumber) {
        $('.order-number-display').text(orderNumber);
    }
});
