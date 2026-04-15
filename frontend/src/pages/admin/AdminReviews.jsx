import { useEffect, useState } from "react";
import { useAdminReviews } from "../../hooks/useAdminReviews.js";
import { Star, Search, Filter, TrendingUp } from "lucide-react";
import "./AdminReviews.css";

export default function AdminReviews() {
  const { reviews, loading, fetchAllReviews } = useAdminReviews();
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const filtered = reviews.filter(review => {
    const matchesSearch =
      review.bookId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.userName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating = ratingFilter === "all" || review.rating === parseInt(ratingFilter);

    return matchesSearch && matchesRating;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  return (
    <div className="admin-reviews">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{reviews.length}</div>
          <div className="stat-label">Total Reviews</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{avgRating}</div>
          <div className="stat-label">Average Rating</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{ratingDistribution[5]}</div>
          <div className="stat-label">5-Star Reviews</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{reviews.filter(r => r.rating <= 2).length}</div>
          <div className="stat-label">Low Ratings ⚠</div>
        </div>
      </div>

      {/* Rating Distribution */}
      {reviews.length > 0 && (
        <div className="rating-distribution">
          <h3>Rating Distribution</h3>
          <div className="distribution-bars">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="distribution-row">
                <span className="star-label">{star} ★</span>
                <div className="bar-container">
                  <div
                    className="bar"
                    style={{
                      width: `${(ratingDistribution[star] / reviews.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="bar-count">{ratingDistribution[star]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="reviews-controls">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by customer, book, or review text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading reviews...</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="empty-state">
            <p>No reviews found</p>
          </div>
        ) : (
          sorted.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-card-header">
                <div className="review-meta">
                  <div className="reviewer-name">{review.userName}</div>
                  <div className="review-book">Book: {review.bookId}</div>
                  <div className="review-date">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
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
                  <span className="rating-badge">{review.rating}/5</span>
                </div>
              </div>

              <div className="review-card-content">
                <div className="review-title">{review.title}</div>
                <div className="review-text">{review.text}</div>
              </div>

              <div className="review-card-footer">
                <span className="order-ref">Order ID: {review.orderId}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Results Count */}
      {!loading && (
        <div className="results-count">
          Showing {sorted.length} of {reviews.length} reviews
        </div>
      )}
    </div>
  );
}
