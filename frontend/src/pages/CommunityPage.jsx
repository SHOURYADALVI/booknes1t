import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, BookOpen, Star, TrendingUp, Users, Heart } from "lucide-react";
import { COMMUNITY_ACTIVITY, GENRE_PREFERENCES, BOOKS } from "../data/mockData.js";
import "./CommunityPage.css";

export default function CommunityPage() {
  const [search, setSearch] = useState("");
  const [likedBooks, setLikedBooks] = useState(new Set());
  const [activeTab, setActiveTab] = useState("trending");

  const filteredActivity = useMemo(() => {
    let result = [...COMMUNITY_ACTIVITY];

    if (search) {
      result = result.filter(a =>
        a.username.toLowerCase().includes(search.toLowerCase()) ||
        a.bookTitle.toLowerCase().includes(search.toLowerCase())
      );
    }

    return result;
  }, [search]);

  const stats = {
    totalReaders: new Set(COMMUNITY_ACTIVITY.map(a => a.userId)).size,
    booksReading: COMMUNITY_ACTIVITY.filter(a => a.action === "reading").length,
    booksCompleted: COMMUNITY_ACTIVITY.filter(a => a.action === "completed").length,
    avgRating: (COMMUNITY_ACTIVITY
      .filter(a => a.rating)
      .reduce((sum, a) => sum + a.rating, 0) / 
      COMMUNITY_ACTIVITY.filter(a => a.rating).length).toFixed(1),
  };

  const getCuratedBooks = () => {
    return [
      { bookId: "b001", reason: "Community Favorite", icon: "⭐" },
      { bookId: "b002", reason: "Highest Rated", icon: "🌟" },
      { bookId: "b004", reason: "Trending in Sci-Fi", icon: "🚀" },
    ];
  };

  const getBookById = (bookId) => BOOKS.find(b => b.id === bookId);

  const toggleLike = (bookId) => {
    const newLiked = new Set(likedBooks);
    if (newLiked.has(bookId)) {
      newLiked.delete(bookId);
    } else {
      newLiked.add(bookId);
    }
    setLikedBooks(newLiked);
  };

  const getRecommendations = () => {
    return GENRE_PREFERENCES.sort((a, b) => b.count - a.count).slice(0, 5).flatMap(gp =>
      BOOKS.filter(b => b.genre === gp.genre)
    );
  };

  return (
    <div className="community-page">
      <div className="container">
        {/* HERO */}
        <div className="community-hero">
          <div>
            <h1 className="hero-title">📚 BookNest Community</h1>
            <p className="hero-subtitle">
              Connect with readers, discover trending books, and explore what others are reading
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="community-stats">
          <div className="stat-box">
            <Users size={24} />
            <div className="stat-info">
              <div className="stat-number">{stats.totalReaders}</div>
              <div className="stat-label">Active Readers</div>
            </div>
          </div>
          <div className="stat-box">
            <BookOpen size={24} />
            <div className="stat-info">
              <div className="stat-number">{stats.booksReading}</div>
              <div className="stat-label">Currently Reading</div>
            </div>
          </div>
          <div className="stat-box">
            <TrendingUp size={24} />
            <div className="stat-info">
              <div className="stat-number">{stats.booksCompleted}</div>
              <div className="stat-label">Completed This Month</div>
            </div>
          </div>
          <div className="stat-box">
            <Star size={24} />
            <div className="stat-info">
              <div className="stat-number">{stats.avgRating}</div>
              <div className="stat-label">Avg Community Rating</div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="community-grid">
          {/* LEFT: ACTIVITY FEED */}
          <div className="activity-column">
            {/* TABS */}
            <div className="tab-buttons">
              <button
                className={`tab-btn ${activeTab === "trending" ? "active" : ""}`}
                onClick={() => setActiveTab("trending")}
              >
                📊 Trending Now
              </button>
              <button
                className={`tab-btn ${activeTab === "recent" ? "active" : ""}`}
                onClick={() => setActiveTab("recent")}
              >
                ⏱️ Recent Activity
              </button>
            </div>

            {activeTab === "trending" && (
              <div className="feed-section">
                <div className="section-title">What's Hot in the Community</div>
                <div className="reading-feed">
                  {COMMUNITY_ACTIVITY.filter(a => a.action === "completed" || a.progress > 50)
                    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                    .slice(0, 5)
                    .map(activity => {
                      const book = getBookById(activity.bookId);
                      return (
                        <div key={activity.id} className="feed-card">
                          <div className="feed-card-header">
                            <div className="reader-info">
                              <div className="reader-avatar">{activity.userAvatar}</div>
                              <div className="reader-details">
                                <div className="reader-name">{activity.username}</div>
                                {activity.action === "completed" ? (
                                  <div className="reader-action">Finished reading</div>
                                ) : (
                                  <div className="reader-action">Reading ({activity.progress}%)</div>
                                )}
                              </div>
                            </div>
                            <button
                              className={`like-btn ${likedBooks.has(book?.id) ? "liked" : ""}`}
                              onClick={() => toggleLike(book?.id)}
                              title="Add to favorites"
                            >
                              <Heart size={18} />
                            </button>
                          </div>

                          <div className="feed-book">
                            <div className="book-cover-sm">{book?.title[0]}</div>
                            <div className="book-details">
                              <div className="book-title">{book?.title}</div>
                              <div className="book-author">by {book?.author}</div>
                              <div className="book-genre">{book?.genre}</div>
                            </div>
                          </div>

                          {activity.action === "completed" && activity.review && (
                            <div className="review-box">
                              <div className="review-rating">
                                {"⭐".repeat(activity.rating)}{" "}
                                <span>{activity.rating}/5</span>
                              </div>
                              <p className="review-text">"{activity.review}"</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {activeTab === "recent" && (
              <div className="feed-section">
                <div className="section-title">Latest Activity</div>
                <div className="search-box-feed">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search by reader or book..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="reading-feed">
                  {filteredActivity.slice(0, 8).map(activity => {
                    const book = getBookById(activity.bookId);
                    return (
                      <div key={activity.id} className="feed-card compact">
                        <div className="feed-card-header">
                          <div className="reader-info">
                            <div className="reader-avatar">{activity.userAvatar}</div>
                            <div className="reader-details">
                              <div className="reader-name">{activity.username}</div>
                              <div className="book-title-sm">{book?.title}</div>
                            </div>
                          </div>
                          <span className={`status-badge ${activity.action}`}>
                            {activity.action === "reading" ? "📖" : "✓"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: RECOMMENDATIONS & TRENDS */}
          <div className="sidebar-column">
            {/* CURATED PICKS */}
            <div className="sidebar-card curated-picks">
              <h3>🎯 Curated For You</h3>
              <p className="card-subtitle">Handpicked by our community team</p>

              <div className="curated-list">
                {getCuratedBooks().map(item => {
                  const book = getBookById(item.bookId);
                  return (
                    <div key={item.bookId} className="curated-item">
                      <div className="curated-header">
                        <div className="icon-badge">{item.icon}</div>
                        <div className="curated-text">
                          <div className="reason">{item.reason}</div>
                        </div>
                      </div>
                      <div className="curated-book">
                        <div className="book-cover-tiny">{book?.title[0]}</div>
                        <div>
                          <div className="curated-book-title">{book?.title}</div>
                          <div className="curated-book-rating">⭐ {book?.rating}</div>
                        </div>
                      </div>
                      <Link to={`/book/${book?.id}`} className="view-btn">View Book</Link>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* GENRE TRENDS */}
            <div className="sidebar-card genre-trends">
              <h3>📈 Trending Genres</h3>
              <div className="trends-list">
                {GENRE_PREFERENCES.slice(0, 5).map(genre => (
                  <div key={genre.genre} className="trend-item">
                    <div className="trend-name">{genre.genre}</div>
                    <div className="trend-meta">
                      <span className="count">{genre.count}</span>
                      <span className={`badge ${genre.trend.includes("+") ? "up" : "down"}`}>
                        {genre.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* YOUR FAVORITES */}
            <div className="sidebar-card favorites">
              <h3>❤️ Your Favorites</h3>
              {likedBooks.size === 0 ? (
                <div className="empty-favorites">
                  <p>No favorites yet</p>
                  <p className="hint">Like books to add them here</p>
                </div>
              ) : (
                <div className="favorites-list">
                  {Array.from(likedBooks)
                    .map(bookId => BOOKS.find(b => b.id === bookId))
                    .map(book => (
                      <div key={book?.id} className="fav-item">
                        <div className="fav-book-cover">{book?.title[0]}</div>
                        <div className="fav-info">
                          <div className="fav-title">{book?.title}</div>
                          <div className="fav-rating">⭐ {book?.rating}</div>
                        </div>
                        <button
                          className="remove-fav"
                          onClick={() => toggleLike(book?.id)}
                          title="Remove from favorites"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
