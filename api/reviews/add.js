const { addReview, getUserBookReview } = require("../_reviews");
const { verifyJwt } = require("../_auth");

/**
 * POST /api/reviews/add
 * Add a review for a book (authenticated customers only)
 */
module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    // Extract JWT from Cookie or Authorization header
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

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify JWT
    let payload;
    try {
      payload = verifyJwt(token);
    } catch (e) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { bookId, rating, title, text, orderId } = req.body || {};

    // Validate input
    if (!bookId || !rating || !title || !text || !orderId) {
      return res.status(400).json({
        error: "Missing required fields: bookId, rating, title, text, orderId",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Check if user already reviewed this book
    const existingReview = getUserBookReview(payload.sub, bookId);
    if (existingReview) {
      return res.status(400).json({
        error: "You have already reviewed this book",
        existingReviewId: existingReview.id,
      });
    }

    const review = addReview({
      bookId,
      rating: parseInt(rating),
      title: title.trim(),
      text: text.trim(),
      userId: payload.sub,
      userName: payload.name,
      orderId,
    });

    console.log(`[REVIEWS ADD] ✓ New review created: ${review.id}`);
    console.log(`[REVIEWS ADD] Book: ${bookId}, Rating: ${rating}⭐, User: ${payload.sub}`);

    return res.status(201).json({
      success: true,
      message: `Review added successfully for book ${bookId}`,
      review,
    });
  } catch (error) {
    console.error("Add review error:", error);
    return res.status(500).json({
      error: "Failed to add review",
      details: error.message,
    });
  }
};
