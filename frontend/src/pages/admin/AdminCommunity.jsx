import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, BookOpen, Star, TrendingUp, Users } from "lucide-react";
import { COMMUNITY_ACTIVITY, GENRE_PREFERENCES, BOOKS } from "../../data/mockData.js";
import "./AdminCommunity.css";

export default function AdminCommunity() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [curatedBooks, setCuratedBooks] = useState([
    { bookId: "b001", reason: "Community favorite - 65% reading it", featured: true },
    { bookId: "b002", reason: "Highest rated this month", featured: true },
    { bookId: "b004", reason: "Rising trend in Sci-Fi", featured: false },
  ]);
  const [selectedGenre, setSelectedGenre] = useState("all");

  const filteredActivity = useMemo(() => {
    let result = [...COMMUNITY_ACTIVITY];
    
    if (search) {
      result = result.filter(a =>
        a.username.toLowerCase().includes(search.toLowerCase()) ||
        a.bookTitle.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter !== "all") {
      result = result.filter(a => a.action === filter);
    }

    return result;
  }, [search, filter]);

  const stats = {
    totalReaders: new Set(COMMUNITY_ACTIVITY.map(a => a.userId)).size,
    booksReading: COMMUNITY_ACTIVITY.filter(a => a.action === "reading").length,
    booksCompleted: COMMUNITY_ACTIVITY.filter(a => a.action === "completed").length,
    avgRating: (COMMUNITY_ACTIVITY
      .filter(a => a.rating)
      .reduce((sum, a) => sum + a.rating, 0) / 
      COMMUNITY_ACTIVITY.filter(a => a.rating).length).toFixed(1),
  };

  const topReads = BOOKS.filter(b =>
    curatedBooks.some(c => c.bookId === b.id)
  );

  const getBookById = (bookId) => BOOKS.find(b => b.id === bookId);

  const toggleFeatured = (bookId) => {
    setCuratedBooks(prev =>
      prev.map(b =>
        b.bookId === bookId ? { ...b, featured: !b.featured } : b
      )
    );
  };

  const removeCuratedBook = (bookId) => {
    setCuratedBooks(prev => prev.filter(b => b.bookId !== bookId));
  };

  const addBookToCuration = (bookId) => {
    if (!curatedBooks.some(b => b.bookId === bookId)) {
      setCuratedBooks(prev => [
        ...prev,
        { bookId, reason: "Trending in community", featured: false }
      ]);
    }
  };

  return (
    <div className="admin-community">
      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <Users size={24} />
          <div className="stat-number">{stats.totalReaders}</div>
          <div className="stat-label">Active Readers</div>
        </div>
        <div className="stat-card">
          <BookOpen size={24} />
          <div className="stat-number">{stats.booksReading}</div>
          <div className="stat-label">Currently Reading</div>
        </div>
        <div className="stat-card">
          <TrendingUp size={24} />
          <div className="stat-number">{stats.booksCompleted}</div>
          <div className="stat-label">Books Completed</div>
        </div>
        <div className="stat-card">
          <Star size={24} />
          <div className="stat-number">{stats.avgRating}</div>
          <div className="stat-label">Avg Community Rating</div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="community-grid">
        {/* LEFT: READING ACTIVITY */}
        <div className="activity-section">
          <div className="section-header">
            <h2>📖 Community Reading Activity</h2>
            <p>What members are currently reading and their progress</p>
          </div>

          {/* SEARCH & FILTER */}
          <div className="activity-controls">
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by reader or book..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="filter-buttons">
              {["all", "reading", "completed"].map(status => (
                <button
                  key={status}
                  className={`filter-btn ${filter === status ? "active" : ""}`}
                  onClick={() => setFilter(status)}
                >
                  {status === "all" ? "All" : status === "reading" ? "Reading" : "Completed"}
                </button>
              ))}
            </div>
          </div>

          {/* ACTIVITY LIST */}
          <div className="activity-list">
            {filteredActivity.length === 0 ? (
              <div className="empty-state">
                <p>No reading activity found</p>
              </div>
            ) : (
              filteredActivity.map(activity => {
                const book = getBookById(activity.bookId);
                return (
                  <div key={activity.id} className="activity-card">
                    <div className="activity-header">
                      <div className="reader-info">
                        <div className="reader-avatar">{activity.userAvatar}</div>
                        <div>
                          <div className="reader-name">{activity.username}</div>
                          <div className="book-title">{activity.bookTitle}</div>
                        </div>
                      </div>
                      <span className={`status-badge ${activity.action}`}>
                        {activity.action === "reading" ? "📖 Reading" : "✓ Completed"}
                      </span>
                    </div>

                    {activity.action === "reading" && (
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${activity.progress}%` }}></div>
                      </div>
                    )}

                    {activity.action === "completed" && activity.review && (
                      <div className="review-section">
                        <div className="rating">
                          {"⭐".repeat(activity.rating)}{" "}
                          <span className="rating-num">{activity.rating}/5</span>
                        </div>
                        <p className="review-text">"{activity.review}"</p>
                      </div>
                    )}

                    <div className="activity-meta">
                      <span className="date">
                        {activity.action === "reading"
                          ? `Progress: ${activity.progress}%`
                          : `Finished on ${activity.lastUpdated}`}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT: GENRE TRENDS & CURATION */}
        <div className="curation-section">
          {/* GENRE TRENDS */}
          <div className="trends-card">
            <h3>📊 Genre Trends</h3>
            <div className="genre-list">
              {GENRE_PREFERENCES.map(genre => (
                <div key={genre.genre} className="genre-item">
                  <div className="genre-info">
                    <span className="genre-name">{genre.genre}</span>
                    <span className="genre-count">{genre.count} readers</span>
                  </div>
                  <span className={`trend ${genre.trend.includes("+") ? "up" : "down"}`}>
                    {genre.trend}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CURATED PICKS */}
          <div className="curation-card">
            <h3>🎯 Curated Picks For Community</h3>
            <p className="subtitle">Featured books to recommend to readers</p>

            <div className="curated-books">
              {curatedBooks.map(curatedBook => {
                const book = getBookById(curatedBook.bookId);
                return (
                  <div key={curatedBook.bookId} className={`curated-item ${curatedBook.featured ? "featured" : ""}`}>
                    <div className="curated-header">
                      <div className="book-info">
                        <div className="book-icon">{book?.title[0]}</div>
                        <div>
                          <div className="curated-title">{book?.title}</div>
                          <div className="curated-author">{book?.author}</div>
                        </div>
                      </div>
                      <button
                        className="featured-toggle"
                        onClick={() => toggleFeatured(curatedBook.bookId)}
                        title="Toggle featured status"
                      >
                        {curatedBook.featured ? "⭐" : "☆"}
                      </button>
                    </div>
                    <div className="curated-reason">{curatedBook.reason}</div>
                    <div className="curated-actions">
                      <Link
                        to={`/book/${book?.id}`}
                        className="view-book-link"
                        title="View book details"
                      >
                        📖 View
                      </Link>
                      <button
                        className="remove-btn"
                        onClick={() => removeCuratedBook(curatedBook.bookId)}
                        title="Remove from curation"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ADD MORE BOOKS */}
            <div className="add-curation">
              <h4>Add More Books</h4>
              <div className="available-books">
                {BOOKS.filter(b => !curatedBooks.some(c => c.bookId === b.id)).map(book => (
                  <button
                    key={book.id}
                    className="add-book-btn"
                    onClick={() => addBookToCuration(book.id)}
                    title={`Add ${book.title} to curation`}
                  >
                    + {book.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
