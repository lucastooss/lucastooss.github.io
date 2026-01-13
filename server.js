require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const axios = require('axios')(process.env.FORMSPREE_URL);
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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


app.post('/send-contact', async (req, res) => {
    try {
        const formspreeUrl = process.env.FORMSPREE_URL;

        if (!formspreeUrl) {
            console.error('Fehler: FORMSPREE_URL Umgebungsvariable ist nicht gesetzt.');
            return res.status(500).send('Server-Konfigurationsfehler.');
        }

        const response = await axios.post(formspreeUrl, req.body, {
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.status === 200) {
            res.redirect('https://lucastooss.github.io/confirmed/index.html');
        } else {
            res.status(500).send('Fehler beim Versand über Formspree.');
        }
    } catch (error) {
        console.error('Fehler bei der Formspree-Weiterleitung:', error.message);
        res.status(500).send('Interner Serverfehler.');
    }
});

// Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));