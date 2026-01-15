const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://lucastooss-github-io.onrender.com';

let stripe;

async function initializeStripe() {
    try {
        const response = await fetch(`${API_BASE_URL}/config`);
        const { publishableKey } = await response.json();
        stripe = Stripe(publishableKey);
    } catch (error) {
        console.error("Stripe konnte nicht initialisiert werden:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeStripe();
    renderCart(); 
    
    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            startStripeCheckout();
        };
    }
});

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-items-container');
    const summaryCard = document.querySelector('.cart-summary-card');
    let subtotal = 0;

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = "<p style='text-align:center; padding:50px; font-family:Poppins, sans-serif;'>Dein Warenkorb ist zurzeit leer.</p>";
        if (summaryCard) summaryCard.style.display = 'none';
        updateTotals(0);
        return;
    }

    if (summaryCard) summaryCard.style.display = 'block'; 

    container.innerHTML = '';
    cart.forEach((item, index) => {
        const itemTotal = item.price * (item.quantity || 1);
        subtotal += itemTotal;

        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <strong>${item.name}</strong>
                    <span>Farbe: ${item.color}</span>
                    <span>Einzelpreis: CHF ${item.price.toFixed(2)}</span>
                </div>
                <div class="quantity-controls">
                    <button onclick="changeQuantity(${index}, -1)">-</button>
                    <span>${item.quantity || 1}</span>
                    <button onclick="changeQuantity(${index}, 1)">+</button>
                </div>
                <div class="item-total-price">
                    CHF ${itemTotal.toFixed(2)}
                </div>
                <button class="remove-btn" onclick="removeItem(${index})" title="Entfernen">×</button>
            </div>
        `;
    });
    updateTotals(subtotal);
}

function changeQuantity(index, delta) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart[index].quantity = (cart[index].quantity || 1) + delta;
    if (cart[index].quantity < 1) removeItem(index);
    else {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function updateTotals(subtotal) {
    const shipping =  10;
    const total = subtotal + shipping;
    
    const subtotalElement = document.getElementById('subtotal');
    const grandTotalElement = document.getElementById('grand-total');
    
    if (subtotalElement) subtotalElement.innerText = `CHF ${subtotal.toFixed(2)}`;
    if (grandTotalElement) grandTotalElement.innerText = `CHF ${total.toFixed(2)}`;
}

async function startStripeCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) return alert("Warenkorb leer!");

    try {
        const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: cart }),
        });

        const session = await response.json();
        
        if (session.url) {
            window.location.href = session.url; 
        } else {
            alert("Fehler beim Erstellen der Session.");
        }
    } catch (error) {
        console.error("Fehler:", error);
        alert("Server nicht erreichbar.");
    }
}