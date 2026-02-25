import { Package, UserCircle } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false)
  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = "/login"
  }

  return (
    <nav className="navbar">
      <div className="nav-inner container">
        <a href="/" className="brand">
          <Package size={26} />
          <span className="brand-title">StockFlow</span>
        </a>

        <div className="nav-actions">
          <a href="/about" className="nav-link">About</a>

          {token ? (
            <div className="user-wrap">
              <UserCircle size={34} className="user-icon" onClick={() => setShowDropdown(!showDropdown)} />
              {showDropdown && (
                <div className="dropdown">
                  <p className="muted">Logged in as</p>
                  <p className="role">{role}</p>
                  <button onClick={handleLogout} className="btn btn-danger">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <a href="/register" className="btn btn-primary">Register</a>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar