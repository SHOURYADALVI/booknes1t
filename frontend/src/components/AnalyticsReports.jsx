import { BarChart3, Users, TrendingUp, Award, Zap } from "lucide-react";
import { useState } from "react";
import "./AnalyticsReports.css";

export default function AnalyticsReports({ advancedAnalytics }) {
  const [activeReport, setActiveReport] = useState("customers");

  if (!advancedAnalytics) {
    return <div style={{ padding: 20, textAlign: "center", color: "var(--muted)" }}>Loading analytics...</div>;
  }

  const {
    customerSegmentation,
    productAnalytics,
    revenueAnalytics,
    satisfactionMetrics,
    loyaltyAnalytics,
  } = advancedAnalytics;

  return (
    <div className="analytics-reports">
      {/* Report Tabs */}
      <div className="report-tabs">
        {[
          { id: "customers", label: "Customer Segmentation", icon: Users },
          { id: "products", label: "Product Performance", icon: BarChart3 },
          { id: "revenue", label: "Revenue Analytics", icon: TrendingUp },
          { id: "satisfaction", label: "Satisfaction", icon: Award },
          { id: "loyalty", label: "Loyalty Program", icon: Zap },
        ].map(tab => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              className={`report-tab ${activeReport === tab.id ? "active" : ""}`}
              onClick={() => setActiveReport(tab.id)}
            >
              <IconComponent size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Report Content */}
      <div className="report-content">
        {activeReport === "customers" && <CustomerSegmentationReport data={customerSegmentation} />}
        {activeReport === "products" && <ProductPerformanceReport data={productAnalytics} />}
        {activeReport === "revenue" && <RevenueAnalyticsReport data={revenueAnalytics} />}
        {activeReport === "satisfaction" && <SatisfactionReport data={satisfactionMetrics} />}
        {activeReport === "loyalty" && <LoyaltyReport data={loyaltyAnalytics} />}
      </div>
    </div>
  );
}

// Customer Segmentation Report
function CustomerSegmentationReport({ data }) {
  if (!data) return null;

  const { segments, segmentSummary, segmentRevenue } = data;

  return (
    <div className="report-section">
      <h3>Customer Segmentation Analysis</h3>

      <div className="segment-grid">
        {[
          { key: "vip", label: "VIP Customers", color: "#ffd700", emoji: "👑" },
          { key: "loyal", label: "Loyal Customers", color: "#667eea", emoji: "❤️" },
          { key: "regular", label: "Regular Customers", color: "#2ecc71", emoji: "👤" },
          { key: "atRisk", label: "At-Risk Customers", color: "#e74c3c", emoji: "⚠️" },
        ].map(segment => (
          <div key={segment.key} className="segment-card">
            <div className="segment-emoji">{segment.emoji}</div>
            <div className="segment-name">{segment.label}</div>
            <div className="segment-count">{segmentSummary[segment.key]}</div>
            <div className="segment-revenue">
              ₹{segmentRevenue[segment.key]?.toLocaleString() || 0}
            </div>
          </div>
        ))}
      </div>

      {segments.vip && segments.vip.length > 0 && (
        <div className="segment-details">
          <h4>Top VIP Customers</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Total Spent</th>
                <th>Orders</th>
              </tr>
            </thead>
            <tbody>
              {segments.vip.slice(0, 5).map(customer => (
                <tr key={customer.userId}>
                  <td>{customer.userName}</td>
                  <td>₹{customer.totalSpent.toLocaleString()}</td>
                  <td>{customer.orderCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Product Performance Report
function ProductPerformanceReport({ data }) {
  if (!data) return null;

  const { topProducts, qualityTierAnalysis, avgRating } = data;

  return (
    <div className="report-section">
      <h3>Product Performance Analysis</h3>

      <div className="quality-tiers">
        <div className="quality-card premium">
          <div className="quality-count">{qualityTierAnalysis?.premium?.length || 0}</div>
          <div className="quality-label">Premium Products</div>
          <div className="quality-detail">Rating ≥ 4.0</div>
        </div>
        <div className="quality-card standard">
          <div className="quality-count">{qualityTierAnalysis?.standard?.length || 0}</div>
          <div className="quality-label">Standard Products</div>
          <div className="quality-detail">Rating 3.0-3.9</div>
        </div>
        <div className="quality-card improving">
          <div className="quality-count">{qualityTierAnalysis?.needsImprovement?.length || 0}</div>
          <div className="quality-label">Needs Improvement</div>
          <div className="quality-detail">Rating &lt; 3.0</div>
        </div>
      </div>

      <div className="top-products">
        <h4>Top 10 Best-Selling Products</h4>
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Revenue</th>
              <th>Units Sold</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.slice(0, 10).map(product => (
              <tr key={product.id}>
                <td className="product-name">{product.title}</td>
                <td>₹{product.revenue.toLocaleString()}</td>
                <td>{product.quantity}</td>
                <td className="rating">
                  <span className="star">★</span> {product.avgRating} ({product.reviewCount})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Revenue Analytics Report
function RevenueAnalyticsReport({ data }) {
  if (!data) return null;

  const { totalRevenue, avgOrderValue, cancelledOrders, cancellationRate, trend } = data;

  return (
    <div className="report-section">
      <h3>Revenue & Sales Analytics</h3>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Revenue</div>
          <div className="kpi-value">₹{totalRevenue.toLocaleString()}</div>
          <div className={`trend ${trend}`}>{trend === "upward" ? "📈" : trend === "downward" ? "📉" : "➡️"} {trend}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Avg Order Value</div>
          <div className="kpi-value">₹{avgOrderValue.toLocaleString()}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Cancellation Rate</div>
          <div className="kpi-value">{cancellationRate}%</div>
          <div className="detail">({cancelledOrders} orders)</div>
        </div>
      </div>
    </div>
  );
}

// Customer Satisfaction Report
function SatisfactionReport({ data }) {
  if (!data) return null;

  const { totalReviews, avgRating, ratingDistribution, satisfiedCustomers, nps } = data;

  if (totalReviews === 0) {
    return (
      <div className="report-section">
        <h3>Customer Satisfaction</h3>
        <div style={{ padding: 20, textAlign: "center", color: "var(--muted)" }}>
          No customer reviews yet.
        </div>
      </div>
    );
  }

  return (
    <div className="report-section">
      <h3>Customer Satisfaction Metrics</h3>

      <div className="satisfaction-grid">
        <div className="satisfaction-card">
          <div className="satisfaction-metric">Avg Rating</div>
          <div className="rating-value">
            <span className="star">★</span> {avgRating}
          </div>
          <div className="detail">out of 5.0</div>
        </div>
        <div className="satisfaction-card">
          <div className="satisfaction-metric">NPS Score</div>
          <div className="nps-value">{nps}</div>
          <div className="detail">Net Promoter Score</div>
        </div>
        <div className="satisfaction-card">
          <div className="satisfaction-metric">Satisfied Customers</div>
          <div className="percentage">{satisfiedCustomers}%</div>
          <div className="detail">4-5 star ratings</div>
        </div>
      </div>

      <div className="rating-distribution">
        <h4>Rating Distribution</h4>
        <div className="distribution-bars">
          {[5, 4, 3, 2, 1].map(star => (
            <div key={star} className="distribution-row">
              <div className="star-label">
                <span className="star">★</span> {star}
              </div>
              <div className="bar-container">
                <div
                  className={`bar star-${star}`}
                  style={{
                    width: totalReviews > 0 ? `${(ratingDistribution[star] / totalReviews) * 100}%` : "0%",
                  }}
                ></div>
              </div>
              <div className="count">{ratingDistribution[star]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Loyalty Program Report
function LoyaltyReport({ data }) {
  if (!data) return null;

  const { customersWithPoints, totalPointsEarned, avgPointBalance, avgRedemptionRate, pointsValue } = data;

  return (
    <div className="report-section">
      <h3>Loyalty Program Analytics</h3>

      <div className="loyalty-grid">
        <div className="loyalty-card">
          <div className="loyalty-label">Active Members</div>
          <div className="loyalty-value">{customersWithPoints}</div>
          <div className="detail">customers in program</div>
        </div>
        <div className="loyalty-card">
          <div className="loyalty-label">Total Points Issued</div>
          <div className="loyalty-value">{totalPointsEarned.toLocaleString()}</div>
          <div className="detail">points</div>
        </div>
        <div className="loyalty-card">
          <div className="loyalty-label">Avg Member Balance</div>
          <div className="loyalty-value">{avgPointBalance}</div>
          <div className="detail">points per customer</div>
        </div>
        <div className="loyalty-card">
          <div className="loyalty-label">Redemption Rate</div>
          <div className="loyalty-value">{avgRedemptionRate}%</div>
          <div className="detail">of earned points</div>
        </div>
        <div className="loyalty-card">
          <div className="loyalty-label">Points Value</div>
          <div className="loyalty-value">₹{pointsValue.toLocaleString()}</div>
          <div className="detail">@ ₹0.50/point</div>
        </div>
      </div>
    </div>
  );
}
