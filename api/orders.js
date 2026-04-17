const { createOrder, getAllOrders, getUserOrders, getOrderById, updateOrderStatus, getOrderAnalytics } = require("./_orders");
const { verifyJwt, getTokenFromRequest } = require("./_auth");
const { awardPoints } = require("./_points");

function setHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
  res.setHeader("Content-Type", "application/json");
}

function extractToken(req) {
  let token = null;
  const cookies = req.headers.cookie?.split("; ") || [];
  for (const cookie of cookies) {
    if (cookie.startsWith("booknest_session=")) {
      token = cookie.slice(17);
      break;
    }
  }

  if (!token) {
    const authHeader = req.headers.authorization || "";
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }
  }

  return token;
}

module.exports = async (req, res) => {
  setHeaders(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  try {
    if (pathname.includes("/api/orders/create")) return handleCreate(req, res);
    if (pathname.includes("/api/orders/list")) return handleList(req, res);
    if (pathname.includes("/api/orders/update-status")) return handleUpdateStatus(req, res);
    if (pathname.includes("/api/orders/analytics")) return handleAnalytics(req, res);

    return res.status(404).json({ error: "Orders endpoint not found" });
  } catch (error) {
    console.error("[ORDERS ERROR]", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

async function handleCreate(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { userId, userName, userEmail, items, total, paymentId } = req.body;

    if (!userId || !userEmail || !items || !Array.isArray(items) || !total) {
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

    // Award points
    awardPoints(userId, userName, total, order.id);

    return res.status(201).json({
      success: true,
      order,
      points: `${Math.floor(total)} points awarded!`,
    });
  } catch (error) {
    console.error("[CREATE ORDER ERROR]", error);
    return res.status(500).json({ error: "Failed to create order" });
  }
}

async function handleList(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "No authentication token provided",
      });
    }

    let payload;
    try {
      payload = verifyJwt(token);
    } catch (e) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid or expired token",
      });
    }

    if (!payload) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const orders =
      payload.role === "admin" ? getAllOrders() : getUserOrders(payload.sub || payload.email);

    return res.status(200).json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (error) {
    console.error("[LIST ORDERS ERROR]", error);
    return res.status(500).json({ error: "Failed to list orders" });
  }
}

async function handleUpdateStatus(req, res) {
  if (req.method !== "PUT") return res.status(405).json({ error: "Method not allowed" });

  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let payload;
    try {
      payload = verifyJwt(token);
    } catch (e) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (payload.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { orderId, status, note } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ error: "Missing required fields: orderId, status" });
    }

    const order = updateOrderStatus(orderId, status, note);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json({
      success: true,
      order,
      message: `Order status updated to ${status}`,
    });
  } catch (error) {
    console.error("[UPDATE ORDER STATUS ERROR]", error);
    return res.status(500).json({ error: "Failed to update order status" });
  }
}

async function handleAnalytics(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let payload;
    try {
      payload = verifyJwt(token);
    } catch (e) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (payload.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const analytics = getOrderAnalytics();

    return res.status(200).json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error("[ORDER ANALYTICS ERROR]", error);
    return res.status(500).json({ error: "Failed to get analytics" });
  }
}
