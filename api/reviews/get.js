const { getBookReviews, getBookAverageRating } = require("../_reviews");

/**
 * GET /api/reviews/book/:bookId
 * Get all reviews for a book (public endpoint)
 */
module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    // Extract bookId from URL path
    const urlPath = req.url.split("?")[0]; // Remove query params
    const bookId = urlPath.split("/").pop();

    if (!bookId) {
      return res.status(400).json({ error: "Book ID is required" });
    }

    const reviews = getBookReviews(bookId);
    const averageRating = getBookAverageRating(bookId);

    console.log(`[REVIEWS GET] Fetched ${reviews.length} reviews for book ${bookId}`);

    return res.status(200).json({
      success: true,
      bookId,
      reviews,
      averageRating,
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    return res.status(500).json({
      error: "Failed to fetch reviews",
      details: error.message,
    });
  }
};
