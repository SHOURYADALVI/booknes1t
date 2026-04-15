// ── Order Management Utilities ─────────────────────────────────────────────
// Handles order storage, retrieval, and analytics

// In-memory store (can be upgraded to database later)
let ordersStore = [];
let orderIdCounter = 1000;

/**
 * Add a new order to the store
 */
function createOrder(orderData) {
  const orderId = `ORD-${Date.now()}-${++orderIdCounter}`;
  const now = new Date().toISOString();
  
  const order = {
    id: orderId,
    userId: orderData.userId, // User email or ID
    userName: orderData.userName,
    userEmail: orderData.userEmail,
    items: orderData.items, // [{ id, title, price, qty }, ...]
    total: orderData.total,
    status: "Processing", // Processing, Shipped, Delivered, Cancelled
    createdAt: now,
    updatedAt: now,
    notes: [],
    paymentId: orderData.paymentId || null,
  };
  
  ordersStore.push(order);
  console.log(`[_ORDERS] Order stored. Total orders in store: ${ordersStore.length}`);
  console.log(`[_ORDERS] Order details:`, { id: order.id, userId: order.userId, userEmail: order.userEmail });
  return order;
}

/**
 * Get all orders (admin function)
 */
function getAllOrders() {
  return ordersStore.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Get user's orders
 */
function getUserOrders(userId) {
  const filtered = ordersStore
    .filter(o => o.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  console.log(`[_ORDERS] getUserOrders(${userId}): Found ${filtered.length} orders out of ${ordersStore.length} total`);
  if (ordersStore.length > 0) {
    console.log(`[_ORDERS] Stored userIds:`, ordersStore.map(o => o.userId));
  }
  
  return filtered;
}

/**
 * Get single order by ID
 */
function getOrderById(orderId) {
  return ordersStore.find(o => o.id === orderId);
}

/**
 * Update order status
 */
function updateOrderStatus(orderId, newStatus, adminNote = "") {
  const order = getOrderById(orderId);
  if (!order) return null;
  
  order.status = newStatus;
  order.updatedAt = new Date().toISOString();
  
  if (adminNote) {
    order.notes.push({
      timestamp: new Date().toISOString(),
      text: adminNote,
      by: "admin",
    });
  }
  
  return order;
}

/**
 * Get order analytics for CRM dashboard
 */
function getOrderAnalytics() {
  const totalOrders = ordersStore.length;
  const totalRevenue = ordersStore
    .filter(o => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  
  const ordersByStatus = {
    Processing: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
  };
  
  ordersStore.forEach(o => {
    ordersByStatus[o.status]++;
  });
  
  // Revenue by status
  const revenueByStatus = {
    Processing: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
  };
  
  ordersStore.forEach(o => {
    revenueByStatus[o.status] += o.total;
  });
  
  // Top products
  const productStats = {};
  ordersStore.forEach(order => {
    order.items.forEach(item => {
      if (!productStats[item.id]) {
        productStats[item.id] = { title: item.title, quantity: 0, revenue: 0 };
      }
      productStats[item.id].quantity += item.qty;
      productStats[item.id].revenue += item.price * item.qty;
    });
  });
  
  const topProducts = Object.entries(productStats)
    .map(([id, stats]) => ({ id, ...stats }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);
  
  // Average order value
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  
  // Unique customers
  const uniqueCustomers = new Set(ordersStore.map(o => o.userId)).size;
  
  // Orders timeline (last 7 days)
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const ordersTimeline = {};
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    ordersTimeline[dateStr] = 0;
  }
  
  ordersStore.forEach(o => {
    const dateStr = o.createdAt.split("T")[0];
    if (ordersTimeline.hasOwnProperty(dateStr)) {
      ordersTimeline[dateStr]++;
    }
  });
  
  return {
    totalOrders,
    totalRevenue,
    avgOrderValue,
    uniqueCustomers,
    ordersByStatus,
    revenueByStatus,
    topProducts,
    ordersTimeline,
  };
}

/**
 * Add a customer review/rating to a product (for CRM)
 */
function addProductReview(productId, review) {
  // This would store reviews - for now just a placeholder
  // In production, this would be in a reviews collection
  return { productId, review, timestamp: new Date().toISOString() };
}

/**
 * Initialize with some mock data for demo
 */
function initializeMockData() {
  if (ordersStore.length > 0) return; // Already initialized
  
  const mockOrders = [
    {
      userId: "admin@booknest.local",
      userName: "Admin User",
      userEmail: "admin@booknest.local",
      items: [
        { id: "b001", title: "The Midnight Library", price: 499, qty: 2 },
        { id: "b005", title: "The Thursday Murder Club", price: 379, qty: 1 },
      ],
      total: 1377,
      status: "Delivered",
      paymentId: "pay_2025_admin_001",
    },
    {
      userId: "reader@booknest.local",
      userName: "Reader User",
      userEmail: "reader@booknest.local",
      items: [
        { id: "b002", title: "Atomic Habits", price: 399, qty: 1 },
      ],
      total: 399,
      status: "Shipped",
      paymentId: "pay_2025_reader_001",
    },
  ];
  
  mockOrders.forEach(o => createOrder(o));
}

// Initialize mock data on first load
initializeMockData();

module.exports = {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getOrderAnalytics,
  addProductReview,
};
