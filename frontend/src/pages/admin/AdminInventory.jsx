import { useState } from "react";
import { BOOKS } from "../../data/mockData";
import { useToast } from "../../hooks/useToast";
import Toast from "../../components/Toast";
import { AlertTriangle, Package } from "lucide-react";

export default function AdminInventory() {
  const [inventory, setInventory] = useState(BOOKS.map(b => ({ ...b })));
  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState("");
  const { toast, showToast } = useToast();

  const updateStock = (id) => {
    const val = parseInt(editVal);
    if (isNaN(val) || val < 0) { showToast("Enter a valid stock number", "error"); return; }
    setInventory(prev => prev.map(b => b.id === id ? { ...b, stock: val } : b));
    setEditId(null);
    setEditVal("");
    showToast("Stock updated successfully");
  };

  const totalStock = inventory.reduce((s, b) => s + b.stock, 0);
  const lowStock = inventory.filter(b => b.stock < 10).length;
  const outOfStock = inventory.filter(b => b.stock === 0).length;

  return (
    <>
      <Toast toast={toast} />
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Total Units in Stock</div>
          <div className="stat-value">{totalStock.toLocaleString()}</div>
        </div>
        <div className="stat-card" style={{ borderTop: lowStock > 0 ? "3px solid var(--amber)" : undefined }}>
          <div className="stat-label">Low Stock Alerts (&lt;10 units)</div>
          <div className="stat-value" style={{ color: lowStock > 0 ? "var(--amber)" : undefined }}>{lowStock}</div>
        </div>
        <div className="stat-card" style={{ borderTop: outOfStock > 0 ? "3px solid var(--error)" : undefined }}>
          <div className="stat-label">Out of Stock</div>
          <div className="stat-value" style={{ color: outOfStock > 0 ? "var(--error)" : undefined }}>{outOfStock}</div>
        </div>
      </div>

      {lowStock > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fef3cd", border: "1px solid #fde68a", borderRadius: "var(--radius)", padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#856404" }}>
          <AlertTriangle size={16} /> {lowStock} book(s) are running low. Consider restocking.
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Book</th><th>Genre</th><th>Price</th><th>Stock</th><th>Status</th><th>Update Stock</th></tr>
            </thead>
            <tbody>
              {inventory.map(book => (
                <tr key={book.id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{book.title}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>by {book.author}</div>
                  </td>
                  <td><span className="badge badge-gray">{book.genre}</span></td>
                  <td style={{ fontWeight: 600 }}>₹{book.price}</td>
                  <td style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: book.stock < 10 ? (book.stock === 0 ? "var(--error)" : "var(--amber)") : "var(--ink)" }}>
                    {book.stock}
                  </td>
                  <td>
                    {book.stock === 0
                      ? <span className="badge badge-red">Out of Stock</span>
                      : book.stock < 10
                      ? <span className="badge badge-amber">Low Stock</span>
                      : <span className="badge badge-green">In Stock</span>
                    }
                  </td>
                  <td>
                    {editId === book.id ? (
                      <div style={{ display: "flex", gap: 6 }}>
                        <input
                          className="form-input"
                          style={{ width: 80, padding: "5px 8px", fontSize: 13 }}
                          value={editVal}
                          onChange={e => setEditVal(e.target.value)}
                          type="number"
                          min="0"
                          autoFocus
                          onKeyDown={e => e.key === "Enter" && updateStock(book.id)}
                        />
                        <button className="btn btn-primary btn-sm" onClick={() => updateStock(book.id)}>Save</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditId(null)}>Cancel</button>
                      </div>
                    ) : (
                      <button className="btn btn-secondary btn-sm" onClick={() => { setEditId(book.id); setEditVal(String(book.stock)); }}>
                        <Package size={12} /> Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
