import { useState, useCallback } from "react";

export const useReviews = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  const addReview = useCallback(async (bookId, rating, title, text, orderId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/reviews/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies
        body: JSON.stringify({ bookId, rating, title, text, orderId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add review");
      }

      const data = await response.json();
      setReviews((prev) => [data.review, ...prev]);
      console.log("[useReviews] Review added:", data.review.id);
      return data.review;
    } catch (err) {
      setError(err.message);
      console.error("[useReviews] Add review error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReviews = useCallback(async (bookId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/reviews/book/${bookId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
      console.log(`[useReviews] Fetched ${data.reviews.length} reviews for book ${bookId}`);
      return data;
    } catch (err) {
      setError(err.message);
      console.error("[useReviews] Fetch reviews error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reviews,
    averageRating,
    loading,
    error,
    addReview,
    fetchReviews,
  };
};
