const {
  getAllRegisteredUsers,
  getClientIp,
  isLoginAllowed,
  registerFailedLogin,
  registerUser,
  setAuthCookie,
  signJwt,
  sanitizeUser,
  DEFAULT_SESSION_TTL_SECONDS,
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
      message: "Too many registration attempts. Try again later.",
      retryAfterSeconds: gate.retryAfterSeconds,
    });
  }

  try {
    const { email, password, confirmPassword, name, role } = req.body || {};

    // Validation
    if (!email || !password || !confirmPassword || !name || !role) {
      registerFailedLogin(ip);
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      registerFailedLogin(ip);
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (!["admin", "user"].includes(role)) {
      registerFailedLogin(ip);
      return res.status(400).json({ message: "Invalid role. Must be 'admin' or 'user'" });
    }

    // Register user
    const result = registerUser(email, password, name, role);

    if (!result.success) {
      registerFailedLogin(ip);
      return res.status(400).json({ message: result.error });
    }

    // Automatically sign in the newly registered user
    const sessionTtl = DEFAULT_SESSION_TTL_SECONDS;
    const user = {
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
      lastLogin: new Date().toISOString(),
    };

    const token = signJwt(user, sessionTtl);
    setAuthCookie(res, token, sessionTtl);

    return res.status(201).json({
      success: true,
      user: sanitizeUser(user),
      message: "Account created successfully. Welcome to BookNest!",
      sessionExpiresInSeconds: sessionTtl,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: error.message || "Registration failed. Please try again.",
    });
  }
};
