import { useState, useCallback } from "react";

export const usePoints = () => {
  const [points, setPoints] = useState({
    balance: 0,
    totalEarned: 0,
    totalRedeemed: 0,
    discountValue: 0,
    transactions: [],
  });
  const [pointsConfig, setPointsConfig] = useState({
    pointsPerRupee: 1,
    pointRedemptionValue: 0.5,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPointsBalance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/points/balance", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch points");
      }

      const data = await response.json();
      setPoints(data.points);
      setPointsConfig(data.config);
      console.log(`[usePoints] Balance: ${data.points.balance} points`);
      return data;
    } catch (err) {
      setError(err.message);
      console.error("[usePoints] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const redeemPoints = useCallback(async (pointsToRedeem) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/points/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ points: pointsToRedeem }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to redeem points");
      }

      const data = await response.json();
      
      // Update local points
      setPoints((prev) => ({
        ...prev,
        balance: data.remainingBalance,
        totalRedeemed: prev.totalRedeemed + data.pointsRedeemed,
        discountValue: data.remainingBalance * pointsConfig.pointRedemptionValue,
      }));

      console.log(`[usePoints] Redeemed ${pointsToRedeem} points for ₹${data.discountAmount}`);
      return data;
    } catch (err) {
      setError(err.message);
      console.error("[usePoints] Redeem error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [pointsConfig]);

  return {
    // Direct access to points data
    balance: points.balance,
    totalEarned: points.totalEarned,
    totalRedeemed: points.totalRedeemed,
    discountValue: points.discountValue,
    transactions: points.transactions,
    // Config
    pointsConfig,
    // State
    points,
    loading,
    error,
    // Methods
    fetchPointsBalance,
    redeemPoints,
  };
};
