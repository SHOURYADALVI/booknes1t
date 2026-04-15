const { addAdminNote, getTicketById } = require("../_tickets");
const { verifyJwt } = require("../_auth");

/**
 * POST /api/tickets/add-note
 * Add admin note to ticket (admin only)
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

    const { ticketId, note } = req.body;

    if (!ticketId || !note) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["ticketId", "note"],
      });
    }

    const ticket = getTicketById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    const updated = addAdminNote(ticketId, payload.sub, note);

    return res.status(200).json({
      success: true,
      ticket: updated,
      message: "Note added successfully",
    });
  } catch (error) {
    console.error("Add note error:", error);
    return res.status(500).json({
      error: "Failed to add note",
      details: error.message,
    });
  }
};
