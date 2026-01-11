// Initialisierung mit deinem Test-Key
const stripe = Stripe('pk_test_51SoAsyIDfb6h5bqJKi8CCMimTIRafCflthIm6UVS6o7TNF97yLtt14aBkHFUE3htT0LQq3SnPuiDQEjaHxRlXRDi00VcigeJek');

document.addEventListener('DOMContentLoaded', () => {
    // Warenkorb beim Laden der Seite anzeigen
    renderCart(); 
    
    // Checkout-Button finden und Event verknüpfen
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
    let subtotal = 0;

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = "<p style='text-align:center; padding:50px; font-family:Poppins, sans-serif;'>Dein Warenkorb ist zurzeit leer.</p>";
        updateTotals(0);
        return;
    }

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
    const shipping = subtotal > 0 ? 10.00 : 0;
    const total = subtotal + shipping;
    document.getElementById('subtotal').innerText = `CHF ${subtotal.toFixed(2)}`;
    document.getElementById('grand-total').innerText = `CHF ${total.toFixed(2)}`;
}

/**
 * Erstellt eine Checkout-Session direkt im Browser.
 * Damit dies funktioniert, muss "Client-only integration" im Stripe Dashboard aktiviert sein!
 */
async function startStripeCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) return alert("Dein Warenkorb ist leer!");

    // Wir bauen die Liste der Produkte für Stripe zusammen
    const lineItems = cart.map(item => {
        return {
            price: item.id, // Das ist die Price-ID (z.B. price_1SoO...)
            quantity: item.quantity
        };
    });

    // Wir fügen die Versandkosten (CHF 10.00) hinzu
    // Falls du in Stripe bereits ein Versand-Objekt angelegt hast, nutze dessen Price-ID.
    // Falls nicht, kannst du hier die Weiterleitung starten:

    const { error } = await stripe.redirectToCheckout({
        lineItems: lineItems,
        mode: 'payment',
        // ACHTUNG: Passe diese URLs an, wenn deine Seite online ist
        successUrl: window.location.origin + '/confirmed/confirmed.html',
        cancelUrl: window.location.origin + '/shopcart/shopcart.html',
        billingAddressCollection: 'required', // Fragt nach der Rechnungsadresse
    });

    if (error) {
        console.error("Stripe Fehler:", error);
        alert("Es gab ein Problem beim Starten des Bezahlvorgangs: " + error.message);
    }
}