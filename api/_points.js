// ── Customer Loyalty Points System ─────────────────────────────────────────
// Manages customer points balance and redemption

// In-memory store
let pointsStore = new Map(); // userId -> { balance, totalEarned, totalRedeemed, transactions: [] }

const POINTS_CONFIG = {
  pointsPerRupee: 1, // 1 point per rupee spent
  pointRedemptionValue: 0.5, // 1 point = ₹0.50
};

/**
 * Get or initialize customer points
 */
function getOrInitializePoints(userId) {
  if (!pointsStore.has(userId)) {
    pointsStore.set(userId, {
      balance: 0,
      totalEarned: 0,
      totalRedeemed: 0,
      transactions: [],
    });
  }
  return pointsStore.get(userId);
}

/**
 * Award points on order completion
 */
function awardPoints(userId, userName, orderAmount, orderId) {
  const pointsEarned = Math.floor(orderAmount * POINTS_CONFIG.pointsPerRupee);
  const points = getOrInitializePoints(userId);
  
  points.balance += pointsEarned;
  points.totalEarned += pointsEarned;
  
  points.transactions.push({
    id: `TXN-${Date.now()}`,
    type: "earned",
    amount: pointsEarned,
    rupeeValue: orderAmount,
    orderId,
    createdAt: new Date().toISOString(),
    description: `Points earned on order ${orderId}`,
  });

  console.log(`[POINTS] Awarded ${pointsEarned} points to ${userId} for order ${orderId}`);
  return points;
}

/**
 * Redeem points for discount
 */
function redeemPoints(userId, pointsToRedeem) {
  const points = getOrInitializePoints(userId);
  
  if (points.balance < pointsToRedeem) {
    throw new Error(`Insufficient points. Available: ${points.balance}, Requested: ${pointsToRedeem}`);
  }

  const discountAmount = pointsToRedeem * POINTS_CONFIG.pointRedemptionValue;
  
  points.balance -= pointsToRedeem;
  points.totalRedeemed += pointsToRedeem;
  
  points.transactions.push({
    id: `TXN-${Date.now()}`,
    type: "redeemed",
    amount: pointsToRedeem,
    rupeeValue: discountAmount,
    createdAt: new Date().toISOString(),
    description: `${pointsToRedeem} points redeemed for ₹${discountAmount}`,
  });

  console.log(`[POINTS] Redeemed ${pointsToRedeem} points for ${userId}, got ₹${discountAmount} discount`);
  return { discountAmount, remainingBalance: points.balance, points };
}

/**
 * Get customer points info
 */
function getPointsInfo(userId) {
  const points = getOrInitializePoints(userId);
  return {
    balance: points.balance,
    totalEarned: points.totalEarned,
    totalRedeemed: points.totalRedeemed,
    discountValue: points.balance * POINTS_CONFIG.pointRedemptionValue,
    transactions: points.transactions.slice(-20), // Last 20 transactions
  };
}

/**
 * Get points configuration
 */
function getPointsConfig() {
  return POINTS_CONFIG;
}

// Get entire points store (for analytics)
function getPointsStore() {
  return pointsStore;
}

module.exports = {
  awardPoints,
  redeemPoints,
  getPointsInfo,
  getPointsConfig,
  getOrInitializePoints,
  getPointsStore,
};
