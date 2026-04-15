const crypto = require("crypto");

const COOKIE_NAME = "booknest_session";
const LOGIN_WINDOW_MS = 10 * 60 * 1000;
const LOGIN_LIMIT = 5;
const DEFAULT_SESSION_TTL_SECONDS = 2 * 60 * 60;
const REMEMBER_ME_TTL_SECONDS = 7 * 24 * 60 * 60;

const loginAttempts = globalThis.__booknestLoginAttempts || (globalThis.__booknestLoginAttempts = new Map());
const registeredUsers = globalThis.__booknestRegisteredUsers || (globalThis.__booknestRegisteredUsers = new Map());

function base64UrlEncode(value) {
  return Buffer.from(value).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlDecode(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return Buffer.from(padded, "base64").toString("utf8");
}

function timingSafeEquals(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function getAuthSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
}

function getExpectedCredentials() {
  return {
    admin: {
      email: process.env.AUTH_ADMIN_EMAIL || "admin@booknest.local",
      password: process.env.AUTH_ADMIN_PASSWORD || "BookNest@2026",
      name: "BookNest Admin",
      role: "admin",
    },
    user: {
      email: process.env.AUTH_USER_EMAIL || "reader@booknest.local",
      password: process.env.AUTH_USER_PASSWORD || "Reader@2026",
      name: "BookNest Reader",
      role: "user",
    },
  };
}

function getClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (forwardedFor) {
    return String(forwardedFor).split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

function setAuthCookie(res, token, maxAgeSeconds = DEFAULT_SESSION_TTL_SECONDS) {
  const secure = process.env.NODE_ENV === "production";
  const cookie = [
    `${COOKIE_NAME}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
  ];

  if (secure) {
    cookie.push("Secure");
  }

  res.setHeader("Set-Cookie", cookie.join("; "));
}

function clearAuthCookie(res) {
  const secure = process.env.NODE_ENV === "production";
  const cookie = [
    `${COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];

  if (secure) {
    cookie.push("Secure");
  }

  res.setHeader("Set-Cookie", cookie.join("; "));
}

function signJwt(payload, expiresInSeconds = DEFAULT_SESSION_TTL_SECONDS) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const claims = {
    ...payload,
    sub: payload.email, // Add standard 'sub' claim for user identifier
    iat: now,
    exp: now + expiresInSeconds,
    iss: "booknest",
  };

  console.log("[JWT] Creating token with claims:", { email: claims.email, sub: claims.sub, role: claims.role });

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(claims));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac("sha256", getAuthSecret())
    .update(signingInput)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${signingInput}.${signature}`;
}

function verifyJwt(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = crypto
    .createHmac("sha256", getAuthSecret())
    .update(signingInput)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  if (!timingSafeEquals(signature, expectedSignature)) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) return null;
    if (payload.iss !== "booknest") return null;
    return payload;
  } catch {
    return null;
  }
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  return header.split(";").reduce((cookies, part) => {
    const [rawKey, ...rawValue] = part.trim().split("=");
    if (!rawKey) return cookies;
    cookies[rawKey] = decodeURIComponent(rawValue.join("="));
    return cookies;
  }, {});
}

function getTokenFromRequest(req) {
  const cookies = parseCookies(req);
  if (cookies[COOKIE_NAME]) {
    return cookies[COOKIE_NAME];
  }

  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }

  return null;
}

function sanitizeUser(user) {
  return {
    email: user.email,
    name: user.name,
    role: user.role,
    lastLogin: user.lastLogin,
  };
}

function isLoginAllowed(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || record.resetAt <= now) {
    loginAttempts.set(ip, { count: 0, resetAt: now + LOGIN_WINDOW_MS });
    return { allowed: true, remaining: LOGIN_LIMIT };
  }

  if (record.count >= LOGIN_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  return { allowed: true, remaining: LOGIN_LIMIT - record.count };
}

function registerFailedLogin(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, resetAt: now + LOGIN_WINDOW_MS };
  const nextRecord = {
    count: record.count + 1,
    resetAt: record.resetAt > now ? record.resetAt : now + LOGIN_WINDOW_MS,
  };
  loginAttempts.set(ip, nextRecord);
  return nextRecord;
}

function resetLoginAttempts(ip) {
  loginAttempts.delete(ip);
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(String(password)).digest("hex");
}

function registerUser(email, password, name, role) {
  // Validation
  if (!email || !password || !name || !role) {
    return { success: false, error: "All fields are required" };
  }

  email = String(email).trim().toLowerCase();
  
  // Validate email format
  if (!email.includes("@") || email.length < 5) {
    return { success: false, error: "Invalid email format" };
  }

  // Validate password strength (minimum 8 chars)
  if (String(password).length < 8) {
    return { success: false, error: "Password must be at least 8 characters" };
  }

  // Validate role
  if (!["admin", "user"].includes(role)) {
    return { success: false, error: "Invalid role. Must be 'admin' or 'user'" };
  }

  // Check if user already exists
  if (registeredUsers.has(email)) {
    return { success: false, error: "Email already registered" };
  }

  // Create user
  const user = {
    email,
    passwordHash: hashPassword(password),
    name: String(name).trim(),
    role,
    createdAt: new Date().toISOString(),
    lastLogin: null,
  };

  registeredUsers.set(email, user);

  return {
    success: true,
    user: sanitizeUser(user),
    message: `${role} account created successfully`,
  };
}

function getUserByEmail(email) {
  email = String(email || "").trim().toLowerCase();
  return registeredUsers.get(email) || null;
}

function compareRegisteredUserCredentials(email, inputPassword) {
  email = String(email || "").trim().toLowerCase();
  const user = getUserByEmail(email);
  if (!user) return false;

  const inputHash = hashPassword(String(inputPassword));
  return timingSafeEquals(inputHash, user.passwordHash);
}

function updateLastLogin(email) {
  email = String(email || "").trim().toLowerCase();
  const user = registeredUsers.get(email);
  if (user) {
    user.lastLogin = new Date().toISOString();
  }
}

function getAllRegisteredUsers() {
  return Array.from(registeredUsers.values()).map(user => ({
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
  }));
}

function getRoleCredentials(role) {
  const credentials = getExpectedCredentials();
  return credentials[role] || null;
}

function compareCredentials(email, inputPassword) {
  // Check registered users first (new registration system)
  if (compareRegisteredUserCredentials(email, inputPassword)) {
    return true;
  }

  // Fallback to demo credentials for testing
  const demoCredentials = getExpectedCredentials();
  const adminMatches = 
    timingSafeEquals(String(email || "").trim().toLowerCase(), demoCredentials.admin.email.trim().toLowerCase()) &&
    timingSafeEquals(hashPassword(String(inputPassword)), hashPassword(demoCredentials.admin.password));
  
  const userMatches = 
    timingSafeEquals(String(email || "").trim().toLowerCase(), demoCredentials.user.email.trim().toLowerCase()) &&
    timingSafeEquals(hashPassword(String(inputPassword)), hashPassword(demoCredentials.user.password));

  return adminMatches || userMatches;
}

module.exports = {
  COOKIE_NAME,
  DEFAULT_SESSION_TTL_SECONDS,
  REMEMBER_ME_TTL_SECONDS,
  clearAuthCookie,
  compareCredentials,
  compareRegisteredUserCredentials,
  getAllRegisteredUsers,
  getClientIp,
  getRoleCredentials,
  getTokenFromRequest,
  getUserByEmail,
  hashPassword,
  isLoginAllowed,
  registerFailedLogin,
  registerUser,
  resetLoginAttempts,
  sanitizeUser,
  setAuthCookie,
  signJwt,
  updateLastLogin,
  verifyJwt,
};