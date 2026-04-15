import { useState, useMemo } from "react";
import { Search, Plus, Minus, Check } from "lucide-react";
import { BOOKS, SUPPLIERS, SUPPLIER_PRICES } from "../data/mockData.js";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../hooks/useToast.js";
import Toast from "../components/Toast.jsx";
import "./OrderBooksPage.css";

const GENRES = ["All", ...new Set(BOOKS.map(b => b.genre))];

export default function OrderBooksPage() {
  const { addItem } = useCart();
  const { toast, showToast } = useToast();
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [selectedBooks, setSelectedBooks] = useState(new Map());
  const [tempQuantity, setTempQuantity] = useState({});
  const [selectedSupplier, setSelectedSupplier] = useState("S001");

  const getSupplierPrice = (bookId) => {
    const prices = SUPPLIER_PRICES[bookId];
    return prices ? prices[selectedSupplier] : BOOKS.find(b => b.id === bookId)?.price || 0;
  };

  const filtered = useMemo(() => {
    let books = [...BOOKS];
    if (search) {
      books = books.filter(b =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (genre !== "All") {
      books = books.filter(b => b.genre === genre);
    }
    return books;
  }, [search, genre]);

  const handleQuantityChange = (bookId, value) => {
    const num = Math.max(0, parseInt(value) || 0);
    setTempQuantity(prev => ({
      ...prev,
      [bookId]: num
    }));
    
    // Update selectedBooks with new quantity for real-time price update
    if (selectedBooks.has(bookId) && num > 0) {
      setSelectedBooks(prev => {
        const newMap = new Map(prev);
        const book = newMap.get(bookId);
        newMap.set(bookId, { ...book, quantity: num });
        return newMap;
      });
    }
  };

  const toggleBookSelection = (book) => {
    const qty = tempQuantity[book.id] || 1;
    if (qty <= 0) return;

    setSelectedBooks(prev => {
      const newMap = new Map(prev);
      if (newMap.has(book.id)) {
        newMap.delete(book.id);
      } else {
        newMap.set(book.id, { ...book, quantity: qty });
      }
      return newMap;
    });
    setTempQuantity(prev => ({ ...prev, [book.id]: 1 }));
  };

  const handleAddToCart = async () => {
    if (selectedBooks.size === 0) {
      showToast("Please select at least one book to place order", "error");
      return;
    }

    let addedCount = 0;
    for (const [bookId, book] of selectedBooks.entries()) {
      for (let i = 0; i < book.quantity; i++) {
        addItem(book);
      }
      addedCount += book.quantity;
    }

    showToast(`✓ Order placed for ${addedCount} book(s)`);
    setSelectedBooks(new Map());
    setTempQuantity({});
  };

  const totalPrice = Array.from(selectedBooks.values()).reduce(
    (sum, book) => sum + (getSupplierPrice(book.id) * book.quantity),
    0
  );

  return (
    <>
      <Toast toast={toast} />
      <div className="order-books-page">
        <div className="container">
          {/* PAGE HEADER */}
          <div className="page-header">
            <div>
              <h1 className="page-title">📚 Bulk Order Books</h1>
              <p className="page-subtitle">Order books in bulk from supplier — Wholesale pricing</p>
            </div>
          </div>

          {/* SUPPLIER SELECTION */}
          <div className="supplier-selector">
            <label>Select Supplier:</label>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="supplier-dropdown"
            >
              {SUPPLIERS.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name} ({supplier.location}) - ⭐ {supplier.rating} | Lead: {supplier.leadDays}d
                </option>
              ))}
            </select>
          </div>

          {/* MAIN LAYOUT */}
          <div className="order-layout">
            {/* LEFT: BOOK SELECTION */}
            <div className="books-section">
              {/* FILTERS */}
              <div className="filter-bar">
                <div className="search-box">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search by title or author..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="genre-filter">
                  {GENRES.map(g => (
                    <button
                      key={g}
                      className={`genre-btn ${genre === g ? 'active' : ''}`}
                      onClick={() => setGenre(g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* BOOKS GRID */}
              <div className="books-grid">
                {filtered.map(book => {
                  const isSelected = selectedBooks.has(book.id);
                  const qty = tempQuantity[book.id] || 1;

                  return (
                    <div
                      key={book.id}
                      className={`book-order-card ${isSelected ? 'selected' : ''}`}
                    >
                      {/* BOOK IMAGE */}
                      <div className="book-image-wrap">
                        <div className="book-image">
                          {book.title[0]}
                        </div>
                        {isSelected && (
                          <div className="selected-badge">
                            <Check size={20} />
                          </div>
                        )}
                      </div>

                      {/* BOOK INFO */}
                      <div className="book-info">
                        <h3 className="book-title">{book.title}</h3>
                        <p className="book-author">{book.author}</p>
                        <div className="book-meta">
                          <span className="genre-tag">{book.genre}</span>
                          <span className="rating">⭐ {book.rating}</span>
                        </div>
                      </div>

                      {/* PRICE & QUANTITY */}
                      <div className="book-footer">
                        <div className="price">₹{getSupplierPrice(book.id)}</div>
                        {!isSelected ? (
                          <button
                            className="btn-select"
                            onClick={() => toggleBookSelection(book)}
                          >
                            <Plus size={16} /> Select
                          </button>
                        ) : (
                          <div className="quantity-control">
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={qty}
                              onChange={(e) => handleQuantityChange(book.id, e.target.value)}
                              className="qty-input"
                            />
                            <button
                              className="btn-remove"
                              onClick={() => toggleBookSelection(book)}
                              title="Remove selection"
                            >
                              <Minus size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <div className="empty-state">
                  <p>No books found matching your search</p>
                </div>
              )}
            </div>

            {/* RIGHT: ORDER SUMMARY */}
            <div className="order-summary">
              <div className="summary-card">
                <h3>Order Details</h3>

                {selectedBooks.size === 0 ? (
                  <div className="empty-summary">
                    <p>No books selected</p>
                    <p className="hint">Select books to create your bulk order</p>
                  </div>
                ) : (
                  <>
                    <div className="selected-items">
                      {Array.from(selectedBooks.values()).map((book, idx) => (
                        <div key={idx} className="summary-item">
                          <div className="item-details">
                            <div className="item-title">{book.title}</div>
                            <div className="item-author">{book.author}</div>
                          </div>
                          <div className="item-pricing">
                            <div className="qty-badge">{book.quantity}x</div>
                            <div className="item-price">₹{(getSupplierPrice(book.id) * book.quantity).toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-totals">
                      <div className="total-row">
                        <span>Subtotal ({Array.from(selectedBooks.values()).reduce((s, b) => s + b.quantity, 0)} items)</span>
                        <span>₹{totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="total-row">
                        <span>Shipping</span>
                        <span>Free</span>
                      </div>
                      <div className="total-row">
                        <span>Estimated Tax</span>
                        <span>₹{Math.round(totalPrice * 0.05).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="final-total">
                      <span>Total Amount</span>
                      <span>₹{(totalPrice + Math.round(totalPrice * 0.05)).toLocaleString()}</span>
                    </div>

                    <button className="btn-checkout" onClick={handleAddToCart}>
                      Place Order
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
