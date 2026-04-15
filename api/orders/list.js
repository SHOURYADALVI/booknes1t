const { getAllOrders, getUserOrders } = require("../_orders");
const { verifyJwt } = require("../_auth");

/**
 * GET /api/orders/list
 * Get user's orders (authenticated) or all orders (admin)
 * Query: ?role=admin to force admin list
 */
module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

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
      return res.status(401).json({
        error: "Unauthorized",
        message: "No authentication token provided",
      });
    }

    // Verify JWT and get user info
    let payload;
    try {
      payload = verifyJwt(token);
    } catch (e) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid or expired token",
      });
    }

    // Debug: Log the full JWT payload
    console.log("[ORDERS LIST] JWT Payload keys:", Object.keys(payload || {}));
    console.log("[ORDERS LIST] Full Payload:", { email: payload?.email, sub: payload?.sub, role: payload?.role });

    // Admin gets all orders, user gets their own orders
    const orders =
      payload.role === "admin"
        ? getAllOrders()
        : getUserOrders(payload.sub);

    console.log(`[ORDERS LIST] User: ${payload.sub}, Role: ${payload.role}, Found: ${orders.length} orders`);

    return res.status(200).json({
      success: true,
      orders,
      isAdmin: payload.role === "admin",
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({
      error: "Failed to fetch orders",
      details: error.message,
    });
  }
};
