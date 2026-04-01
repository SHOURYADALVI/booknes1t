import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, BookOpen, LayoutDashboard, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const { itemCount } = useCart();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/subscriptions", label: "Subscriptions" },
    { to: "/orders", label: "My Orders" },
    { to: "/admin", label: "Admin", icon: <LayoutDashboard size={14} /> },
  ];

  const isActive = (path) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <BookOpen size={22} strokeWidth={1.5} />
          <span>Book<em>Nest</em></span>
        </Link>

        <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${isActive(link.to) ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.icon && link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-btn">
            <ShoppingCart size={20} strokeWidth={1.5} />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
