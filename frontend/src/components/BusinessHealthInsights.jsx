import { AlertTriangle, TrendingUp, Zap, AlertCircle, MessageSquare } from "lucide-react";
import "./BusinessHealthInsights.css";

export default function BusinessHealthInsights({ businessHealth, actionableInsights }) {
  if (!businessHealth || !actionableInsights) {
    return null;
  }

  const { areaHealthScores, priorityAreas, negativeReviewCount } = businessHealth;

  return (
    <div className="business-health-section">
      {/* HEADER */}
      <div className="health-header">
        <div>
          <h3>Business Health & Sentiment Analysis</h3>
          <p className="health-subtitle">
            Automated insights from {businessHealth.totalReviewsAnalyzed} customer reviews
          </p>
        </div>
        <div className="health-badge" style={{
          backgroundColor: negativeReviewCount > 20 ? "#fee" : "#efe",
          color: negativeReviewCount > 20 ? "#c33" : "#3c3",
        }}>
          {negativeReviewCount} Negative Reviews
        </div>
      </div>

      {/* PRIORITY ALERTS */}
      {priorityAreas.length > 0 && (
        <div className="priority-alerts">
          <div className="alerts-title">
            <AlertTriangle size={18} />
            Areas Requiring Attention
          </div>
          <div className="alerts-grid">
            {priorityAreas.map((area, idx) => (
              <div
                key={idx}
                className={`alert-card alert-${area.attention}`}
              >
                <div className="alert-header">
                  <div className="alert-name">
                    {area.area.charAt(0).toUpperCase() + area.area.slice(1)}
                  </div>
                  <div className="alert-score">{area.healthScore}%</div>
                </div>
                <div className="alert-keywords">
                  {area.topKeywords.map((kw, i) => (
                    <span key={i} className="keyword-tag">{kw}</span>
                  ))}
                </div>
                <div className="alert-issues">{area.issueCount} issues found</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DETAILED ISSUE BREAKDOWN */}
      <div className="issues-breakdown-section">
        <div className="breakdown-title">
          <AlertCircle size={18} />
          Detailed Problem Analysis
        </div>
        <div className="issues-breakdown-content">
          {businessHealth.areaDetails && Object.entries(businessHealth.areaDetails).map(([area, details]) => {
            if (!details.problems || details.problems.length === 0) return null;
            
            const totalProblems = details.problems.reduce((sum, p) => sum + (p.count || 1), 0);
            
            return (
              <div key={area} className="area-breakdown-card">
                <div className="area-breakdown-header">
                  <div className="area-name">
                    {area.charAt(0).toUpperCase() + area.slice(1)}
                  </div>
                  <div className="problem-count">{totalProblems} issues</div>
                </div>
                <div className="problems-list">
                  {details.problems.sort((a, b) => (b.count || 1) - (a.count || 1)).map((problem, idx) => (
                    <div key={idx} className="problem-item">
                      <div className="problem-keyword">
                        <span className="keyword-badge">{problem.keyword}</span>
                        <span className="problem-mentions">{problem.count || 1} mention{problem.count > 1 ? 's' : ''}</span>
                      </div>
                      <div className="problem-bar">
                        <div 
                          className="problem-bar-fill"
                          style={{
                            width: `${(problem.count / totalProblems) * 100}%`,
                            backgroundColor: problem.severity === 'high' ? '#f56c6c' : problem.severity === 'medium' ? '#e6a23c' : '#409eff'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="area-health-grid">
        <div className="area-health-title">Overall Health Metrics</div>
        <div className="area-scores">
          {Object.entries(areaHealthScores).map(([area, score]) => {
            const percentage = score;
            let barColor = "#67c23a"; // green
            if (percentage < 50) barColor = "#f56c6c"; // red
            else if (percentage < 70) barColor = "#e6a23c"; // orange
            else if (percentage < 85) barColor = "#409eff"; // blue

            return (
              <div key={area} className="area-health-item">
                <div className="area-label">{area.charAt(0).toUpperCase() + area.slice(1)}</div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>
                <div className="health-percentage">{percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTIONABLE INSIGHTS */}
      <div className="insights-section">
        <div className="insights-title">
          <TrendingUp size={18} />
          Recommended Actions
        </div>
        <div className="insights-list">
          {actionableInsights.map((insight, idx) => (
            <div
              key={idx}
              className={`insight-card insight-${insight.severity}`}
            >
              <div className="insight-icon">{insight.icon}</div>
              <div className="insight-content">
                <div className="insight-title">{insight.title}</div>
                <div className="insight-action">{insight.action}</div>
                <div className="insight-issues">{insight.issues} related reviews</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ALL NEGATIVE REVIEWS */}
      {businessHealth.negativeReviews && businessHealth.negativeReviews.length > 0 && (
        <div className="negative-reviews-section">
          <div className="reviews-title">
            <MessageSquare size={18} />
            All Negative Reviews ({businessHealth.negativeReviews.length})
          </div>
          <div className="negative-reviews-list">
            {businessHealth.negativeReviews.map((review, idx) => (
              <div key={idx} className="negative-review-card">
                <div className="review-text-large">
                  {review.text}
                </div>
                <div className="review-footer">
                  <div className="review-rating">
                    {'⭐'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                  <div className="review-meta">
                    #{review.id} • {review.rating}★
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUMMARY STATS */}
      <div className="health-summary">
        <div className="summary-stat">
          <div className="stat-value negative">{businessHealth.negativeReviewCount}</div>
          <div className="stat-label">Negative Reviews</div>
        </div>
        <div className="summary-stat">
          <div className="stat-value neutral">{businessHealth.neutralReviewCount}</div>
          <div className="stat-label">Neutral Reviews</div>
        </div>
        <div className="summary-stat">
          <div className="stat-value positive">{businessHealth.positiveReviewCount}</div>
          <div className="stat-label">Positive Reviews</div>
        </div>
      </div>
    </div>
  );
}
