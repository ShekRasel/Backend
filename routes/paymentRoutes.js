// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  const { serviceId, amount } = req.body;

  console.log('Received request to create checkout session:', { serviceId, amount });
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'BDT',
            product_data: {
              name: 'Service Payment',
            },
            unit_amount: amount * 100, // Stripe expects the amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/services`, // Update to your client URL
      cancel_url: `${process.env.CLIENT_URL}/orders`, // Update to your client URL
    });

    console.log('Stripe checkout session created:', session);

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
