import { useCallback, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export function useAnalytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [advancedAnalytics, setAdvancedAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    if (!user || user.role !== "admin") {
      setError("Unauthorized - admin access required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`[useAnalytics] Fetching analytics for admin user: ${user.email}`);
      
      const res = await fetch("/api/orders/analytics", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(
          res.status === 401
            ? "Unauthorized"
            : res.status === 403
            ? "Forbidden - admin only"
            : `Error: ${res.status}`
        );
      }

      const data = await res.json();
      console.log(`[useAnalytics] ✓ Analytics loaded:`, {
        totalReviews: data.advanced?.businessHealth?.totalReviewsAnalyzed,
        insights: data.advanced?.actionableInsights?.length,
      });
      
      setAnalytics(data.analytics);
      setAdvancedAnalytics(data.advanced);
    } catch (err) {
      console.error("[useAnalytics] Failed to fetch analytics:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch analytics on mount and when user changes
  useEffect(() => {
    if (user && user.role === "admin") {
      fetchAnalytics();
    }
  }, [user, fetchAnalytics]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const interval = setInterval(() => {
      fetchAnalytics();
    }, 10000);

    return () => clearInterval(interval);
  }, [user, fetchAnalytics]);

  return {
    analytics,
    advancedAnalytics,
    loading,
    error,
    fetchAnalytics,
  };
}
