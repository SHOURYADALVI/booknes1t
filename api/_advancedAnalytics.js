// ── Advanced Analytics Engine ──────────────────────────────────────────────
// Comprehensive analytics calculations for CRM dashboard

const { generateBusinessHealthReport, getActionableInsights } = require("./_sentiment");

/**
 * Calculate advanced analytics from orders, reviews, and customer data
 */
function calculateAdvancedAnalytics(ordersData, reviewsData, pointsData, customersData) {
  // 1. CUSTOMER SEGMENTATION
  const customerSegmentation = calculateCustomerSegmentation(ordersData, pointsData);
  
  // 2. PRODUCT PERFORMANCE ANALYTICS
  const productAnalytics = calculateProductAnalytics(ordersData, reviewsData);
  
  // 3. REVENUE & SALES ANALYTICS
  const revenueAnalytics = calculateRevenueAnalytics(ordersData);
  
  // 4. CUSTOMER SATISFACTION
  const satisfactionMetrics = calculateSatisfactionMetrics(reviewsData);
  
  // 5. LOYALTY PROGRAM ANALYTICS
  const loyaltyAnalytics = calculateLoyaltyAnalytics(pointsData, ordersData);
  
  // 6. CUSTOMER LIFETIME VALUE
  const cltAnalytics = calculateCLVAnalytics(ordersData, pointsData);
  
  // 7. CHURN & RETENTION ANALYSIS
  const retentionAnalytics = calculateRetentionAnalytics(ordersData);

  // 8. BUSINESS HEALTH & SENTIMENT ANALYSIS
  const businessHealthReport = generateBusinessHealthReport(reviewsData);
  const actionableInsights = getActionableInsights(businessHealthReport);

  return {
    customerSegmentation,
    productAnalytics,
    revenueAnalytics,
    satisfactionMetrics,
    loyaltyAnalytics,
    cltAnalytics,
    retentionAnalytics,
    businessHealth: businessHealthReport,
    actionableInsights,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * 1. CUSTOMER SEGMENTATION
 */
function calculateCustomerSegmentation(ordersData, pointsData) {
  const customerMap = new Map();

  // Build customer profiles
  ordersData.forEach(order => {
    if (!customerMap.has(order.userId)) {
      customerMap.set(order.userId, {
        userId: order.userId,
        userName: order.userName,
        email: order.userEmail,
        totalSpent: 0,
        orderCount: 0,
        lastOrderDate: null,
        orders: [],
      });
    }
    const customer = customerMap.get(order.userId);
    customer.totalSpent += order.total;
    customer.orderCount += 1;
    customer.orders.push(order);
    if (!customer.lastOrderDate || new Date(order.createdAt) > new Date(customer.lastOrderDate)) {
      customer.lastOrderDate = order.createdAt;
    }
  });

  const customers = Array.from(customerMap.values());
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = customers.length > 0 ? totalRevenue / customers.reduce((sum, c) => sum + c.orderCount, 0) : 0;

  // Segment customers
  const segments = {
    vip: customers.filter(c => c.totalSpent > avgOrderValue * 3 && c.orderCount >= 5),
    loyal: customers.filter(c => c.totalSpent > avgOrderValue * 1.5 && c.orderCount >= 3 && c.totalSpent <= avgOrderValue * 3),
    regular: customers.filter(c => c.orderCount >= 1 && c.totalSpent <= avgOrderValue * 1.5),
    atRisk: calculateAtRiskCustomers(customers),
  };

  return {
    totalCustomers: customers.length,
    segments,
    segmentSummary: {
      vip: segments.vip.length,
      loyal: segments.loyal.length,
      regular: segments.regular.length,
      atRisk: segments.atRisk.length,
    },
    segmentRevenue: {
      vip: segments.vip.reduce((sum, c) => sum + c.totalSpent, 0),
      loyal: segments.loyal.reduce((sum, c) => sum + c.totalSpent, 0),
      regular: segments.regular.reduce((sum, c) => sum + c.totalSpent, 0),
      atRisk: segments.atRisk.reduce((sum, c) => sum + c.totalSpent, 0),
    },
  };
}

function calculateAtRiskCustomers(customers) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return customers.filter(c => {
    const lastOrder = new Date(c.lastOrderDate);
    return lastOrder < thirtyDaysAgo && c.orderCount < 5;
  });
}

/**
 * 2. PRODUCT PERFORMANCE ANALYTICS
 */
function calculateProductAnalytics(ordersData, reviewsData) {
  const productMap = new Map();

  // Aggregate product data
  ordersData.forEach(order => {
    order.items.forEach(item => {
      if (!productMap.has(item.id)) {
        productMap.set(item.id, {
          id: item.id,
          title: item.title,
          quantity: 0,
          revenue: 0,
          orders: 0,
          reviews: [],
          rating: 0,
        });
      }
      const product = productMap.get(item.id);
      product.quantity += item.qty;
      product.revenue += item.price * item.qty;
      product.orders += 1;
    });
  });

  // Add review data
  reviewsData.forEach(review => {
    if (productMap.has(review.bookId)) {
      const product = productMap.get(review.bookId);
      product.reviews.push(review);
    }
  });

  // Calculate ratings and quality metrics
  const topProducts = Array.from(productMap.values())
    .map(p => ({
      ...p,
      avgRating: p.reviews.length > 0 ? (p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length).toFixed(2) : 0,
      reviewCount: p.reviews.length,
      avgPrice: (p.revenue / p.quantity).toFixed(2),
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return {
    topProducts: topProducts.slice(0, 15),
    bottomProducts: topProducts.slice(-5).reverse(),
    totalProductsSold: productMap.size,
    avgRating: topProducts.length > 0
      ? (topProducts.reduce((sum, p) => sum + parseFloat(p.avgRating), 0) / topProducts.length).toFixed(2)
      : 0,
    qualityTierAnalysis: {
      premium: topProducts.filter(p => parseFloat(p.avgRating) >= 4),
      standard: topProducts.filter(p => parseFloat(p.avgRating) >= 3 && parseFloat(p.avgRating) < 4),
      needsImprovement: topProducts.filter(p => parseFloat(p.avgRating) < 3),
    },
  };
}

/**
 * 3. REVENUE & SALES ANALYTICS
 */
function calculateRevenueAnalytics(ordersData) {
  const now = new Date();
  const daily = {};
  const weekly = {};
  const monthly = {};

  ordersData.forEach(order => {
    const date = new Date(order.createdAt);
    const dateStr = date.toISOString().split("T")[0];
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekStr = weekStart.toISOString().split("T")[0];
    const monthStr = dateStr.substring(0, 7);

    // Daily
    if (!daily[dateStr]) daily[dateStr] = { orders: 0, revenue: 0, cancelled: 0 };
    daily[dateStr].orders += 1;
    daily[dateStr].revenue += order.total;
    if (order.status === "Cancelled") daily[dateStr].cancelled += 1;

    // Weekly
    if (!weekly[weekStr]) weekly[weekStr] = { orders: 0, revenue: 0 };
    weekly[weekStr].orders += 1;
    weekly[weekStr].revenue += order.total;

    // Monthly
    if (!monthly[monthStr]) monthly[monthStr] = { orders: 0, revenue: 0 };
    monthly[monthStr].orders += 1;
    monthly[monthStr].revenue += order.total;
  });

  const totalRevenue = ordersData
    .filter(o => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  const totalOrders = ordersData.length;
  const cancelledOrders = ordersData.filter(o => o.status === "Cancelled").length;
  const cancellationRate = totalOrders > 0 ? ((cancelledOrders / totalOrders) * 100).toFixed(2) : 0;

  return {
    totalRevenue: Math.round(totalRevenue),
    totalOrders,
    cancelledOrders,
    cancellationRate: parseFloat(cancellationRate),
    avgOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
    daily,
    weekly,
    monthly,
    trend: calculateTrend(daily),
  };
}

function calculateTrend(dailyData) {
  const values = Object.values(dailyData).map(d => d.revenue);
  if (values.length < 2) return "stable";
  const recent = values.slice(-7);
  const older = values.slice(0, Math.max(1, values.length - 7));
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
  const change = ((recentAvg - olderAvg) / olderAvg) * 100;
  return change > 10 ? "upward" : change < -10 ? "downward" : "stable";
}

/**
 * 4. CUSTOMER SATISFACTION METRICS
 */
function calculateSatisfactionMetrics(reviewsData) {
  if (reviewsData.length === 0) {
    return {
      totalReviews: 0,
      avgRating: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      nps: 0,
      sentimentBreakdown: {},
    };
  }

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalRating = 0;

  reviewsData.forEach(review => {
    distribution[review.rating]++;
    totalRating += review.rating;
  });

  const avgRating = (totalRating / reviewsData.length).toFixed(2);
  const nps = Math.round(((distribution[5] + distribution[4] - distribution[1] - distribution[2]) / reviewsData.length) * 100);

  return {
    totalReviews: reviewsData.length,
    avgRating: parseFloat(avgRating),
    ratingDistribution: distribution,
    satisfiedCustomers: Math.round(((distribution[5] + distribution[4]) / reviewsData.length) * 100),
    dissatisfiedCustomers: Math.round(((distribution[1] + distribution[2]) / reviewsData.length) * 100),
    nps,
  };
}

/**
 * 5. LOYALTY PROGRAM ANALYTICS
 */
function calculateLoyaltyAnalytics(pointsData, ordersData) {
  const customersWithPoints = pointsData.size;
  let totalPointsEarned = 0;
  let totalPointsRedeemed = 0;
  let avgPointBalance = 0;
  const redemptionRate = new Map();

  pointsData.forEach((points, userId) => {
    totalPointsEarned += points.totalEarned;
    totalPointsRedeemed += points.totalRedeemed;
    avgPointBalance += points.balance;
    const redemptionPct = points.totalEarned > 0 ? (points.totalRedeemed / points.totalEarned) * 100 : 0;
    redemptionRate.set(userId, redemptionPct);
  });

  avgPointBalance = customersWithPoints > 0 ? Math.round(avgPointBalance / customersWithPoints) : 0;
  const avgRedemptionRate = redemptionRate.size > 0
    ? (Array.from(redemptionRate.values()).reduce((a, b) => a + b, 0) / redemptionRate.size).toFixed(2)
    : 0;

  const topRedeemers = Array.from(pointsData.entries())
    .map(([userId, points]) => ({
      userId,
      totalRedeemed: points.totalRedeemed,
      balance: points.balance,
    }))
    .filter(p => p.totalRedeemed > 0)
    .sort((a, b) => b.totalRedeemed - a.totalRedeemed)
    .slice(0, 10);

  return {
    customersWithPoints,
    totalPointsEarned,
    totalPointsRedeemed,
    avgPointBalance,
    avgRedemptionRate: parseFloat(avgRedemptionRate),
    topRedeemers,
    pointsValue: Math.round(totalPointsEarned * 0.5), // 1 point = ₹0.50
  };
}

/**
 * 6. CUSTOMER LIFETIME VALUE
 */
function calculateCLVAnalytics(ordersData, pointsData) {
  const customerMap = new Map();

  ordersData.forEach(order => {
    if (!customerMap.has(order.userId)) {
      customerMap.set(order.userId, {
        userId: order.userId,
        totalLifeValue: 0,
        orderCount: 0,
        pointsRedeemed: 0,
      });
    }
    const customer = customerMap.get(order.userId);
    customer.totalLifeValue += order.total;
    customer.orderCount += 1;
  });

  // Add points data
  pointsData.forEach((points, userId) => {
    if (customerMap.has(userId)) {
      const customer = customerMap.get(userId);
      customer.pointsRedeemed = points.totalRedeemed;
    }
  });

  const clvArray = Array.from(customerMap.values());
  const avgCLV = clvArray.length > 0 ? Math.round(clvArray.reduce((sum, c) => sum + c.totalLifeValue, 0) / clvArray.length) : 0;

  return {
    totalCustomers: clvArray.length,
    avgCLV,
    highValueCustomers: clvArray.filter(c => c.totalLifeValue > avgCLV * 2).length,
    topCustomers: clvArray.sort((a, b) => b.totalLifeValue - a.totalLifeValue).slice(0, 10),
  };
}

/**
 * 7. RETENTION & CHURN ANALYSIS
 */
function calculateRetentionAnalytics(ordersData) {
  const now = new Date();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  const sixtyDays = 60 * 24 * 60 * 60 * 1000;
  const ninetyDays = 90 * 24 * 60 * 60 * 1000;

  const customerLastOrder = new Map();
  ordersData.forEach(order => {
    const lastOrder = customerLastOrder.get(order.userId) || new Date(0);
    const current = new Date(order.createdAt);
    if (current > lastOrder) {
      customerLastOrder.set(order.userId, current);
    }
  });

  let activeThirtyDays = 0;
  let activeSixtyDays = 0;
  let activeNinetyDays = 0;
  let churnedCustomers = 0;

  customerLastOrder.forEach(lastOrderDate => {
    const daysSinceOrder = (now - lastOrderDate) / (24 * 60 * 60 * 1000);
    if (daysSinceOrder <= 30) activeThirtyDays++;
    if (daysSinceOrder <= 60) activeSixtyDays++;
    if (daysSinceOrder <= 90) activeNinetyDays++;
    if (daysSinceOrder > 90) churnedCustomers++;
  });

  const totalCustomers = customerLastOrder.size;

  return {
    activeThirtyDays,
    activeSixtyDays,
    activeNinetyDays,
    churnedCustomers,
    totalCustomers,
    retentionRate30: totalCustomers > 0 ? ((activeThirtyDays / totalCustomers) * 100).toFixed(2) : 0,
    retentionRate60: totalCustomers > 0 ? ((activeSixtyDays / totalCustomers) * 100).toFixed(2) : 0,
    retentionRate90: totalCustomers > 0 ? ((activeNinetyDays / totalCustomers) * 100).toFixed(2) : 0,
    churnRate: totalCustomers > 0 ? ((churnedCustomers / totalCustomers) * 100).toFixed(2) : 0,
  };
}

module.exports = {
  calculateAdvancedAnalytics,
};
