const { createOrder, getUserOrders, getOrderById } = require("../_orders");
const { awardPoints } = require("../_points");

/**
 * POST /api/orders/create
 * Create a new order after payment verification
 * Body: { userId, userName, userEmail, items, total, paymentId }
 */
module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { userId, userName, userEmail, items, total, paymentId } = req.body;

    console.log("Creating order:", { userId, userEmail, itemsCount: items?.length, total, paymentId });

    if (!userId || !userEmail || !items || !Array.isArray(items) || !total) {
      console.warn("Missing fields:", { userId, userEmail, items, total });
      return res.status(400).json({
        error: "Missing required fields: userId, userEmail, items, total",
      });
    }

    if (items.length === 0) {
      return res.status(400).json({ error: "Order must contain at least one item" });
    }

    const order = createOrder({
      userId,
      userName,
      userEmail,
      items,
      total,
      paymentId,
    });

    // Award loyalty points on order completion
    const pointsAwarded = awardPoints(userId, userName, total, order.id);

    console.log("Order created successfully:", order.id);
    console.log(`Awarded ${pointsAwarded.balance} points to customer`);

    return res.status(201).json({
      success: true,
      order,
      pointsAwarded: pointsAwarded.balance,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({
      error: "Failed to create order",
      details: error.message,
    });
  }
};
