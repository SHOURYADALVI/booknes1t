const { addReview, getUserBookReview, getAllReviews, getBookReviews } = require("./_reviews");
const { verifyJwt, getTokenFromRequest } = require("./_auth");

function setHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
  res.setHeader("Content-Type", "application/json");
}

function extractToken(req) {
  let token = null;
  const cookies = req.headers.cookie?.split("; ") || [];
  for (const cookie of cookies) {
    if (cookie.startsWith("booknest_session=")) {
      token = cookie.slice(17);
      break;
    }
  }

  if (!token) {
    const authHeader = req.headers.authorization || "";
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }
  }

  return token;
}

module.exports = async (req, res) => {
  setHeaders(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  try {
    if (pathname.includes("/api/reviews/add")) return handleAdd(req, res);
    if (pathname.includes("/api/reviews/admin-all")) return handleAdminAll(req, res);
    if (pathname.includes("/api/reviews/get")) return handleGet(req, res);

    return res.status(404).json({ error: "Reviews endpoint not found" });
  } catch (error) {
    console.error("[REVIEWS ERROR]", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

async function handleAdd(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let payload;
    try {
      payload = verifyJwt(token);
    } catch (e) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { bookId, rating, title, text, orderId } = req.body || {};

    if (!bookId || !rating || !title || !text || !orderId) {
      return res.status(400).json({
        error: "Missing required fields: bookId, rating, title, text, orderId",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Check if already reviewed
    const existingReview = getUserBookReview(payload.sub || payload.email, bookId);
    if (existingReview) {
      return res.status(409).json({ error: "You have already reviewed this book" });
    }

    const review = addReview({
      userId: payload.sub || payload.email,
      userName: payload.name,
      bookId,
      rating,
      title,
      text,
      orderId,
    });

    return res.status(201).json({
      success: true,
      review,
      message: "Review added successfully",
    });
  } catch (error) {
    console.error("[ADD REVIEW ERROR]", error);
    return res.status(500).json({ error: "Failed to add review" });
  }
}

async function handleGet(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const bookId = url.searchParams.get("bookId");

    if (!bookId) {
      return res.status(400).json({ error: "Missing query parameter: bookId" });
    }

    const reviews = getBookReviews(bookId);

    return res.status(200).json({
      success: true,
      reviews,
      count: reviews.length,
      averageRating:
        reviews.length > 0
          ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
          : 0,
    });
  } catch (error) {
    console.error("[GET REVIEWS ERROR]", error);
    return res.status(500).json({ error: "Failed to get reviews" });
  }
}

async function handleAdminAll(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let payload;
    try {
      payload = verifyJwt(token);
    } catch (e) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (payload.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const reviews = getAllReviews();

    return res.status(200).json({
      success: true,
      reviews,
      count: reviews.length,
    });
  } catch (error) {
    console.error("[ADMIN ALL REVIEWS ERROR]", error);
    return res.status(500).json({ error: "Failed to get reviews" });
  }
}
