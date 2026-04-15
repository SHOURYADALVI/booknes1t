import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import NotificationCenter from "./components/Notifications.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import OrderBooksPage from "./pages/OrderBooksPage.jsx";
import BookDetailPage from "./pages/BookDetailPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import PointsHistoryPage from "./pages/PointsHistoryPage.jsx";
import SubscriptionsPage from "./pages/SubscriptionsPage.jsx";
import CommunityPage from "./pages/CommunityPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import CustomerTicketsPage from "./pages/CustomerTicketsPage.jsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.jsx";
import "./pages/admin/admin.css";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <BrowserRouter>
            <NotificationCenter />
            <Navbar />
            <Routes>
              <Route path="/"              element={<LandingPage />} />
              <Route path="/login"         element={<LoginPage />} />
              <Route path="/signup"        element={<SignupPage />} />
              <Route path="/shop"          element={<ShopPage />} />
              <Route path="/order-books"   element={<OrderBooksPage />} />
              <Route path="/book/:id"      element={<BookDetailPage />} />
              <Route path="/cart"          element={<CartPage />} />
              <Route path="/orders"        element={<OrdersPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/points"        element={<PointsHistoryPage />} />
              <Route path="/subscriptions" element={<SubscriptionsPage />} />
              <Route path="/community"     element={<CommunityPage />} />
              <Route path="/my-support-tickets" element={<ProtectedRoute><CustomerTicketsPage /></ProtectedRoute>} />
              <Route path="/admin"         element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
              <Route path="/admin/*"       element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}
