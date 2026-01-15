require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.get('/config', (req, res) => {
    res.json({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        shippingCost: parseFloat(process.env.SHIPPING_COST_CHF || 10)
    });
});

app.post('/create-checkout-session', async (req, res) => {
    try {
        const { items } = req.body;
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'twint'], 
            line_items: items.map(item => ({
                price: item.id, 
                quantity: item.quantity,
            })),
            mode: 'payment',
            billing_address_collection: 'required',
            
            shipping_options: [
                {
                    shipping_rate: process.env.STRIPE_SHIPPING_RATE_ID,
                },
            ],
            shipping_address_collection: {
                allowed_countries: ['CH'],
            },

            success_url: 'https://lazj.ch/confirmed/',
            cancel_url: 'https://lazj.ch/shopcart/',
        });
        res.json({ url: session.url });
    } catch (e) {
        console.error("Stripe Fehler:", e.message);
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));