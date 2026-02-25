import React, { useState } from "react";
const BACKEND_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${BACKEND_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "password", email: formData.email, password: formData.password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user_id", data.user_id);
      window.location.href = data.role === "admin" ? "/admin/dashboard" : "/staff/dashboard";
    } else {
      alert("Login failed: " + data.detail);
    }
  };

  return (
    <div className="page">
      <div className="container flex items-center justify-center" style={{ minHeight: '70vh' }}>
        <div className="card w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm muted mt-1">Login to your StockFlow account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
              { label: "Password", name: "password", type: "password", placeholder: "••••••••" }
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label>{label}</label>
                <input type={type} name={name} value={formData[name]} onChange={handleChange} required placeholder={placeholder} />
              </div>
            ))}
            <button type="submit" className="btn btn-primary w-full">Login</button>
          </form>

          <p className="text-center text-sm mt-6 muted">
            Don't have an account? <a href="/register" className="nav-link">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;