// ── Books ──────────────────────────────────────────────────────────────────
export const BOOKS = [
  {
    id: "b001", title: "The Midnight Library", author: "Matt Haig",
    genre: "Literary Fiction", price: 499, mrp: 699, stock: 42,
    format: ["Print", "eBook", "Audiobook"],
    cover: "https://covers.openlibrary.org/b/isbn/9781786892737-L.jpg",
    rating: 4.7, reviews: 2840, description:
      "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
    badge: "Bestseller",
  },
  {
    id: "b002", title: "Atomic Habits", author: "James Clear",
    genre: "Self-Help", price: 399, mrp: 599, stock: 67,
    format: ["Print", "eBook", "Audiobook"],
    cover: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
    rating: 4.8, reviews: 5102, description:
      "No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies for forming good habits.",
    badge: "Top Rated",
  },
  {
    id: "b003", title: "The Name of the Wind", author: "Patrick Rothfuss",
    genre: "Fantasy", price: 549, mrp: 799, stock: 28,
    format: ["Print", "eBook"],
    cover: "https://covers.openlibrary.org/b/isbn/9780756404741-L.jpg",
    rating: 4.6, reviews: 3412, description:
      "The tale of Kvothe, from his childhood in a troupe of traveling players to years spent as a near-legendary figure — an epic fantasy masterwork.",
    badge: "Niche Pick",
  },
  {
    id: "b004", title: "Project Hail Mary", author: "Andy Weir",
    genre: "Sci-Fi", price: 449, mrp: 649, stock: 19,
    format: ["Print", "Audiobook"],
    cover: "https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg",
    rating: 4.9, reviews: 4101, description:
      "A lone astronaut must save Earth from disaster in this propulsive, science-first adventure from the author of The Martian.",
    badge: "Staff Pick",
  },
  {
    id: "b005", title: "The Thursday Murder Club", author: "Richard Osman",
    genre: "Cozy Mystery", price: 379, mrp: 529, stock: 54,
    format: ["Print", "eBook", "Audiobook"],
    cover: "https://covers.openlibrary.org/b/isbn/9780241988268-L.jpg",
    rating: 4.5, reviews: 1987, description:
      "Four septuagenarians who meet weekly to solve cold cases find themselves in the middle of a live murder investigation in this delightful cozy mystery.",
    badge: "New Arrival",
  },
  {
    id: "b006", title: "Educated", author: "Tara Westover",
    genre: "Memoir", price: 429, mrp: 599, stock: 33,
    format: ["Print", "eBook"],
    cover: "https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg",
    rating: 4.7, reviews: 3280, description:
      "A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.",
    badge: "Award Winner",
  },
  {
    id: "b007", title: "Klara and the Sun", author: "Kazuo Ishiguro",
    genre: "Literary Fiction", price: 499, mrp: 699, stock: 7,
    format: ["Print", "eBook", "Audiobook"],
    cover: "https://covers.openlibrary.org/b/isbn/9780571364886-L.jpg",
    rating: 4.4, reviews: 1540, description:
      "Told from the perspective of an Artificial Friend, a landmark work from Nobel laureate Kazuo Ishiguro about what it means to love.",
    badge: "Low Stock",
  },
  {
    id: "b008", title: "The Psychology of Money", author: "Morgan Housel",
    genre: "Finance", price: 349, mrp: 499, stock: 88,
    format: ["Print", "eBook"],
    cover: "https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg",
    rating: 4.6, reviews: 4230, description:
      "Timeless lessons on wealth, greed, and happiness. 19 short stories exploring the strange ways people think about money.",
    badge: "Bestseller",
  },
];

// ── Subscription Boxes ─────────────────────────────────────────────────────
export const SUBSCRIPTION_BOXES = [
  {
    id: "sub001", name: "Cozy Reads Box", price: 799,
    description: "1 curated paperback + exclusive bookmark + reader's journal every month",
    books: 1, frequency: "Monthly", genre: "Mixed Fiction",
  },
  {
    id: "sub002", name: "The Niche Box", price: 1299,
    description: "2 handpicked books from underserved genres + author notes + tea sample",
    books: 2, frequency: "Monthly", genre: "Niche & Indie",
  },
  {
    id: "sub003", name: "Audiophile Bundle", price: 599,
    description: "3 audiobook credits per month across any genre",
    books: 3, frequency: "Monthly", genre: "Audiobooks",
  },
];

// ── Orders (mock existing orders) ─────────────────────────────────────────
export const INITIAL_ORDERS = [
  {
    id: "ORD-2025-001", customer: "Priya Sharma", email: "priya.s@email.com",
    date: "2025-01-15", status: "Delivered",
    items: [{ title: "Atomic Habits", qty: 1, price: 399 }, { title: "Educated", qty: 1, price: 429 }],
    total: 828, paymentId: "pay_test_001", city: "Mumbai",
  },
  {
    id: "ORD-2025-002", customer: "Arjun Mehta", email: "arjun.m@email.com",
    date: "2025-01-18", status: "Shipped",
    items: [{ title: "Project Hail Mary", qty: 2, price: 449 }],
    total: 898, paymentId: "pay_test_002", city: "Pune",
  },
  {
    id: "ORD-2025-003", customer: "Sneha Patel", email: "sneha.p@email.com",
    date: "2025-01-22", status: "Processing",
    items: [{ title: "The Midnight Library", qty: 1, price: 499 }],
    total: 499, paymentId: "pay_test_003", city: "Bangalore",
  },
  {
    id: "ORD-2025-004", customer: "Rahul Gupta", email: "rahul.g@email.com",
    date: "2025-01-25", status: "Delivered",
    items: [{ title: "The Psychology of Money", qty: 1, price: 349 }, { title: "The Name of the Wind", qty: 1, price: 549 }],
    total: 898, paymentId: "pay_test_004", city: "Delhi",
  },
  {
    id: "ORD-2025-005", customer: "Kavya Nair", email: "kavya.n@email.com",
    date: "2025-01-28", status: "Cancelled",
    items: [{ title: "Klara and the Sun", qty: 1, price: 499 }],
    total: 499, paymentId: null, city: "Chennai",
  },
  {
    id: "ORD-2025-006", customer: "Vikram Singh", email: "vikram.s@email.com",
    date: "2025-02-01", status: "Delivered",
    items: [{ title: "The Thursday Murder Club", qty: 3, price: 379 }],
    total: 1137, paymentId: "pay_test_006", city: "Hyderabad",
  },
];

// ── Customers (CRM) ────────────────────────────────────────────────────────
export const CUSTOMERS = [
  { id: "C001", name: "Priya Sharma", email: "priya.s@email.com", city: "Mumbai", orders: 8, ltv: 4240, segment: "VIP", subscribed: true, joinDate: "2024-03-10" },
  { id: "C002", name: "Arjun Mehta", email: "arjun.m@email.com", city: "Pune", orders: 3, ltv: 1540, segment: "Regular", subscribed: false, joinDate: "2024-07-22" },
  { id: "C003", name: "Sneha Patel", email: "sneha.p@email.com", city: "Bangalore", orders: 5, ltv: 2380, segment: "Regular", subscribed: true, joinDate: "2024-05-14" },
  { id: "C004", name: "Rahul Gupta", email: "rahul.g@email.com", city: "Delhi", orders: 12, ltv: 6180, segment: "VIP", subscribed: true, joinDate: "2024-01-08" },
  { id: "C005", name: "Kavya Nair", email: "kavya.n@email.com", city: "Chennai", orders: 1, ltv: 499, segment: "New", subscribed: false, joinDate: "2025-01-28" },
  { id: "C006", name: "Vikram Singh", email: "vikram.s@email.com", city: "Hyderabad", orders: 7, ltv: 3890, segment: "Regular", subscribed: true, joinDate: "2024-04-19" },
  { id: "C007", name: "Ananya Roy", email: "ananya.r@email.com", city: "Kolkata", orders: 2, ltv: 980, segment: "New", subscribed: false, joinDate: "2024-11-30" },
  { id: "C008", name: "Rohan Joshi", email: "rohan.j@email.com", city: "Mumbai", orders: 15, ltv: 7650, segment: "VIP", subscribed: true, joinDate: "2023-12-01" },
];

// ── Analytics / chart data ─────────────────────────────────────────────────
export const MONTHLY_REVENUE = [
  { month: "Aug", revenue: 18400, orders: 52 },
  { month: "Sep", revenue: 22100, orders: 64 },
  { month: "Oct", revenue: 19800, orders: 57 },
  { month: "Nov", revenue: 31200, orders: 88 },
  { month: "Dec", revenue: 44600, orders: 124 },
  { month: "Jan", revenue: 38900, orders: 108 },
];

export const GENRE_SALES = [
  { genre: "Literary Fiction", sales: 1240 },
  { genre: "Self-Help", sales: 2310 },
  { genre: "Fantasy", sales: 890 },
  { genre: "Sci-Fi", sales: 1100 },
  { genre: "Cozy Mystery", sales: 720 },
  { genre: "Memoir", sales: 640 },
  { genre: "Finance", sales: 980 },
];

export const THREATS = [
  { id: "T001", threat: "SQL Injection Attack", category: "Web Security", likelihood: "High", impact: "Critical", control: "Parameterized queries + WAF", status: "Mitigated" },
  { id: "T002", threat: "Payment Data Breach", category: "PCI DSS", likelihood: "Medium", impact: "Critical", control: "PCI Level 1 compliance, tokenization", status: "Active Control" },
  { id: "T003", threat: "DDoS Attack", category: "Availability", likelihood: "Medium", impact: "High", control: "Cloudflare rate limiting", status: "Mitigated" },
  { id: "T004", threat: "eBook Piracy (Telegram)", category: "IP Theft", likelihood: "High", impact: "Medium", control: "DRM + blockchain rights mgmt", status: "Monitoring" },
  { id: "T005", threat: "Account Takeover", category: "Auth Security", likelihood: "Medium", impact: "High", control: "MFA + session expiry", status: "Active Control" },
  { id: "T006", threat: "Supply Chain Disruption", category: "Operations", likelihood: "Low", impact: "High", control: "Multi-supplier agreements", status: "Mitigated" },
  { id: "T007", threat: "Phishing Emails to Customers", category: "Social Engineering", likelihood: "Medium", impact: "Medium", control: "SPF/DKIM/DMARC + awareness", status: "Monitoring" },
];
