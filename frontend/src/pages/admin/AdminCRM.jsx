import { CUSTOMERS } from "../../data/mockData";
import { useState } from "react";
import { Users, Mail, TrendingUp } from "lucide-react";

const SEG_COLORS = { VIP: "badge-amber", Regular: "badge-blue", New: "badge-green" };

export default function AdminCRM() {
  const [filter, setFilter] = useState("All");
  const segments = ["All", "VIP", "Regular", "New"];

  const filtered = filter === "All" ? CUSTOMERS : CUSTOMERS.filter(c => c.segment === filter);
  const totalLTV = CUSTOMERS.reduce((s, c) => s + c.ltv, 0);
  const avgLTV = Math.round(totalLTV / CUSTOMERS.length);
  const subscribed = CUSTOMERS.filter(c => c.subscribed).length;

  return (
    <div>
      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card"><div className="stat-label">Total Customers</div><div className="stat-value">{CUSTOMERS.length}</div></div>
        <div className="stat-card"><div className="stat-label">Total Lifetime Value</div><div className="stat-value">₹{totalLTV.toLocaleString()}</div></div>
        <div className="stat-card"><div className="stat-label">Avg Customer LTV</div><div className="stat-value">₹{avgLTV.toLocaleString()}</div></div>
        <div className="stat-card"><div className="stat-label">Newsletter Subscribed</div><div className="stat-value">{subscribed}/{CUSTOMERS.length}</div><div className="stat-delta">{Math.round(subscribed/CUSTOMERS.length*100)}% opt-in rate</div></div>
      </div>

      {/* Segment breakdown */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: "var(--font-display)", marginBottom: 16, fontSize: 18 }}>Customer Segmentation (RFM Model)</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {["VIP", "Regular", "New"].map(seg => {
            const group = CUSTOMERS.filter(c => c.segment === seg);
            const segLTV = group.reduce((s, c) => s + c.ltv, 0);
            const descs = { VIP: "High frequency, high spend. Priority retention.", Regular: "Moderate engagement. Upsell candidates.", New: "Recently acquired. Focus on first repeat purchase." };
            return (
              <div key={seg} style={{ padding: 16, background: "var(--cream)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span className={`badge ${SEG_COLORS[seg]}`}>{seg}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>{group.length}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>₹{segLTV.toLocaleString()} total LTV</div>
                <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.5 }}>{descs[seg]}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter + Table */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {segments.map(s => (
          <button key={s} className={`filter-chip ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Customer</th><th>City</th><th>Orders</th><th>Lifetime Value</th><th>Segment</th><th>Newsletter</th><th>Member Since</th></tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{c.email}</div>
                  </td>
                  <td style={{ fontSize: 13 }}>{c.city}</td>
                  <td style={{ fontWeight: 700 }}>{c.orders}</td>
                  <td style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: c.ltv > 5000 ? "var(--amber)" : "var(--ink)" }}>₹{c.ltv.toLocaleString()}</td>
                  <td><span className={`badge ${SEG_COLORS[c.segment]}`}>{c.segment}</span></td>
                  <td>
                    {c.subscribed
                      ? <span className="badge badge-green">✓ Subscribed</span>
                      : <span className="badge badge-gray">Unsubscribed</span>
                    }
                  </td>
                  <td style={{ fontSize: 12, color: "var(--muted)" }}>{new Date(c.joinDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
