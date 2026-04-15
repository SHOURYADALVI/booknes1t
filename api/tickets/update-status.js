const { updateTicketStatus, getTicketById } = require("../_tickets");
const { verifyJwt } = require("../_auth");

/**
 * POST /api/tickets/update-status
 * Update ticket status (admin only)
 */
module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

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

    const { ticketId, status } = req.body;

    if (!ticketId || !status) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["ticketId", "status"],
      });
    }

    const ticket = getTicketById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    const updated = updateTicketStatus(ticketId, status, payload.sub);

    return res.status(200).json({
      success: true,
      ticket: updated,
      message: `Ticket status updated to ${status}`,
    });
  } catch (error) {
    console.error("Update ticket status error:", error);
    return res.status(500).json({
      error: "Failed to update ticket",
      details: error.message,
    });
  }
};
