import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

function Navbar({ userName = "John Doe", role = "Employee" }) {

    const navigate = useNavigate();

    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
    };


    // ==========================================
    // USER INITIALS
    // ==========================================

    const getInitials = () => {

        if (!userName) {
            return "JD";
        }

        const parts = userName.trim().split(" ");

        if (parts.length === 1) {
            return parts[0].charAt(0).toUpperCase();
        }

        return (
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0)
        ).toUpperCase();
    };


    return (

        <header className="app-navbar">

            {/* =================================
                LEFT SIDE
            ================================= */}

            <div className="navbar-left">

                <button
                    className="mobile-menu-btn"
                    type="button"
                >
                    <i className="bi bi-list"></i>
                </button>


                <div className="navbar-search">

                    <i className="bi bi-search"></i>

                    <input
                        type="text"
                        placeholder="Search tickets, categories..."
                    />

                </div>

            </div>


            {/* =================================
                RIGHT SIDE
            ================================= */}

            <div className="navbar-right">


                {/* Notifications */}

                <button
                    className="navbar-icon"
                    type="button"
                >

                    <i className="bi bi-bell"></i>

                    <span className="navbar-notification">
                        3
                    </span>

                </button>


                {/* =================================
                    USER
                ================================= */}

                <div className="navbar-user">

                    <div className="user-avatar">
                        {getInitials()}
                    </div>

                    <div className="user-details">

                        <strong>
                            {userName}
                        </strong>

                        <span>
                            {role}
                        </span>

                    </div>

                </div>


                {/* =================================
                    PROFILE
                ================================= */}

                <Link
                    to="/profile"
                    className="navbar-profile-btn"
                    title="My Profile"
                >

                    <i className="bi bi-person"></i>

                </Link>


            </div>

        </header>
    );
}

export default Navbar;