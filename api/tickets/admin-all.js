const { getAllTickets, getTicketStats } = require("../_tickets");
const { verifyJwt } = require("../_auth");

/**
 * GET /api/tickets/admin/all
 * Get all tickets (admin only)
 */
module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
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

    let payload;
    try {
      payload = verifyJwt(token);
    } catch (e) {
      return res.status(401).json({ error: "Invalid token" });
    }

    if (payload.role !== "admin") {
      return res.status(403).json({ error: "Forbidden - admin only" });
    }

    const tickets = getAllTickets();
    const stats = getTicketStats();

    return res.status(200).json({
      success: true,
      tickets,
      stats,
      count: tickets.length,
    });
  } catch (error) {
    console.error("Get admin tickets error:", error);
    return res.status(500).json({
      error: "Failed to fetch tickets",
      details: error.message,
    });
  }
};
