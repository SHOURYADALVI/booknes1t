const fs = require("fs");
const http = require("http");
const path = require("path");

const root = path.resolve(__dirname, "..");
const envPath = path.join(root, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([^#=\s]+)\s*=\s*(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  }
}

const createOrder = require(path.join(root, "api", "create-order"));
const verifyPayment = require(path.join(root, "api", "verify-payment"));
const authLogin = require(path.join(root, "api", "auth", "login"));
const authRegister = require(path.join(root, "api", "auth", "register"));
const authMe = require(path.join(root, "api", "auth", "me"));
const authLogout = require(path.join(root, "api", "auth", "logout"));
const ordersCreate = require(path.join(root, "api", "orders", "create"));
const ordersList = require(path.join(root, "api", "orders", "list"));
const ordersUpdateStatus = require(path.join(root, "api", "orders", "update-status"));
const ordersAnalytics = require(path.join(root, "api", "orders", "analytics"));
const reviewsAdd = require(path.join(root, "api", "reviews", "add"));
const reviewsGet = require(path.join(root, "api", "reviews", "get"));
const reviewsAdminAll = require(path.join(root, "api", "reviews", "admin-all"));
const pointsBalance = require(path.join(root, "api", "points", "balance"));
const pointsRedeem = require(path.join(root, "api", "points", "redeem"));
const ticketsCreate = require(path.join(root, "api", "tickets", "create"));
const ticketsUser = require(path.join(root, "api", "tickets", "user"));
const ticketsAdminAll = require(path.join(root, "api", "tickets", "admin-all"));
const ticketsGet = require(path.join(root, "api", "tickets", "get"));
const ticketsUpdateStatus = require(path.join(root, "api", "tickets", "update-status"));
const ticketsAddNote = require(path.join(root, "api", "tickets", "add-note"));

function enhanceResponse(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };

  res.json = (payload) => {
    if (!res.headersSent) {
      res.setHeader("Content-Type", "application/json");
    }
    res.end(JSON.stringify(payload));
    return res;
  };

  return res;
}

const server = http.createServer((req, res) => {
  enhanceResponse(res);
  const requestUrl = new URL(req.url, "http://localhost");
  const chunks = [];

  req.on("data", (chunk) => chunks.push(chunk));
  req.on("end", async () => {
    const rawBody = Buffer.concat(chunks).toString("utf8");
    try {
      req.body = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      req.body = {};
    }

    if (requestUrl.pathname.startsWith("/api/")) {
      if (requestUrl.pathname === "/api/create-order") return createOrder(req, res);
      if (requestUrl.pathname === "/api/verify-payment") return verifyPayment(req, res);
      if (requestUrl.pathname === "/api/auth/login") return authLogin(req, res);
      if (requestUrl.pathname === "/api/auth/register") return authRegister(req, res);
      if (requestUrl.pathname === "/api/auth/me") return authMe(req, res);
      if (requestUrl.pathname === "/api/auth/logout") return authLogout(req, res);
      if (requestUrl.pathname === "/api/orders/create") return ordersCreate(req, res);
      if (requestUrl.pathname === "/api/orders/list") return ordersList(req, res);
      if (requestUrl.pathname === "/api/orders/update-status") return ordersUpdateStatus(req, res);
      if (requestUrl.pathname === "/api/orders/analytics") return ordersAnalytics(req, res);
      if (requestUrl.pathname === "/api/reviews/add") return reviewsAdd(req, res);
      if (requestUrl.pathname === "/api/reviews/admin/all") return reviewsAdminAll(req, res);
      if (requestUrl.pathname.startsWith("/api/reviews/book/")) return reviewsGet(req, res);
      if (requestUrl.pathname === "/api/points/balance") return pointsBalance(req, res);
      if (requestUrl.pathname === "/api/points/redeem") return pointsRedeem(req, res);
      if (requestUrl.pathname === "/api/tickets/create") return ticketsCreate(req, res);
      if (requestUrl.pathname === "/api/tickets/user") return ticketsUser(req, res);
      if (requestUrl.pathname === "/api/tickets/admin/all") return ticketsAdminAll(req, res);
      if (requestUrl.pathname === "/api/tickets/update-status") return ticketsUpdateStatus(req, res);
      if (requestUrl.pathname === "/api/tickets/add-note") return ticketsAddNote(req, res);
      if (requestUrl.pathname.startsWith("/api/tickets/")) return ticketsGet(req, res);
    }

    res.status(404).json({ error: "Not found" });
  });
});

server.listen(3001, () => {
  console.log("BookNest API listening on http://127.0.0.1:3001");
});
