import { useState } from "react";
import { BarChart2, Users, ShieldCheck, Package, TrendingUp, RefreshCw, MessageCircle, Ticket, Building2, Users2 } from "lucide-react";
import AdminOverview from "./admin/AdminOverview.jsx";
import AdminInventory from "./admin/AdminInventory.jsx";
import AdminCRM from "./admin/AdminCRM.jsx";
import AdminOrders from "./admin/AdminOrders.jsx";
import AdminSecurity from "./admin/AdminSecurity.jsx";
import AdminReviews from "./admin/AdminReviews.jsx";
import AdminTicketsPage from "./admin/AdminTicketsPage.jsx";
import AdminPartnerships from "./admin/AdminPartnerships.jsx";
import AdminCommunity from "./admin/AdminCommunity.jsx";
import "./AdminPage.css";

const TABS = [
  { id: "overview", label: "Overview", icon: <TrendingUp size={15} /> },
  { id: "orders", label: "Order History", icon: <RefreshCw size={15} /> },
  { id: "reviews", label: "Customer Reviews", icon: <MessageCircle size={15} /> },
  { id: "tickets", label: "Support Tickets", icon: <Ticket size={15} /> },
  { id: "community", label: "Community", icon: <Users2 size={15} /> },
  { id: "inventory", label: "Inventory", icon: <Package size={15} /> },
  { id: "partnerships", label: "Partnerships", icon: <Building2 size={15} /> },
  { id: "crm", label: "CRM", icon: <Users size={15} /> },
  { id: "security", label: "Risk & Security", icon: <ShieldCheck size={15} /> },
];

export default function AdminPage() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">ERP · CRM · Inventory · Security — BookNest Operations Center</p>
          </div>
          <div className="badge badge-green" style={{ alignSelf: "center" }}>● Live Demo Mode</div>
        </div>

        <div className="admin-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`admin-tab ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="admin-content">
          {tab === "overview"   && <AdminOverview />}
          {tab === "orders"     && <AdminOrders />}
          {tab === "reviews"    && <AdminReviews />}
          {tab === "tickets"    && <AdminTicketsPage />}
          {tab === "community"  && <AdminCommunity />}
          {tab === "inventory"  && <AdminInventory />}
          {tab === "partnerships" && <AdminPartnerships />}
          {tab === "crm"        && <AdminCRM />}
          {tab === "security"   && <AdminSecurity />}
        </div>
      </div>
    </div>
  );
}
