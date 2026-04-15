import { useState, useCallback } from "react";

export const useAdminReviews = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  const fetchAllReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/reviews/admin/all", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch reviews");
      }

      const data = await response.json();
      setReviews(data.reviews);
      console.log(`[useAdminReviews] Fetched ${data.totalReviews} reviews`);
      return data;
    } catch (err) {
      setError(err.message);
      console.error("[useAdminReviews] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reviews,
    loading,
    error,
    fetchAllReviews,
  };
};
