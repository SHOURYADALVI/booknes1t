import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../hooks/useOrders";
import { useToast } from "../hooks/useToast";
import { usePoints } from "../hooks/usePoints";
import Toast from "../components/Toast";
import PointsRedemption from "../components/PointsRedemption";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./CartPage.css";

export default function CartPage() {
  const { items, total, removeItem, updateQty, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder: createRemoteOrder } = useOrders();
  const { toast, showToast } = useToast();
  const { balance, pointsConfig, redeemPoints, fetchPointsBalance } = usePoints();
  
  const [paying, setPaying] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [formError, setFormError] = useState("");
  const [showPointsRedemption, setShowPointsRedemption] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [redeemedPoints, setRedeemedPoints] = useState(0);

  // Fetch points balance when component loads or user changes
  useEffect(() => {
    if (user) {
      fetchPointsBalance();
    }
  }, [user, fetchPointsBalance]);

  const shipping = total >= 499 ? 0 : 49;
  const grandTotal = Math.max(0, total + shipping - appliedDiscount);

  const validateForm = () => {
    if (!customerName.trim()) return "Please enter your name";
    if (!customerEmail.trim() || !customerEmail.includes("@")) return "Please enter a valid email";
    if (!customerPhone.trim() || customerPhone.length < 10) return "Please enter a valid 10-digit phone number";
    return null;
  };

  const handleApplyPoints = async (pointsToUse, discountAmount) => {
    try {
      await redeemPoints(pointsToUse);
      setAppliedDiscount(discountAmount);
      setRedeemedPoints(pointsToUse);
      setShowPointsRedemption(false);
      showToast(`✅ Applied ₹${discountAmount.toFixed(2)} discount using ${pointsToUse} points!`);
    } catch (err) {
      showToast(err.message || "Failed to apply points", "error");
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(0);
    setRedeemedPoints(0);
    showToast("Discount removed. You can apply points again.", "info");
  };

  const handlePayment = async () => {
    const error = validateForm();
    if (error) { setFormError(error); return; }
    setFormError("");
    setPaying(true);

    try {
      // 1. Prepare order items
      const orderItems = items.map(i => ({
        id: i.id,
        title: i.title,
        price: i.price,
        qty: i.qty,
      }));

      // 2. Create Razorpay order
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: grandTotal, currency: "INR", receipt: `rcpt_${Date.now()}` }),
      });
      const orderData = await res.json();

      if (!res.ok) {
        throw new Error(orderData.error || "Failed to create Razorpay order");
      }

      // 3. Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "BookNest",
        description: `${orderItems.length} book(s)`,
        order_id: orderData.orderId,
        prefill: { name: customerName, email: customerEmail, contact: customerPhone },
        theme: { color: "#c8860a" },
        handler: async (response) => {
          try {
            // Verify payment
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
              // Payment verified - NOW create the order
              const savedOrder = await createRemoteOrder(
                orderItems,
                grandTotal,
                response.razorpay_payment_id
              );

              if (savedOrder) {
                clearCart();
                showToast(`✅ Payment successful! Order ${savedOrder.id} created. Check "My Orders".`);
              } else {
                throw new Error("Failed to create order after payment");
              }
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            showToast("Payment verification failed. Please try again.", "error");
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => { 
            setPaying(false);
            showToast("Payment cancelled. Order not created.", "info");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      showToast(err.message || "Payment setup failed. Try again.", "error");
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
                  {appliedDiscount > 0 && (
                    <div className="summary-line discount">
                      <span>Points Discount</span>
                      <span className="discount-amount">-₹{appliedDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="summary-line summary-total"><span>Total</span><span>₹{grandTotal.toLocaleString()}</span></div>
                </div>

                {/* Points Redemption Section */}
                {!appliedDiscount && balance > 0 && (
                  <div className="points-section">
                    <button 
                      className="btn-toggle-points"
                      onClick={() => setShowPointsRedemption(!showPointsRedemption)}
                    >
                      {showPointsRedemption ? "Hide Points" : `💎 Use ${balance} Points (Worth ₹${((balance || 0) * 0.5).toFixed(2)})`}
                    </button>
                  </div>
                )}

                {appliedDiscount > 0 && (
                  <div className="applied-discount-banner">
                    <div className="discount-info">
                      <span className="check-mark">✓</span>
                      <div>
                        <div className="discount-label">Points Applied!</div>
                        <div className="discount-detail">{redeemedPoints} points redeemed for ₹{appliedDiscount.toFixed(2)} discount</div>
                      </div>
                    </div>
                    <button className="remove-discount" onClick={handleRemoveDiscount}>Remove</button>
                  </div>
                )}

                {showPointsRedemption && !appliedDiscount && (
                  <PointsRedemption
                    availablePoints={balance || 0}
                    pointsConfig={pointsConfig}
                    onRedeem={handleApplyPoints}
                    onCancel={() => setShowPointsRedemption(false)}
                  />
                )}
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
