import { Link } from "react-router-dom";
import { ArrowRight, Star, Package, Zap, Shield, BookOpen, TrendingUp, Users } from "lucide-react";
import { BOOKS } from "../data/mockData";
import BookCard from "../components/BookCard";
import { useState } from "react";
import "./LandingPage.css";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(""); }
  };

  const featured = BOOKS.slice(0, 4);

  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
        </div>
        <div className="container hero-content">
          <div className="hero-tag">
            <Star size={12} fill="var(--amber)" color="var(--amber)" />
            India's Curated Online Bookstore
          </div>
          <h1 className="hero-title">
            Every Great Story<br />
            <em>Deserves to be Found</em>
          </h1>
          <p className="hero-subtitle">
            Handpicked titles across niche genres, subscription boxes, and digital formats — delivered to your door or device. No algorithms, just expert curation.
          </p>
          <div className="hero-cta">
            <Link to="/shop" className="btn btn-primary btn-lg">
              Browse Books <ArrowRight size={18} />
            </Link>
            <Link to="/subscriptions" className="btn btn-secondary btn-lg">
              Explore Boxes
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><span className="hero-stat-num">8,000+</span><span>Titles</span></div>
            <div className="hero-stat-div" />
            <div className="hero-stat"><span className="hero-stat-num">4.8★</span><span>Avg Rating</span></div>
            <div className="hero-stat-div" />
            <div className="hero-stat"><span className="hero-stat-num">12k+</span><span>Happy Readers</span></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features-section">
        <div className="container">
          <div className="features-grid">
            {[
              { icon: <Package size={22} />, title: "Free Delivery", desc: "On orders above ₹499 across India" },
              { icon: <Zap size={22} />, title: "AI Recommendations", desc: "Hyper-personalised picks based on your taste" },
              { icon: <Shield size={22} />, title: "Secure Payments", desc: "PCI DSS compliant, Razorpay powered" },
              { icon: <BookOpen size={22} />, title: "Multi-Format", desc: "Print, eBook, and Audiobook in one place" },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div>
                  <h4 className="feature-title">{f.title}</h4>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Staff Picks This Month</h2>
              <p className="section-sub">Curated by our literary team, not an algorithm</p>
            </div>
            <Link to="/shop" className="btn btn-secondary">View All <ArrowRight size={14} /></Link>
          </div>
          <div className="grid-4" style={{ marginTop: "28px" }}>
            {featured.map(book => <BookCard key={book.id} book={book} />)}
          </div>
        </div>
      </section>

      {/* Subscription CTA */}
      <section className="section sub-cta-section">
        <div className="container">
          <div className="sub-cta-card">
            <div className="sub-cta-text">
              <div className="badge badge-amber" style={{ marginBottom: 12 }}>Subscription Boxes</div>
              <h2>Books, Curated Just For You</h2>
              <p>Our monthly subscription boxes bring you handpicked titles, exclusive bookmarks, and reader extras — tailored to your genre preferences.</p>
              <div className="sub-cta-features">
                {["1–2 curated books monthly", "Exclusive reader extras", "Cancel anytime"].map(f => (
                  <span key={f}><Star size={12} fill="var(--amber)" color="var(--amber)" /> {f}</span>
                ))}
              </div>
              <Link to="/subscriptions" className="btn btn-dark btn-lg" style={{ marginTop: 20 }}>
                Explore Boxes <ArrowRight size={16} />
              </Link>
            </div>
            <div className="sub-cta-visual">
              <div className="box-stack">
                {["Cozy Reads", "The Niche Box", "Audiophile"].map((name, i) => (
                  <div key={name} className="box-chip" style={{ transform: `rotate(${(i - 1) * 6}deg)` }}>
                    <Package size={14} /> {name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Stats */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Market Opportunity</h2>
              <p className="section-sub">Why BookNest is positioned to win in the 2025 literary market</p>
            </div>
          </div>
          <div className="grid-3" style={{ marginTop: 28 }}>
            {[
              { icon: <TrendingUp size={24} />, stat: "$142.72B", label: "Global Books Market 2025", note: "Growing YoY" },
              { icon: <BookOpen size={24} />, stat: "26.4%", label: "Audiobook Market CAGR", note: "Fastest growing segment" },
              { icon: <Users size={24} />, stat: "141M+", label: "US Active Readers by Mid-2025", note: "18–45 age group dominant" },
            ].map((s, i) => (
              <div key={i} className="market-stat-card">
                <div className="market-icon">{s.icon}</div>
                <div className="market-stat-num">{s.stat}</div>
                <div className="market-stat-label">{s.label}</div>
                <div className="market-stat-note">{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section newsletter-section">
        <div className="container">
          <div className="newsletter-card">
            <h2>Join 12,000+ Readers</h2>
            <p>Get weekly curated picks, author events, and exclusive subscriber discounts delivered to your inbox.</p>
            {subscribed ? (
              <div className="subscribed-msg">
                <Star size={20} fill="var(--amber)" color="var(--amber)" />
                You're on the list! Watch your inbox for our next edition.
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="form-input"
                />
                <button type="submit" className="btn btn-primary">Subscribe Free</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
