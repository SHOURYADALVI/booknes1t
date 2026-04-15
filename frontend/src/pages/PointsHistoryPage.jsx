import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { usePoints } from "../hooks/usePoints.js";
import PointsCard from "../components/PointsCard.jsx";
import PointsHistory from "../components/PointsHistory.jsx";
import Toast from "../components/Toast.jsx";
import { useToast } from "../hooks/useToast.js";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import "./PointsHistoryPage.css";

export default function PointsHistoryPage() {
  const { user } = useAuth();
  const { balance, totalEarned, totalRedeemed, discountValue, transactions, pointsConfig, fetchPointsBalance } = usePoints();
  const { toast, showToast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPointsBalance().finally(() => setLoading(false));
    }
  }, [user, fetchPointsBalance]);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: 120, paddingBottom: 60, textAlign: "center" }}>
        <div className="spinner" style={{ margin: "0 auto" }}></div>
        <p style={{ marginTop: 20, color: "var(--muted)" }}>Loading your points...</p>
      </div>
    );
  }

  return (
    <>
      <Toast toast={toast} />
      <div className="points-history-page">
        <div className="container">
          <div className="page-header">
            <Link to="/orders" className="back-link">
              <ArrowLeft size={18} />
              Back to Orders
            </Link>
            <h1 className="page-title">Loyalty Points</h1>
            <p className="page-subtitle">Track and manage your reward points</p>
          </div>

          <div className="points-layout">
            {/* Main Card */}
            <div className="points-main">
              <PointsCard
                balance={balance}
                discountValue={discountValue}
                config={pointsConfig}
              />

              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Earned</div>
                  <div className="stat-value">{totalEarned || 0}</div>
                  <div className="stat-subtitle">points</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Redeemed</div>
                  <div className="stat-value">{totalRedeemed || 0}</div>
                  <div className="stat-subtitle">points</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Redemption Value</div>
                  <div className="stat-value">₹{(pointsConfig?.pointRedemptionValue || 0.5).toFixed(2)}</div>
                  <div className="stat-subtitle">per point</div>
                </div>
              </div>

              {/* How It Works */}
              <div className="info-section">
                <h3>How It Works</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-icon">📚</div>
                    <div>
                      <h4>Earn Points</h4>
                      <p>Get 1 point for every ₹1 spent on purchases</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-icon">🎁</div>
                    <div>
                      <h4>Save Points</h4>
                      <p>Points never expire. Use them whenever you want</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-icon">💰</div>
                    <div>
                      <h4>Redeem Discount</h4>
                      <p>Redeem points at checkout for instant discounts</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <PointsHistory transactions={transactions} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
