const { getPointsInfo, getPointsConfig, redeemPoints } = require("./_points");
const { verifyJwt, getTokenFromRequest } = require("./_auth");

function setHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
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
    if (pathname.includes("/api/points/balance")) return handleBalance(req, res);
    if (pathname.includes("/api/points/redeem")) return handleRedeem(req, res);

    return res.status(404).json({ error: "Points endpoint not found" });
  } catch (error) {
    console.error("[POINTS ERROR]", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

async function handleBalance(req, res) {
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

    const pointsInfo = getPointsInfo(payload.sub || payload.email);
    const config = getPointsConfig();

    return res.status(200).json({
      success: true,
      points: pointsInfo,
      config,
      formatted: {
        balance: `${pointsInfo.balance} points`,
        discountValue: `₹${pointsInfo.discountValue.toFixed(2)}`,
        totalEarned: `${pointsInfo.totalEarned} points`,
        totalRedeemed: `${pointsInfo.totalRedeemed} points`,
      },
    });
  } catch (error) {
    console.error("[GET BALANCE ERROR]", error);
    return res.status(500).json({ error: "Failed to get points balance" });
  }
}

async function handleRedeem(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

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

    const { pointsToRedeem } = req.body;

    if (!pointsToRedeem || pointsToRedeem <= 0) {
      return res.status(400).json({ error: "Invalid points amount" });
    }

    const result = redeemPoints(payload.sub || payload.email, pointsToRedeem);

    return res.status(200).json({
      success: true,
      discountAmount: result.discountAmount,
      remainingBalance: result.remainingBalance,
      message: `${pointsToRedeem} points redeemed for ₹${result.discountAmount.toFixed(2)} discount`,
    });
  } catch (error) {
    console.error("[REDEEM POINTS ERROR]", error);
    const message = error.message || "Failed to redeem points";
    return res.status(400).json({ error: message });
  }
}
