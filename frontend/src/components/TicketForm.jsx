import { useState } from "react";
import { AlertCircle, Send } from "lucide-react";
import { useTickets } from "../hooks/useTickets.js";
import { useToast } from "../hooks/useToast.js";
import Toast from "./Toast.jsx";
import "./TicketForm.css";

export default function TicketForm({ bookId, bookTitle, orderId, onSuccess }) {
  const { createTicket, loading } = useTickets();
  const { toast, showToast } = useToast();
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "Quality",
  });
  const [error, setError] = useState("");

  const categories = ["Quality", "Delivery", "Wrong Item", "Damaged", "Other"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.subject.trim()) {
      setError("Subject is required");
      return;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }

    try {
      const ticket = await createTicket({
        bookId,
        bookTitle,
        orderId,
        subject: formData.subject,
        description: formData.description,
        category: formData.category,
      });

      showToast(`✓ Support ticket ${ticket.id} created successfully!`);
      setFormData({ subject: "", description: "", category: "Quality" });
      if (onSuccess) onSuccess(ticket);
    } catch (err) {
      setError(err.message || "Failed to create ticket");
      showToast(err.message || "Failed to create ticket", "error");
    }
  };

  return (
    <>
      <Toast toast={toast} />
      <div className="ticket-form-container">
        <form className="ticket-form" onSubmit={handleSubmit}>
          <h3>Report an Issue</h3>

          {error && (
            <div className="form-error-box">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Subject *</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Brief subject of the issue"
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the issue"
              rows={4}
              maxLength={1000}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5 }} />
                Creating Ticket...
              </>
            ) : (
              <>
                <Send size={16} />
                Submit Ticket
              </>
            )}
          </button>
        </form>
      </div>
    </>
  );
}
