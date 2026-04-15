import { useParams, Link, useNavigate } from "react-router-dom";
import { BOOKS } from "../data/mockData";
import { useCart } from "../context/CartContext";
import { useToast } from "../hooks/useToast";
import { useReviews } from "../hooks/useReviews";
import Toast from "../components/Toast";
import ReviewsDisplay from "../components/ReviewsDisplay";
import { Star, ShoppingCart, ArrowLeft, Package, Zap } from "lucide-react";
import "./BookDetailPage.css";

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = BOOKS.find(b => b.id === id);
  const { addItem, items } = useCart();
  const { toast, showToast } = useToast();
  const { reviews, averageRating, fetchReviews, totalReviews: reviewCount } = useReviews();

  if (!book) return (
    <div className="container" style={{ padding: "80px 24px", textAlign: "center" }}>
      <h2>Book not found</h2>
      <button onClick={() => navigate(-1)} className="btn btn-primary" style={{ marginTop: 16 }}>Go Back</button>
    </div>
  );

  const inCart = items.find(i => i.id === book.id);
  const discount = Math.round((1 - book.price / book.mrp) * 100);
  const related = BOOKS.filter(b => b.genre === book.genre && b.id !== book.id).slice(0, 3);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Toast toast={toast} />
      <div className="book-detail-page">
        <div className="container">
          <button onClick={handleBack} className="back-link">
            <ArrowLeft size={16} /> Go Back
          </button>

          <div className="book-detail-grid">
            <div className="book-detail-cover">
              <img
                src={book.cover}
                alt={book.title}
                onError={e => { e.target.src = `https://placehold.co/300x440/f0e8d8/3d2b1f?text=${encodeURIComponent(book.title)}`; }}
              />
              <div className="book-formats">
                {book.format.map(f => <span key={f} className="badge badge-gray">{f}</span>)}
              </div>
            </div>

            <div className="book-detail-info">
              <span className="badge badge-amber">{book.badge}</span>
              <h1 className="book-detail-title">{book.title}</h1>
              <p className="book-detail-author">by <strong>{book.author}</strong></p>
              <p className="book-detail-genre">{book.genre}</p>

              <div className="book-detail-rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.round(book.rating) ? "var(--amber)" : "none"} color="var(--amber)" />
                ))}
                <span className="rating-num">{book.rating}</span>
                <span className="rating-reviews">({book.reviews.toLocaleString()} reviews)</span>
              </div>

              <p className="book-detail-desc">{book.description}</p>

              <div className="book-detail-price-block">
                <span className="detail-price">₹{book.price}</span>
                <span className="detail-mrp">₹{book.mrp}</span>
                <span className="badge badge-green">{discount}% OFF</span>
              </div>

              <div className="book-detail-stock">
                {book.stock > 10
                  ? <span className="in-stock">✓ In Stock ({book.stock} available)</span>
                  : book.stock > 0
                  ? <span className="low-stock">⚠ Only {book.stock} left!</span>
                  : <span className="out-of-stock">Out of Stock</span>
                }
              </div>

              <div className="book-detail-actions">
                <button
                  className={`btn btn-primary btn-lg ${inCart ? "in-cart" : ""}`}
                  onClick={() => { addItem(book); showToast(`"${book.title}" added to cart!`); }}
                  disabled={book.stock === 0}
                >
                  <ShoppingCart size={18} />
                  {inCart ? `In Cart (${inCart.qty})` : "Add to Cart"}
                </button>
                <Link to="/cart" className="btn btn-dark btn-lg">
                  <Zap size={18} /> Buy Now
                </Link>
              </div>

              <div className="book-detail-perks">
                <div className="perk"><Package size={14} /> Free delivery on orders above ₹499</div>
                <div className="perk"><Star size={14} /> 30-day hassle-free returns</div>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div className="related-section">
              <h3>More in {book.genre}</h3>
              <div className="related-grid">
                {related.map(b => (
                  <Link to={`/book/${b.id}`} key={b.id} className="related-card">
                    <img src={b.cover} alt={b.title} onError={e => { e.target.src = `https://placehold.co/80x120/f0e8d8/3d2b1f?text=Book`; }} />
                    <div>
                      <div className="related-title">{b.title}</div>
                      <div className="related-author">by {b.author}</div>
                      <div className="related-price">₹{b.price}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <ReviewsDisplay
            bookId={id}
            bookTitle={book.title}
            reviews={reviews}
            averageRating={averageRating}
            totalReviews={reviewCount}
            onLoadReviews={fetchReviews}
          />
        </div>
      </div>
    </>
  );
}
