# BookNest – Online Bookstore

E-Commerce application built for VES Institute of Technology | E-Commerce Lab  
**Stack:** React (Vite) · Node.js Serverless Functions · JWT auth · Razorpay · Vercel

---

## What's Covered (Lab Modules)

| Module | Where to find it |
|--------|-----------------|
| Order Management + Inventory | `/admin` → Order Management tab + Inventory tab |
| Secure Admin Login | `/login` → JWT session, route protection, logout |
| Online Payment System (Razorpay) | `/cart` → checkout flow |
| ERP + CRM Concepts | `/admin` → Overview + CRM tabs |
| Digital Marketing + Landing Pages | `/` (home) + `/subscriptions` |
| Risk Assessment + Security | `/admin` → Risk & Security tab |
| Cloud Deployment | This README — deployed on Vercel |
| **NEW: Real-Time Order Management** | `/admin` → Order Management (all orders) + `/orders` (user orders) |
| **NEW: Dual-Role System (Admin/Customer)** | Login with different roles → Different dashboards |
| **NEW: Live Order Sync** | Place order as user → See instantly in admin dashboard |
| **NEW: Order Status Notifications** | Admin updates status → User gets toast notification |
| **NEW: Live CRM Analytics** | `/admin` → CRM tab (3 sub-tabs: Overview, Products, Timeline) |

---

## Project Structure

```
booknest/
├── api/                         # Vercel serverless functions (Node.js)
│   ├── _auth.js                 # Shared JWT + cookie helpers
│   ├── create-order.js          # POST /api/create-order  — creates Razorpay order
│   ├── auth/
│   │   ├── login.js             # POST /api/auth/login — issues JWT session cookie
│   │   ├── me.js                # GET /api/auth/me — restores active session
│   │   └── logout.js           # POST /api/auth/logout — clears session cookie
│   ├── verify-payment.js        # POST /api/verify-payment — verifies HMAC signature
│   └── package.json             # razorpay npm dependency
│
├── frontend/                    # React (Vite) app
│   ├── src/
│   │   ├── components/          # Navbar, BookCard, Toast
│   │   ├── context/             # CartContext (global state)
│   │   ├── data/                # mockData.js (books, orders, customers, threats)
│   │   ├── hooks/               # useToast
│   │   └── pages/
│   │       ├── LandingPage      # Home / marketing page
│   │       ├── ShopPage         # Catalog with filters
│   │       ├── BookDetailPage   # Single book view
│   │       ├── CartPage         # Cart + Razorpay checkout
│   │       ├── OrdersPage       # Order tracking
│   │       ├── LoginPage        # Secure admin sign-in
│   │       ├── SubscriptionsPage
│   │       └── AdminPage        # Dashboard (ERP/CRM/Inventory/Security)
│   │           └── admin/       # Overview, Orders, Inventory, CRM, Security tabs
│   └── index.html
│
├── vercel.json                  # Vercel routing config
├── .env.example                 # Copy this to .env
└── README.md
```

---

## NEW: Multi-Role Admin-User Real-Time System

### What's New

✅ **Separate logins for Admin and Customer**
- Admin gets full dashboard access to `/admin`
- Customers get order tracking at `/orders`
- Different redirects after login based on role

✅ **Live Order Sync (Real-Time)**
- User places order → appears instantly in admin's order list
- Admin updates order status → User sees change within 5 seconds
- Toast notifications alert users of status changes

✅ **Simultaneous Sessions**
- Login as Admin and Customer in different tabs/browsers
- Changes sync instantly across all sessions
- No session conflicts

✅ **Live CRM Analytics Dashboard**
- **Overview Tab:** Total orders, revenue, average order value, orders by status
- **Products Tab:** Top-selling books with quantity and revenue analysis
- **Timeline Tab:** 7-day bar chart of order volume
- Auto-updates every 10 seconds

### Quick Test

**Demo Credentials:**

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@booknest.local` | `BookNest@2026` |
| Customer | `reader@booknest.local` | `Reader@2026` |

**Test Flow:**
1. Open two browser windows side-by-side
2. Login as Customer in Window 1 → `/orders`
3. Login as Admin in Window 2 → `/admin` → Order Management
4. Customer places order in Window 1
5. Order appears instantly in Admin's list in Window 2
6. Admin updates status → Customer sees notification in Window 1 (within 5 sec)

**See also:** [TESTING_GUIDE.md](TESTING_GUIDE.md) and [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

### 1. Clone and install

```bash
git clone <your-repo-url>
cd booknest
cd frontend && npm install && cd ..
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your Razorpay **test** keys:

```
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

Then add the admin auth values:

```bash
AUTH_ADMIN_EMAIL=admin@booknest.local
AUTH_ADMIN_PASSWORD=BookNest@2026
AUTH_USER_EMAIL=reader@booknest.local
AUTH_USER_PASSWORD=Reader@2026
JWT_SECRET=replace-with-a-long-random-string
```

> Get keys from: https://dashboard.razorpay.com → Settings → API Keys → Generate Test Key

### 3. Run the frontend

```bash
cd frontend
npm run dev
```

> Open http://localhost:5173

### 4. Run the API locally (optional for payment testing)

Install the Vercel CLI if you haven't:
```bash
npm i -g vercel
```

From the project root:
```bash
vercel dev
```

This runs everything — frontend + API functions — on http://localhost:3000

---

## Deploying to Vercel

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "BookNest initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/booknest.git
git push -u origin main
```

### Step 2 — Import into Vercel

1. Go to https://vercel.com → New Project
2. Import your GitHub repo
3. Vercel auto-detects the config from `vercel.json`
4. **Do not change** the build settings — `vercel.json` handles everything

### Step 3 — Add Environment Variables

In Vercel project → Settings → Environment Variables, add:

| Key | Value | Environment |
|-----|-------|-------------|
| `RAZORPAY_KEY_ID` | `rzp_test_xxx...` | Production + Preview + Development |
| `RAZORPAY_KEY_SECRET` | `xxx...` | Production + Preview + Development |
| `VITE_RAZORPAY_KEY_ID` | `rzp_test_xxx...` | Production + Preview + Development |
| `AUTH_ADMIN_EMAIL` | `admin@booknest.local` | Production + Preview + Development |
| `AUTH_ADMIN_PASSWORD` | `BookNest@2026` | Production + Preview + Development |
| `AUTH_USER_EMAIL` | `reader@booknest.local` | Production + Preview + Development |
| `AUTH_USER_PASSWORD` | `Reader@2026` | Production + Preview + Development |
| `JWT_SECRET` | `long-random-string` | Production + Preview + Development |

### Step 4 — Deploy

```bash
vercel --prod
```

Or just push to `main` — Vercel auto-deploys on every push.

---

## How the Razorpay Payment Flow Works

```
User clicks "Pay ₹X"
        │
        ▼
POST /api/create-order       ← Node.js serverless fn
  razorpay.orders.create()   ← Creates order on Razorpay server
  returns { orderId, amount }
        │
        ▼
Razorpay Checkout Modal      ← Opens in browser (test cards below)
  User enters card details
  Payment processed
  returns { payment_id, order_id, signature }
        │
        ▼
POST /api/verify-payment     ← Node.js serverless fn
  HMAC-SHA256 verification   ← Ensures payment wasn't tampered
  returns { success: true }
        │
        ▼
Order added to state ✓
Cart cleared ✓
```

### Test Card Details (Razorpay Test Mode)

| Field | Value |
|-------|-------|
| Card Number | `4111 1111 1111 1111` |
| Expiry | Any future date (e.g. `12/29`) |
| CVV | Any 3 digits (e.g. `123`) |
| OTP | `1234` |

Or use UPI test ID: `success@razorpay`

---

## Demo Walkthrough for Professor

1. **Landing Page** `/` — Marketing page showing market stats (₹142.72B market), subscription boxes, newsletter signup
2. **Shop** `/shop` — Filter books by genre/format, search, sort
3. **Book Detail** `/book/b001` — Full book page, add to cart
4. **Cart + Payment** `/cart` — Enter name/email/phone → Pay with Razorpay test card → Order confirmed
5. **My Orders** `/orders` — See all orders with status, expand for details
6. **Login** `/login` — Admin sign-in with JWT + protected session
7. **Subscriptions** `/subscriptions` — Subscription box plans
8. **Admin Dashboard** `/admin`
   - **Overview** — Revenue charts, genre sales, order pipeline
   - **Order Management** — Update order status (ERP workflow)
   - **Inventory** — Edit stock levels, low-stock alerts
   - **CRM** — Customer segmentation (VIP/Regular/New), LTV, newsletter opt-in rates
   - **Risk & Security** — Threat register, PCI DSS checklist, BCP summary

### Admin Login Flow

The app now uses a server-issued JWT session with role separation:

1. `POST /api/auth/login` validates the selected role's credentials and signs a JWT on the server.
2. The token is stored in an `HttpOnly` cookie so the browser cannot read it from JavaScript.
3. `GET /api/auth/me` verifies the cookie and restores the session on page refresh.
4. `POST /api/auth/logout` clears the session cookie.

The admin dashboard is locked to `role: admin`; customer sessions can still sign in, but they are routed away from `/admin`. The login endpoint also rate-limits repeated failures per IP and keeps the session short-lived by default.

---

## Tech Decisions (for viva)

**Why Vercel serverless instead of a separate Express server?**  
One repo, one deploy command. No server to manage, auto-scaling, zero cold-start issues for demo scale. The `api/` folder is auto-detected by Vercel as serverless functions.

**Why Razorpay and not Stripe?**  
Razorpay is India-first — supports UPI, wallets, net banking natively. Stripe requires business registration for INR payouts. For an Indian e-commerce demo, Razorpay is the correct choice.

**Why HMAC-SHA256 signature verification on the backend?**  
The payment amount and order ID are signed server-side with your secret key. A tampered response (e.g. changing amount to ₹1) would produce a different signature and fail verification — this is PCI DSS requirement.

**Why mock data instead of a DB?**  
For a professor demo, DB setup time and potential connection issues outweigh the benefit. The architecture (CartContext, mockData.js) is designed to swap in a real DB call with a 2-line change per function.
