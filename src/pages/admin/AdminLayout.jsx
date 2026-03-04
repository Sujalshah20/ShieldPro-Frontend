import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon, Menu } from "lucide-react";
import "../../styles/admin.css";

const AdminLayout = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-layout premium-gradient min-h-screen">
      <header className="admin-header">
        <div className="admin-logo-container flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={24} className="text-white" />
          </button>
          <img src="/shieldpro_logo.svg" alt="ShieldPro Logo" className="w-10 h-10" />
          <div>
            <h2 className="m-0 leading-tight text-white">ShieldPro</h2>
            <span className="text-xs opacity-70">Admin Dashboard</span>
          </div>
        </div>

        <div className="admin-header-right">
          <div>
            <strong>Admin User</strong>
            <div style={{ fontSize: "12px" }}>Admin</div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      {/* 🔴 THIS WAS MISSING */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
