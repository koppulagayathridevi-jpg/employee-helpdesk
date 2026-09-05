


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/login.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!email.trim() || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            // ==========================================
            // LOGIN API
            // ==========================================

            const response = await API.post("/auth/login", {
                email: email.trim().toLowerCase(),
                password: password
            });

            console.log("Login response:", response.data);

            // ==========================================
            // GET RESPONSE DATA
            // ==========================================

            const { token, user } = response.data;

            if (!token || !user) {
                setError("Invalid login response from server.");
                return;
            }

            console.log("Logged in user:", user);
            console.log("User role:", user.role);

            // ==========================================
            // CLEAN OLD LOGIN DATA
            // ==========================================

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("role");

            // ==========================================
            // STORE AUTHENTICATION DATA
            // ==========================================

            localStorage.setItem("token", token);

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            // IMPORTANT:
            // AdminDashboard uses localStorage.getItem("role")
            localStorage.setItem(
                "role",
                user.role?.trim()
            );

            // ==========================================
            // SUCCESS MESSAGE
            // ==========================================

            setSuccess("Login successful! Redirecting...");

            // ==========================================
            // ROLE BASED REDIRECT
            // ==========================================

            setTimeout(() => {

                const role = user.role?.trim();

                console.log("Redirecting based on role:", role);

                if (role === "admin") {

                    navigate("/admin-dashboard");

                } else if (role === "supportAgent") {

                    navigate("/agent-dashboard");

                } else if (role === "manager") {

                    navigate("/manager-dashboard");

                } else if (role === "employee") {

                    navigate("/dashboard");

                } else {

                    console.error(
                        "Unknown user role:",
                        role
                    );

                    navigate("/");

                }

            }, 700);

        } catch (error) {

            console.error("Login error:", error);

            // ==========================================
            // ERROR HANDLING
            // ==========================================

            if (error.response) {

                setError(
                    error.response.data?.message ||
                    "Login failed. Please check your credentials."
                );

            } else if (error.request) {

                setError(
                    "Unable to connect to the server. Please make sure the backend is running."
                );

            } else {

                setError(
                    "Login failed. Please try again."
                );
            }

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="auth-page">

            {/* =====================================
                LEFT BRANDING SECTION
            ====================================== */}

            <div className="auth-brand">

                <div className="brand-logo">
                    <i className="bi bi-headset"></i>
                </div>

                <h1>HelpDesk</h1>

                <p className="brand-tagline">
                    Smart support for every employee.
                </p>

                <p className="brand-description">
                    Raise requests, track issues and get the support
                    you need — all from one simple workspace.
                </p>

                <div className="brand-features">

                    <div>
                        <i className="bi bi-check-circle-fill"></i>
                        Fast ticket resolution
                    </div>

                    <div>
                        <i className="bi bi-check-circle-fill"></i>
                        Real-time ticket tracking
                    </div>

                    <div>
                        <i className="bi bi-check-circle-fill"></i>
                        Secure & reliable
                    </div>

                </div>

            </div>


            {/* =====================================
                LOGIN CONTAINER
            ====================================== */}

            <div className="auth-container">

                <div className="auth-card">

                    {/* Mobile Logo */}

                    <div className="mobile-logo">
                        <i className="bi bi-headset"></i>
                    </div>


                    {/* Header */}

                    <div className="auth-header">

                        <span className="welcome-text">
                            Welcome back 👋
                        </span>

                        <h2>
                            Sign in to your account
                        </h2>

                        <p>
                            Enter your details to access your workspace.
                        </p>

                    </div>


                    {/* =====================================
                        ERROR MESSAGE
                    ====================================== */}

                    {error && (
                        <div className="login-error">

                            <i className="bi bi-exclamation-circle"></i>

                            <span>
                                {error}
                            </span>

                        </div>
                    )}


                    {/* =====================================
                        SUCCESS MESSAGE
                    ====================================== */}

                    {success && (
                        <div className="login-success">

                            <i className="bi bi-check-circle"></i>

                            <span>
                                {success}
                            </span>

                        </div>
                    )}


                    {/* =====================================
                        LOGIN FORM
                    ====================================== */}

                    <form onSubmit={handleSubmit}>

                        {/* Email */}

                        <div className="form-group">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <div className="input-wrapper">

                                <i className="bi bi-envelope"></i>

                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your Email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    disabled={loading}
                                    autoComplete="email"
                                />

                            </div>

                        </div>


                        {/* Password */}

                        <div className="form-group">

                            <div className="password-label">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <Link to="/forgot-password">
                                    Forgot password?
                                </Link>

                            </div>

                            <div className="input-wrapper">

    <i className="bi bi-lock"></i>

    <input
        type={showPassword ? "text" : "password"}
        id="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) =>
            setPassword(e.target.value)
        }
        disabled={loading}
        autoComplete="current-password"
    />

    <button
        type="button"
        className="password-eye"
        onClick={() =>
            setShowPassword(!showPassword)
        }
        disabled={loading}
        aria-label={
            showPassword
                ? "Hide password"
                : "Show password"
        }
    >
        <i
            className={
                showPassword
                    ? "bi bi-eye-slash"
                    : "bi bi-eye"
            }
        ></i>
    </button>

</div>
    

                        </div>


                        {/* Remember Me */}

                        <div className="remember-row">

                            <label>

                                <input
                                    type="checkbox"
                                />

                                <span>
                                    Remember me
                                </span>

                            </label>

                        </div>


                        {/* Login Button */}

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>

                                    Signing In...
                                </>
                            ) : (
                                <>
                                    Sign In

                                    <i className="bi bi-arrow-right"></i>
                                </>
                            )}

                        </button>

                    </form>


                    {/* =====================================
                        REGISTER
                    ====================================== */}

                    <div className="auth-footer">

                        <span>
                            Don't have an account?
                        </span>

                        <Link to="/register">
                            Create one
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;