const { getOrderAnalytics, getAllOrders } = require("../_orders");
const { getAllReviews } = require("../_reviews");
const { getPointsStore } = require("../_points");
const { verifyJwt } = require("../_auth");
const { calculateAdvancedAnalytics } = require("../_advancedAnalytics");

/**
 * GET /api/orders/analytics
 * Get order analytics including CRM insights (admin only)
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
        message: "Only admins can access analytics",
      });
    }

    // Get basic analytics
    const basicAnalytics = getOrderAnalytics();
    
    // Get advanced analytics with CRM insights
    const ordersData = getAllOrders();
    const reviewsData = getAllReviews();
    const pointsData = getPointsStore();
    
    console.log(`[ANALYTICS] Fetching data for admin user: ${payload.sub}`);
    console.log(`[ANALYTICS] Orders: ${ordersData.length}, Reviews: ${reviewsData.length}, Points customers: ${pointsData.size}`);
    
    const advancedAnalytics = calculateAdvancedAnalytics(ordersData, reviewsData, pointsData);

    return res.status(200).json({
      success: true,
      analytics: basicAnalytics,
      advanced: advancedAnalytics,
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    return res.status(500).json({
      error: "Failed to fetch analytics",
      details: error.message,
    });
  }
};
