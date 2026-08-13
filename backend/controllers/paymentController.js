const Stripe = require("stripe");
const Order = require("../models/Order");
const asyncHandler = require("../middleware/asyncHandler");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const SUPPORTED_CURRENCIES = ["usd", "etb", "ngn", "kes", "aed", "sar", "egp"];

// POST /api/payment/stripe/create-session
const createStripeSession = async (req, res) => {
  try {
    const { items, destination, courier, discountRatio = 0, currency = "USD", exchangeRate = 1 } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: "No items provided" });

    const ratio = Number(discountRatio) || 0;
    const rate = Number(exchangeRate) > 0 ? Number(exchangeRate) : 1;
    const activeCurrency = SUPPORTED_CURRENCIES.includes(
      String(currency).toLowerCase()
    )
      ? String(currency).toLowerCase()
      : "usd";

    // Separate cart items from fee items (freight, tax, discount)
    const cartItems = items.filter((i) => i.product);
    const feeItems = items.filter((i) => !i.product);

    // Prices arrive already converted to the customer's local currency
    const cartLineItems = cartItems.map((item) => {
      const chargedPrice = Math.max(0, (item.price || 0) * (1 - ratio));
      return {
        price_data: {
          currency: activeCurrency,
          product_data: { name: item.name },
          unit_amount: Math.round(chargedPrice * 100),
        },
        quantity: item.quantity,
      };
    });

    // Fee line items (freight, tax) — discounts are skipped for Stripe
    const feeLineItems = feeItems
      .filter((i) => i.price > 0)
      .map((item) => ({
        price_data: {
          currency: activeCurrency,
          product_data: { name: item.name },
          unit_amount: Math.round(Math.abs(item.price) * 100),
        },
        quantity: 1,
      }));

    const lineItems = [...cartLineItems, ...feeLineItems];

    // Store totals in USD so the existing display pipeline keeps working
    const grandTotalLocal = items.reduce(
      (sum, i) => sum + (i.price || 0) * i.quantity,
      0
    );
    const safeTotal = Math.round((grandTotalLocal / rate) * 100) / 100;

    // FIX 2: Create order with "Pending" status — only confirmed after webhook
    const order = await Order.create({
      user: req.user._id,
      items: cartItems.map((item) => ({
        product: item.product || undefined,
        name: item.name,
        price: Math.round(((item.price || 0) / rate) * 100) / 100,
        quantity: item.quantity,
      })),
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
        currency: activeCurrency,
        exchangeRate: String(rate),
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
      const rate =
        Number(session.metadata?.exchangeRate) > 0
          ? Number(session.metadata?.exchangeRate)
          : 1;
      // Reconcile the stored USD total against Stripe's actual charge
      const usdTotal =
        Math.round(((session.amount_total || 0) / 100 / rate) * 100) / 100;
      await Order.findByIdAndUpdate(session.metadata.orderId, {
        status: "Processing",
        total: usdTotal,
      });
      console.log("✅ Order confirmed by Stripe:", session.metadata.orderId, "→", usdTotal, "USD");
    }
  }

  res.status(200).json({ received: true });
};

module.exports = {
  createStripeSession: asyncHandler(createStripeSession),
  stripeWebhook: asyncHandler(stripeWebhook),
};
