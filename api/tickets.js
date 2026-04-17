const {
  createTicket,
  getAllTickets,
  getUserTickets,
  getTicketById,
  updateTicketStatus,
  addAdminNote,
} = require("./_tickets");
const { verifyJwt, getTokenFromRequest } = require("./_auth");

function setHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
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
    if (pathname.includes("/api/tickets/create")) return handleCreate(req, res);
    if (pathname.includes("/api/tickets/admin-all")) return handleAdminAll(req, res);
    if (pathname.includes("/api/tickets/user")) return handleUser(req, res);
    if (pathname.includes("/api/tickets/get")) return handleGet(req, res);
    if (pathname.includes("/api/tickets/update-status")) return handleUpdateStatus(req, res);
    if (pathname.includes("/api/tickets/add-note")) return handleAddNote(req, res);

    return res.status(404).json({ error: "Tickets endpoint not found" });
  } catch (error) {
    console.error("[TICKETS ERROR]", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

async function handleCreate(req, res) {
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

    const { bookId, bookTitle, orderId, subject, description, category, priority, attachments } = req.body;

    if (!subject || !description || !bookId) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["subject", "description", "bookId"],
      });
    }

    const ticket = createTicket({
      userId: payload.sub || payload.email,
      userName: payload.name || "Customer",
      userEmail: payload.sub || payload.email,
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
      message: "Ticket created successfully",
    });
  } catch (error) {
    console.error("[CREATE TICKET ERROR]", error);
    return res.status(500).json({ error: "Failed to create ticket" });
  }
}

async function handleGet(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const ticketId = url.searchParams.get("ticketId");

    if (!ticketId) {
      return res.status(400).json({ error: "Missing query parameter: ticketId" });
    }

    const ticket = getTicketById(ticketId);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error("[GET TICKET ERROR]", error);
    return res.status(500).json({ error: "Failed to get ticket" });
  }
}

async function handleUser(req, res) {
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

    const tickets = getUserTickets(payload.sub || payload.email);

    return res.status(200).json({
      success: true,
      tickets,
      count: tickets.length,
    });
  } catch (error) {
    console.error("[USER TICKETS ERROR]", error);
    return res.status(500).json({ error: "Failed to get user tickets" });
  }
}

async function handleAdminAll(req, res) {
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

    if (payload.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const tickets = getAllTickets();

    return res.status(200).json({
      success: true,
      tickets,
      count: tickets.length,
    });
  } catch (error) {
    console.error("[ADMIN ALL TICKETS ERROR]", error);
    return res.status(500).json({ error: "Failed to get tickets" });
  }
}

async function handleUpdateStatus(req, res) {
  if (req.method !== "PUT") return res.status(405).json({ error: "Method not allowed" });

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

    if (payload.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { ticketId, status, assignedTo } = req.body;

    if (!ticketId || !status) {
      return res.status(400).json({ error: "Missing required fields: ticketId, status" });
    }

    const ticket = updateTicketStatus(ticketId, status, assignedTo);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    return res.status(200).json({
      success: true,
      ticket,
      message: `Ticket status updated to ${status}`,
    });
  } catch (error) {
    console.error("[UPDATE TICKET STATUS ERROR]", error);
    return res.status(500).json({ error: "Failed to update ticket status" });
  }
}

async function handleAddNote(req, res) {
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

    if (payload.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { ticketId, note } = req.body;

    if (!ticketId || !note) {
      return res.status(400).json({ error: "Missing required fields: ticketId, note" });
    }

    const ticket = addAdminNote(ticketId, payload.sub || payload.email, note);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    return res.status(200).json({
      success: true,
      ticket,
      message: "Note added successfully",
    });
  } catch (error) {
    console.error("[ADD NOTE ERROR]", error);
    return res.status(500).json({ error: "Failed to add note" });
  }
}
