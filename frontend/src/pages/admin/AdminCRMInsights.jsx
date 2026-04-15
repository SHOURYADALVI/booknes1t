import { Target, Zap, AlertCircle, TrendingUp, Users, Gift, Clock, DollarSign, Star, X, Send, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";
import "./AdminCRMInsights.css";

export default function AdminCRMInsights({ analytics, advancedAnalytics }) {
  if (!advancedAnalytics) return null;

  const [actionModal, setActionModal] = useState(null);
  const [actionData, setActionData] = useState(null);

  const {
    customerSegmentation,
    productAnalytics,
    revenueAnalytics,
    satisfactionMetrics,
    loyaltyAnalytics,
    retentionAnalytics,
  } = advancedAnalytics;

  // 1. CUSTOMER ENGAGEMENT OPPORTUNITIES
  const generateCustomerInsights = () => {
    const insights = [];

    // VIP customers to retain
    if (customerSegmentation?.segments?.vip?.length > 0) {
      insights.push({
        icon: <Target size={16} />,
        severity: "high",
        title: "VIP Customer Retention",
        action: `You have ${customerSegmentation.segments.vip.length} VIP customers spending ₹${customerSegmentation.segmentRevenue.vip.toLocaleString()}. Create exclusive offers to maintain their loyalty.`,
        metric: customerSegmentation.segments.vip.length,
        recommendation: "Send personalized thank-you emails with exclusive early access to new releases",
      });
    }

    // At-risk customers recovery
    if (customerSegmentation?.segments?.atRisk?.length > 0) {
      insights.push({
        icon: <AlertCircle size={16} />,
        severity: "critical",
        title: "At-Risk Customers (30+ days inactive)",
        action: `${customerSegmentation.segments.atRisk.length} customers haven't ordered in 30 days. Win them back with targeted campaigns.`,
        metric: customerSegmentation.segments.atRisk.length,
        recommendation: "Send re-engagement offers: '20% off your next order' or 'Free shipping' to lure them back",
      });
    }

    return insights;
  };

  // 2. PRODUCT QUALITY & PERFORMANCE
  const generateProductInsights = () => {
    const insights = [];

    // Low-rated products
    if (productAnalytics?.qualityTierAnalysis?.needsImprovement?.length > 0) {
      const poorProducts = productAnalytics.qualityTierAnalysis.needsImprovement;
      insights.push({
        icon: <Star size={16} />,
        severity: "high",
        title: "Low-Rated Books (< 3★)",
        action: `${poorProducts.length} books have ratings below 3 stars. High risk of poor reviews and low sales.`,
        metric: poorProducts.length,
        recommendation: "Review customer feedback, adjust book descriptions, negotiate better prices with suppliers, or replace titles",
        examples: poorProducts.slice(0, 3).map(p => `${p.title} (${p.avgRating}★)`),
      });
    }

    // Top performers to promote
    if (productAnalytics?.topProducts?.length > 0) {
      const topPerformers = productAnalytics.topProducts.slice(0, 3);
      insights.push({
        icon: <TrendingUp size={16} />,
        severity: "low",
        title: "Best Sellers (Must Stock More)",
        action: `Your top 3 books are generating ₹${topPerformers.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()} in revenue.`,
        metric: topPerformers.length,
        recommendation: "Increase inventory, create bundle deals, or feature prominently on homepage",
        examples: topPerformers.map(p => `${p.title} (${p.avgRating}★, ₹${p.revenue.toLocaleString()})`),
      });
    }

    return insights;
  };

  // 3. REVENUE OPTIMIZATION
  const generateRevenueInsights = () => {
    const insights = [];

    const { cancellationRate, trend, avgOrderValue } = revenueAnalytics;

    // High cancellation rate
    if (cancellationRate > 5) {
      insights.push({
        icon: <AlertCircle size={16} />,
        severity: "critical",
        title: `High Cancellation Rate (${cancellationRate}%)`,
        action: "Orders are being cancelled frequently. Investigate payment failures, shipping issues, or customer dissatisfaction.",
        metric: `${cancellationRate}%`,
        recommendation: "Add payment retry options, improve order confirmation emails, or offer incentives to complete purchases",
      });
    }

    // Upward or downward trend
    if (trend === "downward") {
      insights.push({
        icon: <TrendingUp size={16} />,
        severity: "high",
        title: "Revenue Declining",
        action: "Last 7 days revenue is down compared to previous period. Act quickly to reverse the trend.",
        metric: trend,
        recommendation: "Run flash sales, offer discounts, or launch a re-engagement email campaign",
      });
    }

    // AOV opportunity
    if (avgOrderValue < 500) {
      insights.push({
        icon: <DollarSign size={16} />,
        severity: "medium",
        title: "Low Average Order Value",
        action: `Your AOV is ₹${avgOrderValue}. Bundle deals and cross-sells could increase this by 20-30%.`,
        metric: `₹${avgOrderValue}`,
        recommendation: "Create bundle deals (e.g., 3 books for 25% off), recommend related books at checkout",
      });
    }

    return insights;
  };

  // 4. CUSTOMER SATISFACTION & LOYALTY
  const generateSatisfactionInsights = () => {
    const insights = [];

    const { nps, satisfiedCustomers, dissatisfiedCustomers } = satisfactionMetrics;

    // NPS improvement
    if (nps < 50) {
      insights.push({
        icon: <Zap size={16} />,
        severity: "high",
        title: `Low NPS Score (${nps})`,
        action: "Your Net Promoter Score is below 50. Customers are unlikely to recommend your service.",
        metric: nps,
        recommendation: "Contact detractors for feedback, implement their suggestions, improve service quality",
      });
    }

    // Low loyalty redemption
    if (loyaltyAnalytics?.avgRedemptionRate < 40) {
      insights.push({
        icon: <Gift size={16} />,
        severity: "medium",
        title: `Low Points Redemption (${Math.round(loyaltyAnalytics.avgRedemptionRate)}%)`,
        action: "Customers aren't redeeming loyalty points. Make the program more appealing.",
        metric: `${Math.round(loyaltyAnalytics.avgRedemptionRate)}%`,
        recommendation: "Lower redemption thresholds, add exclusive perks, send reminders of point balance",
      });
    }

    return insights;
  };

  // 5. CHURN & RETENTION
  const generateRetentionInsights = () => {
    const insights = [];

    // High churn rate
    if (retentionAnalytics?.churnRate > 20) {
      insights.push({
        icon: <Clock size={16} />,
        severity: "critical",
        title: `High Churn Rate (${retentionAnalytics.churnRate}%)`,
        action: `${retentionAnalytics.churnedCustomers} customers haven't ordered in 90+ days. They're slipping away.`,
        metric: `${retentionAnalytics.churnRate}%`,
        recommendation: "Launch win-back campaign with special offers, personalized emails, or exclusive content for lapsed customers",
      });
    }

    // Low 30-day retention
    if (retentionAnalytics?.retentionRate30 < 30) {
      insights.push({
        icon: <TrendingUp size={16} />,
        severity: "high",
        title: `Low 30-Day Retention (${retentionAnalytics.retentionRate30}%)`,
        action: "Most customers don't return within 30 days. Build subscription or recurring purchase habits.",
        metric: `${retentionAnalytics.retentionRate30}%`,
        recommendation: "Send book recommendations after 7 days, create reading challenges, offer auto-reorder subscriptions",
      });
    }

    // Active customers to celebrate
    if (retentionAnalytics?.activeThirtyDays > 0) {
      const activeRate = ((retentionAnalytics.activeThirtyDays / retentionAnalytics.totalCustomers) * 100).toFixed(1);
      if (activeRate > 50) {
        insights.push({
          icon: <Users size={16} />,
          severity: "low",
          title: `Healthy Engagement (${activeRate}% active in 30 days)`,
          action: `${retentionAnalytics.activeThirtyDays} customers are actively buying. Maintain engagement!`,
          metric: `${activeRate}%`,
          recommendation: "Keep these customers happy with loyalty rewards, exclusive early access, and personalized recommendations",
        });
      }
    }

    return insights;
  };

  const allInsights = [
    ...generateCustomerInsights(),
    ...generateProductInsights(),
    ...generateRevenueInsights(),
    ...generateSatisfactionInsights(),
    ...generateRetentionInsights(),
  ];

  const criticalInsights = allInsights.filter(i => i.severity === "critical");
  const highPriorityInsights = allInsights.filter(i => i.severity === "high");
  const mediumInsights = allInsights.filter(i => i.severity === "medium");

  if (allInsights.length === 0) {
    return (
      <div style={{
        textAlign: "center",
        padding: "60px 20px",
        color: "var(--text-light)",
      }}>
        <Zap size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No Actionable Insights Yet</h3>
        <p style={{ fontSize: 14, margin: 0 }}>Build more order history and customer data to generate AI-driven insights</p>
      </div>
    );
  }

  return (
    <div className="crm-insights-container">
      {/* CRITICAL ALERTS */}
      {criticalInsights.length > 0 && (
        <div className="insights-section critical">
          <div className="section-header critical">
            <AlertCircle size={18} />
            Critical Actions Required ({criticalInsights.length})
          </div>
          <div className="insights-grid">
            {criticalInsights.map((insight, idx) => (
              <InsightCard 
                key={idx} 
                insight={insight}
                onAction={() => {
                  setActionModal(insight.title);
                  setActionData(insight);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* HIGH PRIORITY */}
      {highPriorityInsights.length > 0 && (
        <div className="insights-section high">
          <div className="section-header high">
            <TrendingUp size={18} />
            High Priority ({highPriorityInsights.length})
          </div>
          <div className="insights-grid">
            {highPriorityInsights.map((insight, idx) => (
              <InsightCard 
                key={idx} 
                insight={insight}
                onAction={() => {
                  setActionModal(insight.title);
                  setActionData(insight);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* MEDIUM PRIORITY */}
      {mediumInsights.length > 0 && (
        <div className="insights-section medium">
          <div className="section-header medium">
            <Zap size={18} />
            Optimization Opportunities ({mediumInsights.length})
          </div>
          <div className="insights-grid">
            {mediumInsights.map((insight, idx) => (
              <InsightCard 
                key={idx} 
                insight={insight}
                onAction={() => {
                  setActionModal(insight.title);
                  setActionData(insight);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ACTION MODAL */}
      {actionModal && actionData && (
        <ActionModal 
          insight={actionData}
          onClose={() => {
            setActionModal(null);
            setActionData(null);
          }}
          analyticsData={{
            customerSegmentation,
            productAnalytics,
            revenueAnalytics,
            satisfactionMetrics,
            loyaltyAnalytics,
            retentionAnalytics,
          }}
        />
      )}
    </div>
  );
}

function InsightCard({ insight, onAction }) {
  return (
    <div className={`insight-card severity-${insight.severity}`}>
      <div className="card-header">
        <div className="card-icon">{insight.icon}</div>
        <div className="card-title">{insight.title}</div>
        <div className="card-metric">{insight.metric}</div>
      </div>

      <div className="card-body">
        <p className="card-action">{insight.action}</p>

        <div className="card-recommendation">
          <strong>✓ Recommended Action:</strong>
          <p>{insight.recommendation}</p>
        </div>

        {insight.examples && insight.examples.length > 0 && (
          <div className="card-examples">
            <strong>Examples:</strong>
            <ul>
              {insight.examples.map((ex, i) => (
                <li key={i}>{ex}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="card-cta">
        <button className="action-btn" onClick={onAction}>
          <Zap size={14} style={{ marginRight: 4 }} />
          Take Action
        </button>
      </div>
    </div>
  );
}

function ActionModal({ insight, onClose, analyticsData }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [formData, setFormData] = useState({
    discountPercentage: 20,
    campaignName: "",
  });

  const actionConfigs = {
    "VIP Customer Retention": {
      title: "VIP Retention Campaign",
      description: "Send exclusive offers and early access to your VIP customers",
      steps: [
        {
          title: "Select Offer Type",
          content: (
            <div className="modal-form">
              <div className="form-group">
                <label>What type of offer?</label>
                <div className="option-group">
                  <label className="option">
                    <input type="radio" name="offer" defaultChecked /> Exclusive Early Access to New Releases
                  </label>
                  <label className="option">
                    <input type="radio" name="offer" /> 20% Discount Coupon
                  </label>
                  <label className="option">
                    <input type="radio" name="offer" /> Free Shipping on Next 5 Orders
                  </label>
                  <label className="option">
                    <input type="radio" name="offer" /> VIP Event Invitation
                  </label>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Preview Campaign",
          content: (
            <div className="modal-preview">
              <div className="preview-card">
                <strong>VIP Retention Email</strong>
                <hr style={{ margin: "12px 0", opacity: 0.2 }} />
                <p><strong>Subject:</strong> Exclusive Offer for Our Most Valued Customers</p>
                <p><strong>To:</strong> {analyticsData.customerSegmentation.segments.vip.length} VIP customers</p>
                <p style={{ fontSize: 13, background: "#f5f5f5", padding: 8, borderRadius: 4 }}>
                  We appreciate your loyalty! As one of our VIP members, you're the first to access our newest releases...
                </p>
              </div>
            </div>
          ),
        },
      ],
    },
    "At-Risk Customers (30+ days inactive)": {
      title: "Win-Back Campaign",
      description: "Re-engage inactive customers with special offers",
      steps: [
        {
          title: "Craft Win-Back Message",
          content: (
            <div className="modal-form">
              <div className="form-group">
                <label>Campaign Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Spring Comeback" 
                  value={formData.campaignName}
                  onChange={(e) => setFormData({...formData, campaignName: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Discount Percentage</label>
                <div className="input-with-unit">
                  <input 
                    type="number" 
                    min="5" 
                    max="50"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({...formData, discountPercentage: e.target.value})}
                  />
                  <span>%</span>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Review & Confirm",
          content: (
            <div className="modal-preview">
              <div className="preview-card">
                <strong>We Miss You! {formData.discountPercentage}% Off</strong>
                <hr style={{ margin: "12px 0", opacity: 0.2 }} />
                <p><strong>Customers:</strong> {analyticsData.customerSegmentation.segments.atRisk.length} inactive users</p>
                <p><strong>Offer:</strong> {formData.discountPercentage}% off your next order</p>
                <p style={{ fontSize: 13, background: "#f5f5f5", padding: 8, borderRadius: 4 }}>
                  Hey! We noticed you haven't visited us in a while. We've got new books you'll love, and here's {formData.discountPercentage}% off to get you started...
                </p>
              </div>
            </div>
          ),
        },
      ],
    },
    "Low-Rated Books (< 3★)": {
      title: "Manage Low-Rated Books",
      description: "Improve, reprice, or replace underperforming titles",
      steps: [
        {
          title: "Review Low-Rated Books",
          content: (
            <div className="modal-preview">
              <div className="preview-card">
                <strong>Books Needing Attention:</strong>
                <ul style={{ margin: "12px 0", fontSize: 13 }}>
                  {analyticsData.productAnalytics.qualityTierAnalysis.needsImprovement.slice(0, 3).map((book, i) => (
                    <li key={i} style={{ marginBottom: 8 }}>
                      <strong>{book.title}</strong> - {book.avgRating}★ ({book.reviewCount} reviews)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ),
        },
        {
          title: "Select Action",
          content: (
            <div className="modal-form">
              <div className="form-group">
                <label>What would you like to do?</label>
                <div className="option-group">
                  <label className="option">
                    <input type="radio" name="action" defaultChecked /> Reduce price to boost sales
                  </label>
                  <label className="option">
                    <input type="radio" name="action" /> Improve book description based on reviews
                  </label>
                  <label className="option">
                    <input type="radio" name="action" /> Replace with similar, higher-rated books
                  </label>
                  <label className="option">
                    <input type="radio" name="action" /> Request refund from supplier
                  </label>
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
    "Best Sellers (Must Stock More)": {
      title: "Promote Best Sellers",
      description: "Increase visibility and stock for top performers",
      steps: [
        {
          title: "Top Performance Books",
          content: (
            <div className="modal-preview">
              <div className="preview-card">
                <strong>Your Top 3 Bestsellers:</strong>
                <ul style={{ margin: "12px 0", fontSize: 13 }}>
                  {analyticsData.productAnalytics.topProducts.slice(0, 3).map((book, i) => (
                    <li key={i} style={{ marginBottom: 8 }}>
                      <strong>{book.title}</strong> - ₹{book.revenue.toLocaleString()} revenue, {book.quantity} sold
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ),
        },
        {
          title: "Promotion Strategy",
          content: (
            <div className="modal-form">
              <div className="form-group">
                <label>Promotion Type</label>
                <div className="option-group">
                  <label className="option">
                    <input type="radio" name="promo" defaultChecked /> Featured on Homepage (1 week)
                  </label>
                  <label className="option">
                    <input type="radio" name="promo" /> Create Bundle Deal (Save 25%)
                  </label>
                  <label className="option">
                    <input type="radio" name="promo" /> Email Campaign (Bestsellers)
                  </label>
                  <label className="option">
                    <input type="radio" name="promo" /> Increase Stock & Reorder from Supplier
                  </label>
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
    "High Cancellation Rate": {
      title: "Reduce Order Cancellations",
      description: "Improve payment and order completion",
      steps: [
        {
          title: "Investigate Cancellation Causes",
          content: (
            <div className="modal-preview">
              <div className="preview-card">
                <strong>Current Cancellation Rate: {analyticsData.revenueAnalytics.cancellationRate}%</strong>
                <p style={{ fontSize: 13, marginTop: 8 }}>Likely causes:</p>
                <ul style={{ fontSize: 13, margin: "8px 0" }}>
                  <li>Payment failures or timeouts</li>
                  <li>High shipping costs shown at checkout</li>
                  <li>Unexpected taxes/additional fees</li>
                  <li>Customer satisfaction concerns</li>
                </ul>
              </div>
            </div>
          ),
        },
        {
          title: "Implement Solutions",
          content: (
            <div className="modal-form">
              <div className="form-group">
                <label>Which would you like to enable?</label>
                <div className="option-group">
                  <label className="option">
                    <input type="checkbox" /> Allow payment retry on failure
                  </label>
                  <label className="option">
                    <input type="checkbox" /> Offer free shipping above ₹500
                  </label>
                  <label className="option">
                    <input type="checkbox" /> Show full price breakdown early
                  </label>
                  <label className="option">
                    <input type="checkbox" /> Send abandoned cart recovery emails
                  </label>
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
  };

  const config = Object.entries(actionConfigs).find(([key]) => insight.title.includes(key))?.[1] || {
    title: insight.title,
    description: insight.recommendation,
    steps: [{
      title: "Execute Action",
      content: (
        <div className="modal-preview">
          <div className="preview-card">
            <p>{insight.action}</p>
            <p style={{ fontSize: 13, marginTop: 12 }}>{insight.recommendation}</p>
          </div>
        </div>
      ),
    }],
  };

  const handleExecute = () => {
    setCompleted(true);
    setTimeout(() => onClose(), 2000);
  };

  return (
    <div className="action-modal-overlay">
      <div className="action-modal">
        <div className="modal-header">
          <div>
            <h2>{config.title}</h2>
            <p>{config.description}</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {!completed ? (
          <>
            <div className="modal-body">
              {config.steps && config.steps[currentStep] ? (
                <>
                  <div className="step-indicator">
                    Step {currentStep + 1} of {config.steps.length}: {config.steps[currentStep].title}
                  </div>
                  <div className="step-content">
                    {config.steps[currentStep].content}
                  </div>
                </>
              ) : null}
            </div>

            <div className="modal-footer">
              {currentStep > 0 && (
                <button className="btn-secondary" onClick={() => setCurrentStep(currentStep - 1)}>
                  ← Back
                </button>
              )}
              <div></div>
              {config.steps && currentStep < config.steps.length - 1 ? (
                <button className="btn-primary" onClick={() => setCurrentStep(currentStep + 1)}>
                  Next →
                </button>
              ) : (
                <button className="btn-success" onClick={handleExecute}>
                  <Send size={14} /> Execute Campaign
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="modal-success">
            <CheckCircle size={48} style={{ color: "#10b981", marginBottom: 16 }} />
            <h3>Campaign Launched! ✓</h3>
            <p>{insight.title} campaign has been queued</p>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 12 }}>
              Closing...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
