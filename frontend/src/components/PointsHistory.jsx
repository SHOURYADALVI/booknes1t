import { TrendingUp, TrendingDown, Calendar } from "lucide-react";
import "./PointsHistory.css";

export default function PointsHistory({ transactions = [] }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="points-history empty">
        <p>No transaction history yet. Start earning points with your purchases!</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="points-history">
      <h3 className="history-title">Points Transaction History</h3>

      <div className="transactions-list">
        {transactions.map((transaction, index) => (
          <div
            key={index}
            className={`transaction-item ${transaction.type === "earned" ? "earned" : "redeemed"}`}
          >
            <div className="transaction-icon">
              {transaction.type === "earned" ? (
                <TrendingUp size={18} />
              ) : (
                <TrendingDown size={18} />
              )}
            </div>

            <div className="transaction-details">
              <div className="transaction-title">
                {transaction.type === "earned" ? "Points Earned" : "Points Redeemed"}
              </div>
              <div className="transaction-meta">
                <Calendar size={12} />
                {formatDate(transaction.date)}
                {transaction.orderId && (
                  <span className="order-ref">Order: {transaction.orderId.slice(0, 8)}</span>
                )}
              </div>
            </div>

            <div className={`transaction-amount ${transaction.type}`}>
              <span className="symbol">{transaction.type === "earned" ? "+" : "-"}</span>
              <span className="value">{Math.abs(transaction.points)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
