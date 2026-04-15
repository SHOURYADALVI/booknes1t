import { useAnalytics } from "../../hooks/useAnalytics.js";
import AnalyticsReports from "../../components/AnalyticsReports.jsx";
import BusinessHealthInsights from "../../components/BusinessHealthInsights.jsx";
import AdminCRMInsights from "./AdminCRMInsights.jsx";
import { TrendingUp, Package, Users, DollarSign, RefreshCw, Lightbulb } from "lucide-react";
import { useState } from "react";

const STATUS_COLORS = {
  Processing: "badge-amber",
  Shipped: "badge-blue",
  Delivered: "badge-green",
  Cancelled: "badge-red",
};

export default function AdminCRM() {
  const { analytics, advancedAnalytics, loading, fetchAnalytics } = useAnalytics();
  const [activeTab, setActiveTab] = useState("overview");

  if (loading && !analytics) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "var(--muted)" }}>
        Loading analytics...
      </div>
    );
  }

  if (!analytics) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "var(--muted)" }}>
        Unable to load analytics data
      </div>
    );
  }

  const {
    totalOrders,
    totalRevenue,
    avgOrderValue,
    uniqueCustomers,
    ordersByStatus,
    revenueByStatus,
    topProducts,
    ordersTimeline,
  } = analytics;

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "1px solid var(--border)", paddingBottom: 12, overflowX: "auto" }}>
        {["overview", "products", "timeline", "actionable", "insights", "reports"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 16px",
              borderBottom: activeTab === tab ? "2px solid var(--ink)" : "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? "var(--ink)" : "var(--muted)",
              textTransform: "capitalize",
              whiteSpace: "nowrap",
            }}
          >
            {tab === "actionable" ? <><Lightbulb size={14} style={{ marginRight: 6, display: "inline" }} />Actionable Insights</> : tab}
          </button>
        ))}
        <button
          onClick={fetchAnalytics}
          style={{
            marginLeft: "auto",
            padding: "8px 12px",
            background: "var(--cream)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
          }}
        >
          <RefreshCw size={14} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
          Refresh
        </button>
      </div>

      {activeTab === "overview" && (
        <>
          {/* Key Metrics */}
          <div className="grid-4" style={{ marginBottom: 24 }}>
            <div className="stat-card">
              <div className="stat-label">Total Orders</div>
              <div className="stat-value">{totalOrders}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Revenue</div>
              <div className="stat-value">₹{totalRevenue.toLocaleString()}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Average Order Value</div>
              <div className="stat-value">₹{avgOrderValue.toLocaleString()}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Unique Customers</div>
              <div className="stat-value">{uniqueCustomers}</div>
            </div>
          </div>

          {/* Order Status Breakdown */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginBottom: 24 }}>
            <div className="card">
              <h3 style={{ fontFamily: "var(--font-display)", marginBottom: 16, fontSize: 16 }}>Orders by Status</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {Object.entries(ordersByStatus).map(([status, count]) => (
                  <div key={status} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{status}</div>
                      <div style={{ height: 8, background: "var(--cream)", borderRadius: 4, overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            background: {
                              Processing: "#f59e0b",
                              Shipped: "#3b82f6",
                              Delivered: "#10b981",
                              Cancelled: "#ef4444",
                            }[status],
                            width: `${totalOrders > 0 ? (count / totalOrders) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, minWidth: 40 }}>{count}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontFamily: "var(--font-display)", marginBottom: 16, fontSize: 16 }}>Revenue by Status</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {Object.entries(revenueByStatus).map(([status, revenue]) => (
                  <div key={status} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className={`badge ${STATUS_COLORS[status]}`}>{status}</span>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                      ₹{revenue.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "products" && (
        <div className="card">
          <h3 style={{ fontFamily: "var(--font-display)", marginBottom: 16, fontSize: 16 }}>Top Selling Products</h3>
          <div style={{ padding: 0 }}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity Sold</th>
                    <th>Revenue</th>
                    <th>Avg per Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, idx) => (
                    <tr key={idx}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{product.title}</div>
                      </td>
                      <td style={{ fontSize: 13, fontWeight: 700 }}>{product.quantity} units</td>
                      <td style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--green)" }}>
                        ₹{product.revenue.toLocaleString()}
                      </td>
                      <td style={{ fontSize: 13, color: "var(--muted)" }}>
                        ₹{(product.revenue / product.quantity).toFixed(0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "timeline" && (
        <div className="card">
          <h3 style={{ fontFamily: "var(--font-display)", marginBottom: 16, fontSize: 16 }}>Orders Over Last 7 Days</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 150, paddingBottom: 8 }}>
            {Object.entries(ordersTimeline).map(([date, count]) => {
              const maxCount = Math.max(...Object.values(ordersTimeline));
              const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
              return (
                <div key={date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div
                    style={{
                      width: "100%",
                      height: `${height}%`,
                      background: "var(--amber)",
                      borderRadius: "4px 4px 0 0",
                      minHeight: 20,
                    }}
                    title={`${count} orders`}
                  />
                  <div style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", width: "100%" }}>
                    {new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "insights" && (
        <BusinessHealthInsights
          businessHealth={advancedAnalytics?.businessHealth}
          actionableInsights={advancedAnalytics?.actionableInsights}
        />
      )}

      {activeTab === "actionable" && (
        <AdminCRMInsights
          analytics={analytics}
          advancedAnalytics={advancedAnalytics}
        />
      )}

      {activeTab === "reports" && (
        <div className="card">
          <AnalyticsReports advancedAnalytics={advancedAnalytics} />
        </div>
      )}
    </div>
  );
}
