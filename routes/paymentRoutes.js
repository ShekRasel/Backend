// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Service = require('../models/Service');

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
            unit_amount: amount * 100, 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/orders`, 
      cancel_url: `${process.env.CLIENT_URL}/orders`, 
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/payment-success', async (req, res) => {
  const { session_id, service_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      // Update the service as paid
      await Service.findByIdAndUpdate(service_id, { paid: true });
    }

    res.redirect(`${process.env.CLIENT_URL}/services`);
  } catch (error) {
    console.error('Error handling payment success:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
