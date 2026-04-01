import { SUBSCRIPTION_BOXES } from "../data/mockData";
import { useCart } from "../context/CartContext";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";
import { Package, Star, Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./SubscriptionsPage.css";

export default function SubscriptionsPage() {
  const { addItem } = useCart();
  const { toast, showToast } = useToast();

  const handleSubscribe = (box) => {
    addItem({ ...box, id: box.id, title: box.name, author: "BookNest Curation Team", cover: "", genre: "Subscription Box", format: ["Print"] });
    showToast(`"${box.name}" added to cart!`);
  };

  return (
    <>
      <Toast toast={toast} />
      <div className="subs-page">
        <div className="container">
          {/* Hero */}
          <div className="subs-hero">
            <div className="badge badge-amber" style={{ marginBottom: 16 }}>Curated Subscription Boxes</div>
            <h1>Books Delivered,<br /><em>Curated Just for You</em></h1>
            <p>Every month, our literary team handpicks books that match your taste — from cozy mysteries to niche fiction, audiobooks to indie gems.</p>
          </div>

          {/* Plans */}
          <div className="subs-grid">
            {SUBSCRIPTION_BOXES.map((box, i) => (
              <div key={box.id} className={`sub-plan-card ${i === 1 ? "featured" : ""}`}>
                {i === 1 && <div className="plan-popular-tag">Most Popular</div>}
                <div className="plan-icon"><Package size={28} /></div>
                <h2 className="plan-name">{box.name}</h2>
                <div className="plan-price">
                  <span className="plan-price-num">₹{box.price}</span>
                  <span className="plan-price-period">/{box.frequency.toLowerCase()}</span>
                </div>
                <p className="plan-desc">{box.description}</p>
                <div className="plan-meta">
                  <span><Star size={12} fill="var(--amber)" color="var(--amber)" /> {box.books} book{box.books > 1 ? "s" : ""} per box</span>
                  <span>📚 {box.genre}</span>
                </div>
                <ul className="plan-features">
                  {["Free shipping included", "Cancel anytime", "Exclusive reader extras", "Personalised curation notes"].map(f => (
                    <li key={f}><Check size={14} /> {f}</li>
                  ))}
                </ul>
                <button
                  className={`btn ${i === 1 ? "btn-primary" : "btn-dark"} btn-lg subscribe-btn`}
                  onClick={() => handleSubscribe(box)}
                >
                  Subscribe Now <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="subs-faq">
            <h2>How It Works</h2>
            <div className="faq-steps">
              {[
                { step: "01", title: "Choose Your Box", desc: "Pick a plan that fits your reading style and budget." },
                { step: "02", title: "Tell Us Your Taste", desc: "Fill a quick reader profile — genres, themes, authors you love." },
                { step: "03", title: "We Curate", desc: "Our literary team handpicks titles specifically for you every month." },
                { step: "04", title: "Books at Your Door", desc: "Your curated box ships by the 5th of every month, free of charge." },
              ].map(s => (
                <div key={s.step} className="faq-step">
                  <div className="step-num">{s.step}</div>
                  <div>
                    <div className="step-title">{s.title}</div>
                    <div className="step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
