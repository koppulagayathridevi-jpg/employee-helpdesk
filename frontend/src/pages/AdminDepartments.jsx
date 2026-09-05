import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/admin-departments.css";

const AdminDepartments = () => {
    const navigate = useNavigate();

    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/admin/departments");

            if (response.data.success) {
                setDepartments(response.data.departments || []);
            }
        } catch (err) {
            console.error("Departments error:", err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("role");

                navigate("/login");
                return;
            }

            if (err.response?.status === 403) {
                setError("Access denied. Admins only.");
                return;
            }

            setError(
                err.response?.data?.message ||
                "Failed to load departments."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const resetForm = () => {
        setName("");
        setDescription("");
        setIsActive(true);
        setEditingDepartment(null);
    };

    const openAddForm = () => {
        resetForm();
        setShowForm(true);
    };

    const openEditForm = (department) => {
        setEditingDepartment(department);
        setName(department.name || "");
        setDescription(department.description || "");
        setIsActive(department.isActive);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        resetForm();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("Please enter department name.");
            return;
        }

        try {
            setSaving(true);

            const data = {
                name: name.trim(),
                description: description.trim(),
                isActive
            };

            let response;

            if (editingDepartment) {
                response = await API.put(
                    `/admin/departments/${editingDepartment._id}`,
                    data
                );
            } else {
                response = await API.post(
                    "/admin/departments",
                    data
                );
            }

            if (response.data.success) {
                closeForm();
                fetchDepartments();
            }

        } catch (err) {
            console.error("Department save error:", err);

            alert(
                err.response?.data?.message ||
                "Failed to save department."
            );
        } finally {
            setSaving(false);
        }
    };

    const toggleDepartmentStatus = async (department) => {
        const newStatus = !department.isActive;

        const confirmation = window.confirm(
            newStatus
                ? `Activate ${department.name}?`
                : `Deactivate ${department.name}?`
        );

        if (!confirmation) {
            return;
        }

        try {
            await API.put(
                `/admin/departments/${department._id}`,
                {
                    name: department.name,
                    description: department.description || "",
                    isActive: newStatus
                }
            );

            setDepartments((previousDepartments) =>
                previousDepartments.map((item) =>
                    item._id === department._id
                        ? {
                            ...item,
                            isActive: newStatus
                        }
                        : item
                )
            );

        } catch (err) {
            console.error(
                "Department status error:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Failed to update department."
            );
        }
    };

    const handleDelete = async (department) => {
        const confirmation = window.confirm(
            `Deactivate ${department.name}?`
        );

        if (!confirmation) {
            return;
        }

        try {
            await API.delete(
                `/admin/departments/${department._id}`
            );

            setDepartments((previousDepartments) =>
                previousDepartments.map((item) =>
                    item._id === department._id
                        ? {
                            ...item,
                            isActive: false
                        }
                        : item
                )
            );

        } catch (err) {
            console.error(
                "Department delete error:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Failed to deactivate department."
            );
        }
    };

    const activeCount = departments.filter(
        department => department.isActive
    ).length;

    const inactiveCount = departments.filter(
        department => !department.isActive
    ).length;

    const totalUsers = departments.reduce(
        (total, department) =>
            total + (department.userCount || 0),
        0
    );

    const totalTickets = departments.reduce(
        (total, department) =>
            total + (department.ticketCount || 0),
        0
    );

    return (
        <div className="admin-departments-page">

            {/* Header */}

            <div className="departments-header">

                <div>
                    <h2>Department Management</h2>

                    <p>
                        Manage HelpDesk departments and monitor their activity
                    </p>
                </div>

                <div className="departments-header-actions">

                    <button
                        className="department-back-btn"
                        onClick={() =>
                            navigate("/admin-dashboard")
                        }
                    >
                        ← Dashboard
                    </button>

                    <button
                        className="department-add-btn"
                        onClick={openAddForm}
                    >
                        + Add Department
                    </button>

                    <button
                        className="department-refresh-btn"
                        onClick={fetchDepartments}
                        disabled={loading}
                    >
                        {loading
                            ? "Refreshing..."
                            : "↻ Refresh"}
                    </button>

                </div>

            </div>

            {/* Summary */}

            <div className="department-summary">

                <div className="department-summary-card">

                    <div className="summary-icon">
                        🏢
                    </div>

                    <div>
                        <strong>
                            {departments.length}
                        </strong>

                        <span>
                            Total Departments
                        </span>
                    </div>

                </div>

                <div className="department-summary-card">

                    <div className="summary-icon">
                        🟢
                    </div>

                    <div>
                        <strong>
                            {activeCount}
                        </strong>

                        <span>
                            Active Departments
                        </span>
                    </div>

                </div>

                <div className="department-summary-card">

                    <div className="summary-icon">
                        👥
                    </div>

                    <div>
                        <strong>
                            {totalUsers}
                        </strong>

                        <span>
                            Users
                        </span>
                    </div>

                </div>

                <div className="department-summary-card">

                    <div className="summary-icon">
                        🎫
                    </div>

                    <div>
                        <strong>
                            {totalTickets}
                        </strong>

                        <span>
                            Tickets
                        </span>
                    </div>

                </div>

            </div>

            {/* Error */}

            {error && (
                <div className="department-error">

                    <span>{error}</span>

                    <button onClick={fetchDepartments}>
                        Retry
                    </button>

                </div>
            )}

            {/* Add / Edit Form */}

            {showForm && (
                <div className="department-form-card">

                    <div className="department-form-header">

                        <div>
                            <h4>
                                {editingDepartment
                                    ? "Edit Department"
                                    : "Add Department"}
                            </h4>

                            <p>
                                {editingDepartment
                                    ? "Update department information"
                                    : "Create a new HelpDesk department"}
                            </p>
                        </div>

                        <button
                            className="form-close-btn"
                            onClick={closeForm}
                        >
                            ×
                        </button>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="department-form-grid">

                            <div className="department-form-group">

                                <label>
                                    Department Name *
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter department name"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    required
                                />

                            </div>

                            <div className="department-form-group">

                                <label>
                                    Description
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter department description"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>

                        <div className="department-active-option">

                            <label>

                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) =>
                                        setIsActive(
                                            e.target.checked
                                        )
                                    }
                                />

                                Department is active

                            </label>

                        </div>

                        <div className="department-form-actions">

                            <button
                                type="button"
                                className="form-cancel-btn"
                                onClick={closeForm}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="form-save-btn"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingDepartment
                                        ? "Update Department"
                                        : "Create Department"}
                            </button>

                        </div>

                    </form>

                </div>
            )}

            {/* Loading */}

            {loading ? (

                <div className="departments-loading">

                    <div className="department-spinner"></div>

                    <p>
                        Loading departments...
                    </p>

                </div>

            ) : departments.length === 0 ? (

                <div className="departments-empty">

                    <div>🏢</div>

                    <h4>
                        No departments found
                    </h4>

                    <p>
                        Create your first HelpDesk department.
                    </p>

                    <button
                        onClick={openAddForm}
                    >
                        + Add Department
                    </button>

                </div>

            ) : (

                <div className="departments-table-card">

                    <div className="departments-table-wrapper">

                        <table className="departments-table">

                            <thead>

                                <tr>
                                    <th>Department</th>
                                    <th>Description</th>
                                    <th>Users</th>
                                    <th>Tickets</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>

                            </thead>

                            <tbody>

                                {departments.map(
                                    (department) => (

                                        <tr
                                            key={
                                                department._id
                                            }
                                        >

                                            <td>

                                                <div className="department-name-cell">

                                                    <div className="department-icon">
                                                        🏢
                                                    </div>

                                                    <strong>
                                                        {
                                                            department.name
                                                        }
                                                    </strong>

                                                </div>

                                            </td>

                                            <td>

                                                <span className="department-description">

                                                    {
                                                        department.description ||
                                                        "No description"
                                                    }

                                                </span>

                                            </td>

                                            <td>

                                                <span className="count-badge">
                                                    👥{" "}
                                                    {
                                                        department.userCount ||
                                                        0
                                                    }
                                                </span>

                                            </td>

                                            <td>

                                                <span className="count-badge">
                                                    🎫{" "}
                                                    {
                                                        department.ticketCount ||
                                                        0
                                                    }
                                                </span>

                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        department.isActive
                                                            ? "department-status active"
                                                            : "department-status inactive"
                                                    }
                                                >
                                                    {department.isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>

                                            </td>

                                            <td>
                                                {department.createdAt
                                                    ? new Date(
                                                        department.createdAt
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric"
                                                        }
                                                    )
                                                    : "—"}
                                            </td>

                                            <td>

                                                <div className="department-actions">

                                                    <button
                                                        className="edit-department-btn"
                                                        onClick={() =>
                                                            openEditForm(
                                                                department
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    {department.isActive ? (

                                                        <button
                                                            className="deactivate-department-btn"
                                                            onClick={() =>
                                                                toggleDepartmentStatus(
                                                                    department
                                                                )
                                                            }
                                                        >
                                                            Deactivate
                                                        </button>

                                                    ) : (

                                                        <button
                                                            className="activate-department-btn"
                                                            onClick={() =>
                                                                toggleDepartmentStatus(
                                                                    department
                                                                )
                                                            }
                                                        >
                                                            Activate
                                                        </button>

                                                    )}

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}

        </div>
    );
};

export default AdminDepartments;