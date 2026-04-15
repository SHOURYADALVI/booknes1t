# BookNest Order Management API Documentation

## Base URL
- **Local Development:** `http://127.0.0.1:3001`
- **Production:** `https://your-vercel-domain.vercel.app` (add to `vercel.json`)

---

## Authentication

All order endpoints require JWT authentication via HttpOnly cookies or Authorization header.

### Cookie-Based (Default)
```
GET /api/orders/list
Cookie: booknest_session=eyJhbGciOiJIUzI1NiIs...
```

### Authorization Header
```
GET /api/orders/list
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## Endpoints

### 1. Create Order
**Endpoint:** `POST /api/orders/create`

**Description:** Create a new order after payment verification. Called by the frontend after Razorpay payment succeeds.

**Authentication:** Not required (called during checkout, before session)

**Request Body:**
```json
{
  "userId": "reader@booknest.local",
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "items": [
    {
      "id": "b001",
      "title": "The Midnight Library",
      "price": 499,
      "qty": 2
    }
  ],
  "total": 998,
  "paymentId": "pay_2026_reader_001"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "order": {
    "id": "ORD-1707234567890-1001",
    "userId": "reader@booknest.local",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "items": [...],
    "total": 998,
    "status": "Processing",
    "createdAt": "2026-02-07T10:23:45.123Z",
    "updatedAt": "2026-02-07T10:23:45.123Z",
    "notes": [],
    "paymentId": "pay_2026_reader_001"
  },
  "message": "Order created successfully"
}
```

**Error Responses:**
```json
// 400 Bad Request
{
  "error": "Missing required fields: userId, userEmail, items, total"
}

// 400 Bad Request
{
  "error": "Order must contain at least one item"
}

// 500 Internal Server Error
{
  "error": "Failed to create order",
  "details": "..."
}
```

---

### 2. Get Orders List
**Endpoint:** `GET /api/orders/list`

**Description:** Get authenticated user's orders or all orders if admin. Supports JWT in cookie or Authorization header.

**Authentication:** ✅ Required (JWT)

**Query Parameters:** None

**Response (200 OK):**
```json
{
  "success": true,
  "orders": [
    {
      "id": "ORD-1707234567890-1001",
      "userId": "reader@booknest.local",
      "userName": "John Doe",
      "userEmail": "john@example.com",
      "items": [
        {
          "id": "b001",
          "title": "The Midnight Library",
          "price": 499,
          "qty": 2
        }
      ],
      "total": 998,
      "status": "Processing",
      "createdAt": "2026-02-07T10:23:45.123Z",
      "updatedAt": "2026-02-07T10:23:45.123Z",
      "notes": [],
      "paymentId": "pay_2026_reader_001"
    }
  ],
  "isAdmin": false
}
```

**Error Responses:**
```json
// 401 Unauthorized
{
  "error": "Unauthorized",
  "message": "No authentication token provided"
}

// 401 Unauthorized
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}

// 500 Internal Server Error
{
  "error": "Failed to fetch orders",
  "details": "..."
}
```

**Behavior:**
- **User role:** Returns only their orders
- **Admin role:** Returns ALL orders in system
- **Cookie/Header:** Both methods work

---

### 3. Update Order Status
**Endpoint:** `PATCH /api/orders/update-status`

**Description:** Update an order's status. Admin-only operation.

**Authentication:** ✅ Required (JWT, Admin role)

**Request Body:**
```json
{
  "orderId": "ORD-1707234567890-1001",
  "status": "Shipped",
  "note": "Order dispatched today"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "order": {
    "id": "ORD-1707234567890-1001",
    "userId": "reader@booknest.local",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "items": [...],
    "total": 998,
    "status": "Shipped",
    "createdAt": "2026-02-07T10:23:45.123Z",
    "updatedAt": "2026-02-07T10:24:12.456Z",
    "notes": [
      {
        "timestamp": "2026-02-07T10:24:12.456Z",
        "text": "Order dispatched today",
        "by": "admin"
      }
    ],
    "paymentId": "pay_2026_reader_001"
  },
  "message": "Order ORD-1707234567890-1001 updated to Shipped"
}
```

**Error Responses:**
```json
// 401 Unauthorized
{
  "error": "Unauthorized"
}

// 403 Forbidden
{
  "error": "Forbidden",
  "message": "Only admins can update order status"
}

// 400 Bad Request
{
  "error": "Missing required fields: orderId, status"
}

// 400 Bad Request
{
  "error": "Invalid status. Valid statuses: Processing, Shipped, Delivered, Cancelled"
}

// 404 Not Found
{
  "error": "Order not found"
}
```

**Valid Status Values:**
- `Processing` - Initial status after order creation
- `Shipped` - Package sent to delivery
- `Delivered` - Order received by customer
- `Cancelled` - Order cancelled

---

### 4. Get Analytics
**Endpoint:** `GET /api/orders/analytics`

**Description:** Get comprehensive order and revenue analytics. Admin-only. Used by CRM dashboard.

**Authentication:** ✅ Required (JWT, Admin role)

**Query Parameters:** None

**Response (200 OK):**
```json
{
  "success": true,
  "analytics": {
    "totalOrders": 42,
    "totalRevenue": 42500,
    "avgOrderValue": 1012,
    "uniqueCustomers": 15,
    "ordersByStatus": {
      "Processing": 8,
      "Shipped": 12,
      "Delivered": 20,
      "Cancelled": 2
    },
    "revenueByStatus": {
      "Processing": 8096,
      "Shipped": 12144,
      "Delivered": 20260,
      "Cancelled": 2000
    },
    "topProducts": [
      {
        "id": "b001",
        "title": "The Midnight Library",
        "quantity": 15,
        "revenue": 7485
      },
      {
        "id": "b002",
        "title": "Atomic Habits",
        "quantity": 12,
        "revenue": 4788
      }
    ],
    "ordersTimeline": {
      "2026-02-01": 5,
      "2026-02-02": 6,
      "2026-02-03": 4,
      "2026-02-04": 8,
      "2026-02-05": 7,
      "2026-02-06": 6,
      "2026-02-07": 6
    }
  }
}
```

**Error Responses:**
```json
// 401 Unauthorized
{
  "error": "Unauthorized"
}

// 403 Forbidden
{
  "error": "Forbidden",
  "message": "Only admins can access analytics"
}

// 500 Internal Server Error
{
  "error": "Failed to fetch analytics",
  "details": "..."
}
```

**Analytics Breakdown:**
- **totalOrders:** Total orders in system
- **totalRevenue:** Sum of non-cancelled order totals
- **avgOrderValue:** totalRevenue / totalOrders
- **uniqueCustomers:** Count of distinct user IDs
- **ordersByStatus:** Count of orders by each status
- **revenueByStatus:** Sum of revenues by status
- **topProducts:** Top 10 products by revenue
- **ordersTimeline:** Daily order count for last 7 days

---

## Rate Limiting

- Login attempts: **5 per 10 minutes per IP**
- No specific rate limits on order endpoints (implement if needed)

---

## HTTP Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET/PATCH |
| 201 | Created | Successful POST (order created) |
| 400 | Bad Request | Validation error in request |
| 401 | Unauthorized | Missing/invalid JWT |
| 403 | Forbidden | Insufficient permissions (non-admin) |
| 404 | Not Found | Order/resource doesn't exist |
| 405 | Method Not Allowed | Wrong HTTP method |
| 500 | Internal Server Error | Server error |

---

## CORS Headers

All endpoints include CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, Cookie
```

---

## Examples

### cURL Examples

**1. Create Order**
```bash
curl -X POST http://127.0.0.1:3001/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"user@example.com",
    "userName":"John Doe",
    "userEmail":"user@example.com",
    "items":[{"id":"b001","title":"Book","price":499,"qty":1}],
    "total":499,
    "paymentId":"pay_123"
  }'
```

**2. Get Orders (with Cookie)**
```bash
curl -X GET http://127.0.0.1:3001/api/orders/list \
  -H "Cookie: booknest_session=YOUR_JWT_TOKEN_HERE"
```

**3. Get Orders (with Authorization Header)**
```bash
curl -X GET http://127.0.0.1:3001/api/orders/list \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**4. Update Status**
```bash
curl -X PATCH http://127.0.0.1:3001/api/orders/update-status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "orderId":"ORD-1707234567890-1001",
    "status":"Shipped",
    "note":"Order dispatched"
  }'
```

**5. Get Analytics**
```bash
curl -X GET http://127.0.0.1:3001/api/orders/analytics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## JavaScript/Fetch Examples

### Get User's Orders
```javascript
async function getUserOrders() {
  const res = await fetch('/api/orders/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Send cookies
  });
  const data = await res.json();
  return data.orders;
}
```

### Create Order
```javascript
async function createOrder(items, total, paymentId) {
  const res = await fetch('/api/orders/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: user.email,
      userName: user.name,
      userEmail: user.email,
      items,
      total,
      paymentId,
    }),
  });
  return res.json();
}
```

### Update Order Status (Admin)
```javascript
async function updateOrderStatus(orderId, newStatus, note) {
  const res = await fetch('/api/orders/update-status', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      orderId,
      status: newStatus,
      note,
    }),
  });
  return res.json();
}
```

### Get Analytics (Admin)
```javascript
async function getAnalytics() {
  const res = await fetch('/api/orders/analytics', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  const data = await res.json();
  return data.analytics;
}
```

---

## Deployment to Vercel

For production deployment:

1. Add order endpoints to `vercel.json`:
```json
{
  "functions": {
    "api/orders/*.js": {
      "maxDuration": 10
    }
  }
}
```

2. Ensure environment variables are set:
```
JWT_SECRET=your_secret_here
AUTH_ADMIN_EMAIL=admin_email
AUTH_ADMIN_PASSWORD=admin_password_hash
AUTH_USER_EMAIL=user_email
AUTH_USER_PASSWORD=user_password_hash
```

3. Database: Replace in-memory storage with MongoDB URI if needed

---

## Notes

- All timestamps are ISO 8601 format
- Prices are integers (no decimals) in rupees
- Order IDs are unique across all requests
- Admin cannot see non-admin endpoints
- Session timeout: 2 hours (default) or 7 days (with "remember me")
