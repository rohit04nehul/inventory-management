import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./App.css";
import TaglineSection from "./TaglineSection";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: "",  // New: optional ID
    name: "",
    description: "",
    price: "",
    quantity: "",
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  // Currency formatter
  const currencyFormatter = useMemo(() => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }), []);

  // Auto-dismiss messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products");
      setProducts(res.data);
      setError("");
    } catch {
      setError("Failed to fetch products");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter + sort (fixed comparator)
  const filteredProducts = useMemo(() => {
    let filtered = products;
    const q = filter.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter(
        (p) =>
          String(p.id).includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      const isNumeric = ["id", "price", "quantity"].includes(sortField);
      if (isNumeric) {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      } else {
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
        return sortDirection === "asc" 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }
    });
  }, [products, filter, sortField, sortDirection]);

  // Form change
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const resetForm = () => {
    setForm({ id: "", name: "", description: "", price: "", quantity: "" });
    setEditId(null);
  };

  // Validation
  const validateForm = () => {
    if (!form.name.trim() || !form.description.trim()) return "Name and description are required.";
    const price = Number(form.price);
    const quantity = Number(form.quantity);
    if (isNaN(price) || price < 0) return "Price must be a positive number.";
    if (isNaN(quantity) || quantity < 0) return "Quantity must be a positive integer.";
    if (form.id && (isNaN(Number(form.id)) || Number(form.id) < 1)) return "ID must be a positive integer.";
    return null;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        quantity: Number(form.quantity),
      };
      if (form.id) payload.id = Number(form.id);  // Include if filled

      if (editId) {
        await api.put(`/products/${editId}`, payload);
        setMessage("Product updated successfully");
      } else {
        await api.post("/products", payload);
        setMessage("Product created successfully");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || "Operation failed";
      setError(detail);
    }
    setLoading(false);
  };

  const handleEdit = (p) => {
    setForm({
      id: p.id,  // Show current ID on edit
      name: p.name,
      description: p.description,
      price: p.price,
      quantity: p.quantity,
    });
    setEditId(p.id);
    setMessage("");
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setLoading(true);
    setMessage("");
    setError("");
    try {
      await api.delete(`/products/${id}`);
      setMessage("Product deleted successfully");
      fetchProducts();
    } catch {
      setError("Delete failed");
    }
    setLoading(false);
  };

  const currency = (n) => currencyFormatter.format(Number(n || 0));

  return (
    <div className="app-bg">
      <header className="topbar">
        <div className="brand">
          <span className="brand-badge">📦</span>
          <h1>KAKA TRACKING</h1>
        </div>
        <button className="btn btn-light" onClick={fetchProducts} disabled={loading}>
          Refresh
        </button>
      </header>

      <div className="container">
        <div className="stats">
          <div className="chip">Total: {products.length}</div>
          <input
            type="text"
            placeholder="Search by id, name or description..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="content-grid">
          <div className="card form-card">
            <h2>{editId ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleSubmit} className="product-form">
              {!editId && (  // Show ID only on add mode
                <input
                  type="number"
                  name="id"
                  placeholder="ID (optional, for specific numbering)"
                  value={form.id}
                  onChange={handleChange}
                  min="1"
                />
              )}
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                required
                step="0.01"
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={form.quantity}
                onChange={handleChange}
                required
              />
              <div className="form-actions">
                <button className="btn" type="submit" disabled={loading}>
                  {editId ? "Update" : "Add"}
                </button>
                {editId && (
                  <button className="btn btn-secondary" type="button" onClick={resetForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
            {message && <div className="success-msg">{message}</div>}
            {error && <div className="error-msg">{error}</div>}
          </div>

          <TaglineSection />

          <div className="card list-card">
            <h2>Products</h2>
            {loading ? (
              <div className="loader">Loading...</div>
            ) : (
              <div className="scroll-x">
                <table className="product-table">
                  <thead>
                    <tr>
                      <th scope="col" onClick={() => handleSort("id")}>
                        ID {sortField === "id" && (sortDirection === "asc" ? " ↑" : " ↓")}
                      </th>
                      <th scope="col" onClick={() => handleSort("name")}>
                        Name {sortField === "name" && (sortDirection === "asc" ? " ↑" : " ↓")}
                      </th>
                      <th scope="col">Description</th>
                      <th scope="col" onClick={() => handleSort("price")}>
                        Price {sortField === "price" && (sortDirection === "asc" ? " ↑" : " ↓")}
                      </th>
                      <th scope="col" onClick={() => handleSort("quantity")}>
                        Quantity {sortField === "quantity" && (sortDirection === "asc" ? " ↑" : " ↓")}
                      </th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.name}</td>
                        <td title={p.description}>{p.description}</td>
                        <td>{currency(p.price)}</td>
                        <td>{p.quantity}</td>
                        <td>
                          <button aria-label={`Edit ${p.name}`} onClick={() => handleEdit(p)}>Edit</button>
                          <button aria-label={`Delete ${p.name}`} onClick={() => handleDelete(p.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="empty">
                          No products found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;