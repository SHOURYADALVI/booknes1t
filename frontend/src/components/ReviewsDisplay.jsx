import { Star, MessageCircle } from "lucide-react";
import { useEffect } from "react";
import "./ReviewsDisplay.css";

export default function ReviewsDisplay({ bookId, bookTitle, reviews, averageRating, totalReviews, onLoadReviews }) {
  useEffect(() => {
    if (onLoadReviews && bookId) {
      onLoadReviews(bookId);
    }
  }, [bookId, onLoadReviews]);

  if (!reviews || reviews.length === 0) {
    return (
      <div className="reviews-section">
        <div className="reviews-header">
          <h3 className="reviews-title">Customer Reviews</h3>
          {totalReviews > 0 && (
            <div className="rating-summary">
              <div className="rating-avg">
                {averageRating.toFixed(1)}
                <Star size={16} fill="var(--amber)" color="var(--amber)" style={{ marginLeft: 4 }} />
              </div>
              <div className="rating-count">{totalReviews} review{totalReviews !== 1 ? "s" : ""}</div>
            </div>
          )}
        </div>
        {totalReviews === 0 && (
          <div className="no-reviews">
            <MessageCircle size={32} color="var(--border)" />
            <p>No reviews yet. Be the first to review this book!</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h3 className="reviews-title">Customer Reviews</h3>
        <div className="rating-summary">
          <div className="rating-avg">
            {averageRating.toFixed(1)}
            <Star size={16} fill="var(--amber)" color="var(--amber)" style={{ marginLeft: 4 }} />
          </div>
          <div className="rating-count">{totalReviews} review{totalReviews !== 1 ? "s" : ""}</div>
        </div>
      </div>

      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <div className="reviewer-info">
                <div className="reviewer-name">{review.userName}</div>
                <div className="review-date">
                  {new Date(review.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div className="review-rating">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < review.rating ? "var(--amber)" : "var(--border)"}
                    color={i < review.rating ? "var(--amber)" : "var(--border)"}
                  />
                ))}
                <span className="rating-text">{review.rating}/5</span>
              </div>
            </div>

            <div className="review-title">{review.title}</div>
            <div className="review-text">{review.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
