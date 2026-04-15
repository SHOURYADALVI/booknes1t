import { useNotification } from "../context/NotificationContext";
import { X, AlertCircle, CheckCircle, Info } from "lucide-react";
import "./Notifications.css";

export default function NotificationCenter() {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={18} />;
      case "error":
        return <AlertCircle size={18} />;
      case "info":
      default:
        return <Info size={18} />;
    }
  };

  return (
    <div className="notification-center">
      {notifications.map((notif) => (
        <div key={notif.id} className={`notification notification-${notif.type}`}>
          <div className="notification-icon">{getIcon(notif.type)}</div>
          <div className="notification-content">{notif.message}</div>
          <button
            className="notification-close"
            onClick={() => removeNotification(notif.id)}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
