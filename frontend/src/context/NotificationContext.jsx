import { createContext, useContext, useState, useCallback, useEffect } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [orderStatusUpdates, setOrderStatusUpdates] = useState({});

  const addNotification = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now();
    const notif = { id, message, type, timestamp: new Date() };

    setNotifications((prev) => [...prev, notif]);

    if (duration > 0) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration);
    }

    return id;
  }, []);

  // Notify order status change
  const notifyOrderStatusChange = useCallback(
    (orderId, oldStatus, newStatus) => {
      const message = `Order ${orderId}: Status changed from ${oldStatus} → ${newStatus}`;
      const id = addNotification(message, "success", 5000);

      setOrderStatusUpdates((prev) => ({
        ...prev,
        [orderId]: { newStatus, timestamp: new Date() },
      }));

      return id;
    },
    [addNotification]
  );

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
        notifyOrderStatusChange,
        orderStatusUpdates,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};
