import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar({ role = "employee" }) {

    const navigate = useNavigate();

    // Logout operation
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
    };

    const employeeMenu = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: "bi-grid-1x2"
        },
        {
            name: "My Tickets",
            path: "/tickets",
            icon: "bi-ticket-perforated"
        },
        {
            name: "Create Ticket",
            path: "/create-ticket",
            icon: "bi-plus-square"
        },
        {
            name: "Knowledge Base",
            path: "/knowledge-base",
            icon: "bi-book"
        },
        {
            name: "Profile",
            path: "/profile",
            icon: "bi-person"
        }
    ];

    const agentMenu = [
        {
            name: "Dashboard",
            path: "/agent-dashboard",
            icon: "bi-grid-1x2"
        },
        {
            name: "All Tickets",
            path: "/tickets",
            icon: "bi-ticket-detailed"
        },
        {
            name: "My Assigned",
            path: "/assigned-tickets",
            icon: "bi-person-check"
        },
        {
            name: "Create Ticket",
            path: "/create-ticket",
            icon: "bi-plus-square"
        },
        {
            name: "Knowledge Base",
            path: "/knowledge-base",
            icon: "bi-book"
        },
        {
            name: "Reports",
            path: "/reports",
            icon: "bi-bar-chart"
        },
        {
            name: "Profile",
            path: "/profile",
            icon: "bi-person"
        }
    ];

    const adminMenu = [
        {
            name: "Dashboard",
            path: "/admin-dashboard",
            icon: "bi-grid-1x2"
        },
        {
            name: "Users",
            path: "/users",
            icon: "bi-people"
        },
        {
            name: "Departments",
            path: "/departments",
            icon: "bi-building"
        },
        {
            name: "Tickets",
            path: "/tickets",
            icon: "bi-ticket-detailed"
        },
        {
            name: "SLA Management",
            path: "/sla",
            icon: "bi-clock-history"
        },
        {
            name: "Reports & Analytics",
            path: "/reports",
            icon: "bi-bar-chart-line"
        },
        {
            name: "Settings",
            path: "/settings",
            icon: "bi-gear"
        }
    ];

    let menu = employeeMenu;

    if (role === "agent") {
        menu = agentMenu;
    }

    if (role === "admin") {
        menu = adminMenu;
    }

    return (
        <aside className="app-sidebar">

            {/* Logo */}
            <div className="sidebar-brand">

                <div className="sidebar-logo">
                    <i className="bi bi-headset"></i>
                </div>

                <div>
                    <h3>HelpDesk</h3>
                    <span>Support Workspace</span>
                </div>

            </div>


            {/* Menu */}
            <nav className="sidebar-menu">

                <p className="menu-label">
                    MAIN MENU
                </p>

                {menu.map((item) => (

                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                    >

                        <i className={`bi ${item.icon}`}></i>

                        <span>{item.name}</span>

                    </NavLink>

                ))}

            </nav>


            {/* Bottom */}
            <div className="sidebar-bottom">

                {/* Notifications */}
                <NavLink
                    to="/notifications"
                    className="sidebar-link"
                >
                    <i className="bi bi-bell"></i>

                    <span>Notifications</span>

                    <span className="notification-count">
                        3
                    </span>
                </NavLink>


                {/* Logout */}
                <button
                    type="button"
                    className="sidebar-logout"
                    onClick={handleLogout}
                >

                    <i className="bi bi-box-arrow-left"></i>

                    <span>Logout</span>

                </button>

            </div>

        </aside>
    );
}

export default Sidebar;