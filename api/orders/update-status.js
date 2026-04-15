const { updateOrderStatus } = require("../_orders");
const { verifyJwt } = require("../_auth");

/**
 * PATCH /api/orders/update-status
 * Update order status (admin only)
 * Body: { orderId, status, note }
 */
module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "PATCH") return res.status(405).json({ error: "Method not allowed" });

  try {
    // Extract JWT from Cookie or Authorization header
    let token = null;
    const cookies = req.headers.cookie?.split("; ") || [];
    for (const cookie of cookies) {
      if (cookie.startsWith("booknest_session=")) {
        token = cookie.slice(17); // "booknest_session=" is 17 chars
        break;
      }
    }

    if (!token) {
      const authHeader = req.headers.authorization || "";
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.slice(7);
      }
    }

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify JWT and check admin role
    let payload;
    try {
      payload = verifyJwt(token);
    } catch (e) {
      return res.status(401).json({ error: "Invalid token" });
    }

    if (payload.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden",
        message: "Only admins can update order status",
      });
    }

    const { orderId, status, note } = req.body;

    console.log(`[UPDATE STATUS] Admin: ${payload.sub}, Order: ${orderId}, New Status: ${status}`);

    if (!orderId || !status) {
      return res.status(400).json({
        error: "Missing required fields: orderId, status",
      });
    }

    const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status. Valid statuses: " + validStatuses.join(", "),
      });
    }

    const updatedOrder = updateOrderStatus(orderId, status, note || "");

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json({
      success: true,
      order: updatedOrder,
      message: `Order ${orderId} updated to ${status}`,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({
      error: "Failed to update order",
      details: error.message,
    });
  }
};
