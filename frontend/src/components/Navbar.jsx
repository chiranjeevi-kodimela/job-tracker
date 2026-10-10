import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

const LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/companies", label: "Companies" },
  { to: "/applications", label: "Applications" },
  { to: "/interviews", label: "Interviews" },
];

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMenu = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="brand" onClick={closeMenu}>
          Job Tracker
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden="true">{open ? "✕" : "☰"}</span>
        </button>

        <nav
          id="main-nav"
          aria-label="Main"
          className={`nav-links${open ? " open" : ""}`}
        >
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/dashboard"}
              onClick={closeMenu}
            >
              {link.label}
            </NavLink>
          ))}

          <div className="nav-user">
            <NavLink to="/profile" onClick={closeMenu} className="nav-profile">
              <span className="avatar" aria-hidden="true">
                {(user?.name || "?").charAt(0).toUpperCase()}
              </span>
              <span>{user?.name || "Profile"}</span>
            </NavLink>

            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
