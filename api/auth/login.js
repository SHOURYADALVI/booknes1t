const {
  compareCredentials,
  getClientIp,
  getUserByEmail,
  isLoginAllowed,
  registerFailedLogin,
  resetLoginAttempts,
  sanitizeUser,
  setAuthCookie,
  signJwt,
  updateLastLogin,
  DEFAULT_SESSION_TTL_SECONDS,
  REMEMBER_ME_TTL_SECONDS,
} = require("../_auth");

function setSecurityHeaders(res, origin) {
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");
}

module.exports = async (req, res) => {
  setSecurityHeaders(res, req.headers.origin);

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ip = getClientIp(req);
  const gate = isLoginAllowed(ip);

  if (!gate.allowed) {
    return res.status(429).json({
      error: "Too many failed attempts. Try again later.",
      retryAfterSeconds: gate.retryAfterSeconds,
    });
  }

  try {
    const { email, password, rememberMe } = req.body || {};

    if (!email || !password) {
      registerFailedLogin(ip);
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Try to authenticate against registered users or demo credentials
    if (!compareCredentials(email, password)) {
      const record = registerFailedLogin(ip);
      return res.status(401).json({
        error: "Invalid email or password",
        remainingAttempts: Math.max(0, 5 - record.count),
      });
    }

    // Get user from registered users
    const registeredUser = getUserByEmail(email);
    let userRole, userName;
    
    if (registeredUser) {
      userRole = registeredUser.role;
      userName = registeredUser.name;
      updateLastLogin(email);
    } else {
      // Fallback to demo credentials for backwards compatibility
      const demoEmail = String(email).trim().toLowerCase();
      if (demoEmail === "admin@booknest.local") {
        userRole = "admin";
        userName = "BookNest Admin";
      } else if (demoEmail === "reader@booknest.local") {
        userRole = "user";
        userName = "BookNest Reader";
      } else {
        return res.status(401).json({ error: "User not found in system" });
      }
    }

    const sessionTtl = rememberMe ? REMEMBER_ME_TTL_SECONDS : DEFAULT_SESSION_TTL_SECONDS;
    const user = {
      email: String(email).trim().toLowerCase(),
      name: userName,
      role: userRole,
      lastLogin: new Date().toISOString(),
    };

    const token = signJwt(user, sessionTtl);
    setAuthCookie(res, token, sessionTtl);
    resetLoginAttempts(ip);

    return res.status(200).json({
      success: true,
      user: sanitizeUser(user),
      sessionExpiresInSeconds: sessionTtl,
    });
  } catch (error) {
    console.error("Auth login error:", error);
    return res.status(500).json({
      error: error.message === "JWT_SECRET is not configured"
        ? "JWT secret is not configured"
        : "Failed to sign in",
    });
  }
};