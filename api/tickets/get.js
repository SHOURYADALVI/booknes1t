const { getTicketById } = require("../_tickets");
const { verifyJwt } = require("../_auth");

/**
 * GET /api/tickets/:id
 * Get specific ticket (user can see own, admin can see all)
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

    const ticketId = req.url.split("/api/tickets/")[1]?.split("?")[0];

    if (!ticketId) {
      return res.status(400).json({ error: "Ticket ID required" });
    }

    const ticket = getTicketById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // Check authorization: user can only see their own, admins can see all
    if (payload.role !== "admin" && ticket.userId !== payload.sub) {
      return res.status(403).json({ error: "Forbidden - cannot access this ticket" });
    }

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error("Get ticket error:", error);
    return res.status(500).json({
      error: "Failed to fetch ticket",
      details: error.message,
    });
  }
};
