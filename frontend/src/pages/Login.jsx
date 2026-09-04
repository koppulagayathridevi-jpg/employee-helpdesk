import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/login.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // Validation
        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await API.post("/auth/login", {
                email: email.trim(),
                password: password
            });

            console.log("Login response:", response.data);

            // Get token and user from backend
            const { token, user } = response.data;

            // Store authentication data
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            setSuccess("Login successful! Redirecting...");

            // Role-based redirect
            setTimeout(() => {
              if (user.role === "admin") {
    navigate("/admin-dashboard");
} else if (user.role === "supportAgent") {
    navigate("/agent-dashboard");
} else if (user.role === "manager") {
    navigate("/manager-dashboard");
} else {
    navigate("/dashboard");
}
            }, 1000);

        } catch (error) {
            console.error("Login error:", error);

            setError(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            {/* Left Branding Section */}
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


            {/* Login Card */}
            <div className="auth-container">

                <div className="auth-card">

                    <div className="mobile-logo">
                        <i className="bi bi-headset"></i>
                    </div>

                    <div className="auth-header">

                        <span className="welcome-text">
                            Welcome back 👋
                        </span>

                        <h2>Sign in to your account</h2>

                        <p>
                            Enter your details to access your workspace.
                        </p>

                    </div>


                    {/* Error Message */}
                    {error && (
                        <div className="login-error">
                            <i className="bi bi-exclamation-circle"></i>
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="login-success">
                            <i className="bi bi-check-circle"></i>
                            {success}
                        </div>
                    )}


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
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    disabled={loading}
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
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    disabled={loading}
                                />

                                <i className="bi bi-eye password-eye"></i>

                            </div>

                        </div>


                        {/* Remember */}
                        <div className="remember-row">

                            <label>

                                <input type="checkbox" />

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


                    {/* Register */}
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