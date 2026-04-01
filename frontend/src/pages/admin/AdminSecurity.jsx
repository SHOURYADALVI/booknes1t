import { THREATS } from "../../data/mockData";
import { ShieldCheck, AlertTriangle, CheckCircle, Eye } from "lucide-react";

const LIKELIHOOD_COLOR = { High: "badge-red", Medium: "badge-amber", Low: "badge-green" };
const IMPACT_COLOR = { Critical: "badge-red", High: "badge-amber", Medium: "badge-blue", Low: "badge-green" };
const STATUS_COLOR = { "Mitigated": "badge-green", "Active Control": "badge-blue", "Monitoring": "badge-amber" };

export default function AdminSecurity() {
  const mitigated = THREATS.filter(t => t.status === "Mitigated").length;
  const active = THREATS.filter(t => t.status === "Active Control").length;
  const monitoring = THREATS.filter(t => t.status === "Monitoring").length;
  const highRisk = THREATS.filter(t => t.likelihood === "High" && (t.impact === "Critical" || t.impact === "High")).length;

  return (
    <div>
      {/* Security posture */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card" style={{ borderTop: "3px solid var(--success)" }}>
          <div className="stat-label">Threats Mitigated</div>
          <div className="stat-value" style={{ color: "var(--success)" }}>{mitigated}</div>
        </div>
        <div className="stat-card" style={{ borderTop: "3px solid #3d6b8a" }}>
          <div className="stat-label">Active Controls</div>
          <div className="stat-value" style={{ color: "#3d6b8a" }}>{active}</div>
        </div>
        <div className="stat-card" style={{ borderTop: "3px solid var(--amber)" }}>
          <div className="stat-label">Monitoring</div>
          <div className="stat-value" style={{ color: "var(--amber)" }}>{monitoring}</div>
        </div>
        <div className="stat-card" style={{ borderTop: "3px solid var(--error)" }}>
          <div className="stat-label">High Risk Items</div>
          <div className="stat-value" style={{ color: "var(--error)" }}>{highRisk}</div>
        </div>
      </div>

      {/* PCI DSS Compliance checklist */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: "var(--font-display)", marginBottom: 16, fontSize: 18 }}>PCI DSS Compliance Status</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {[
            { item: "Encrypted payment gateway (Razorpay Level 1)", done: true },
            { item: "PCI DSS compliant token storage", done: true },
            { item: "Role-based access control (RBAC)", done: true },
            { item: "Secure HTTPS/TLS on all endpoints", done: true },
            { item: "Automated daily encrypted backups", done: true },
            { item: "Penetration test (annual)", done: false },
            { item: "MFA for admin accounts", done: true },
            { item: "GDPR / IT Act 2000 compliance review", done: false },
          ].map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: c.done ? "#d4edda" : "#fef3cd", borderRadius: "var(--radius)", fontSize: 13, fontWeight: 500 }}>
              {c.done
                ? <CheckCircle size={15} color="var(--success)" />
                : <AlertTriangle size={15} color="var(--amber)" />
              }
              {c.item}
            </div>
          ))}
        </div>
      </div>

      {/* Threat Register */}
      <div className="card" style={{ marginBottom: 20, padding: 0 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
          <ShieldCheck size={18} color="var(--amber)" />
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>Risk Register (Porter's Threat Analysis)</h3>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Threat</th><th>Category</th><th>Likelihood</th><th>Impact</th><th>Control Measure</th><th>Status</th></tr>
            </thead>
            <tbody>
              {THREATS.map((t, i) => (
                <tr key={t.id}>
                  <td style={{ color: "var(--muted)", fontSize: 12 }}>{t.id}</td>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{t.threat}</td>
                  <td><span className="badge badge-gray">{t.category}</span></td>
                  <td><span className={`badge ${LIKELIHOOD_COLOR[t.likelihood]}`}>{t.likelihood}</span></td>
                  <td><span className={`badge ${IMPACT_COLOR[t.impact]}`}>{t.impact}</span></td>
                  <td style={{ fontSize: 12, color: "var(--muted)", maxWidth: 200 }}>{t.control}</td>
                  <td><span className={`badge ${STATUS_COLOR[t.status]}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BCP Summary */}
      <div className="card">
        <h3 style={{ fontFamily: "var(--font-display)", marginBottom: 16, fontSize: 18 }}>Business Continuity Plan (BCP)</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
          {[
            { title: "Business Impact Analysis", desc: "Critical functions: Order fulfillment (RTO 4hr), Payment processing (RTO 1hr), Customer support (RTO 8hr)", icon: "🔍" },
            { title: "Disaster Recovery", desc: "Cloud-based daily backups on Vercel + Supabase. Recovery time reduced by 70% with automated restore scripts.", icon: "🔄" },
            { title: "Supply Chain Continuity", desc: "Multi-supplier agreements in place. Backup 3PL partners identified. Lead time buffer: 2 weeks min inventory.", icon: "📦" },
            { title: "Crisis Communication", desc: "Automated customer notifications via Mailchimp. Status page at status.booknest.in. Team escalation matrix documented.", icon: "📢" },
          ].map(b => (
            <div key={b.title} style={{ padding: 16, background: "var(--cream)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{b.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{b.title}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
