# Quick Reference - BookNest Development

## 🚀 Quick Start Commands

```bash
# Terminal 1: Start API Server
node scripts/local-api-server.cjs

# Terminal 2: Start Frontend
node scripts/local-frontend-server.cjs

# Browser
http://localhost:5173
```

## 👤 Demo Credentials

| User | Email | Password |
|------|-------|----------|
| Admin | `admin@booknest.local` | `BookNest@2026` |
| Customer | `reader@booknest.local` | `Reader@2026` |

## 📂 Key File Locations

### Backend (Order System)
- **Order Storage**: `api/_orders.js` (in-memory store functions)
- **Create Order**: `api/orders/create.js` → `POST /api/orders/create`
- **List Orders**: `api/orders/list.js` → `GET /api/orders/list`
- **Update Status**: `api/orders/update-status.js` → `PATCH /api/orders/update-status`
- **Analytics**: `api/orders/analytics.js` → `GET /api/orders/analytics`

### Frontend (React Components)
- **Order Hook**: `frontend/src/hooks/useOrders.js` (polling, CRUD)
- **Analytics Hook**: `frontend/src/hooks/useAnalytics.js` (admin only)
- **Notifications**: `frontend/src/context/NotificationContext.jsx` (toast system)
- **Notifications UI**: `frontend/src/components/Notifications.jsx` (toast component)
- **Cart Page**: `frontend/src/pages/CartPage.jsx` (saves to backend)
- **Orders Page**: `frontend/src/pages/OrdersPage.jsx` (user's orders)
- **Admin Orders**: `frontend/src/pages/admin/AdminOrders.jsx` (all orders)
- **Admin CRM**: `frontend/src/pages/admin/AdminCRM.jsx` (analytics dashboard)

## 🔌 API Endpoints

```javascript
// Create order (no auth needed - called from checkout)
POST /api/orders/create
Body: { userId, userName, userEmail, items, total, paymentId }
Response: { success, order }

// Get orders (auth required - JWT verified)
GET /api/orders/list
Response: { orders, isAdmin }

// Update status (admin only)
PATCH /api/orders/update-status
Body: { orderId, status, note }
Response: { order }

// Get analytics (admin only)
GET /api/orders/analytics
Response: { analytics }
```

## 🎨 Component Hierarchy

```
App
├── AuthProvider
├── CartProvider
├── NotificationProvider
│   ├── NotificationCenter (displays toasts)
│   ├── Navbar
│   └── Routes
│       ├── LandingPage
│       ├── LoginPage
│       ├── ShopPage
│       ├── CartPage (uses useOrders hook)
│       ├── OrdersPage (uses useOrders hook)
│       ├── ProtectedRoute
│       │   └── AdminPage
│       │       ├── AdminOverview
│       │       ├── AdminOrders (uses useOrders hook)
│       │       ├── AdminInventory
│       │       ├── AdminCRM (uses useAnalytics hook)
│       │       └── AdminSecurity
```

## 🔄 Data Flow - User Places Order

```
CartPage component
  ↓
User clicks "Pay"
  ↓
handlePayment() function
  ↓
POST /api/create-order (Razorpay order)
  ↓
Razorpay modal opens
  ↓
User enters test card (4111 1111 1111 1111)
  ↓
Payment verified
  ↓
POST /api/verify-payment (backend verification)
  ↓
createRemoteOrder() from useOrders hook
  ↓
POST /api/orders/create (saves to backend)
  ↓
Order stored in backend
Order appears in OrdersPage (polling detects it)
Order appears in AdminOrders (polling detects it)
```

## 🔄 Real-Time Sync Flow

```
User in Window 1: /orders page
  ↓ (every 5 seconds)
  GET /api/orders/list
  
Admin in Window 2: /admin → Order Management
  ↓ (every 5 seconds)
  GET /api/orders/list (with admin=true)
  ↓
  Admin updates order status
  ↓
  PATCH /api/orders/update-status
  
User's polling detects status change
  ↓
  Comparison in useOrders hook
  ↓
  notifyOrderStatusChange() triggered
  ↓
  Toast notification appears
  ↓
  OrdersPage updates display
```

## 🛠️ Common Tasks

### Add New Order Field
1. Modify schema in `_orders.js` (add to order object)
2. Update `createOrder()` function in `_orders.js`
3. Update `api/orders/create.js` validation
4. Update frontend components that display orders

### Add New Analytics Metric
1. Calculate in `getOrderAnalytics()` function in `_orders.js`
2. Return in response object
3. Update frontend `AdminCRM.jsx` to display new metric
4. Update `API_DOCUMENTATION.md`

### Extend Admin Dashboard
1. Create new tab in `AdminPage.jsx` (if top-level feature)
2. Create new component in `admin/` folder
3. Add to TABS list in AdminPage.jsx
4. Use hooks: `useOrders()`, `useAnalytics()`, `useAuth()`

### Create New Protected Route
1. Wrap component in `<ProtectedRoute><Component /></ProtectedRoute>`
2. In `ProtectedRoute.jsx`, check `user.role === "admin"`
3. Add to routes in `App.jsx`

## 📊 Status Values

```javascript
"Processing"   // Default, fresh order
"Shipped"      // Admin updated: in delivery
"Delivered"    // Admin updated: received
"Cancelled"    // Admin updated: cancelled
```

## 🔐 Auth Tokens

```javascript
// JWT Structure
{
  sub: "user@email.com",           // Subject (user ID)
  role: "admin" | "user",          // Role claim
  name: "User Name",               // Full name
  email: "user@email.com",         // Email
  iat: 1707234567,                 // Issued at
  exp: 1707238167,                 // Expires at
  iss: "BookNest"                  // Issuer
}

// Storage
HttpOnly cookie: booknest_session=...

// Access in API
1. Cookie automatically sent with credentials
2. Verify with: verifyJwt(token) from _auth.js
3. Extract payload: { sub, role, name, email }
```

## 🎯 Polling Intervals

```javascript
// useOrders hook
5 seconds    // OrdersPage re-fetches orders

// useAnalytics hook  
10 seconds   // AdminCRM re-fetches analytics

// Auto-adjust intervals in custom hooks if needed:
// useEffect(() => {
//   const interval = setInterval(fetchOrders, YOUR_INTERVAL);
//   return () => clearInterval(interval);
// }, []);
```

## 🚨 Common Errors & Fixes

### "Order not found"
- Check order ID format: `ORD-{timestamp}-{counter}`
- Verify order was created (check backend console)
- Try refreshing the page

### "Unauthorized - Forbidden"
- User trying to update order status (admin-only)
- Invalid JWT token (login again)
- JWT expired (login again)

### "Orders not syncing"
- Check polling interval (5s for orders, 10s for analytics)
- Verify browser network tab (should see GET requests)
- Check browser console for errors
- Manually refresh page if needed

### "Notification not showing"
- Check top-right corner (high z-index)
- Notification auto-dismisses after 5s
- Check NotificationProvider is wrapping App
- Verify useNotification() hook is called in component

## 📈 Performance Tips

### Reduce API Calls
- Increase polling interval (trade-off with real-time feel)
- Use React.memo() on list items to prevent re-renders
- Use useCallback() for functions passed to child components

### Optimize Database (Future)
- Index on `userId` for user queries
- Index on `status` and `createdAt` for dashboard
- Add pagination for orders list

### Frontend Optimizations
- Lazy-load analytics charts (only when tab clicked)
- Virtualize long order lists (if >1000 items)
- Use react-query or SWR for caching

## 🐛 Debug Checklist

Working on a bug? Check:

- [ ] Network tab (DevTools → Network) shows requests completing
- [ ] Server logs show no errors
- [ ] JWT token is valid (check in jwt.io)
- [ ] Role claim matches requirement (admin vs user)
- [ ] Order ID is correctly formatted
- [ ] Status is one of: Processing, Shipped, Delivered, Cancelled
- [ ] Polling interval is correct (5s orders, 10s analytics)
- [ ] useAuth() hook exists and user object is populated

## 📚 Documentation Files

1. **TESTING_GUIDE.md** - Full test scenarios
2. **API_DOCUMENTATION.md** - API endpoints reference
3. **IMPLEMENTATION_SUMMARY.md** - What was built and how
4. **README.md** - Project overview
5. **This file** - Quick reference

---

**Last updated:** February 2026  
**Status:** Production-ready
