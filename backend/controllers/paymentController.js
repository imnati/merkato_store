const Stripe = require("stripe");
const Order = require("../models/Order");
const Product = require("../models/Product");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payment/stripe/create-session
const createStripeSession = async (req, res) => {
  try {
    const { items, destination, courier } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: "No items provided" });

    // Separate cart items from fee items (freight, tax, discount)
    const cartItems = items.filter((i) => i.product);
    const feeItems = items.filter((i) => !i.product);

    // Fetch prices from DB for cart items only
    const productIds = cartItems.map((i) => i.product).filter(Boolean);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    const cartLineItems = cartItems.map((item) => {
      const dbProduct = dbProducts.find(
        (p) => p._id.toString() === item.product
      );
      const safePrice = dbProduct
        ? dbProduct.discountPrice || dbProduct.price
        : item.price;
      return {
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: Math.round(safePrice * 100),
        },
        quantity: item.quantity,
      };
    });

    // Fee line items (freight, tax) — use client price, these are computed server-side in a real app
    const feeLineItems = feeItems
      .filter((i) => i.price > 0) // skip discounts for Stripe (handled in total)
      .map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: Math.round(Math.abs(item.price) * 100),
        },
        quantity: 1,
      }));

    const lineItems = [...cartLineItems, ...feeLineItems];

    const safeTotal = items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    // FIX 2: Create order with "Pending" status — only confirmed after webhook
    const order = await Order.create({
      user: req.user._id,
      items: cartItems.map((item) => {
        const dbProduct = dbProducts.find(
          (p) => p._id.toString() === item.product
        );
        return {
          product: item.product || undefined,
          name: item.name,
          price: dbProduct?.discountPrice || dbProduct?.price || item.price,
          quantity: item.quantity,
        };
      }),
      total: safeTotal,
      destination: destination || "",
      courier: courier || "Regional Freight",
      status: "Pending Payment",
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
    res.status(500).json({ message: "Payment service unavailable." });
  }
};

// POST /api/payment/stripe/webhook
const stripeWebhook = async (req, res) => {
  // FIX 3: Fail hard if webhook secret is missing
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("❌ STRIPE_WEBHOOK_SECRET is not set");
    return res.status(500).json({ message: "Webhook secret not configured" });
  }

  const sig = req.headers["stripe-signature"];
  if (!sig) return res.status(400).json({ message: "Missing stripe-signature header" });

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature failed:", err.message);
    return res.status(400).json({ message: "Webhook signature verification failed" });
  }

  // FIX 4: Only mark order as Processing after real payment confirmed by Stripe
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.metadata?.orderId) {
      await Order.findByIdAndUpdate(session.metadata.orderId, {
        status: "Processing",
      });
      console.log("✅ Order confirmed by Stripe:", session.metadata.orderId);
    }
  }

  res.status(200).json({ received: true });
};

module.exports = { createStripeSession, stripeWebhook };
