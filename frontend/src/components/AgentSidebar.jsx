import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/agent-sidebar.css";

function AgentSidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        navigate("/login");
    };

    return (
        <aside className="agent-sidebar">

            {/* Logo */}
            <div className="agent-sidebar-logo">

                <div className="agent-logo-icon">
                    <i className="bi bi-headset"></i>
                </div>

                <div>
                    <h2>HelpDesk</h2>
                    <span>Support Center</span>
                </div>

            </div>

            {/* Agent Label */}
            <div className="agent-sidebar-label">
                SUPPORT AGENT
            </div>

            {/* Navigation */}
            <nav className="agent-sidebar-nav">

                <NavLink
                    to="/agent-dashboard"
                    className={({ isActive }) =>
                        `agent-nav-link ${isActive ? "active" : ""}`
                    }
                >
                    <i className="bi bi-grid-1x2"></i>
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/agent/tickets"
                    className={({ isActive }) =>
                        `agent-nav-link ${isActive ? "active" : ""}`
                    }
                >
                    <i className="bi bi-ticket-perforated"></i>
                    <span>All Tickets</span>
                </NavLink>

                <NavLink
                    to="/agent/my-tickets"
                    className={({ isActive }) =>
                        `agent-nav-link ${isActive ? "active" : ""}`
                    }
                >
                    <i className="bi bi-person-check"></i>
                    <span>My Tickets</span>
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `agent-nav-link ${isActive ? "active" : ""}`
                    }
                >
                    <i className="bi bi-person-circle"></i>
                    <span>My Profile</span>
                </NavLink>

            </nav>

            {/* Bottom */}
            <div className="agent-sidebar-bottom">

                <button
                    className="agent-logout-btn"
                    onClick={handleLogout}
                >
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Logout</span>
                </button>

            </div>

        </aside>
    );
}

export default AgentSidebar;