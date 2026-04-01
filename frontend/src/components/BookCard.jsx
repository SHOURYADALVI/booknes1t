import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useToast } from "../hooks/useToast";
import Toast from "./Toast";
import { Link } from "react-router-dom";
import "./BookCard.css";

export default function BookCard({ book }) {
  const { addItem } = useCart();
  const { toast, showToast } = useToast();

  const discount = Math.round((1 - book.price / book.mrp) * 100);

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(book);
    showToast(`"${book.title}" added to cart`);
  };

  return (
    <>
      <Toast toast={toast} />
      <Link to={`/book/${book.id}`} className="book-card">
        <div className="book-card-cover">
          <img src={book.cover} alt={book.title} onError={e => { e.target.src = `https://placehold.co/200x300/f0e8d8/3d2b1f?text=${encodeURIComponent(book.title)}`; }} />
          <span className="book-badge">{book.badge}</span>
          {book.stock < 10 && <span className="stock-warning">Only {book.stock} left!</span>}
        </div>
        <div className="book-card-body">
          <div className="book-genre">{book.genre}</div>
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">by {book.author}</p>
          <div className="book-rating">
            <Star size={12} fill="var(--amber)" color="var(--amber)" />
            <span>{book.rating}</span>
            <span className="review-count">({book.reviews.toLocaleString()})</span>
          </div>
          <div className="book-price-row">
            <span className="book-price">₹{book.price}</span>
            <span className="book-mrp">₹{book.mrp}</span>
            <span className="book-discount">{discount}% off</span>
          </div>
          <button className="btn btn-primary btn-sm book-add-btn" onClick={handleAdd}>
            <ShoppingCart size={13} /> Add to Cart
          </button>
        </div>
      </Link>
    </>
  );
}
