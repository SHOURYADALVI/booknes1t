import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, BookOpen, LayoutDashboard, Menu, X, LogIn, LogOut, UserPlus, Gift, Ticket, Users } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { usePoints } from "../hooks/usePoints.js";
import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, logout, loading } = useAuth();
  const { balance, fetchPointsBalance } = usePoints();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch points balance when user changes
  useEffect(() => {
    if (user && user.role === "user") {
      fetchPointsBalance();
    }
  }, [user, fetchPointsBalance]);

  const roleLabel = user?.role === "admin" ? "Admin" : user?.role === "user" ? "Customer" : null;

  const navLinks = [
    { to: "/", label: "Home" },
    ...(user?.role !== "admin" ? [{ to: "/shop", label: "Shop" }] : []),
    ...(user?.role !== "user" ? [{ to: "/order-books", label: "Order Books" }] : []),
    { to: "/subscriptions", label: "Subscriptions" },
    { to: "/community", label: "Community", icon: <Users size={14} /> },
    { to: "/orders", label: "My Orders" },
    ...(user?.role === "user"
      ? [
          { to: "/points", label: "Points", icon: <Gift size={14} /> },
          { to: "/my-support-tickets", label: "Support", icon: <Ticket size={14} /> },
        ]
      : []),
    ...(user?.role === "admin"
      ? [{ to: "/admin", label: "Admin", icon: <LayoutDashboard size={14} /> }]
      : []),
  ];

  const isActive = (path) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
  };

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
          {!loading && roleLabel && <span className={`role-badge role-${user.role}`}>{roleLabel}</span>}
          {!loading && user?.role === "user" && balance > 0 && (
            <div className="points-badge">
              <Gift size={14} />
              <span>{balance}</span>
            </div>
          )}
          {!loading && user && (
            <button className="auth-btn auth-btn-ghost" onClick={handleLogout}>
              <LogOut size={16} />
              Sign out
            </button>
          )}
          {!loading && !user && (
            <>
              <Link to="/signup" className="auth-btn auth-btn-primary">
                <UserPlus size={16} />
                Sign up
              </Link>
              <Link to="/login" className="auth-btn">
                <LogIn size={16} />
                Sign in
              </Link>
            </>
          )}
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
