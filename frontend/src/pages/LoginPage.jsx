import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Lock, Clock3, BadgeCheck, Fingerprint, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import "./LoginPage.css";

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast, showToast } = useToast();
  const requestedPath = location.state?.from?.pathname || "";
  const requestedRole = location.state?.requiredRole || (requestedPath.startsWith("/admin") ? "admin" : "user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [role, setRole] = useState(requestedRole);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const getRedirectPath = () => {
    if (role === "admin") {
      return requestedPath.startsWith("/admin") ? requestedPath : "/admin";
    }

    if (requestedPath && !requestedPath.startsWith("/admin")) {
      return requestedPath;
    }

    return "/orders";
  };

  useEffect(() => {
    if (!loading && user) {
      navigate(user.role === "admin" ? "/admin" : "/orders", { replace: true });
    }
  }, [loading, user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login({ email, password, role, rememberMe });
      navigate(getRedirectPath(), { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
      showToast(err.message || "Login failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <Toast toast={toast} />
      <div className="login-shell">
        <section className="login-hero">
          <div className="login-badge">
            <ShieldCheck size={14} /> Signed JWT + HttpOnly cookie
          </div>
          <h1>Admin access with a hardened session layer.</h1>
          <p>
            Log in as admin or customer. The session is issued server-side, rate-limited, signed with JWT, and stored as a secure cookie.
          </p>

          <div className="role-switch" role="tablist" aria-label="Login role">
            <button
              type="button"
              className={`role-chip ${role === "admin" ? "active" : ""}`}
              onClick={() => setRole("admin")}
            >
              Admin
            </button>
            <button
              type="button"
              className={`role-chip ${role === "user" ? "active" : ""}`}
              onClick={() => setRole("user")}
            >
              Customer
            </button>
          </div>

          {location.state?.reason === "role" && (
            <div className="login-note">
              Customer sessions cannot open the admin dashboard. Switch to Admin to continue.
            </div>
          )}

          <div className="security-grid">
            {[
              { icon: <Lock size={16} />, title: "HttpOnly cookie", text: "The token is not exposed to JavaScript." },
              { icon: <Clock3 size={16} />, title: "Short expiry", text: "Sessions expire automatically after a fixed window." },
              { icon: <Fingerprint size={16} />, title: "Brute-force control", text: "Login attempts are throttled per IP." },
              { icon: <BadgeCheck size={16} />, title: "Protected routes", text: "Admin pages redirect to login when unauthenticated." },
            ].map((item) => (
              <article key={item.title} className="security-card">
                <div className="security-icon">{item.icon}</div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="login-panel">
          <div className="login-card card">
            <div className="login-card-header">
              <div className="login-kicker">BookNest Secure Access</div>
              <h2>{role === "admin" ? "Sign in as admin" : "Sign in as customer"}</h2>
              <p>
                {role === "admin"
                  ? "Use the admin credentials configured in your environment variables."
                  : "Use the customer credentials configured in your environment variables."}
              </p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  id="email"
                  className="form-input"
                  type="email"
                  autoComplete="username"
                  placeholder={role === "admin" ? "admin@booknest.local" : "reader@booknest.local"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <div className="password-field">
                  <input
                    id="password"
                    className="form-input"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder={role === "admin" ? "Enter your admin password" : "Enter your customer password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <label className="remember-row">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Keep this {role === "admin" ? "admin" : "customer"} device trusted
              </label>

              {error && <div className="login-error">{error}</div>}

              <button className="btn btn-primary btn-lg login-button" type="submit" disabled={submitting}>
                {submitting ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Verifying session...</> : <>Open Dashboard <ArrowRight size={16} /></>}
              </button>
            </form>

            <div className="login-footnote">
              JWT is issued by the server, signed with a secret, and stored in a secure cookie to reduce exposure. Roles are embedded in the token.
            </div>

            <div className="login-create-account">
              <p>Don't have an account? <Link to="/signup" className="signup-link">Create one now</Link></p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}