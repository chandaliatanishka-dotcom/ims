import React, { useState } from "react";
const BACKEND_URL = import.meta.env.VITE_API_URL;

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "", first_name: "", last_name: "", email_id: "", password: "", role: "staff",
  });

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${BACKEND_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (response.ok) {
      alert("Registered successfully!");
      window.location.href = "/login";
    } else {
      alert("Registration failed: " + data.detail);
    }
  };

  const fields = [
    { label: "Username", name: "username", type: "text" },
    { label: "First Name", name: "first_name", type: "text" },
    { label: "Last Name", name: "last_name", type: "text" },
    { label: "Email", name: "email_id", type: "email" },
    { label: "Password", name: "password", type: "password" },
  ];

  return (
    <div className="page">
      <div className="container flex items-center justify-center" style={{ minHeight: '70vh' }}>
        <div className="card w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-sm muted mt-1">Join StockFlow today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ label, name, type }) => (
              <div key={name}>
                <label>{label}</label>
                <input type={type} name={name} required value={formData[name]} onChange={handleChange} />
              </div>
            ))}
            <button type="submit" className="btn btn-primary w-full">Create Account</button>
          </form>

          <p className="text-center text-sm mt-6 muted">
            Already have an account? <a href="/login" className="nav-link">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;