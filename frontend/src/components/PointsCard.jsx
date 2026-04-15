import { Gift } from "lucide-react";
import "./PointsCard.css";

export default function PointsCard({ balance, discountValue, config }) {
  return (
    <div className="points-card">
      <div className="points-header">
        <div className="points-icon">
          <Gift size={24} />
        </div>
        <div>
          <div className="points-label">Loyalty Points</div>
          <div className="points-value">{balance || 0}</div>
        </div>
      </div>

      <div className="points-info">
        <div className="info-row">
          <span className="info-label">Worth:</span>
          <span className="info-value">₹{(discountValue || 0).toFixed(2)}</span>
        </div>
        <div className="info-row small">
          <span className="info-label">Rate:</span>
          <span className="info-value">{config?.pointRedemptionValue || 0.5} per point</span>
        </div>
      </div>

      <div className="points-progress">
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
    </div>
  );
}
