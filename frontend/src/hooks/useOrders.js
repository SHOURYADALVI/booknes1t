import { useCallback, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Fetch orders from backend
  const fetchOrders = useCallback(async () => {
    if (!user) {
      console.log("No user, skipping fetch");
      setOrders([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching orders for user:", user.email);
      const res = await fetch("/api/orders/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Send cookies
      });

      console.log("Orders fetch response status:", res.status);

      if (!res.ok) {
        throw new Error(
          res.status === 401
            ? "Unauthorized - please login"
            : `Error: ${res.status}`
        );
      }

      const data = await res.json();
      console.log("Orders fetched:", data.orders?.length || 0, "orders");
      setOrders(data.orders || []);
      setLastUpdate(new Date());
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch orders on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  // Create new order
  const createOrder = useCallback(
    async (items, total, paymentId) => {
      if (!user) {
        setError("User not authenticated");
        return null;
      }

      try {
        const res = await fetch("/api/orders/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.email,
            userName: user.name || user.email,
            userEmail: user.email,
            items,
            total,
            paymentId,
          }),
        });

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }

        const data = await res.json();
        console.log("Order created by API:", data.order);
        
        // Don't rely on local state - refetch from backend
        setLastUpdate(new Date());
        
        // Small delay then fetch fresh orders
        setTimeout(() => {
          console.log("Refetching orders after creation...");
          fetchOrders();
        }, 500);
        
        return data.order;
      } catch (err) {
        console.error("Failed to create order:", err);
        setError(err.message);
        return null;
      }
    },
    [user, fetchOrders]
  );

  // Update order status (admin only)
  const updateOrderStatus = useCallback(async (orderId, newStatus, note = "") => {
    try {
      const res = await fetch("/api/orders/update-status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          orderId,
          status: newStatus,
          note,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? data.order : o))
      );
      setLastUpdate(new Date());
      return data.order;
    } catch (err) {
      console.error("Failed to update order:", err);
      setError(err.message);
      return null;
    }
  }, []);

  // Poll for order updates (for real-time sync)
  useEffect(() => {
    if (!user) return;

    // Poll every 5 seconds
    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, [user, fetchOrders]);

  return {
    orders,
    loading,
    error,
    lastUpdate,
    fetchOrders,
    createOrder,
    updateOrderStatus,
  };
}
