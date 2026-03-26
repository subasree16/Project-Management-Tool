import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function AppShell() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("pm_tool_theme") === "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("pm_tool_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div>
            <div className="brand-mark">FlowPilot</div>
            <p className="sidebar-copy">
              Track projects, deadlines, and execution from one workspace.
            </p>
          </div>

          <div className="sidebar-highlight">
            <span className="sidebar-label">Today</span>
            <strong>{todayLabel}</strong>
            <p>Use the dashboard for quick monitoring and the projects area for delivery work.</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end className="nav-link">
            <span>Dashboard</span>
            <small>Overview and signals</small>
          </NavLink>
          <NavLink to="/projects" className="nav-link">
            <span>Projects</span>
            <small>Manage scope and tasks</small>
          </NavLink>
        </nav>

        <div className="sidebar-insights">
          <div className="insight-card">
            <span className="sidebar-label">Workspace Pulse</span>
            <strong>Keep active work current</strong>
            <p>Update task status daily so project progress and overdue alerts remain reliable.</p>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="avatar">{user?.name?.slice(0, 1).toUpperCase()}</div>
            <div>
              <strong>{user?.name}</strong>
              <span>{user?.role}</span>
            </div>
          </div>

          <button className="ghost-button" onClick={() => setDarkMode((value) => !value)}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button className="danger-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-panel">
        <Outlet />
      </main>
    </div>
  );
}

export default AppShell;
