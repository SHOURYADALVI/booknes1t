import { useState, useEffect } from "react";
import { Zap, AlertCircle } from "lucide-react";
import "./PointsRedemption.css";

export default function PointsRedemption({
  availablePoints,
  pointsConfig,
  onRedeem,
  onCancel,
  loading = false,
}) {
  const [pointsToUse, setPointsToUse] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Calculate discount when points change
  useEffect(() => {
    if (pointsToUse > availablePoints) {
      setError(`You only have ${availablePoints} points available`);
      setDiscount(0);
    } else if (pointsToUse < 0) {
      setError("Points cannot be negative");
      setDiscount(0);
    } else {
      setError("");
      const discountAmount = pointsToUse * (pointsConfig?.pointRedemptionValue || 0.5);
      setDiscount(discountAmount);
    }
  }, [pointsToUse, availablePoints, pointsConfig]);

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setPointsToUse(Math.max(0, Math.min(value, availablePoints)));
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setPointsToUse(Math.max(0, Math.min(value, availablePoints)));
  };

  const handleUseMax = () => {
    setPointsToUse(availablePoints);
  };

  const handleApply = async () => {
    if (pointsToUse === 0) {
      setError("Please select points to redeem");
      return;
    }

    if (pointsToUse > availablePoints) {
      setError("Insufficient points");
      return;
    }

    try {
      setSuccess(true);
      await onRedeem(pointsToUse, discount);
      setTimeout(() => {
        setPointsToUse(0);
        setSuccess(false);
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to redeem points");
      setSuccess(false);
    }
  };

  return (
    <div className="points-redemption">
      <div className="redemption-header">
        <Zap size={20} />
        <h3>Redeem Your Points</h3>
      </div>

      <div className="redemption-body">
        {/* Available Points Summary */}
        <div className="points-summary">
          <div className="summary-item">
            <span className="summary-label">Available Points:</span>
            <span className="summary-value">{availablePoints}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Points per ₹1:</span>
            <span className="summary-value">{pointsConfig?.pointsPerRupee || 1}</span>
          </div>
        </div>

        {/* Slider or Input */}
        <div className="redemption-input">
          <label className="input-label">
            <span>Points to Use:</span>
            <span className="max-link" onClick={handleUseMax}>
              Use Max
            </span>
          </label>

          <div className="input-group">
            <input
              type="range"
              min="0"
              max={availablePoints}
              value={pointsToUse}
              onChange={handleSliderChange}
              className="slider"
              disabled={loading || availablePoints === 0}
            />
            <input
              type="number"
              min="0"
              max={availablePoints}
              value={pointsToUse}
              onChange={handleInputChange}
              className="number-input"
              disabled={loading || availablePoints === 0}
            />
          </div>
        </div>

        {/* Discount Preview */}
        {pointsToUse > 0 && (
          <div className="discount-preview">
            <div className="preview-row">
              <span>Redeeming:</span>
              <strong>{pointsToUse} points</strong>
            </div>
            <div className="preview-row highlight">
              <span>Discount:</span>
              <strong>₹{discount.toFixed(2)}</strong>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="success-message">
            ✓ Points redeemed successfully!
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="btn-apply"
            onClick={handleApply}
            disabled={loading || pointsToUse === 0 || error !== ""}
          >
            {loading ? "Processing..." : `Apply ₹${discount.toFixed(2)} Discount`}
          </button>
          <button
            className="btn-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>

        {/* Info Text */}
        <p className="info-text">
          1 point = ₹{pointsConfig?.pointRedemptionValue || 0.5} discount on your purchase
        </p>
      </div>
    </div>
  );
}
