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
  clearAuthCookie,
  registerUser,
  getTokenFromRequest,
  verifyJwt,
  DEFAULT_SESSION_TTL_SECONDS,
  REMEMBER_ME_TTL_SECONDS,
} = require("./_auth");

function setSecurityHeaders(res, origin) {
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");
}

module.exports = async (req, res) => {
  setSecurityHeaders(res, req.headers.origin);
  if (req.method === "OPTIONS") return res.status(200).end();

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  try {
    // Route to appropriate handler
    if (pathname.includes("/login")) return handleLogin(req, res);
    if (pathname.includes("/register")) return handleRegister(req, res);
    if (pathname.includes("/logout")) return handleLogout(req, res);
    if (pathname.includes("/me")) return handleMe(req, res);

    return res.status(404).json({ error: "Auth endpoint not found" });
  } catch (error) {
    console.error("[AUTH ERROR]", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

async function handleLogin(req, res) {
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

    if (!compareCredentials(email, password)) {
      registerFailedLogin(ip);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    resetLoginAttempts(ip);
    updateLastLogin(email);

    // Get user info (registered or demo)
    let user = getUserByEmail(email);
    if (!user) {
      // Fallback to demo credentials
      const credentials = require("./_auth").getRoleCredentials(
        email === "admin@booknest.local" ? "admin" : "user"
      );
      user = credentials;
    }

    const ttl = rememberMe ? REMEMBER_ME_TTL_SECONDS : DEFAULT_SESSION_TTL_SECONDS;
    const token = signJwt(user, ttl);
    setAuthCookie(res, token, ttl);

    return res.status(200).json({
      success: true,
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    console.error("[LOGIN ERROR]", error);
    registerFailedLogin(ip);
    return res.status(500).json({ error: "Login failed" });
  }
}

async function handleRegister(req, res) {
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

    if (!email || !password || !confirmPassword || !name || !role) {
      registerFailedLogin(ip);
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      registerFailedLogin(ip);
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const result = registerUser(email, password, name, role);

    if (!result.success) {
      registerFailedLogin(ip);
      return res.status(400).json({ message: result.error });
    }

    resetLoginAttempts(ip);

    // Auto-login after registration
    const token = signJwt(result.user);
    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: result.message,
      user: result.user,
      token,
    });
  } catch (error) {
    console.error("[REGISTER ERROR]", error);
    registerFailedLogin(ip);
    return res.status(500).json({ message: "Registration failed" });
  }
}

async function handleLogout(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  clearAuthCookie(res);
  return res.status(200).json({ success: true });
}

async function handleMe(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const token = getTokenFromRequest(req);
    const payload = verifyJwt(token);

    if (!payload) {
      return res.status(401).json({ authenticated: false });
    }

    return res.status(200).json({
      authenticated: true,
      user: sanitizeUser(payload),
    });
  } catch (error) {
    console.error("[SESSION ERROR]", error);
    return res.status(500).json({ error: "Failed to load session" });
  }
}
