// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// import "../styles/admin-sidebar.css";

// const AdminSidebar = () => {

//     const navigate = useNavigate();
//     const location = useLocation();

//     // =========================================
//     // NAVIGATION ITEMS
//     // =========================================

//     const menuItems = [
//         {
//             name: "Dashboard",
//             icon: "🏠",
//             path: "/admin-dashboard"
//         },
//         {
//             name: "Manage Tickets",
//             icon: "🎫",
//             path: "/admin/tickets"
//         },
//         {
//             name: "Manage Users",
//             icon: "👥",
//             path: "/admin/users"
//         },
//         {
//             name: "Departments",
//             icon: "🏢",
//             path: "/admin/departments"
//         },
//         {
//             name: "Reports",
//             icon: "📊",
//             path: "/admin/reports"
//         }
//     ];

//     // =========================================
//     // LOGOUT
//     // =========================================

//     const handleLogout = () => {

//         localStorage.removeItem("token");
//         localStorage.removeItem("role");
//         localStorage.removeItem("user");

//         navigate("/login");
//     };

//     // =========================================
//     // CHECK ACTIVE MENU
//     // =========================================

//     const isActive = (path) => {

//         if (path === "/admin-dashboard") {
//             return location.pathname === "/admin-dashboard";
//         }

//         return location.pathname.startsWith(path);
//     };

//     // =========================================
//     // UI
//     // =========================================

//     return (

//         <aside className="admin-sidebar">

//             {/* =================================
//                 SIDEBAR BRAND
//             ================================== */}

//             <div className="admin-sidebar-brand">

//                 <div className="admin-brand-logo">
//                     E
//                 </div>

//                 <div className="admin-brand-text">

//                     <h3>HelpDesk</h3>

//                     <span>Admin Panel</span>

//                 </div>

//             </div>


//             {/* =================================
//                 SIDEBAR MENU
//             ================================== */}

//             <div className="admin-sidebar-menu">

//                 <p className="admin-menu-title">
//                     MAIN MENU
//                 </p>


//                 <nav>

//                     {menuItems.map((item) => (

//                         <button
//                             key={item.path}
//                             className={`admin-sidebar-item ${
//                                 isActive(item.path)
//                                     ? "active"
//                                     : ""
//                             }`}
//                             onClick={() => navigate(item.path)}
//                         >

//                             <span className="admin-sidebar-icon">
//                                 {item.icon}
//                             </span>

//                             <span className="admin-sidebar-label">
//                                 {item.name}
//                             </span>

//                         </button>

//                     ))}

//                 </nav>

//             </div>


//             {/* =================================
//                 SIDEBAR BOTTOM
//             ================================== */}

//             <div className="admin-sidebar-bottom">

//                 <div className="admin-sidebar-divider"></div>


//                 {/* Admin Profile */}

//                 <div className="admin-sidebar-profile">

//                     <div className="sidebar-profile-avatar">
//                         A
//                     </div>

//                     <div className="sidebar-profile-info">

//                         <strong>
//                             Admin
//                         </strong>

//                         <span>
//                             Administrator
//                         </span>

//                     </div>

//                 </div>


//                 {/* Logout */}

//                 <button
//                     className="admin-sidebar-logout"
//                     onClick={handleLogout}
//                 >

//                     <span>
//                         🚪
//                     </span>

//                     <span>
//                         Logout
//                     </span>

//                 </button>

//             </div>

//         </aside>

//     );
// };

// export default AdminSidebar;

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/admin-sidebar.css";
const AdminSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        navigate("/login");
    };

    const menuItems = [
        {
            name: "Dashboard",
            icon: "🏠",
            path: "/admin-dashboard"
        },
        {
            name: "Manage Tickets",
            icon: "🎫",
            path: "/admin/tickets"
        },
        {
            name: "Manage Users",
            icon: "👥",
            path: "/admin/users"
        },
        {
            name: "Departments",
            icon: "🏢",
            path: "/admin/departments"
        },
        {
            name: "Reports",
            icon: "📊",
            path: "/admin/reports"
        }
    ];

    return (
        <aside className="admin-sidebar">

            {/* LOGO */}
            <div className="admin-sidebar-brand">

                <div className="admin-sidebar-logo">
                    E
                </div>

                <div className="admin-sidebar-brand-text">
                    <h2>HelpDesk</h2>
                    <span>Admin Panel</span>
                </div>

            </div>


            {/* MENU */}
            <div className="admin-sidebar-menu">

                <p className="admin-sidebar-heading">
                    MAIN MENU
                </p>

                <nav>

                    {menuItems.map((item) => (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `admin-sidebar-link ${
                                    isActive ? "active" : ""
                                }`
                            }
                        >

                            <span className="admin-sidebar-icon">
                                {item.icon}
                            </span>

                            <span className="admin-sidebar-text">
                                {item.name}
                            </span>

                        </NavLink>

                    ))}

                </nav>

            </div>


            {/* BOTTOM */}
            <div className="admin-sidebar-bottom">

                <div className="admin-sidebar-profile">

                    <div className="admin-profile-avatar">
                        A
                    </div>

                    <div className="admin-profile-details">
                        <strong>Admin</strong>
                        <span>Administrator</span>
                    </div>

                </div>


                <button
                    className="admin-sidebar-logout"
                    onClick={handleLogout}
                >
                    <span>🚪</span>
                    <span>Logout</span>
                </button>

            </div>

        </aside>
    );
};

export default AdminSidebar;