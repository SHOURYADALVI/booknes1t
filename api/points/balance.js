const { getPointsInfo, getPointsConfig } = require("../_points");
const { verifyJwt } = require("../_auth");

/**
 * GET /api/points/balance
 * Get user's points balance and info (authenticated)
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

    // Verify JWT
    let payload;
    try {
      payload = verifyJwt(token);
    } catch (e) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const pointsInfo = getPointsInfo(payload.sub);
    const config = getPointsConfig();

    console.log(`[POINTS BALANCE] User ${payload.sub}: ${pointsInfo.balance} points`);

    return res.status(200).json({
      success: true,
      points: pointsInfo,
      config,
    });
  } catch (error) {
    console.error("Get points error:", error);
    return res.status(500).json({
      error: "Failed to fetch points",
      details: error.message,
    });
  }
};
