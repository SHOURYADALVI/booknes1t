import { useCart } from "../../context/CartContext";
import { useToast } from "../../hooks/useToast";
import Toast from "../../components/Toast";
import { useState } from "react";

const STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];
const STATUS_COLORS = { Processing: "badge-amber", Shipped: "badge-blue", Delivered: "badge-green", Cancelled: "badge-red" };

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useCart();
  const { toast, showToast } = useToast();
  const [search, setSearch] = useState("");

  const filtered = search
    ? orders.filter(o => o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()))
    : orders;

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    showToast(`Order ${orderId} updated to ${newStatus}`);
  };

  const revenue = orders.filter(o => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);

  return (
    <>
      <Toast toast={toast} />
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <input
            className="form-input"
            placeholder="Search by order ID or customer…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 200 }}
          />
          <span style={{ fontSize: 13, color: "var(--muted)" }}>
            {filtered.length} orders · Revenue: <strong style={{ color: "var(--ink)" }}>₹{revenue.toLocaleString()}</strong>
          </span>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
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
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id}>
                  <td><code style={{ fontSize: 12 }}>{order.id}</code></td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{order.customer}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{order.email}</div>
                  </td>
                  <td style={{ fontSize: 13, color: "var(--muted)" }}>{order.date}</td>
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
      </div>
    </>
  );
}
