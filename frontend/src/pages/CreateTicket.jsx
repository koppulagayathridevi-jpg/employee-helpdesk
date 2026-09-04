import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../api/api";

import "../styles/createticket.css";


function CreateTicket() {

    const navigate = useNavigate();


    // =========================
    // FORM DATA
    // =========================

    const [formData, setFormData] = useState({
        subject: "",
        department: "",
        category: "",
        priority: "",
        description: ""
    });


    // =========================
    // FILE
    // =========================

    const [file, setFile] = useState(null);


    // =========================
    // UI STATES
    // =========================

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =========================
    // HANDLE INPUT
    // =========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));

        // Remove error when user starts editing
        if (error) {
            setError("");
        }

    };


    // =========================
    // HANDLE FILE
    // =========================

    const handleFileChange = (e) => {

        if (
            e.target.files &&
            e.target.files.length > 0
        ) {

            const selectedFile =
                e.target.files[0];


            // 10 MB limit
            const maxSize =
                10 * 1024 * 1024;


            if (selectedFile.size > maxSize) {

                setError(
                    "File size must be less than 10MB."
                );

                e.target.value = "";

                setFile(null);

                return;
            }


            setFile(selectedFile);

            setError("");

        }

    };


    // =========================
    // REMOVE FILE
    // =========================

    const removeFile = () => {

        setFile(null);

    };


    // =========================
    // SUBMIT TICKET
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();


        setError("");

        setSuccess("");


        // =========================
        // FRONTEND VALIDATION
        // =========================

        if (!formData.subject.trim()) {

            setError(
                "Please enter a ticket subject."
            );

            return;
        }


        if (!formData.department) {

            setError(
                "Please select a department."
            );

            return;
        }


        if (!formData.category) {

            setError(
                "Please select a category."
            );

            return;
        }


        if (!formData.priority) {

            setError(
                "Please select a priority."
            );

            return;
        }


        if (!formData.description.trim()) {

            setError(
                "Please describe your issue."
            );

            return;
        }


        try {

            setLoading(true);


            // =========================
            // CREATE TICKET
            // =========================

            const response = await API.post(
                "/tickets",
                {
                    title: formData.subject.trim(),

                    description:
                        formData.description.trim(),

                    category:
                        formData.category,

                    priority:
                        formData.priority,

                    department:
                        formData.department
                }
            );


            console.log(
                "Ticket created:",
                response.data
            );


            // =========================
            // SUCCESS
            // =========================

            setSuccess(
                "Ticket created successfully!"
            );


            // Clear form
            setFormData({
                subject: "",
                department: "",
                category: "",
                priority: "",
                description: ""
            });


            setFile(null);


            // Redirect to My Tickets
            setTimeout(() => {

                navigate("/tickets");

            }, 1200);


        } catch (error) {

            console.error(
                "Create ticket error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Unable to create ticket. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="create-ticket-page">


            {/* ================================
                PAGE HEADER
            ================================= */}

            <div className="create-ticket-header">

                <div>

                    <span className="page-label">
                        SUPPORT CENTER
                    </span>

                    <h1>
                        Create New Ticket
                    </h1>

                    <p>
                        Tell us what you need help with and our support
                        team will get back to you.
                    </p>

                </div>


                <Link
                    to="/tickets"
                    className="back-tickets-btn"
                >

                    <i className="bi bi-arrow-left"></i>

                    My Tickets

                </Link>

            </div>


            {/* ================================
                SUCCESS MESSAGE
            ================================= */}

            {success && (

                <div className="ticket-success-message">

                    <i className="bi bi-check-circle"></i>

                    <span>
                        {success}
                    </span>

                </div>

            )}


            {/* ================================
                ERROR MESSAGE
            ================================= */}

            {error && (

                <div className="ticket-error-message">

                    <i className="bi bi-exclamation-circle"></i>

                    <span>
                        {error}
                    </span>

                </div>

            )}


            {/* ================================
                MAIN CONTENT
            ================================= */}

            <div className="create-ticket-layout">


                {/* ================================
                    FORM
                ================================= */}

                <div className="ticket-form-card">


                    <div className="form-card-header">

                        <div className="form-header-icon">

                            <i className="bi bi-ticket-perforated"></i>

                        </div>

                        <div>

                            <h2>
                                Ticket Information
                            </h2>

                            <p>
                                Please provide details about your issue.
                            </p>

                        </div>

                    </div>


                    <form onSubmit={handleSubmit}>


                        {/* =========================
                            SUBJECT
                        ========================= */}

                        <div className="form-group">

                            <label>

                                Subject

                                <span>*</span>

                            </label>

                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Enter a short title for your issue"
                                required
                            />

                        </div>


                        {/* =========================
                            DEPARTMENT + CATEGORY
                        ========================= */}

                        <div className="form-row">


                            {/* Department */}

                            <div className="form-group">

                                <label>

                                    Department

                                    <span>*</span>

                                </label>

                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select department
                                    </option>

                                    <option value="IT Support">
                                        IT Support
                                    </option>

                                    <option value="HR">
                                        Human Resources
                                    </option>

                                    <option value="Finance">
                                        Finance
                                    </option>

                                    <option value="Admin">
                                        Administration
                                    </option>

                                </select>

                            </div>


                            {/* Category */}

                            <div className="form-group">

                                <label>

                                    Category

                                    <span>*</span>

                                </label>

                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select category
                                    </option>

                                    <option value="Hardware">
                                        Hardware
                                    </option>

                                    <option value="Software">
                                        Software
                                    </option>

                                    <option value="Network">
                                        Network
                                    </option>

                                    <option value="Email">
                                        Email
                                    </option>

                                    <option value="Access">
                                        Access / Login
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* =========================
                            PRIORITY + ASSET
                        ========================= */}

                        <div className="form-row">


                            {/* Priority */}

                            <div className="form-group">

                                <label>

                                    Priority

                                    <span>*</span>

                                </label>

                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select priority
                                    </option>

                                    <option value="Low">
                                        Low
                                    </option>

                                    <option value="Medium">
                                        Medium
                                    </option>

                                    <option value="High">
                                        High
                                    </option>

                                    <option value="Critical">
                                        Critical
                                    </option>

                                </select>

                            </div>


                            {/* Related Asset */}

                            <div className="form-group">

                                <label>
                                    Related Asset
                                </label>

                                <input
                                    type="text"
                                    placeholder="e.g. Laptop / PC / Printer"
                                />

                            </div>

                        </div>


                        {/* =========================
                            DESCRIPTION
                        ========================= */}

                        <div className="form-group">

                            <label>

                                Description

                                <span>*</span>

                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your issue in detail..."
                                rows="7"
                                required
                            ></textarea>

                            <div className="field-help">

                                <i className="bi bi-info-circle"></i>

                                Include any error messages or steps
                                that can help us understand the issue.

                            </div>

                        </div>


                        {/* =========================
                            ATTACHMENT
                        ========================= */}

                        <div className="form-group">

                            <label>
                                Attachment
                            </label>


                            <label className="upload-box">

                                <input
                                    type="file"
                                    accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                />

                                <div className="upload-icon">

                                    <i className="bi bi-cloud-arrow-up"></i>

                                </div>

                                <div className="upload-content">

                                    <strong>
                                        Click to upload a file
                                    </strong>

                                    <span>
                                        PNG, JPG, PDF or DOC up to 10MB
                                    </span>

                                </div>

                            </label>


                            {file && (

                                <div className="selected-file">

                                    <div>

                                        <i className="bi bi-file-earmark"></i>

                                        <span>
                                            {file.name}
                                        </span>

                                    </div>


                                    <button
                                        type="button"
                                        onClick={removeFile}
                                    >

                                        <i className="bi bi-x"></i>

                                    </button>

                                </div>

                            )}

                        </div>


                        {/* =========================
                            ACTIONS
                        ========================= */}

                        <div className="form-actions">


                            <Link
                                to="/tickets"
                                className="cancel-btn"
                            >

                                Cancel

                            </Link>


                            <button
                                type="submit"
                                className="submit-ticket-btn"
                                disabled={loading}
                            >

                                {loading ? (

                                    <>
                                        <i className="bi bi-arrow-repeat"></i>
                                        Creating...
                                    </>

                                ) : (

                                    <>
                                        <i className="bi bi-send"></i>
                                        Submit Ticket
                                    </>

                                )}

                            </button>

                        </div>

                    </form>

                </div>


                {/* ================================
                    SIDE INFORMATION
                ================================= */}

                <aside className="ticket-help-card">

                    <div className="help-icon">

                        <i className="bi bi-headset"></i>

                    </div>


                    <h3>
                        Need Help?
                    </h3>


                    <p>
                        Our support team is available to help
                        you with technical and workplace issues.
                    </p>


                    <div className="help-divider"></div>


                    <div className="help-item">

                        <i className="bi bi-clock"></i>

                        <div>

                            <strong>
                                Response Time
                            </strong>

                            <span>
                                Usually within 4 hours
                            </span>

                        </div>

                    </div>


                    <div className="help-item">

                        <i className="bi bi-shield-check"></i>

                        <div>

                            <strong>
                                Priority Support
                            </strong>

                            <span>
                                Urgent issues are handled first
                            </span>

                        </div>

                    </div>


                    <div className="help-item">

                        <i className="bi bi-chat-dots"></i>

                        <div>

                            <strong>
                                Support Team
                            </strong>

                            <span>
                                Available during business hours
                            </span>

                        </div>

                    </div>

                </aside>

            </div>

        </div>

    );

}


export default CreateTicket;