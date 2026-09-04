import React, { useState } from "react";
import API from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import "../styles/register.css";

function Register() {
    const navigate = useNavigate();

    // Form states
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [department, setDepartment] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Message states
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // Register function
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // Check required fields
        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !email.trim() ||
            !employeeId.trim() ||
            !department ||
            !password ||
            !confirmPassword
        ) {
            setError("Please fill in all fields.");
            return;
        }

        // Check password
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Password length
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);

            // Combine first and last name
            const fullName = `${firstName.trim()} ${lastName.trim()}`;

            // Send data to backend
            const response = await API.post("/auth/register", {
                name: fullName,
                email: email.trim(),
                password: password,
                employeeId: employeeId.trim(),
                department: department,
                phone: "",
                role: "employee"
            });

            console.log("Registration successful:", response.data);

            setSuccess(
                "Account created successfully! Redirecting to login..."
            );

            // Clear form
            setFirstName("");
            setLastName("");
            setEmail("");
            setEmployeeId("");
            setDepartment("");
            setPassword("");
            setConfirmPassword("");

            // Go to login page
            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            console.error("Registration error:", error);

            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            <div className="register-wrapper">

                {/* Branding */}
                <div className="register-brand">

                    <div className="register-icon">
                        <i className="bi bi-person-plus"></i>
                    </div>

                    <h1>Join HelpDesk</h1>

                    <p>
                        Create your employee account and get
                        support whenever you need it.
                    </p>

                    <div className="register-points">

                        <span>
                            <i className="bi bi-shield-check"></i>
                            Secure account
                        </span>

                        <span>
                            <i className="bi bi-ticket-perforated"></i>
                            Easy ticket creation
                        </span>

                        <span>
                            <i className="bi bi-clock-history"></i>
                            Track requests anytime
                        </span>

                    </div>

                </div>


                {/* Registration Card */}
                <div className="register-card">

                    <div className="register-heading">

                        <span>Create account</span>

                        <h2>Let's get started</h2>

                        <p>
                            Fill in your details to create your account.
                        </p>

                    </div>


                    {/* Error Message */}
                    {error && (
                        <div className="register-error">
                            <i className="bi bi-exclamation-circle"></i>
                            <span>{error}</span>
                        </div>
                    )}


                    {/* Success Message */}
                    {success && (
                        <div className="register-success">
                            <i className="bi bi-check-circle"></i>
                            <span>{success}</span>
                        </div>
                    )}


                    <form onSubmit={handleSubmit}>

                        {/* First Name + Last Name */}
                        <div className="register-grid">

                            <div className="register-field">

                                <label>First Name</label>

                                <div className="register-input">

                                    <i className="bi bi-person"></i>

                                    <input
                                        type="text"
                                        placeholder="John"
                                        value={firstName}
                                        onChange={(e) =>
                                            setFirstName(e.target.value)
                                        }
                                    />

                                </div>

                            </div>


                            <div className="register-field">

                                <label>Last Name</label>

                                <div className="register-input">

                                    <i className="bi bi-person"></i>

                                    <input
                                        type="text"
                                        placeholder="Doe"
                                        value={lastName}
                                        onChange={(e) =>
                                            setLastName(e.target.value)
                                        }
                                    />

                                </div>

                            </div>

                        </div>


                        {/* Email */}
                        <div className="register-field">

                            <label>Email Address</label>

                            <div className="register-input">

                                <i className="bi bi-envelope"></i>

                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                />

                            </div>

                        </div>


                        {/* Employee ID */}
                        <div className="register-field">

                            <label>Employee ID</label>

                            <div className="register-input">

                                <i className="bi bi-person-badge"></i>

                                <input
                                    type="text"
                                    placeholder="EMP001"
                                    value={employeeId}
                                    onChange={(e) =>
                                        setEmployeeId(e.target.value)
                                    }
                                />

                            </div>

                        </div>


                        {/* Department */}
                        <div className="register-field">

                            <label>Department</label>

                            <div className="register-input">

                                <i className="bi bi-building"></i>

                                <select
                                    value={department}
                                    onChange={(e) =>
                                        setDepartment(e.target.value)
                                    }
                                >

                                    <option value="">
                                        Select department
                                    </option>

                                    <option value="IT Support">
                                        IT Support
                                    </option>

                                    <option value="Human Resources">
                                        Human Resources
                                    </option>

                                    <option value="Finance">
                                        Finance
                                    </option>

                                    <option value="Administration">
                                        Administration
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* Password */}
                        <div className="register-field">

                            <label>Password</label>

                            <div className="register-input">

                                <i className="bi bi-lock"></i>

                                <input
                                    type="password"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />

                            </div>

                        </div>


                        {/* Confirm Password */}
                        <div className="register-field">

                            <label>Confirm Password</label>

                            <div className="register-input">

                                <i className="bi bi-lock"></i>

                                <input
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />

                            </div>

                        </div>


                        {/* Register Button */}
                        <button
                            type="submit"
                            className="register-button"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <i className="bi bi-arrow-right"></i>
                                </>
                            )}

                        </button>

                    </form>


                    {/* Login Link */}
                    <div className="register-login">

                        Already have an account?

                        <Link to="/login">
                            Sign in
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;