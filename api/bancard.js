const express = require('express');
const router = express.Router();
const { BANCARD_KEY } = process.env;

router.post('/pay', async (req, res) => {
  try {
    const { amount, currency, customer } = req.body;

    // Bancard API request
    const paymentRes = await fetch('https://api.bancard.com/payment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BANCARD_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        currency,
        customer,
        return_url: 'https://superspuma.paraguai.com/checkout/success'
      })
    });

    const data = await paymentRes.json();
    res.json({ payment_url: data.payment_url });
  } catch (error) {
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

module.exports = router;