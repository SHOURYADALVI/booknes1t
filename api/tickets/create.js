const { createTicket } = require("../_tickets");
const { verifyJwt } = require("../_auth");

/**
 * POST /api/tickets/create
 * Create a new support ticket (customer)
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

    const { bookId, bookTitle, orderId, subject, description, category, priority, attachments } = req.body;

    if (!subject || !description || !bookId) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["subject", "description", "bookId"],
      });
    }

    const ticket = createTicket({
      userId: payload.sub,
      userName: payload.name || "Customer",
      userEmail: payload.sub,
      bookId,
      bookTitle,
      orderId,
      subject,
      description,
      category,
      priority,
      attachments,
    });

    return res.status(201).json({
      success: true,
      ticket,
      message: `Ticket ${ticket.id} created successfully`,
    });
  } catch (error) {
    console.error("Create ticket error:", error);
    return res.status(500).json({
      error: "Failed to create ticket",
      details: error.message,
    });
  }
};
