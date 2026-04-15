// ── Review Management Utilities ─────────────────────────────────────────────
// Handles customer reviews and ratings for delivered products

// In-memory store (can be upgraded to database later)
let reviewsStore = [];
let reviewIdCounter = 2000;

// Mock data for review generation
const BOOK_IDS = ["b001", "b002", "b003", "b004", "b005", "b006", "b007", "b008", "b009", "b010"];
const REVIEWER_NAMES = [
  "Aman Kumar", "Priya Singh", "Raj Patel", "Ananya Desai", "Vikram Sharma",
  "Neha Gupta", "Arjun Nair", "Deepika Reddy", "Rohit Verma", "Sophia Chen",
  "Aditya Mishra", "Kavya Menon", "Rahul Chopra", "Anjali Bhat", "Nikhil Rao"
];
const REVIEW_TITLES = [
  "Absolutely loved it!", "Great read", "Couldn't put it down", "Highly recommended",
  "Worth every penny", "Mind-blowing story", "Perfect for my mood", "Best purchase",
  "Exceeded expectations", "Phenomenal", "Masterpiece", "Life-changing",
  "A complete gem", "Spectacular", "Simply amazing", "Not what I expected",
  "Disappointing", "Could be better", "Average read", "Decent book",
  "Fast delivery!", "Poor packaging", "Overpriced", "Worth the money"
];
const REVIEW_TEXTS = [
  // POSITIVE REVIEWS - Good delivery & quality
  "This book is absolutely amazing! Arrived on time with excellent packaging. Great quality print!",
  "Really enjoyed this book. The plot kept me engaged throughout. Fast delivery and arrived in perfect condition.",
  "Outstanding storytelling and character development. Quick delivery, well-written pages. Highly recommend!",
  "A fantastic read that I couldn't put down. Truly captivated me. Great value for money!",
  "Well-written and thought-provoking. Loved every bit of it. Fast delivery and beautiful book.",
  "This exceeded my expectations. Arrived early! A must-read with excellent packaging!",
  "Brilliant narrative and interesting premise. Thoroughly enjoyed. Worth every penny!",
  "A wonderful journey through the pages. Didn't want it to end. Great quality, fast delivery.",
  "Exceptional work. The author has a gift for storytelling. Good customer service too!",
  "Couldn't have asked for a better book. Perfect in every way. Arrived on time beautifully packed.",
  
  // NEUTRAL REVIEWS - Some issues
  "It was okay but had some issues. Not my favorite. Took longer to arrive than expected.",
  "Decent book but felt a bit slow paced. Packaging could be better.",
  "Not what I expected. Disappointed with the ending but pages were good quality.",
  "Average read. Delivery was delayed by 2 days but book is fine.",
  "Book is good but pages feel cheap. Disappointed with the paper quality.",
  
  // NEGATIVE REVIEWS - Clear issues
  "Really disappointed. Arrived late and damaged in shipping. Poor packaging!",
  "Waste of money. Overpriced for this quality. Pages started falling off after a week.",
  "Terrible experience. Delivery took 2 weeks! Pages are damaged and the ink fades.",
  "Not worth the price. Poor quality paper and broken binding. Bad customer service.",
  "Broken package on arrival! Support team didn't respond to complaints. Damaged pages.",
  "Overpriced and low quality. Delivery was slow and package was poorly packaged.",
  "Disappointed with poor quality. Pages in bad condition, ink fades quickly.",
  "Rude customer service and delayed delivery. Not worth it at all.",
  "Pages fell off! Poor quality construction. Took too long to arrive.",
  "Worst purchase ever. Damaged in shipping, no response from support team.",
];

/**
 * Generate mock reviews for analytics testing
 */
function generateMockReviews() {
  const mockReviews = [];
  const startDate = new Date("2024-01-01");
  
  // Generate 200 reviews spread across books and users
  for (let i = 0; i < 200; i++) {
    const bookId = BOOK_IDS[Math.floor(Math.random() * BOOK_IDS.length)];
    const reviewer = REVIEWER_NAMES[Math.floor(Math.random() * REVIEWER_NAMES.length)];
    const userId = `user${Math.floor(i / 15)}@booknest.local`; // Realistic user distribution
    
    // Better rating distribution: more 4-5 stars than 1-2
    let rating;
    const rand = Math.random();
    if (rand < 0.15) rating = 5; // 15% get 5 stars
    else if (rand < 0.35) rating = 4; // 20% get 4 stars
    else if (rand < 0.55) rating = 4; // 20% get 4 stars
    else if (rand < 0.75) rating = 3; // 20% get 3 stars
    else if (rand < 0.90) rating = 2; // 15% get 2 stars
    else rating = 1; // 10% get 1 star
    
    // Spread dates across the year
    const daysOffset = Math.floor(Math.random() * 365);
    const reviewDate = new Date(startDate);
    reviewDate.setDate(reviewDate.getDate() + daysOffset);
    
    const review = {
      id: `REV-${Date.now()}-${++reviewIdCounter}`,
      bookId,
      userId,
      userName: reviewer,
      rating,
      title: REVIEW_TITLES[Math.floor(Math.random() * REVIEW_TITLES.length)],
      text: REVIEW_TEXTS[Math.floor(Math.random() * REVIEW_TEXTS.length)],
      orderId: `ORD-1775637000000-${1000 + i}`,
      createdAt: reviewDate.toISOString(),
      updatedAt: reviewDate.toISOString(),
      helpful: Math.floor(Math.random() * 50),
    };
    
    mockReviews.push(review);
  }
  
  return mockReviews;
}

// Initialize with mock reviews on module load
console.log("[_REVIEWS] Loading initial mock reviews...");
reviewsStore = generateMockReviews();
console.log(`[_REVIEWS] Initialized with ${reviewsStore.length} mock reviews`);

/**
 * Add a new review
 */
function addReview(reviewData) {
  const reviewId = `REV-${Date.now()}-${++reviewIdCounter}`;
  const now = new Date().toISOString();
  
  const review = {
    id: reviewId,
    bookId: reviewData.bookId, // Product ID
    userId: reviewData.userId, // User email
    userName: reviewData.userName,
    rating: reviewData.rating, // 1-5 stars
    title: reviewData.title,
    text: reviewData.text,
    orderId: reviewData.orderId, // Reference to order
    createdAt: now,
    updatedAt: now,
    helpful: 0,
  };
  
  reviewsStore.push(review);
  console.log(`[_REVIEWS] ✓ Review added for book ${reviewData.bookId} by ${reviewData.userId}`);
  console.log(`[_REVIEWS] Total reviews in store: ${reviewsStore.length}`);
  console.log(`[_REVIEWS] New review object:`, JSON.stringify(review, null, 2));
  return review;
}

/**
 * Get all reviews (admin function)
 */
function getAllReviews() {
  const allReviews = reviewsStore.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  console.log(`[_REVIEWS] getAllReviews() called - returning ${allReviews.length} reviews`);
  return allReviews;
}

/**
 * Get book reviews
 */
function getBookReviews(bookId) {
  return reviewsStore
    .filter(r => r.bookId === bookId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Get user's review for a specific book
 */
function getUserBookReview(userId, bookId) {
  return reviewsStore.find(r => r.userId === userId && r.bookId === bookId) || null;
}

/**
 * Get all reviews by a user
 */
function getUserReviews(userId) {
  return reviewsStore
    .filter(r => r.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Calculate average rating for a book
 */
function getBookAverageRating(bookId) {
  const reviews = reviewsStore.filter(r => r.bookId === bookId);
  if (reviews.length === 0) return 0;
  
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10; // Round to 1 decimal
}

/**
 * Update review
 */
function updateReview(reviewId, updateData) {
  const review = reviewsStore.find(r => r.id === reviewId);
  if (!review) return null;
  
  if (updateData.rating) review.rating = updateData.rating;
  if (updateData.title) review.title = updateData.title;
  if (updateData.text) review.text = updateData.text;
  review.updatedAt = new Date().toISOString();
  
  console.log(`[_REVIEWS] Review ${reviewId} updated`);
  return review;
}

/**
 * Delete review
 */
function deleteReview(reviewId) {
  const index = reviewsStore.findIndex(r => r.id === reviewId);
  if (index === -1) return null;
  
  const deleted = reviewsStore.splice(index, 1)[0];
  console.log(`[_REVIEWS] Review ${reviewId} deleted`);
  return deleted;
}

module.exports = {
  addReview,
  getAllReviews,
  getBookReviews,
  getUserBookReview,
  getUserReviews,
  getBookAverageRating,
  updateReview,
  deleteReview,
};
