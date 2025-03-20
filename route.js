async function handler({ amount, currency, address, items }) {
  if (!amount || !currency || !address || !items || !Array.isArray(items)) {
    return {
      error: "Missing required fields",
    };
  }

  if (
    !address.fullName ||
    !address.street ||
    !address.city ||
    !address.pinCode ||
    !address.phone
  ) {
    return {
      error: "Invalid address information",
    };
  }

  if (amount <= 0) {
    return {
      error: "Amount must be greater than 0",
    };
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        address: JSON.stringify(address),
        items: JSON.stringify(items),
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    return {
      error: error.message || "Payment intent creation failed",
    };
  }
}