import { useCart } from "../context/CartContext";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./CartPage.css";

export default function CartPage() {
  const { items, total, removeItem, updateQty, clearCart, addOrder } = useCart();
  const { toast, showToast } = useToast();
  const [paying, setPaying] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [formError, setFormError] = useState("");

  const shipping = total >= 499 ? 0 : 49;
  const grandTotal = total + shipping;

  const validateForm = () => {
    if (!customerName.trim()) return "Please enter your name";
    if (!customerEmail.trim() || !customerEmail.includes("@")) return "Please enter a valid email";
    if (!customerPhone.trim() || customerPhone.length < 10) return "Please enter a valid 10-digit phone number";
    return null;
  };

  const handlePayment = async () => {
    const error = validateForm();
    if (error) { setFormError(error); return; }
    setFormError("");
    setPaying(true);

    try {
      // 1. Create Razorpay order via our API
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: grandTotal, currency: "INR", receipt: `rcpt_${Date.now()}` }),
      });
      const orderData = await res.json();

      if (!res.ok) throw new Error(orderData.error || "Order creation failed");

      // 2. Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "BookNest",
        description: `${items.length} book(s) — Order ${orderData.receipt}`,
        order_id: orderData.orderId,
        prefill: { name: customerName, email: customerEmail, contact: customerPhone },
        theme: { color: "#c8860a" },
        handler: async (response) => {
          try {
            // 3. Verify payment
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              // 4. Add order to local state
              const newOrder = {
                id: `ORD-${Date.now()}`,
                customer: customerName,
                email: customerEmail,
                date: new Date().toISOString().split("T")[0],
                status: "Processing",
                items: items.map(i => ({ title: i.title, qty: i.qty, price: i.price })),
                total: grandTotal,
                paymentId: response.razorpay_payment_id,
                city: "Online",
              };
              addOrder(newOrder);
              clearCart();
              showToast(`Payment successful! Order ${newOrder.id} confirmed.`);
            } else {
              showToast("Payment verification failed. Please contact support.", "error");
            }
          } catch {
            showToast("Verification error. Please contact support.", "error");
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => { setPaying(false); showToast("Payment cancelled", "error"); }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      showToast(err.message || "Payment failed. Try again.", "error");
      setPaying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container">
        <Toast toast={toast} />
        <div className="empty-state" style={{ paddingTop: 80 }}>
          <ShoppingBag size={48} color="var(--border)" />
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added any books yet.</p>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: 20 }}>Browse Books</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toast toast={toast} />
      <div className="cart-page">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">Your Cart</h1>
            <p className="page-subtitle">{items.length} item(s) ready for checkout</p>
          </div>

          <div className="cart-layout">
            {/* Items */}
            <div className="cart-items">
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.cover}
                    alt={item.title}
                    onError={e => { e.target.src = `https://placehold.co/70x100/f0e8d8/3d2b1f?text=Book`; }}
                  />
                  <div className="cart-item-info">
                    <div className="cart-item-title">{item.title}</div>
                    <div className="cart-item-author">by {item.author}</div>
                    <div className="cart-item-genre badge badge-gray" style={{ marginTop: 4 }}>{item.genre}</div>
                  </div>
                  <div className="cart-item-controls">
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.qty - 1)}><Minus size={12} /></button>
                      <span className="qty-num">{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.id, item.qty + 1)}><Plus size={12} /></button>
                    </div>
                    <div className="cart-item-price">₹{(item.price * item.qty).toLocaleString()}</div>
                    <button className="remove-btn" onClick={() => removeItem(item.id)}><Trash2 size={15} /></button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary + Checkout */}
            <div className="cart-summary">
              <div className="card">
                <h3 className="summary-title">Order Summary</h3>

                <div className="summary-lines">
                  <div className="summary-line"><span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span><span>₹{total.toLocaleString()}</span></div>
                  <div className="summary-line"><span>Delivery</span><span className={shipping === 0 ? "free-text" : ""}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span></div>
                  {shipping === 0 && <div className="free-delivery-note">🎉 You qualify for free delivery!</div>}
                  <div className="summary-line summary-total"><span>Total</span><span>₹{grandTotal.toLocaleString()}</span></div>
                </div>

                {/* Customer Details */}
                <div className="customer-form">
                  <h4>Delivery Details</h4>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" placeholder="Rohit Bhanushali" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" placeholder="you@email.com" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" placeholder="9XXXXXXXXX" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} maxLength={10} />
                  </div>
                  {formError && <div className="form-error">{formError}</div>}
                </div>

                <button
                  className="btn btn-primary checkout-btn"
                  onClick={handlePayment}
                  disabled={paying}
                >
                  {paying ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Processing...</> : <>Pay ₹{grandTotal.toLocaleString()} <ArrowRight size={16} /></>}
                </button>

                <div className="security-note">
                  <Shield size={13} /> Secured by Razorpay · PCI DSS Compliant
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
