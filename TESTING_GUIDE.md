# BookNest Multi-Role Admin-User System - Complete Setup Guide

## 🎯 What's New

Your BookNest application now has a **complete dual-role system** with real-time order management and live CRM analytics:

### ✨ Key Features

**For Users:**
- Place orders and see them instantly in "My Orders"
- Real-time notifications when admin updates order status
- Live status tracking (Processing → Shipped → Delivered)
- Auto-refresh every 5 seconds

**For Admins:**
- View ALL orders from all users in one dashboard
- Update order status with one click
- Users see changes in REAL-TIME instantly
- Live CRM Analytics Dashboard with 3 tabs:
  - **Overview**: Total orders, revenue, order breakdown by status
  - **Products**: Top-selling books with quantity and revenue analysis
  - **Timeline**: Orders over last 7 days (visual bar chart)

**Simultaneous Sessions:**
- Login as **Admin** and **Customer** at the same time (different browsers/tabs)
- Changes sync instantly across both sessions
- No session conflicts or crosstalk

---

## 🚀 Quick Start - Testing Locally

### Step 1: Start the Backend API Server
```bash
# Open PowerShell in your project root
cd c:\Users\Shourya\Downloads\booknest_fixed\booknest

# Start API server
node scripts/local-api-server.cjs
# Expected output: "BookNest API listening on http://127.0.0.1:3001"
```

### Step 2: Start the Frontend (New Tab)
```bash
# In a NEW PowerShell tab/window
cd c:\Users\Shourya\Downloads\booknest_fixed\booknest

# Start frontend
node scripts/local-frontend-server.cjs
# Expected output: "Vite v5.4.x ready in ... ms"
```

### Step 3: Open in Browser
```
http://localhost:5173
```

---

## 🧪 Testing Scenarios

### Scenario 1: Admin-Only Access
1. **Login as Admin**
   - URL: `http://localhost:5173/login`
   - Email: `admin@booknest.local`
   - Password: `BookNest@2026`
   - Role: Select "Admin"
   - Click "Sign in"

2. **You should see:**
   - Navbar shows "Admin" badge
   - Can access `/admin` dashboard
   - Admin menu visible in navbar

3. **Try accessing Admin Dashboard:**
   - Click "Admin Dashboard" in navbar
   - See 5 tabs: Overview, Order Management, Inventory, CRM, Risk & Security
   - Everything except CRM/Orders might show placeholder data

**Result:** ✅ Admin dashboard loads, only admins can access /admin

---

### Scenario 2: Customer Cannot Access Admin
1. **Login as Customer**
   - Email: `reader@booknest.local`
   - Password: `Reader@2026`
   - Role: Select "Customer"

2. **Try to access /admin**
   - Go to `http://localhost:5173/admin`
   - Should redirect to login with message
   - Admin menu disappears from navbar

**Result:** ✅ Route protection works, customers blocked from /admin

---

### Scenario 3: Place Order (User) → Update Status (Admin) → See Notification

#### Part A: User Places Order
1. **Login as Customer** (Email: `reader@booknest.local`)
2. Go to Shop → Add some books to cart
3. Go to Cart → Fill in delivery details:
   - Name: Any name
   - Email: reader@booknest.local (or any email)
   - Phone: 9123456789
4. Click "Pay" button
5. **Razorpay popup** appears
   - Click "Test Card" or skip (demo mode)
   - **Your order is created and appears instantly in "My Orders" page**
6. Go to "My Orders" → See your new order with status "Processing"

#### Part B: Admin Updates Order Status (Real-Time Sync Test)
1. **Open a NEW BROWSER WINDOW/TAB** (or use incognito)
2. **Login as Admin** (Email: `admin@booknest.local`, Password: `BookNest@2026`)
3. Go to Admin Dashboard → "Order Management" tab
4. **Find the order you just created** (search by customer name or email)
5. Change status from "Processing" → "Shipped" and click update
6. **You should see success notification** "Order updated to Shipped"

#### Part C: Customer Sees Real-Time Change
1. **Switch back to USER browser/tab** with "My Orders" page
2. **Wait up to 5 seconds** (auto-refresh interval)
3. **Order status automatically changed to "Shipped"**
4. **Toast notification appears** at top-right: "Order [ID]: Status changed from Processing → Shipped"

**Result:** ✅ Real-time sync works! Admin updates immediately visible to users.

---

### Scenario 4: Live CRM Analytics Dashboard

1. **Login as Admin**
2. Go to Admin Dashboard → Click "CRM" tab
3. **Overview Tab (Default):**
   - Total Orders: Shows all orders in system
   - Total Revenue: Sum of non-cancelled orders
   - Average Order Value: Revenue ÷ Orders
   - Unique Customers: Count of distinct user emails
   - Orders by Status: Bar chart showing Processing/Shipped/Delivered/Cancelled
   - Revenue by Status: Shows ₹ by status

4. **Click Products Tab:**
   - See top-selling books by revenue
   - Quantity sold per book
   - Revenue generated per book
   - Average price per unit

5. **Click Timeline Tab:**
   - Bar chart showing order volume last 7 days
   - Hover over bars to see exact date

6. **Place more orders as customer** and watch analytics update in real-time!

**Result:** ✅ Live CRM dashboard with real-time data

---

## 📊 Data Flow Diagram

```
USER PLACES ORDER
       ↓
CartPage → /api/orders/create (POST)
       ↓
Backend stores order + creates JWT
       ↓
Order appears in user's OrdersPage
       ↓
ORDER POLLING (Every 5 seconds)
OrdersPage fetches /api/orders/list (GET)
       ↓
ADMIN UPDATES STATUS
AdminOrders → /api/orders/update-status (PATCH)
       ↓
Backend updates order + sends response
       ↓
USER POLLING DETECTS CHANGE
       ↓
NotificationContext triggers toast
       ↓
USER SEES NOTIFICATION + STATUS UPDATE
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Redirect After Login |
|------|-------|----------|----------------------|
| Admin | `admin@booknest.local` | `BookNest@2026` | `/admin` |
| Customer | `reader@booknest.local` | `Reader@2026` | `/orders` |

---

## 📁 New Files Created

### Backend
- `api/_orders.js` - Order storage engine
- `api/orders/create.js` - Create order endpoint
- `api/orders/list.js` - Get orders endpoint
- `api/orders/update-status.js` - Update status endpoint
- `api/orders/analytics.js` - CRM analytics endpoint

### Frontend
- `frontend/src/hooks/useOrders.js` - Order management hook
- `frontend/src/hooks/useAnalytics.js` - Analytics hook
- `frontend/src/context/NotificationContext.jsx` - Notification system
- `frontend/src/components/Notifications.jsx` - Toast component
- `frontend/src/components/Notifications.css` - Toast styles

### Modified Frontend
- `frontend/src/App.jsx` - Added NotificationProvider + AuthProvider
- `frontend/src/pages/CartPage.jsx` - Now saves to backend
- `frontend/src/pages/OrdersPage.jsx` - Fetches from backend
- `frontend/src/pages/admin/AdminOrders.jsx` - Shows all orders + status update
- `frontend/src/pages/admin/AdminCRM.jsx` - Live CRM analytics dashboard

---

## 🔒 Security Features

✅ **JWT Authentication**
- All order endpoints require valid JWT token
- Tokens verified on backend with admin role check

✅ **Role-Based Access Control**
- Admin-only endpoints reject non-admins
- Users only see their own orders
- Status updates only allowed for admins

✅ **HttpOnly Cookies**
- JWT stored securely in HttpOnly cookies
- Cannot be accessed via JavaScript
- Protected from XSS attacks

✅ **Rate Limiting**
- Login attempts limited (5 per 10 min per IP)
- Prevents brute force attacks

---

## 💡 Common Issues & Solutions

### Issue: Orders not appearing in AdminOrders
**Solution:** 
- Ensure you're logged in as Admin
- API must be running on port 3001
- Check browser console (F12) for errors
- Refresh page manually

### Issue: Notifications not showing
**Solution:**
- Make sure notification component is mounted (it is, in App.jsx)
- Check top-right corner of screen
- Notification auto-disappears after 5 seconds

### Issue: Real-time sync not working (order status not updating)
**Solution:**
- Check that polling is running (every 5 seconds)
- Both browser tabs should show update within 5 seconds
- Refresh page manually if needed
- Check network tab in DevTools for /api/orders/list calls

### Issue: Admin Dashboard showing blank CRM
**Solution:**
- Wait for API to respond (check network tab)
- Analytics endpoint might not be loading - check for errors
- Try clicking "Refresh" button in CRM tab

---

## 🎓 Learning Points

### Polling vs WebSocket
Currently using **HTTP polling** (simplicity):
- Frontend fetches every 5 seconds
- Works everywhere, no setup
- Slightly more bandwidth

To upgrade to **WebSocket** (future):
- Real-time push from server
- Lower latency
- Better for high-frequency updates

### In-Memory vs Database
Currently using **in-memory storage** (demo):
- Data lost on server restart
- Good for development/demo
- Fast access

To upgrade to **persistent database**:
- Use MongoDB, PostgreSQL, etc.
- Data survives restarts
- Better for production

---

## ✅ Testing Checklist

- [ ] Admin can login and see "/admin" dashboard
- [ ] Customer cannot access "/admin" (redirects to login)
- [ ] Customer can place order from cart
- [ ] Order appears in user's "My Orders" page
- [ ] Admin can see order in "Order Management" tab
- [ ] Admin can change order status
- [ ] Customer sees status change within 5 seconds
- [ ] Toast notification appears for status change
- [ ] CRM analytics show correct totals
- [ ] Timeline shows 7-day bar chart
- [ ] Products tab shows top-selling books
- [ ] Simultaneous sessions work (no conflicts)
- [ ] Logout clears auth state
- [ ] Refresh page maintains auth session

---

## 🚀 Next Steps

**Already Implemented:**
✅ Multi-role authentication
✅ Real-time order sync
✅ Admin order management
✅ Live CRM analytics

**Optional Enhancements:**
- [ ] WebSocket for true real-time (vs polling)
- [ ] MongoDB/PostgreSQL persistence
- [ ] Email notifications when order status changes
- [ ] Order history archive
- [ ] Customer reviews & ratings (for CRM)
- [ ] Export analytics to CSV/PDF
- [ ] Advanced filters in order management
- [ ] Bulk order status updates

---

## 📞 Questions?

Refer to the demo credentials and test scenarios above to verify everything works correctly.
