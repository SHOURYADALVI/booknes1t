import { Link } from "react-router-dom";
import { BookOpen, Heart, Lock, Mail, Phone } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section footer-brand">
            <div className="footer-logo">
              <BookOpen size={24} strokeWidth={1.5} />
              <span>Book<em>Nest</em></span>
            </div>
            <p className="footer-tagline">Your gateway to endless reading adventures</p>
            <div className="footer-social">
              <a href="mailto:support@booknest.local" title="Email" className="social-icon">
                <Mail size={18} />
              </a>
              <a href="tel:+1234567890" title="Phone" className="social-icon">
                <Phone size={18} />
              </a>
              <a href="#" title="Newsletter" className="social-icon">
                <Heart size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/community">Community</Link></li>
              <li><Link to="/subscriptions">Subscriptions</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="mailto:support@booknest.local">Contact Us</a></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/my-support-tickets">Help Center</Link></li>
              <li><a href="#">Shipping & Returns</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/privacy-policy" className="privacy-link"><Lock size={14} />Privacy Policy</Link></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Policy</a></li>
              <li><a href="#">Accessibility</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-divider"></div>

        {/* Bottom Footer */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} BookNest. All rights reserved.</p>
          <p className="footer-credit">
            Made with <Heart size={13} className="heart-icon" /> for book lovers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
