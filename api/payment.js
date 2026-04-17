const Razorpay = require("razorpay");
const crypto = require("crypto");

function setHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");
}

module.exports = async (req, res) => {
  setHeaders(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  try {
    if (pathname.includes("/api/payment/create")) return handleCreateOrder(req, res);
    if (pathname.includes("/api/payment/verify")) return handleVerify(req, res);

    return res.status(404).json({ error: "Payment endpoint not found" });
  } catch (error) {
    console.error("[PAYMENT ERROR]", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

async function handleCreateOrder(req, res) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return res.status(500).json({
      error: "Razorpay keys not configured",
      hint: "Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to Vercel Environment Variables",
    });
  }

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount, currency = "INR", receipt } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Valid amount is required" });
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // rupees → paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: { source: "BookNest Online Store" },
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return res.status(500).json({
      error: "Failed to create payment order",
      details: error.message,
    });
  }
}

async function handleVerify(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing required payment fields" });
    }

    // In test mode (no RAZORPAY_KEY_SECRET), auto-approve for testing
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.log("TEST MODE: Auto-approving payment for order", razorpay_order_id);
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully (test mode)",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        timestamp: new Date().toISOString(),
      });
    }

    // Production mode: verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        timestamp: new Date().toISOString(),
      });
    } else {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({
      error: "Payment verification failed",
      details: error.message,
    });
  }
}
