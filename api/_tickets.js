// ── Issue Ticket Management System ─────────────────────────────────────────
// Handles customer complaint tickets and admin resolution workflow

let ticketsStore = [];
let ticketIdCounter = 5000;

const TICKET_STATUS = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

const TICKET_PRIORITY = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

/**
 * Create a new issue ticket
 */
function createTicket(ticketData) {
  const ticketId = `TKT-${Date.now()}-${++ticketIdCounter}`;
  const now = new Date().toISOString();

  const ticket = {
    id: ticketId,
    userId: ticketData.userId, // Customer email
    userName: ticketData.userName,
    userEmail: ticketData.userEmail,
    bookId: ticketData.bookId,
    bookTitle: ticketData.bookTitle,
    orderId: ticketData.orderId || null,
    subject: ticketData.subject,
    description: ticketData.description,
    category: ticketData.category || "Quality", // Quality, Delivery, Wrong Item, Damaged, Other
    priority: ticketData.priority || TICKET_PRIORITY.MEDIUM,
    status: TICKET_STATUS.OPEN,
    createdAt: now,
    updatedAt: now,
    resolvedAt: null,
    adminNotes: [],
    attachments: ticketData.attachments || [],
    assignedTo: null, // Admin user email
  };

  ticketsStore.push(ticket);
  console.log(`[_TICKETS] Ticket created: ${ticketId} by ${ticketData.userId}`);
  return ticket;
}

/**
 * Get all tickets (admin only)
 */
function getAllTickets() {
  return ticketsStore.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Get tickets by user
 */
function getUserTickets(userId) {
  return ticketsStore
    .filter(t => t.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Get ticket by ID
 */
function getTicketById(ticketId) {
  return ticketsStore.find(t => t.id === ticketId);
}

/**
 * Update ticket status
 */
function updateTicketStatus(ticketId, newStatus, assignedTo = null) {
  const ticket = getTicketById(ticketId);
  if (!ticket) return null;

  ticket.status = newStatus;
  ticket.updatedAt = new Date().toISOString();
  ticket.assignedTo = assignedTo;

  if (newStatus === TICKET_STATUS.RESOLVED || newStatus === TICKET_STATUS.CLOSED) {
    ticket.resolvedAt = new Date().toISOString();
  }

  console.log(`[_TICKETS] Ticket ${ticketId} status updated to ${newStatus}`);
  return ticket;
}

/**
 * Add admin note to ticket
 */
function addAdminNote(ticketId, adminEmail, note) {
  const ticket = getTicketById(ticketId);
  if (!ticket) return null;

  ticket.adminNotes.push({
    id: `NOTE-${Date.now()}`,
    adminEmail,
    text: note,
    createdAt: new Date().toISOString(),
  });

  ticket.updatedAt = new Date().toISOString();
  console.log(`[_TICKETS] Note added to ticket ${ticketId}`);
  return ticket;
}

/**
 * Get ticket statistics
 */
function getTicketStats() {
  return {
    total: ticketsStore.length,
    open: ticketsStore.filter(t => t.status === TICKET_STATUS.OPEN).length,
    inProgress: ticketsStore.filter(t => t.status === TICKET_STATUS.IN_PROGRESS).length,
    resolved: ticketsStore.filter(t => t.status === TICKET_STATUS.RESOLVED).length,
    closed: ticketsStore.filter(t => t.status === TICKET_STATUS.CLOSED).length,
    byPriority: {
      critical: ticketsStore.filter(t => t.priority === TICKET_PRIORITY.CRITICAL).length,
      high: ticketsStore.filter(t => t.priority === TICKET_PRIORITY.HIGH).length,
      medium: ticketsStore.filter(t => t.priority === TICKET_PRIORITY.MEDIUM).length,
      low: ticketsStore.filter(t => t.priority === TICKET_PRIORITY.LOW).length,
    },
    avgResolutionTime: calculateAvgResolutionTime(),
  };
}

function calculateAvgResolutionTime() {
  const resolved = ticketsStore.filter(t => t.resolvedAt);
  if (resolved.length === 0) return 0;

  const totalTime = resolved.reduce((sum, t) => {
    const created = new Date(t.createdAt);
    const resolved = new Date(t.resolvedAt);
    return sum + (resolved - created);
  }, 0);

  const hours = Math.round((totalTime / resolved.length) / (1000 * 60 * 60));
  return hours;
}

module.exports = {
  createTicket,
  getAllTickets,
  getUserTickets,
  getTicketById,
  updateTicketStatus,
  addAdminNote,
  getTicketStats,
  TICKET_STATUS,
  TICKET_PRIORITY,
};
