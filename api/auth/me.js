const { getTokenFromRequest, sanitizeUser, verifyJwt } = require("../_auth");

function setSecurityHeaders(res, origin) {
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");
}

module.exports = async (req, res) => {
  setSecurityHeaders(res, req.headers.origin);

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const token = getTokenFromRequest(req);
    const payload = verifyJwt(token);

    if (!payload) {
      return res.status(401).json({ authenticated: false });
    }

    return res.status(200).json({
      authenticated: true,
      user: sanitizeUser(payload),
    });
  } catch (error) {
    console.error("Auth session error:", error);
    return res.status(500).json({ error: "Failed to load session" });
  }
};