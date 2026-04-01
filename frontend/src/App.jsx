import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import ShopPage from "./pages/ShopPage";
import BookDetailPage from "./pages/BookDetailPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import AdminPage from "./pages/AdminPage";
import "./pages/admin/admin.css";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"              element={<LandingPage />} />
          <Route path="/shop"          element={<ShopPage />} />
          <Route path="/book/:id"      element={<BookDetailPage />} />
          <Route path="/cart"          element={<CartPage />} />
          <Route path="/orders"        element={<OrdersPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/admin"         element={<AdminPage />} />
          <Route path="/admin/*"       element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
