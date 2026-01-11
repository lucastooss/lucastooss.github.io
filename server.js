const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Zieht den Key sicher von Render
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.post('/create-checkout-session', async (req, res) => {
    try {
        const { items } = req.body;
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map(item => ({
                price: item.id, 
                quantity: item.quantity,
            })),
            mode: 'payment',
            billing_address_collection: 'required',
            // Deine finale Domain!
            success_url: 'https://lazj.ch/confirmed/confirmed.html',
            cancel_url: 'https://lazj.ch/shopcart/shopcart.html',
        });
        res.json({ url: session.url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(process.env.PORT || 3000, () => console.log('Server läuft'));
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.post('/create-checkout-session', async (req, res) => {
    try {
        const { items } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map(item => ({
                price: item.id, // Die Price-ID aus deinem Warenkorb (z.B. price_1SoO2o...)
                quantity: item.quantity,
            })),
            mode: 'payment',
            billing_address_collection: 'required',
            // Passe die URLs an deine lokale Umgebung an (meist Port 5500 bei Live Server)
            success_url: 'http://127.0.0.1:5500/confirmed/confirmed.html',
            cancel_url: 'http://127.0.0.1:5500/shopcart/shopcart.html',
        });

        res.json({ url: session.url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(3000, () => console.log('Backend läuft auf http://localhost:3000'));