import { useOrders } from "../hooks/useOrders.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNotification } from "../context/NotificationContext.jsx";
import { useReviews } from "../hooks/useReviews.js";
import { Package, CheckCircle, Truck, XCircle, Clock, ChevronDown, ChevronUp, RefreshCw, MessageCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import ReviewModal from "../components/ReviewModal.jsx";
import TicketForm from "../components/TicketForm.jsx";
import "./OrdersPage.css";

const STATUS_CONFIG = {
  "Processing": { icon: <Clock size={14} />, cls: "badge-amber" },
  "Shipped":    { icon: <Truck size={14} />, cls: "badge-blue" },
  "Delivered":  { icon: <CheckCircle size={14} />, cls: "badge-green" },
  "Cancelled":  { icon: <XCircle size={14} />, cls: "badge-red" },
};

export default function OrdersPage() {
  const { orders, loading, fetchOrders, lastUpdate, updateOrderStatus } = useOrders();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { notifyOrderStatusChange } = useNotification();
  const { addReview, loading: reviewLoading } = useReviews();
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("All");
  const [prevOrders, setPrevOrders] = useState([]);
  const [reviewModal, setReviewModal] = useState({ isOpen: false, bookId: null, bookTitle: null, orderId: null });
  const [ticketModal, setTicketModal] = useState({ isOpen: false, bookId: null, bookTitle: null, orderId: null });

  // Detect order status changes and notify user
  useEffect(() => {
    orders.forEach(order => {
      const prevOrder = prevOrders.find(o => o.id === order.id);
      if (prevOrder && prevOrder.status !== order.status) {
        notifyOrderStatusChange(order.id, prevOrder.status, order.status);
      }
    });
    setPrevOrders(orders);
  }, [orders, notifyOrderStatusChange, prevOrders]);

  // Log for debugging
  useEffect(() => {
    console.log("OrdersPage mounted. Orders count:", orders.length);
  }, [orders]);

  const statuses = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];
  const filtered = filter === "All" ? orders : orders.filter(o => o.status === filter);

  const handleReviewSubmit = async ({ rating, title, text }) => {
    try {
      console.log(`[OrdersPage] Submitting review for book ${reviewModal.bookId}:`, { rating, title, bookTitle: reviewModal.bookTitle });
      
      const review = await addReview(
        reviewModal.bookId,
        rating,
        title,
        text,
        reviewModal.orderId
      );
      
      console.log(`[OrdersPage] ✓ Review submitted successfully:`, review);
      
      setReviewModal({ isOpen: false, bookId: null, bookTitle: null, orderId: null });
      
      // Show success toast
      if (window.showToast) {
        window.showToast?.(`Review for "${reviewModal.bookTitle}" submitted! 📚`, 'success');
      }
    } catch (err) {
      console.error("[OrdersPage] Failed to submit review:", err);
      throw err;
    }
  };

  return (
    <div className="orders-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Orders</h1>
            <p className="page-subtitle">{orders.length} total orders {lastUpdate && ` · Last updated ${lastUpdate.toLocaleTimeString()}`}</p>
          </div>
          <button 
            onClick={fetchOrders} 
            disabled={loading}
            style={{ height: "fit-content", padding: "8px 16px", display: "flex", alignItems: "center", gap: 8 }}
            className="btn btn-secondary"
          >
            <RefreshCw size={14} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
            Refresh
          </button>
        </div>

        {/* Status Filter */}
        <div className="orders-filter">
          {statuses.map(s => (
            <button key={s} className={`filter-chip ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>
              {s} {s !== "All" && <span className="chip-count">{orders.filter(o => o.status === s).length}</span>}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <Package size={40} color="var(--border)" />
            <h3>No orders found</h3>
            <p>No orders with status "{filter}"</p>
          </div>
        ) : (
          <div className="orders-list">
            {filtered.map(order => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG["Processing"];
              const isOpen = expanded === order.id;
              return (
                <div key={order.id} className={`order-card ${isOpen ? "open" : ""}`}>
                  <div className="order-header" onClick={() => setExpanded(isOpen ? null : order.id)}>
                    <div className="order-meta">
                      <div className="order-id">{order.id}</div>
                      <div className="order-date">{new Date(order.createdAt || order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                    </div>
                    <div className="order-customer">
                      <div className="cust-name">{order.userName}</div>
                      <div className="cust-email">{order.userEmail}</div>
                    </div>
                    <div className={`badge ${cfg.cls} order-status-badge`}>
                      {cfg.icon} {order.status}
                    </div>
                    <div className="order-total">₹{order.total.toLocaleString()}</div>
                    <button className="expand-btn">{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
                  </div>

                  {isOpen && (
                    <div className="order-detail">
                      {/* Admin Status Update */}
                      {isAdmin && (
                        <div style={{ marginBottom: 16, padding: "12px", backgroundColor: "#f5f5f5", borderRadius: 6 }}>
                          <label style={{ display: "block", marginBottom: 8, fontSize: 12, fontWeight: 600, color: "#666" }}>
                            🔧 Admin: Update Order Status
                          </label>
                          <select
                            value={order.status}
                            onChange={(e) => {
                              console.log("Changing status to:", e.target.value);
                              updateOrderStatus(order.id, e.target.value);
                            }}
                            style={{
                              width: "100%",
                              padding: "8px 12px",
                              borderRadius: 4,
                              border: "1px solid #ddd",
                              fontSize: 14,
                              cursor: "pointer",
                              fontWeight: 500,
                            }}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      )}
                      
                      <div className="order-items-table">
                        <table>
                          <thead>
                            <tr><th>Book</th><th>Qty</th><th>Price</th><th>Subtotal</th>{order.status === "Delivered" && !isAdmin && <th>Action</th>}</tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, i) => (
                              <tr key={i}>
                                <td>{item.title}</td>
                                <td>{item.qty}</td>
                                <td>₹{item.price}</td>
                                <td>₹{(item.price * item.qty).toLocaleString()}</td>
                                {order.status === "Delivered" && !isAdmin && (
                                  <td style={{ display: "flex", gap: 6 }}>
                                    <button
                                      onClick={() => setReviewModal({
                                        isOpen: true,
                                        bookId: item.id,
                                        bookTitle: item.title,
                                        orderId: order.id,
                                      })}
                                      className="btn-review"
                                      title="Write a review"
                                    >
                                      <MessageCircle size={14} /> Review
                                    </button>
                                    <button
                                      onClick={() => setTicketModal({
                                        isOpen: true,
                                        bookId: item.id,
                                        bookTitle: item.title,
                                        orderId: order.id,
                                      })}
                                      className="btn-complaint"
                                      title="Report an issue"
                                      style={{
                                        padding: "4px 8px",
                                        fontSize: 12,
                                        backgroundColor: "#ef4444",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "var(--radius)",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                      }}
                                    >
                                      <AlertCircle size={14} /> Report Issue
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="order-detail-footer">
                        <div className="payment-info">
                          {order.paymentId
                            ? <span className="pay-id">Payment ID: <code>{order.paymentId}</code></span>
                            : <span className="no-pay">No payment recorded</span>
                          }
                        </div>
                        <div className="order-grand-total">Total: <strong>₹{order.total.toLocaleString()}</strong></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ isOpen: false, bookId: null, bookTitle: null, orderId: null })}
        bookId={reviewModal.bookId}
        bookTitle={reviewModal.bookTitle}
        onSubmit={handleReviewSubmit}
        isLoading={reviewLoading}
      />

      {ticketModal.isOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }} onClick={() => setTicketModal({ isOpen: false, bookId: null, bookTitle: null, orderId: null })}>
          <div style={{
            background: "white",
            borderRadius: "var(--radius)",
            maxWidth: 500,
            width: "90%",
            maxHeight: "90vh",
            overflowY: "auto",
          }} onClick={e => e.stopPropagation()}>
            <div style={{
              padding: 20,
              borderBottom: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>Report Issue</h2>
              <button
                onClick={() => setTicketModal({ isOpen: false, bookId: null, bookTitle: null, orderId: null })}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 24,
                  cursor: "pointer",
                  color: "var(--muted)",
                }}
              >×</button>
            </div>
            <div style={{ padding: 20 }}>
              <TicketForm
                bookId={ticketModal.bookId}
                bookTitle={ticketModal.bookTitle}
                orderId={ticketModal.orderId}
                onSuccess={() => {
                  setTicketModal({ isOpen: false, bookId: null, bookTitle: null, orderId: null });
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
