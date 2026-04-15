const { redeemPoints } = require("../_points");
const { verifyJwt } = require("../_auth");

/**
 * POST /api/points/redeem
 * Redeem points for discount (authenticated)
 */
module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

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

    // Verify JWT
    let payload;
    try {
      payload = verifyJwt(token);
    } catch (e) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { points } = req.body || {};

    if (!points || points <= 0) {
      return res.status(400).json({ error: "Invalid points amount" });
    }

    if (!Number.isInteger(points)) {
      return res.status(400).json({ error: "Points must be an integer" });
    }

    const result = redeemPoints(payload.sub, points);

    console.log(`[POINTS REDEEM] User ${payload.sub} redeemed ${points} points for ₹${result.discountAmount}`);

    return res.status(200).json({
      success: true,
      discountAmount: result.discountAmount,
      pointsRedeemed: points,
      remainingBalance: result.remainingBalance,
    });
  } catch (error) {
    console.error("Redeem points error:", error);
    
    if (error.message.includes("Insufficient points")) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Failed to redeem points",
      details: error.message,
    });
  }
};
