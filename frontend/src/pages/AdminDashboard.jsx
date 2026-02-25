import React, { useEffect, useState } from "react";
const BACKEND_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const [pendingStaff, setPendingStaff] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [reports, setReports] = useState({ by_product: {}, by_category: {} });
  const [stats, setStats] = useState({ total_products: 0, total_sales: 0, total_revenue: 0, low_stock: 0 });
  const [staffReport, setStaffReport] = useState([]);
  const [expandedStaff, setExpandedStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: "", category: "", price: "", quantity: "",
    description: "", img: "", restock: 5, status: "active", addedby: 1
  });

  const token = localStorage.getItem("token");
  const lowStockProducts = products.filter(p => p.quantity <= p.restock);

  useEffect(() => {
    fetchPendingStaff();
    fetchStaffList();
    fetchProducts();
    fetchStats();
    fetchReports();
    fetchCategories();
    fetchStaffReport();
  }, []);

  const fetchPendingStaff = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/users/unverified`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (res.ok) {
        const data = await res.json();
        setPendingStaff(data);
      }
    } catch (error) {
      console.error("Error fetching pending staff:", error);
    }
  };

  const fetchStaffList = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/users/staff`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (res.ok) {
        const data = await res.json();
        setStaffList(data);
      }
    } catch (error) {
      console.error("Error fetching staff list:", error);
    }
  };

  const approveStaff = async (id) => {
    try {
      await fetch(`${BACKEND_URL}/users/verify/${id}`, { 
        method: "PUT", 
        headers: { Authorization: `Bearer ${token}` } 
      });
      fetchPendingStaff();
      fetchStaffList();
    } catch (error) {
      console.error("Error approving staff:", error);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm("Remove this staff member?")) return;
    try {
      await fetch(`${BACKEND_URL}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStaffList();
      fetchStaffReport();
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) { 
        const data = await res.json(); 
        setProducts(data.items || []); 
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/stats`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/reports`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchStaffReport = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/reports/staff`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (res.ok) {
        const data = await res.json();
        setStaffReport(data);
      }
    } catch (error) {
      console.error("Error fetching staff report:", error);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct ? `${BACKEND_URL}/products/${editingProduct.id}` : `${BACKEND_URL}/products`;
      const method = editingProduct ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          ...formData, 
          price: parseFloat(formData.price), 
          quantity: parseInt(formData.quantity),
          restock: parseInt(formData.restock)
        }),
      });
      
      if (res.ok) {
        alert(editingProduct ? "Product updated!" : "Product added!");
        setShowForm(false); 
        setEditingProduct(null);
        setFormData({ 
          name: "", category: "", price: "", quantity: "", 
          description: "", img: "", restock: 5, status: "active", addedby: 1 
        });
        fetchProducts(); 
        fetchStats();
      } else {
        const errorData = await res.json();
        alert(errorData.detail || "Something went wrong");
      }
    } catch (error) {
      alert("Network error occurred");
    }
  };

  const handleEdit = (product) => { 
    setEditingProduct(product); 
    setFormData(product); 
    setShowForm(true); 
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await fetch(`${BACKEND_URL}/products/${id}`, { 
        method: "DELETE", 
        headers: { Authorization: `Bearer ${token}` } 
      });
      fetchProducts(); 
      fetchStats();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newCategory }),
      });
      if (res.ok) { 
        setNewCategory(""); 
        fetchCategories(); 
      } else { 
        const data = await res.json(); 
        alert(data.detail); 
      }
    } catch (error) {
      alert("Network error occurred");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await fetch(`${BACKEND_URL}/categories/${id}`, { 
        method: "DELETE", 
        headers: { Authorization: `Bearer ${token}` } 
      });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Helper function to safely format revenue
  const formatRevenue = (revenue) => {
    if (revenue === undefined || revenue === null) return "₹0.00";
    return `₹${Number(revenue).toFixed(2)}`;
  };

  return (
    <div className="page">
      <div className="container mx-auto px-4">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 pt-6">
          {[
            { title: "Total Products", value: stats.total_products || 0 },
            { title: "Low Stock Items", value: stats.low_stock || 0 },
            { title: "Items Sold", value: stats.total_sales || 0 },
            { title: "Total Revenue", value: formatRevenue(stats.total_revenue) },
          ].map(({ title, value }) => (
            <div key={title} className="bg-white p-6 rounded-2xl border border-slate-200">
              <p className="text-sm mb-1 text-slate-500">{title}</p>
              <p className="text-2xl font-bold text-teal-700">{value}</p>
            </div>
          ))}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Low Stock Alerts</h2>
          {lowStockProducts.length === 0 ? (
            <p className="text-slate-500">All items are well stocked.</p>
          ) : (
            lowStockProducts.map(p => (
              <div key={p.id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                <p className="text-slate-800">{p.name}</p>
                <span className="text-sm font-medium text-red-500">{p.quantity} left</span>
              </div>
            ))
          )}
        </div>

        {/* Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {[
            { title: "Revenue by Category", data: reports.by_category || {} },
            { title: "Revenue by Product", data: reports.by_product || {} },
          ].map(({ title, data }) => (
            <div key={title} className="bg-white p-6 rounded-2xl border border-slate-200">
              <h2 className="text-lg font-semibold mb-4 text-slate-800">{title}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500">
                      <th className="text-left px-4 py-3">Name</th>
                      <th className="text-left px-4 py-3">Sold</th>
                      <th className="text-left px-4 py-3">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(data).map(([name, d]) => (
                      <tr key={name} className="border-t border-slate-100">
                        <td className="px-4 py-3 capitalize">{name}</td>
                        <td className="px-4 py-3">{d.quantity || 0}</td>
                        <td className="px-4 py-3">{formatRevenue(d.revenue)}</td>
                      </tr>
                    ))}
                    {Object.keys(data).length === 0 && (
                      <tr>
                        <td colSpan={3} className="text-center py-6 text-slate-400">
                          No sales yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Staff Sales Report */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Staff Sales Report</h2>
          {staffReport.length === 0 ? (
            <p className="text-slate-500">No staff sales data yet.</p>
          ) : (
            staffReport.map((s) => (
              <div key={s.email} className="mb-2">
                <div
                  className="flex justify-between items-center py-3 px-2 rounded-lg cursor-pointer hover:bg-slate-50 border-b border-slate-100"
                  onClick={() => setExpandedStaff(expandedStaff === s.email ? null : s.email)}
                >
                  <div>
                    <p className="font-medium text-slate-800">{s.staff_name}</p>
                    <p className="text-xs text-slate-500">{s.email}</p>
                  </div>
                  <div className="flex gap-6 items-center">
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Items Sold</p>
                      <p className="font-semibold text-teal-700">{s.total_items_sold || 0}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Revenue</p>
                      <p className="font-semibold text-teal-700">{formatRevenue(s.total_revenue)}</p>
                    </div>
                    <span className="text-slate-400 text-sm">{expandedStaff === s.email ? '▲' : '▼'}</span>
                  </div>
                </div>

                {expandedStaff === s.email && (
                  <div className="mt-2 ml-4 mb-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Products Sold</p>
                    {!s.products_sold || Object.keys(s.products_sold).length === 0 ? (
                      <p className="text-sm text-slate-400">No sales yet</p>
                    ) : (
                      Object.entries(s.products_sold).map(([product, qty]) => (
                        <div key={product} className="flex justify-between py-1.5 border-b border-slate-200 last:border-0">
                          <span className="text-sm text-slate-700">{product}</span>
                          <span className="text-sm font-medium text-teal-700">{qty} units</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Products Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-800">Products</h2>
          <button 
            onClick={() => { 
              setShowForm(!showForm); 
              setEditingProduct(null);
              if (!showForm) {
                setFormData({ 
                  name: "", category: "", price: "", quantity: "", 
                  description: "", img: "", restock: 5, status: "active", addedby: 1 
                });
              }
            }}
            className="px-4 py-2 rounded-lg text-white text-sm font-medium bg-teal-700 hover:bg-teal-800"
          >
            {showForm ? "Cancel" : "+ Add Product"}
          </button>
        </div>

        {/* Product Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 mb-6">
            <h3 className="text-lg font-semibold mb-4">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Name", name: "name", type: "text" },
                { label: "Price", name: "price", type: "number", step: "0.01" },
                { label: "Quantity", name: "quantity", type: "number" },
                { label: "Restock Level", name: "restock", type: "number" },
                { label: "Image URL", name: "img", type: "text" },
                { label: "Supplier ID", name: "addedby", type: "number" },
              ].map(({ label, name, type = "text", step }) => (
                <div key={name}>
                  <label className="block text-sm font-medium mb-1 text-slate-700">{label}</label>
                  <input 
                    type={type} 
                    name={name} 
                    value={formData[name]} 
                    onChange={handleChange} 
                    required={name !== "img" && name !== "description"}
                    step={step}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none border border-slate-200 bg-slate-50 focus:border-teal-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Category</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  required
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none border border-slate-200 bg-slate-50 focus:border-teal-500"
                >
                  <option value="">-- Select category --</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-slate-700">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none border border-slate-200 bg-slate-50 focus:border-teal-500"
                />
              </div>
              <div className="md:col-span-2">
                <button 
                  type="submit" 
                  className="w-full py-2.5 rounded-lg text-white font-semibold text-sm bg-teal-700 hover:bg-teal-800"
                >
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500">
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">Qty</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3">{p.category}</td>
                    <td className="px-4 py-3">₹{p.price}</td>
                    <td className="px-4 py-3">{p.quantity}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(p)} 
                          className="px-3 py-1 rounded-lg text-white text-xs font-medium bg-amber-500 hover:bg-amber-600"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)} 
                          className="px-3 py-1 rounded-lg text-white text-xs font-medium bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-slate-400">
                      No products yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Categories</h2>
          <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3 mb-6">
            <input 
              type="text" 
              value={newCategory} 
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name" 
              required
              className="px-3 py-2 rounded-lg text-sm outline-none sm:w-64 border border-slate-200 bg-slate-50 focus:border-teal-500"
            />
            <button 
              type="submit" 
              className="px-4 py-2 rounded-lg text-white text-sm font-medium bg-teal-700 hover:bg-teal-800"
            >
              + Add
            </button>
          </form>
          {categories.length === 0 ? (
            <p className="text-slate-400">No categories yet.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {categories.map(c => (
                <div key={c.id} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-slate-50 border border-slate-200">
                  <span className="text-slate-700">{c.name}</span>
                  <button 
                    onClick={() => handleDeleteCategory(c.id)} 
                    className="font-bold text-red-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Staff */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Pending Staff Approval</h2>
          {pendingStaff.length === 0 ? (
            <p className="text-slate-500">No staff pending approval.</p>
          ) : (
            pendingStaff.map(staff => (
              <div key={staff.id} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                <div>
                  <p className="font-medium text-slate-800">{staff.first_name} {staff.last_name}</p>
                  <p className="text-sm text-slate-500">{staff.email_id}</p>
                </div>
                <button 
                  onClick={() => approveStaff(staff.id)}
                  className="px-4 py-1.5 rounded-lg text-white text-sm font-medium bg-green-500 hover:bg-green-600"
                >
                  Approve
                </button>
              </div>
            ))
          )}
        </div>

        {/* All Staff */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">All Staff</h2>
          {staffList.length === 0 ? (
            <p className="text-slate-500">No staff members yet.</p>
          ) : (
            staffList.map(staff => (
              <div key={staff.id} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                <div>
                  <p className="font-medium text-slate-800">{staff.first_name} {staff.last_name}</p>
                  <p className="text-sm text-slate-500">{staff.email_id}</p>
                  <span className={`text-xs font-medium ${staff.verified ? 'text-green-600' : 'text-amber-500'}`}>
                    {staff.verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <button 
                  onClick={() => handleDeleteStaff(staff.id)}
                  className="px-4 py-1.5 rounded-lg text-white text-sm font-medium bg-red-500 hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;