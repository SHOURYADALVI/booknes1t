import { MONTHLY_REVENUE, GENRE_SALES, INITIAL_ORDERS } from "../../data/mockData";
import { useCart } from "../../context/CartContext";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, ShoppingBag, Users, DollarSign } from "lucide-react";

export default function AdminOverview() {
  const { orders } = useCart();
  const totalRevenue = orders.filter(o => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);
  const avgOrder = orders.length ? Math.round(totalRevenue / orders.filter(o=>o.status!=="Cancelled").length) : 0;

  const stats = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, delta: "+18% vs last month", icon: <DollarSign size={20} />, color: "#c8860a" },
    { label: "Total Orders", value: orders.length, delta: `${orders.filter(o=>o.status==="Processing").length} processing`, icon: <ShoppingBag size={20} />, color: "#5c7a5c" },
    { label: "Avg Order Value", value: `₹${avgOrder}`, delta: "Target: ₹650", icon: <TrendingUp size={20} />, color: "#3d6b8a" },
    { label: "Active Customers", value: "8", delta: "3 VIP tier", icon: <Users size={20} />, color: "#7a4a8a" },
  ];

  return (
    <div className="admin-overview">
      {/* KPI Stats */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card" style={{ borderTop: `3px solid ${s.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-delta">{s.delta}</div>
              </div>
              <div style={{ color: s.color, background: `${s.color}18`, padding: 10, borderRadius: 8 }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        <div className="card">
          <h3 style={{ fontFamily: "var(--font-display)", marginBottom: 20 }}>Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_REVENUE}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c8860a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#c8860a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8dcc8" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#c8860a" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ fontFamily: "var(--font-display)", marginBottom: 20 }}>Sales by Genre</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={GENRE_SALES} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e8dcc8" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="genre" type="category" tick={{ fontSize: 11 }} width={100} />
              <Tooltip />
              <Bar dataKey="sales" fill="#5c7a5c" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Order Status breakdown */}
      <div className="card">
        <h3 style={{ fontFamily: "var(--font-display)", marginBottom: 16 }}>Order Pipeline (ERP View)</h3>
        <div className="pipeline-bars">
          {["Processing", "Shipped", "Delivered", "Cancelled"].map(status => {
            const count = orders.filter(o => o.status === status).length;
            const pct = orders.length ? Math.round((count / orders.length) * 100) : 0;
            const colors = { Processing: "#c8860a", Shipped: "#3d6b8a", Delivered: "#5c7a5c", Cancelled: "#c0392b" };
            return (
              <div key={status} className="pipeline-row">
                <div className="pipeline-label">{status}</div>
                <div className="pipeline-bar-wrap">
                  <div className="pipeline-bar-fill" style={{ width: `${pct}%`, background: colors[status] }} />
                </div>
                <div className="pipeline-count">{count} orders ({pct}%)</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
