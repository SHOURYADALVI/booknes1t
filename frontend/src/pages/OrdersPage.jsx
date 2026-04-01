import { useCart } from "../context/CartContext";
import { Package, CheckCircle, Truck, XCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import "./OrdersPage.css";

const STATUS_CONFIG = {
  "Processing": { icon: <Clock size={14} />, cls: "badge-amber" },
  "Shipped":    { icon: <Truck size={14} />, cls: "badge-blue" },
  "Delivered":  { icon: <CheckCircle size={14} />, cls: "badge-green" },
  "Cancelled":  { icon: <XCircle size={14} />, cls: "badge-red" },
};

export default function OrdersPage() {
  const { orders } = useCart();
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("All");

  const statuses = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];
  const filtered = filter === "All" ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="orders-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Orders</h1>
            <p className="page-subtitle">{orders.length} total orders</p>
          </div>
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
                      <div className="order-date">{new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                    </div>
                    <div className="order-customer">
                      <div className="cust-name">{order.customer}</div>
                      <div className="cust-email">{order.email}</div>
                    </div>
                    <div className={`badge ${cfg.cls} order-status-badge`}>
                      {cfg.icon} {order.status}
                    </div>
                    <div className="order-total">₹{order.total.toLocaleString()}</div>
                    <button className="expand-btn">{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
                  </div>

                  {isOpen && (
                    <div className="order-detail">
                      <div className="order-items-table">
                        <table>
                          <thead>
                            <tr><th>Book</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, i) => (
                              <tr key={i}>
                                <td>{item.title}</td>
                                <td>{item.qty}</td>
                                <td>₹{item.price}</td>
                                <td>₹{(item.price * item.qty).toLocaleString()}</td>
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
    </div>
  );
}
