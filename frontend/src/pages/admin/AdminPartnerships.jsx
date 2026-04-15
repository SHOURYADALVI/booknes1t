import { useState, useMemo } from "react";
import { Search, Plus, Edit2, Trash2, CheckCircle, Clock } from "lucide-react";
import { LIBRARY_PARTNERSHIPS } from "../../data/mockData.js";
import "./AdminPartnerships.css";

export default function AdminPartnerships() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [partnerships, setPartnerships] = useState(LIBRARY_PARTNERSHIPS);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    libraryName: "",
    city: "",
    partnershipType: "Distribution",
    bookAllocation: "",
    monthlyVolume: "",
    discountPercent: "",
    status: "Active",
    email: "",
    contactPerson: "",
  });

  const filtered = useMemo(() => {
    let result = [...partnerships];
    if (search) {
      result = result.filter(p =>
        p.libraryName.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase()) ||
        p.contactPerson.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filter !== "All") {
      result = result.filter(p => p.status === filter);
    }
    return result;
  }, [search, filter, partnerships]);

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      libraryName: "",
      city: "",
      partnershipType: "Distribution",
      bookAllocation: "",
      monthlyVolume: "",
      discountPercent: "",
      status: "Active",
      email: "",
      contactPerson: "",
    });
    setShowForm(true);
  };

  const handleEdit = (partnership) => {
    setEditingId(partnership.id);
    setFormData({
      libraryName: partnership.libraryName,
      city: partnership.city,
      partnershipType: partnership.partnershipType,
      bookAllocation: partnership.bookAllocation,
      monthlyVolume: partnership.monthlyVolume,
      discountPercent: partnership.discountPercent,
      status: partnership.status,
      email: partnership.email,
      contactPerson: partnership.contactPerson,
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Edit existing
      setPartnerships(prev =>
        prev.map(p =>
          p.id === editingId
            ? { ...p, ...formData }
            : p
        )
      );
    } else {
      // Add new
      const newPartnership = {
        id: `LP${String(partnerships.length + 1).padStart(3, "0")}`,
        ...formData,
        joinDate: new Date().toISOString().split("T")[0],
      };
      setPartnerships(prev => [...prev, newPartnership]);
    }
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this partnership?")) {
      setPartnerships(prev => prev.filter(p => p.id !== id));
    }
  };

  const stats = {
    total: partnerships.length,
    active: partnerships.filter(p => p.status === "Active").length,
    pending: partnerships.filter(p => p.status === "Pending").length,
    totalAllocation: partnerships.reduce((sum, p) => sum + parseInt(p.bookAllocation), 0),
  };

  return (
    <div className="admin-partnerships">
      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Partnerships</div>
        </div>
        <div className="stat-card stat-active">
          <div className="stat-number">{stats.active}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalAllocation.toLocaleString()}</div>
          <div className="stat-label">Total Book Allocation</div>
        </div>
      </div>

      {/* HEADER */}
      <div className="partnerships-header">
        <div className="title-section">
          <h2>Library Partnerships</h2>
          <p>Manage and track partnerships with libraries and book distribution networks</p>
        </div>
        <button className="btn-primary" onClick={handleAddNew}>
          <Plus size={18} /> Add Partnership
        </button>
      </div>

      {/* SEARCH & FILTER */}
      <div className="search-filter">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by library name, city, or contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          {["All", "Active", "Pending"].map(status => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? "active" : ""}`}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? "Edit Partnership" : "Add New Partnership"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Library Name"
                  value={formData.libraryName}
                  onChange={(e) => setFormData({ ...formData, libraryName: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Contact Person"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <select
                  value={formData.partnershipType}
                  onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
                >
                  <option>Distribution</option>
                  <option>Exclusive Distributor</option>
                  <option>Bulk Supply</option>
                  <option>Revenue Share</option>
                </select>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div className="form-row">
                <input
                  type="number"
                  placeholder="Book Allocation"
                  value={formData.bookAllocation}
                  onChange={(e) => setFormData({ ...formData, bookAllocation: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Monthly Volume (e.g., 15-20)"
                  value={formData.monthlyVolume}
                  onChange={(e) => setFormData({ ...formData, monthlyVolume: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="number"
                  placeholder="Discount %"
                  value={formData.discountPercent}
                  onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                  min="0"
                  max="100"
                  required
                />
              </div>
              <div className="form-buttons">
                <button type="submit" className="btn-primary">
                  {editingId ? "Update" : "Add"} Partnership
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PARTNERSHIPS TABLE */}
      <div className="partnerships-table">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>No partnerships found</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Library Name</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Type</th>
                <th>Books</th>
                <th>Monthly</th>
                <th>Discount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(partnership => (
                <tr key={partnership.id}>
                  <td>
                    <div className="cell-library">
                      <div className="lib-icon">{partnership.libraryName[0]}</div>
                      <div>
                        <div className="lib-name">{partnership.libraryName}</div>
                        <div className="lib-type">{partnership.partnershipType}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div>{partnership.contactPerson}</div>
                      <div className="email">{partnership.email}</div>
                    </div>
                  </td>
                  <td>{partnership.city}</td>
                  <td>{partnership.partnershipType}</td>
                  <td className="books-col">{partnership.bookAllocation.toLocaleString()}</td>
                  <td>{partnership.monthlyVolume}</td>
                  <td><span className="discount-badge">{partnership.discountPercent}%</span></td>
                  <td>
                    <span className={`status-badge status-${partnership.status.toLowerCase()}`}>
                      {partnership.status === "Active" ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {partnership.status}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="action-btn edit"
                        onClick={() => handleEdit(partnership)}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(partnership.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
