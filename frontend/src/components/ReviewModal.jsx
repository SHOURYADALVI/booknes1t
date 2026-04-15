import { useState } from "react";
import { X, Star, Loader } from "lucide-react";
import "./ReviewModal.css";

export default function ReviewModal({ 
  isOpen, 
  onClose, 
  bookId, 
  bookTitle, 
  onSubmit, 
  isLoading = false,
  existingReview = null 
}) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState(existingReview?.title || "");
  const [text, setText] = useState(existingReview?.text || "");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    if (!title.trim()) {
      alert("Please enter a review title");
      return;
    }
    if (!text.trim()) {
      alert("Please enter a review");
      return;
    }

    try {
      await onSubmit({ rating, title, text });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
      }, 1500);
    } catch (err) {
      alert("Failed to submit review: " + err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="review-modal-overlay">
      <div className="review-modal">
        <button className="review-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {submitted ? (
          <div className="review-success">
            <div className="success-icon">✓</div>
            <h2>Thank you for your review!</h2>
            <p>Your review has been submitted successfully.</p>
          </div>
        ) : (
          <>
            <h2 className="review-modal-title">Review: {bookTitle}</h2>

            <form onSubmit={handleSubmit} className="review-form">
              <div className="form-group">
                <label>Rating *</label>
                <div className="star-rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${
                        (hoveredRating || rating) >= star ? "active" : ""
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                    >
                      <Star
                        size={32}
                        fill={(hoveredRating || rating) >= star ? "var(--amber)" : "none"}
                        color="var(--amber)"
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <div className="rating-display">
                    <span className="rating-stars">★★★★★</span>
                    <span className="rating-text">{rating}/5 stars</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Review Title *</label>
                <input
                  type="text"
                  placeholder="Summarize your experience"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  className="review-input-text"
                />
                <small>{title.length}/100</small>
              </div>

              <div className="form-group">
                <label>Your Review *</label>
                <textarea
                  placeholder="Share your thoughts about this book..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={1000}
                  rows={6}
                  className="review-textarea"
                />
                <small>{text.length}/1000</small>
              </div>

              <div className="review-modal-actions">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading || rating === 0}
                >
                  {isLoading ? (
                    <>
                      <Loader size={14} style={{ animation: "spin 1s linear infinite" }} />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
