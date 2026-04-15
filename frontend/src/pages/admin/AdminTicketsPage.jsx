import { useTickets } from "../../hooks/useTickets.js";
import { useEffect, useState } from "react";
import { X, ChevronDown, AlertCircle, CheckCircle, Clock, Zap } from "lucide-react";
import { useToast } from "../../hooks/useToast.js";
import "./AdminTicketsPage.css";

export default function AdminTicketsPage() {
  const { tickets, stats, loading, error, fetchAllTickets, updateStatus, addNote } = useTickets();
  const { showToast } = useToast();
  
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [updateStatusValue, setUpdateStatusValue] = useState("");

  useEffect(() => {
    fetchAllTickets();
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

  // Filter and sort tickets
  let filteredTickets = tickets.filter(t => {
    const matchesStatus = filterStatus === "all" || t.status === filterStatus;
    const matchesPriority = filterPriority === "all" || t.priority === filterPriority;
    const matchesSearch = searchQuery === "" || 
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bookTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  // Sort tickets
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "priority":
        const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      default:
        return 0;
    }
  });

  const handleUpdateStatus = async () => {
    if (!updateStatusValue) return;
    try {
      await updateStatus(selectedTicket.id, updateStatusValue);
      setUpdateStatusValue("");
      setSelectedTicket(prev => ({ ...prev, status: updateStatusValue }));
      showToast("Ticket status updated", "success");
    } catch (err) {
      showToast("Failed to update status", "error");
    }
  };

  const handleAddNote = async () => {
    if (!adminNote.trim()) return;
    try {
      await addNote(selectedTicket.id, adminNote);
      setAdminNote("");
      // Refresh selected ticket to show new note
      const updated = tickets.find(t => t.id === selectedTicket.id);
      if (updated) setSelectedTicket(updated);
      showToast("Note added successfully", "success");
    } catch (err) {
      showToast("Failed to add note", "error");
    }
  };

  if (loading && !tickets.length) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "var(--muted)" }}>
        Loading tickets...
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
    <div className="admin-tickets-page">
      {/* Stats Row */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-label">Total Tickets</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Open</div>
            <div className="stat-value" style={{ color: STATUS_COLORS.Open }}>
              {stats.byStatus?.Open || 0}
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-label">In Progress</div>
            <div className="stat-value" style={{ color: STATUS_COLORS["In Progress"] }}>
              {stats.byStatus?.["In Progress"] || 0}
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Avg Resolution</div>
            <div className="stat-value">{stats.avgResolutionTime || 0}h</div>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="filters-section">
        <input
          type="text"
          placeholder="Search by subject, email, or book..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="filter-select">
          <option value="all">All Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="filter-select">
          <option value="all">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="filter-select">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {/* Tickets Table */}
      <div className="tickets-container">
        {sortedTickets.length === 0 ? (
          <div style={{ padding: 30, textAlign: "center", color: "var(--muted)" }}>
            No tickets found
          </div>
        ) : (
          <div className="tickets-table-wrap">
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Customer</th>
                  <th>Book</th>
                  <th>Subject</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sortedTickets.map(ticket => (
                  <tr key={ticket.id} className={`ticket-row priority-${ticket.priority.toLowerCase()}`}>
                    <td className="ticket-id">{ticket.id}</td>
                    <td>
                      <div className="customer-info">
                        <div className="customer-name">{ticket.userName}</div>
                        <div className="customer-email">{ticket.userEmail}</div>
                      </div>
                    </td>
                    <td className="book-title">{ticket.bookTitle}</td>
                    <td className="subject">{ticket.subject}</td>
                    <td>
                      <span className="priority-badge" style={{ background: PRIORITY_COLORS[ticket.priority] }}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge" style={{ background: STATUS_COLORS[ticket.status] }}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="date-cell">
                      {new Date(ticket.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="view-btn"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedTicket && (
        <div className="modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ticket {selectedTicket.id}</h2>
              <button onClick={() => setSelectedTicket(null)} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Ticket Info */}
              <div className="ticket-info-grid">
                <div className="info-item">
                  <div className="info-label">Customer</div>
                  <div className="info-value">{selectedTicket.userName}</div>
                  <div className="info-detail">{selectedTicket.userEmail}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Book</div>
                  <div className="info-value">{selectedTicket.bookTitle}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Category</div>
                  <div className="info-value">{selectedTicket.category || "General"}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Created</div>
                  <div className="info-value">
                    {new Date(selectedTicket.createdAt).toLocaleDateString("en-IN")}
                  </div>
                </div>
              </div>

              {/* Subject & Description */}
              <div className="ticket-content">
                <div className="content-section">
                  <h4>Subject</h4>
                  <p>{selectedTicket.subject}</p>
                </div>
                <div className="content-section">
                  <h4>Description</h4>
                  <p>{selectedTicket.description}</p>
                </div>
              </div>

              {/* Admin Notes */}
              <div className="notes-section">
                <h4>Resolution Notes</h4>
                {selectedTicket.adminNotes && selectedTicket.adminNotes.length > 0 ? (
                  <div className="notes-list">
                    {selectedTicket.adminNotes.map(note => (
                      <div key={note.id} className="note-card">
                        <div className="note-header">
                          <span className="note-admin">{note.adminEmail}</span>
                          <span className="note-date">
                            {new Date(note.createdAt).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <p className="note-text">{note.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "var(--muted)", fontSize: 13 }}>No notes added yet</p>
                )}
              </div>

              {/* Add Note */}
              {selectedTicket.status !== "Closed" && (
                <div className="add-note-section">
                  <textarea
                    value={adminNote}
                    onChange={e => setAdminNote(e.target.value)}
                    placeholder="Add resolution note for customer..."
                    className="note-textarea"
                    rows="3"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!adminNote.trim()}
                    className="add-note-btn"
                  >
                    Add Note
                  </button>
                </div>
              )}

              {/* Status Update */}
              <div className="status-update-section">
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <label style={{ fontWeight: 600, fontSize: 13 }}>Update Status:</label>
                  <select
                    value={updateStatusValue || selectedTicket.status}
                    onChange={e => setUpdateStatusValue(e.target.value)}
                    className="status-select"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                  {updateStatusValue && updateStatusValue !== selectedTicket.status && (
                    <button onClick={handleUpdateStatus} className="update-btn">
                      Update
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
