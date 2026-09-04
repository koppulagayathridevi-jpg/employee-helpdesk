import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../styles/forgot-password.css";

function ForgotPassword() {

    const [email, setEmail] = useState("");

    const [submitted, setSubmitted] = useState(false);


    const handleSubmit = (e) => {

        e.preventDefault();

        console.log("Reset email:", email);

        // Temporary UI behaviour
        setSubmitted(true);
    };


    return (

        <div className="forgot-page">

            <div className="forgot-container">


                {/* ==============================
                    LEFT BRAND SECTION
                ============================== */}

                <div className="forgot-brand">

                    <div className="forgot-brand-content">

                        <div className="forgot-logo">

                            <i className="bi bi-headset"></i>

                        </div>

                        <h1>
                            HelpDesk
                        </h1>

                        <p>
                            Simple support.
                            Faster solutions.
                        </p>


                        <div className="forgot-decoration">

                            <div className="decoration-circle circle-one"></div>

                            <div className="decoration-circle circle-two"></div>

                            <i className="bi bi-shield-check"></i>

                        </div>

                    </div>

                </div>


                {/* ==============================
                    RIGHT CONTENT
                ============================== */}

                <div className="forgot-card">

                    {!submitted ? (

                        <>

                            <div className="forgot-icon">

                                <i className="bi bi-lock"></i>

                            </div>


                            <div className="forgot-header">

                                <span>
                                    ACCOUNT RECOVERY
                                </span>

                                <h2>
                                    Forgot your password?
                                </h2>

                                <p>
                                    No worries. Enter your email address
                                    and we'll help you reset your password.
                                </p>

                            </div>


                            <form onSubmit={handleSubmit}>

                                <div className="forgot-form-group">

                                    <label>
                                        Email Address
                                    </label>

                                    <div className="forgot-input">

                                        <i className="bi bi-envelope"></i>

                                        <input
                                            type="email"
                                            placeholder="Enter your registered email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            required
                                        />

                                    </div>

                                </div>


                                <button
                                    type="submit"
                                    className="forgot-btn"
                                >

                                    Send Reset Link

                                    <i className="bi bi-arrow-right"></i>

                                </button>

                            </form>


                            <div className="back-login">

                                <Link to="/login">

                                    <i className="bi bi-arrow-left"></i>

                                    Back to Sign In

                                </Link>

                            </div>

                        </>

                    ) : (

                        /* ==============================
                           SUCCESS SCREEN
                        ============================== */

                        <div className="reset-success">

                            <div className="success-icon">

                                <i className="bi bi-envelope-check"></i>

                            </div>

                            <span className="success-label">
                                EMAIL SENT
                            </span>

                            <h2>
                                Check your inbox
                            </h2>

                            <p>
                                We've sent password reset instructions
                                to:
                            </p>

                            <strong>
                                {email}
                            </strong>

                            <p className="success-small">
                                If you don't see the email, please check
                                your spam or junk folder.
                            </p>


                            <Link
                                to="/login"
                                className="success-login-btn"
                            >

                                Back to Sign In

                                <i className="bi bi-arrow-right"></i>

                            </Link>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default ForgotPassword;