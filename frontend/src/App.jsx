import { Routes, Route, BrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import AboutUs from "./pages/AboutUs";
import LogIn from "./pages/LogIn";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <main className="main container">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/staff/dashboard" element={<StaffDashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
