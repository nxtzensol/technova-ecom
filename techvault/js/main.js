// Product data
const products = [
    {
        id: 1,
        name: "UltraBook Pro 15",
        price: 1299.99,
        description: "Powerful laptop with Intel i7 processor, 16GB RAM, and 512GB SSD. Perfect for professionals and content creators.",
        emoji: "💻",
        category: "Laptops"
    },
    {
        id: 2,
        name: "SmartPhone X12",
        price: 899.99,
        description: "Latest flagship smartphone with 6.7-inch OLED display, 5G connectivity, and professional-grade camera system.",
        emoji: "📱",
        category: "Phones"
    },
    {
        id: 3,
        name: "Wireless Earbuds Pro",
        price: 199.99,
        description: "Premium wireless earbuds with active noise cancellation, 30-hour battery life, and crystal-clear audio.",
        emoji: "🎧",
        category: "Audio"
    },
    {
        id: 4,
        name: "4K Smart Monitor 32\"",
        price: 549.99,
        description: "Stunning 4K UHD monitor with HDR support, USB-C connectivity, and built-in speakers for immersive viewing.",
        emoji: "🖥️",
        category: "Monitors"
    },
    {
        id: 5,
        name: "Gaming Keyboard RGB",
        price: 129.99,
        description: "Mechanical gaming keyboard with customizable RGB lighting, programmable keys, and ultra-responsive switches.",
        emoji: "⌨️",
        category: "Accessories"
    },
    {
        id: 6,
        name: "Wireless Mouse Elite",
        price: 79.99,
        description: "Precision wireless mouse with ergonomic design, adjustable DPI, and long-lasting battery life.",
        emoji: "🖱️",
        category: "Accessories"
    },
    {
        id: 7,
        name: "Tablet Pro 11\"",
        price: 749.99,
        description: "Versatile tablet with powerful processor, stunning display, and support for stylus and keyboard accessories.",
        emoji: "📟",
        category: "Tablets"
    },
    {
        id: 8,
        name: "Smart Watch Series 5",
        price: 399.99,
        description: "Advanced smartwatch with health monitoring, GPS, water resistance, and seamless smartphone integration.",
        emoji: "⌚",
        category: "Wearables"
    }
];

// Cart management
let cart = JSON.parse(localStorage.getItem('techvault_cart')) || [];

function saveCart() {
    localStorage.setItem('techvault_cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    $('.cart-count').text(count);
}

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }

    saveCart();
    showNotification('Product added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}

function updateCartItemQuantity(productId, quantity) {
    if (quantity < 1) {
        removeFromCart(productId);
        return;
    }

    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
        saveCart();
        renderCart();
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function clearCart() {
    cart = [];
    saveCart();
}

// Notification system
function showNotification(message) {
    const notification = $('<div class="notification"></div>')
        .text(message)
        .css({
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: '#27ae60',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '8px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
            zIndex: 9999,
            animation: 'fadeIn 0.3s ease'
        });

    $('body').append(notification);

    setTimeout(() => {
        notification.fadeOut(300, () => notification.remove());
    }, 2000);
}

// Render functions
function renderProductCard(product) {
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `;
}

function renderFeaturedProducts() {
    const container = $('#featuredProducts');
    const featured = products.slice(0, 4);
    container.html(featured.map(p => renderProductCard(p)).join(''));

    $('.product-card').click(function(e) {
        if (!$(e.target).hasClass('add-to-cart')) {
            const productId = $(this).data('product-id');
            window.location.href = `product-detail.html?id=${productId}`;
        }
    });
}

function renderAllProducts() {
    const container = $('#allProducts');
    container.html(products.map(p => renderProductCard(p)).join(''));

    $('.product-card').click(function(e) {
        if (!$(e.target).hasClass('add-to-cart')) {
            const productId = $(this).data('product-id');
            window.location.href = `product-detail.html?id=${productId}`;
        }
    });
}

function renderCart() {
    const container = $('#cartItems');
    
    if (cart.length === 0) {
        container.html(`
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <a href="products.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `);
        $('#cartSummary').hide();
        return;
    }

    $('#cartSummary').show();
    container.html(cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.emoji}</div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <input type="number" value="${item.quantity}" min="1" 
                       onchange="updateCartItemQuantity(${item.id}, this.value)">
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join(''));

    const subtotal = getCartTotal();
    const shipping = subtotal > 50 ? 0 : 9.99;
    const total = subtotal + shipping;

    $('#subtotal').text(`$${subtotal.toFixed(2)}`);
    $('#shipping').text(shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`);
    $('#total').text(`$${total.toFixed(2)}`);
}

function renderProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);

    if (!product) {
        window.location.href = 'products.html';
        return;
    }

    $('#detailImage').text(product.emoji);
    $('#detailName').text(product.name);
    $('#detailPrice').text(`$${product.price.toFixed(2)}`);
    $('#detailDescription').text(product.description);
    $('#addToCartBtn').click(function() {
        const quantity = parseInt($('#quantity').val()) || 1;
        addToCart(product.id, quantity);
    });
}

function renderOrderSummary() {
    const container = $('#orderSummaryItems');
    
    if (cart.length === 0) {
        window.location.href = 'products.html';
        return;
    }

    container.html(cart.map(item => `
        <div class="summary-row">
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join(''));

    const subtotal = getCartTotal();
    const shipping = subtotal > 50 ? 0 : 9.99;
    const total = subtotal + shipping;

    $('#checkoutSubtotal').text(`$${subtotal.toFixed(2)}`);
    $('#checkoutShipping').text(shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`);
    $('#checkoutTotal').text(`$${total.toFixed(2)}`);
}

function processCheckout() {
    const formData = {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        email: $('#email').val(),
        phone: $('#phone').val(),
        address: $('#address').val(),
        city: $('#city').val(),
        zipCode: $('#zipCode').val(),
        cardNumber: $('#cardNumber').val(),
        expiryDate: $('#expiryDate').val(),
        cvv: $('#cvv').val()
    };

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.address || !formData.city || !formData.zipCode ||
        !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
        showNotification('Please fill in all required fields');
        return;
    }

    // Generate order number
    const orderNumber = 'TV-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Store order details
    localStorage.setItem('techvault_last_order', JSON.stringify({
        orderNumber: orderNumber,
        items: cart,
        total: getCartTotal(),
        date: new Date().toISOString()
    }));

    // Clear cart and redirect
    clearCart();
    window.location.href = `confirmation.html?order=${orderNumber}`;
}

// Search functionality
function setupSearch() {
    $('#searchBtn').click(function() {
        const query = $('#searchInput').val().toLowerCase();
        if (query) {
            window.location.href = `products.html?search=${encodeURIComponent(query)}`;
        }
    });

    $('#searchInput').keypress(function(e) {
        if (e.which === 13) {
            $('#searchBtn').click();
        }
    });
}

// Filter products by search
function filterProducts(searchQuery) {
    if (!searchQuery) return products;
    
    return products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
}

// Initialize pages
$(document).ready(function() {
    updateCartCount();
    setupSearch();

    // Home page
    if ($('#featuredProducts').length) {
        renderFeaturedProducts();
    }

    // Products page
    if ($('#allProducts').length) {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        
        if (searchQuery) {
            const filtered = filterProducts(searchQuery);
            $('#allProducts').html(filtered.map(p => renderProductCard(p)).join(''));
            $('#searchResultsTitle').text(`Search Results for "${searchQuery}"`);
        } else {
            renderAllProducts();
        }

        $('.product-card').click(function(e) {
            if (!$(e.target).hasClass('add-to-cart')) {
                const productId = $(this).data('product-id');
                window.location.href = `product-detail.html?id=${productId}`;
            }
        });
    }

    // Product detail page
    if ($('#detailName').length) {
        renderProductDetail();
    }

    // Cart page
    if ($('#cartItems').length) {
        renderCart();
    }

    // Checkout page
    if ($('#checkoutForm').length) {
        renderOrderSummary();
        $('#checkoutBtn').click(processCheckout);
    }

    // Confirmation page
    if ($('#confirmationContent').length) {
        const urlParams = new URLSearchParams(window.location.search);
        const orderNumber = urlParams.get('order');
        
        if (orderNumber) {
            $('#orderNumberDisplay').text(orderNumber);
        }
    }

    // Set active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    $(`.nav a[href="${currentPage}"]`).addClass('active');
});
