import { useTickets } from "../hooks/useTickets.js";
import { useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import "./CustomerTicketsPage.css";

export default function CustomerTicketsPage() {
  const { tickets, loading, error, fetchUserTickets } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchUserTickets();
  }, []);

  const STATUS_COLORS = {
    Open: "#ef4444",
    "In Progress": "#f59e0b",
    Resolved: "#10b981",
    Closed: "#6b7280",
  };

  const PRIORITY_COLORS = {
    Low: "#10b981",
    Medium: "#f59e0b",
    High: "#ef4444",
    Critical: "#8b5cf6",
  };

  // Filter tickets
  const filteredTickets = tickets.filter(t => filterStatus === "all" || t.status === filterStatus);

  // Sort by newest first
  const sortedTickets = [...filteredTickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading && !tickets.length) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "var(--muted)" }}>
        Loading your tickets...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, background: "rgba(239, 68, 68, 0.1)", borderRadius: "var(--radius)", color: "#ef4444", border: "1px solid #ef4444" }}>
        {error}
      </div>
    );
  }

  return (
    <div className="customer-tickets-page">
      <div className="page-header">
        <h1>My Support Tickets</h1>
        <p className="page-subtitle">Track your complaints and resolutions</p>
      </div>

      {/* Filter */}
      <div className="filter-bar">
        <label>Filter by Status:</label>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="status-filter">
          <option value="all">All Tickets ({tickets.length})</option>
          <option value="Open">Open ({tickets.filter(t => t.status === "Open").length})</option>
          <option value="In Progress">In Progress ({tickets.filter(t => t.status === "In Progress").length})</option>
          <option value="Resolved">Resolved ({tickets.filter(t => t.status === "Resolved").length})</option>
          <option value="Closed">Closed ({tickets.filter(t => t.status === "Closed").length})</option>
        </select>
      </div>

      {/* Tickets List */}
      {sortedTickets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No tickets yet</h3>
          <p>You haven't raised any complaints yet. If you have an issue with a delivered product, please create a support ticket.</p>
        </div>
      ) : (
        <div className="tickets-list">
          {sortedTickets.map(ticket => (
            <div
              key={ticket.id}
              className={`ticket-card priority-${ticket.priority.toLowerCase()}`}
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="ticket-card-header">
                <div className="ticket-id-badge">{ticket.id}</div>
                <span className="status-badge" style={{ background: STATUS_COLORS[ticket.status] }}>
                  {ticket.status}
                </span>
              </div>

              <h3 className="ticket-subject">{ticket.subject}</h3>

              <div className="ticket-meta">
                <span className="meta-item">
                  <span className="label">Book:</span> {ticket.bookTitle}
                </span>
                <span className="meta-item">
                  <span className="label">Category:</span> {ticket.category || "General"}
                </span>
              </div>

              <div className="ticket-meta-bottom">
                <span className="priority-badge" style={{ background: PRIORITY_COLORS[ticket.priority] }}>
                  {ticket.priority} Priority
                </span>
                <span className="date">
                  {new Date(ticket.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {ticket.adminNotes && ticket.adminNotes.length > 0 && (
                <div className="notes-indicator">
                  <span className="note-count">{ticket.adminNotes.length} update{ticket.adminNotes.length !== 1 ? "s" : ""}</span>
                </div>
              )}

              <button className="view-details-btn">
                View Details <ChevronDown size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedTicket && (
        <div className="modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Ticket {selectedTicket.id}</h2>
                <p className="modal-subtitle">{selectedTicket.bookTitle}</p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Status & Priority */}
              <div className="status-section">
                <div className="status-item">
                  <span className="label">Current Status</span>
                  <span className="status-badge" style={{ background: STATUS_COLORS[selectedTicket.status] }}>
                    {selectedTicket.status}
                  </span>
                </div>
                <div className="status-item">
                  <span className="label">Priority</span>
                  <span className="priority-badge" style={{ background: PRIORITY_COLORS[selectedTicket.priority] }}>
                    {selectedTicket.priority}
                  </span>
                </div>
              </div>

              {/* Timeline */}
              <div className="timeline-section">
                <h4>Timeline</h4>
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-marker" style={{ background: STATUS_COLORS.Open }} />
                    <div className="timeline-content">
                      <div className="timeline-title">Ticket Created</div>
                      <div className="timeline-date">
                        {new Date(selectedTicket.createdAt).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>

                  {selectedTicket.resolvedAt && (
                    <div className="timeline-item">
                      <div className="timeline-marker" style={{ background: STATUS_COLORS.Resolved }} />
                      <div className="timeline-content">
                        <div className="timeline-title">Resolved</div>
                        <div className="timeline-date">
                          {new Date(selectedTicket.resolvedAt).toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Complaint Details */}
              <div className="details-section">
                <h4>Your Complaint</h4>

                <div className="detail-item">
                  <span className="detail-label">Subject</span>
                  <p className="detail-value">{selectedTicket.subject}</p>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Description</span>
                  <p className="detail-value">{selectedTicket.description}</p>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Category</span>
                  <p className="detail-value">{selectedTicket.category || "General Issue"}</p>
                </div>
              </div>

              {/* Admin Solutions */}
              {selectedTicket.adminNotes && selectedTicket.adminNotes.length > 0 && (
                <div className="solutions-section">
                  <h4>Solutions & Updates from Admin</h4>
                  <div className="solutions-list">
                    {selectedTicket.adminNotes.map((note, idx) => (
                      <div key={note.id} className="solution-card">
                        <div className="solution-header">
                          <span className="solution-number">Update {idx + 1}</span>
                          <span className="solution-date">
                            {new Date(note.createdAt).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <p className="solution-text">{note.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTicket.status === "Resolved" && (
                <div className="success-box">
                  <span className="success-icon">✓</span>
                  <div>
                    <div className="success-title">Issue Resolved</div>
                    <p>Thank you for bringing this to our attention. Your issue has been resolved.</p>
                  </div>
                </div>
              )}

              {selectedTicket.status === "Open" && (
                <div className="info-box">
                  <span className="info-icon">ℹ️</span>
                  <div>
                    <div className="info-title">Ticket Pending</div>
                    <p>Our support team will review your complaint and provide a solution shortly.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
