import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/profile.css";

function Profile() {
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
        employeeId: "",
        role: "",
        joiningDate: "",
        location: "Chennai, India"
    });

    // ==========================================
    // FETCH PROFILE
    // ==========================================

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/users/me");

            console.log("Profile response:", response.data);

            const user = response.data.user;

            const nameParts = (user.name || "").trim().split(" ");

            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ");

            setProfile({
                firstName,
                lastName,
                email: user.email || "",
                phone: user.phone || "",
                department: user.department || "",
                employeeId: user.employeeId || "",
                role: user.role || "",
                joiningDate: user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric"
                      })
                    : "Not available",
                location: "Chennai, India"
            });

        } catch (error) {
            console.error("Fetch profile error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load profile."
            );
        } finally {
            setLoading(false);
        }
    };


    // ==========================================
    // HANDLE INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setProfile((previousProfile) => ({
            ...previousProfile,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };


    // ==========================================
    // SAVE PROFILE
    // ==========================================

    const handleSave = async () => {
        try {
            setSaving(true);
            setError("");
            setSuccess("");

            if (!profile.firstName.trim()) {
                setError("First name is required.");
                return;
            }

            if (!profile.lastName.trim()) {
                setError("Last name is required.");
                return;
            }

            const fullName =
                `${profile.firstName.trim()} ${profile.lastName.trim()}`;

            const response = await API.put("/users/profile", {
                name: fullName,
                department: profile.department,
                phone: profile.phone
            });

            console.log("Profile update response:", response.data);

            const updatedUser = response.data.user;

            setProfile((previousProfile) => ({
                ...previousProfile,
                firstName: updatedUser.name
                    ? updatedUser.name.trim().split(" ")[0]
                    : previousProfile.firstName,

                lastName: updatedUser.name
                    ? updatedUser.name.trim().split(" ").slice(1).join(" ")
                    : previousProfile.lastName,

                email: updatedUser.email || previousProfile.email,
                employeeId:
                    updatedUser.employeeId || previousProfile.employeeId,

                department:
                    updatedUser.department || previousProfile.department,

                phone: updatedUser.phone || ""
            }));

            // Update localStorage user information
            const storedUser = localStorage.getItem("user");

            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);

                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        ...parsedUser,
                        name: updatedUser.name,
                        department: updatedUser.department,
                        phone: updatedUser.phone
                    })
                );
            }

            setIsEditing(false);
            setSuccess("Profile updated successfully!");

        } catch (error) {
            console.error("Update profile error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to update profile."
            );
        } finally {
            setSaving(false);
        }
    };


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };


    // ==========================================
    // AVATAR INITIALS
    // ==========================================

    const getInitials = () => {
        const first =
            profile.firstName?.charAt(0)?.toUpperCase() || "";

        const last =
            profile.lastName?.charAt(0)?.toUpperCase() || "";

        return `${first}${last}`;
    };


    // ==========================================
    // ROLE DISPLAY
    // ==========================================

    const getRoleDisplay = () => {
        if (!profile.role) return "Employee";

        return profile.role.charAt(0).toUpperCase() +
            profile.role.slice(1);
    };


    // ==========================================
    // LOADING SCREEN
    // ==========================================

    if (loading) {
        return (
            <div className="profile-page">

                <div className="profile-page-header">

                    <div>
                        <span className="profile-label">
                            ACCOUNT
                        </span>

                        <h1>
                            My Profile
                        </h1>

                        <p>
                            Loading your profile...
                        </p>
                    </div>

                </div>

                <div className="profile-card">
                    <p>Loading profile information...</p>
                </div>

            </div>
        );
    }


    return (

        <div className="profile-page">

            {/* =================================
                PAGE HEADER
            ================================= */}

            <div className="profile-page-header">

                <div>

                    <span className="profile-label">
                        ACCOUNT
                    </span>

                    <h1>
                        My Profile
                    </h1>

                    <p>
                        Manage your personal information and account settings.
                    </p>

                </div>

                <Link
                    to="/dashboard"
                    className="profile-back-btn"
                >

                    <i className="bi bi-arrow-left"></i>

                    Dashboard

                </Link>

            </div>


            {/* =================================
                ERROR / SUCCESS MESSAGE
            ================================= */}

            {error && (
                <div className="profile-alert profile-alert-error">
                    <i className="bi bi-exclamation-circle"></i>
                    {error}
                </div>
            )}

            {success && (
                <div className="profile-alert profile-alert-success">
                    <i className="bi bi-check-circle"></i>
                    {success}
                </div>
            )}


            {/* =================================
                PROFILE HERO
            ================================= */}

            <section className="profile-hero">

                <div className="profile-avatar-large">
                    {getInitials()}
                </div>

                <div className="profile-hero-info">

                    <h2>
                        {profile.firstName} {profile.lastName}
                    </h2>

                    <span>
                        {getRoleDisplay()} · {profile.department}
                    </span>

                    <p>
                        <i className="bi bi-envelope"></i>
                        {profile.email}
                    </p>

                </div>


                <div className="profile-hero-actions">

                    {!isEditing ? (

                        <button
                            className="edit-profile-btn"
                            onClick={() => {
                                setIsEditing(true);
                                setSuccess("");
                                setError("");
                            }}
                        >

                            <i className="bi bi-pencil"></i>

                            Edit Profile

                        </button>

                    ) : (

                        <button
                            className="save-profile-btn"
                            onClick={handleSave}
                            disabled={saving}
                        >

                            <i className="bi bi-check-lg"></i>

                            {saving
                                ? "Saving..."
                                : "Save Changes"
                            }

                        </button>

                    )}

                </div>

            </section>


            {/* =================================
                MAIN GRID
            ================================= */}

            <div className="profile-content-grid">


                {/* =================================
                    PERSONAL INFORMATION
                ================================= */}

                <section className="profile-card">

                    <div className="profile-card-heading">

                        <div className="profile-heading-icon">

                            <i className="bi bi-person"></i>

                        </div>

                        <div>

                            <h3>
                                Personal Information
                            </h3>

                            <span>
                                Your basic personal details
                            </span>

                        </div>

                    </div>


                    <div className="profile-form-grid">


                        {/* FIRST NAME */}

                        <div className="profile-field">

                            <label>
                                First Name
                            </label>

                            <input
                                type="text"
                                name="firstName"
                                value={profile.firstName}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />

                        </div>


                        {/* LAST NAME */}

                        <div className="profile-field">

                            <label>
                                Last Name
                            </label>

                            <input
                                type="text"
                                name="lastName"
                                value={profile.lastName}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />

                        </div>


                        {/* EMAIL */}

                        <div className="profile-field">

                            <label>
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                disabled
                            />

                        </div>


                        {/* PHONE */}

                        <div className="profile-field">

                            <label>
                                Phone Number
                            </label>

                            <input
                                type="text"
                                name="phone"
                                value={profile.phone}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />

                        </div>

                    </div>

                </section>


                {/* =================================
                    WORK INFORMATION
                ================================= */}

                <section className="profile-card">

                    <div className="profile-card-heading">

                        <div className="profile-heading-icon">

                            <i className="bi bi-briefcase"></i>

                        </div>

                        <div>

                            <h3>
                                Work Information
                            </h3>

                            <span>
                                Your company details
                            </span>

                        </div>

                    </div>


                    <div className="work-info-list">


                        {/* EMPLOYEE ID */}

                        <div className="work-info-item">

                            <div className="work-info-icon">

                                <i className="bi bi-person-badge"></i>

                            </div>

                            <div>

                                <span>
                                    Employee ID
                                </span>

                                <strong>
                                    {profile.employeeId}
                                </strong>

                            </div>

                        </div>


                        {/* DEPARTMENT */}

                        <div className="work-info-item">

                            <div className="work-info-icon">

                                <i className="bi bi-diagram-3"></i>

                            </div>

                            <div>

                                <span>
                                    Department
                                </span>

                                <strong>
                                    {profile.department}
                                </strong>

                            </div>

                        </div>


                        {/* ROLE */}

                        <div className="work-info-item">

                            <div className="work-info-icon">

                                <i className="bi bi-shield-check"></i>

                            </div>

                            <div>

                                <span>
                                    Role
                                </span>

                                <strong>
                                    {getRoleDisplay()}
                                </strong>

                            </div>

                        </div>


                        {/* JOINING DATE */}

                        <div className="work-info-item">

                            <div className="work-info-icon">

                                <i className="bi bi-calendar3"></i>

                            </div>

                            <div>

                                <span>
                                    Joining Date
                                </span>

                                <strong>
                                    {profile.joiningDate}
                                </strong>

                            </div>

                        </div>


                        {/* LOCATION */}

                        <div className="work-info-item">

                            <div className="work-info-icon">

                                <i className="bi bi-geo-alt"></i>

                            </div>

                            <div>

                                <span>
                                    Location
                                </span>

                                <strong>
                                    {profile.location}
                                </strong>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================
                    ACCOUNT SECURITY
                ================================= */}

                <section className="profile-card security-card">

                    <div className="profile-card-heading">

                        <div className="profile-heading-icon">

                            <i className="bi bi-shield-lock"></i>

                        </div>

                        <div>

                            <h3>
                                Account Security
                            </h3>

                            <span>
                                Manage your account security
                            </span>

                        </div>

                    </div>


                    {/* PASSWORD */}

                    <div className="security-item">

                        <div className="security-item-left">

                            <div className="security-icon">

                                <i className="bi bi-key"></i>

                            </div>

                            <div>

                                <strong>
                                    Password
                                </strong>

                                <span>
                                    Last changed recently
                                </span>

                            </div>

                        </div>


                        <button
                            className="security-btn"
                            type="button"
                            disabled
                        >

                            Change Password

                            <i className="bi bi-chevron-right"></i>

                        </button>

                    </div>


                    {/* LOGOUT */}

                    <div className="security-item">

                        <div className="security-item-left">

                            <div className="security-icon">

                                <i className="bi bi-box-arrow-right"></i>

                            </div>

                            <div>

                                <strong>
                                    Sign Out
                                </strong>

                                <span>
                                    Sign out from this account
                                </span>

                            </div>

                        </div>


                        <button
                            type="button"
                            className="logout-btn"
                            onClick={handleLogout}
                        >

                            Logout

                            <i className="bi bi-arrow-right"></i>

                        </button>

                    </div>

                </section>


                {/* =================================
                    ACCOUNT STATUS
                ================================= */}

                <section className="profile-status-card">

                    <div className="status-icon">

                        <i className="bi bi-check-circle"></i>

                    </div>

                    <div>

                        <strong>
                            Account Active
                        </strong>

                        <span>
                            Your employee account is active and in good standing.
                        </span>

                    </div>

                    <span className="active-badge">
                        Active
                    </span>

                </section>

            </div>

        </div>

    );
}

export default Profile;