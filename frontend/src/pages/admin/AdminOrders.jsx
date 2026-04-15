import { useOrders } from "../../hooks/useOrders.js";
import { useNotification } from "../../context/NotificationContext.jsx";
import Toast from "../../components/Toast.jsx";
import { useState, useEffect } from "react";
import { useToast } from "../../hooks/useToast.js";

const STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];
const STATUS_COLORS = { Processing: "badge-amber", Shipped: "badge-blue", Delivered: "badge-green", Cancelled: "badge-red" };

export default function AdminOrders() {
  const { orders, loading, updateOrderStatus, lastUpdate, fetchOrders } = useOrders();
  const { addNotification } = useNotification();
  const { toast, showToast } = useToast();
  const [search, setSearch] = useState("");

  const filtered = search
    ? orders.filter(o => 
        o.id.toLowerCase().includes(search.toLowerCase()) || 
        o.userName.toLowerCase().includes(search.toLowerCase()) ||
        o.userEmail.toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  const handleStatusChange = async (orderId, newStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const oldStatus = order.status;
    const updatedOrder = await updateOrderStatus(orderId, newStatus, `Status updated by admin`);
    
    if (updatedOrder) {
      addNotification(`Order ${orderId} updated to ${newStatus}`, "success", 3000);
    } else {
      showToast(`Failed to update order ${orderId}`, "error");
    }
  };

  const revenue = orders.filter(o => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const processingCount = orders.filter(o => o.status === "Processing").length;
  const deliveredCount = orders.filter(o => o.status === "Delivered").length;

  return (
    <>
      <Toast toast={toast} />
      
      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card"><div className="stat-label">Total Orders</div><div className="stat-value">{totalOrders}</div></div>
        <div className="stat-card"><div className="stat-label">Total Revenue</div><div className="stat-value">₹{revenue.toLocaleString()}</div></div>
        <div className="stat-card"><div className="stat-label">Processing</div><div className="stat-value">{processingCount}</div></div>
        <div className="stat-card"><div className="stat-label">Delivered</div><div className="stat-value">{deliveredCount}</div></div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <input
            className="form-input"
            placeholder="Search by order ID, customer name, or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 200 }}
          />
          <span style={{ fontSize: 13, color: "var(--muted)" }}>
            {filtered.length} orders {lastUpdate && `· Updated ${lastUpdate.toLocaleTimeString()}`}
          </span>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: 20, textAlign: "center", color: "var(--muted)" }}>
            Loading orders...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 20, textAlign: "center", color: "var(--muted)" }}>
            No orders found
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id}>
                    <td><code style={{ fontSize: 12 }}>{order.id}</code></td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{order.userName}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>{order.userEmail}</div>
                    </td>
                    <td style={{ fontSize: 13, color: "var(--muted)" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td style={{ fontSize: 13 }}>{order.items.reduce((s, i) => s + i.qty, 0)} item(s)</td>
                    <td style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>₹{order.total.toLocaleString()}</td>
                    <td><span className={`badge ${STATUS_COLORS[order.status]}`}>{order.status}</span></td>
                    <td>
                      <select
                        className="form-input"
                        style={{ padding: "5px 10px", fontSize: 12 }}
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
