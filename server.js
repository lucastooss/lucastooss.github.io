const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
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
            success_url: 'https://lucastooss.github.io/confirmed/',
            cancel_url: 'https://lucastooss.github.io/shopcart/',
        });
        res.json({ url: session.url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(process.env.PORT || 3000, () => console.log('Server läuft'));