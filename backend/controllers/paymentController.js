const Stripe = require("stripe");
const Order = require("../models/Order");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createStripeSession = async (req, res) => {
  try {
    const { items, destination, courier } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: "No items provided" });

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round((item.price || 0) * 100),
      },
      quantity: item.quantity,
    }));

    const order = await Order.create({
      user: req.user._id,
      items: items.map((item) => ({
        product: item.product || undefined,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      destination: destination || "",
      courier: courier || "Regional Freight",
      status: "Processing",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/checkout/success?order_id=${order._id}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
      },
    });

    res.json({ url: session.url, sessionId: session.id, orderId: order._id });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ message: "Payment service unavailable. Try again later." });
  }
};

// POST /api/payment/stripe/webhook  — Stripe calls this after payment
const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  console.log("🔑 Webhook Secret: ", process.env.STRIPE_WEBHOOK_SECRET ? "✅ Loaded" : "❌ NOT LOADED");
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
     console.log("✅ Webhook signature verified!"); // ✅ Add t
  } catch {
    return res.status(400).json({ message: "Webhook signature failed" });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.metadata?.orderId) {
      await Order.findByIdAndUpdate(session.metadata.orderId, {
        status: "Processing",
        paymentConfirmed: true,
      });
      console.log("✅ Order confirmed:", session.metadata.orderId);
    }
  }

  res.json({ received: true });
};

module.exports = { createStripeSession, stripeWebhook };
