import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/admin-users.css";

const AdminUsers = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [role, setRole] = useState("All");
    const [department, setDepartment] = useState("All");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const params = {};

            if (search.trim()) {
                params.search = search.trim();
            }

            if (role !== "All") {
                params.role = role;
            }

            if (department !== "All") {
                params.department = department;
            }

            const response = await API.get("/admin/users", {
                params
            });

            if (response.data.success) {
                setUsers(response.data.users || []);
            }

        } catch (err) {
            console.error("Admin users error:", err);

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
                "Failed to load users."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [role, department]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers();
    };

    const clearFilters = () => {
        setSearch("");
        setRole("All");
        setDepartment("All");
    };

    const updateUserStatus = async (userId, currentStatus) => {
        const newStatus = !currentStatus;

        const confirmation = window.confirm(
            newStatus
                ? "Are you sure you want to activate this user?"
                : "Are you sure you want to deactivate this user?"
        );

        if (!confirmation) {
            return;
        }

        try {
            await API.patch(
                `/admin/users/${userId}/status`,
                {
                    isActive: newStatus
                }
            );

            setUsers((previousUsers) =>
                previousUsers.map((user) =>
                    user._id === userId
                        ? {
                            ...user,
                            isActive: newStatus
                        }
                        : user
                )
            );

        } catch (err) {
            console.error("Update user status error:", err);

            alert(
                err.response?.data?.message ||
                "Failed to update user status."
            );
        }
    };

    const getRoleLabel = (userRole) => {
        switch (userRole) {
            case "admin":
                return "Admin";

            case "supportAgent":
                return "Support Agent";

            case "manager":
                return "Department Manager";

            case "employee":
                return "Employee";

            default:
                return userRole || "Unknown";
        }
    };

    const getRoleClass = (userRole) => {
        switch (userRole) {
            case "admin":
                return "role-admin";

            case "supportAgent":
                return "role-agent";

            case "manager":
                return "role-manager";

            case "employee":
                return "role-employee";

            default:
                return "";
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const departments = [
        "IT",
        "IT Support",
        "Human Resources",
        "Finance",
        "Admin"
    ];

    return (
        <div className="admin-users-page">

            {/* Header */}

            <div className="admin-users-header">

                <div>
                    <h2>User Management</h2>

                    <p>
                        Manage employees, support agents, managers and administrators
                    </p>
                </div>

                <div className="users-header-actions">

                    <button
                        className="users-back-btn"
                        onClick={() => navigate("/admin-dashboard")}
                    >
                        ← Dashboard
                    </button>

                    <button
                        className="users-refresh-btn"
                        onClick={fetchUsers}
                        disabled={loading}
                    >
                        {loading ? "Refreshing..." : "↻ Refresh"}
                    </button>

                </div>

            </div>

            {/* Search & Filters */}

            <div className="users-filter-card">

                <form
                    className="users-search-row"
                    onSubmit={handleSearch}
                >

                    <div className="users-search-box">

                        <span>🔎</span>

                        <input
                            type="text"
                            placeholder="Search name, email or employee ID..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                    <button
                        type="submit"
                        className="users-search-btn"
                    >
                        Search
                    </button>

                </form>

                <div className="users-filters">

                    <div className="users-filter-group">

                        <label>Role</label>

                        <select
                            value={role}
                            onChange={(e) =>
                                setRole(e.target.value)
                            }
                        >
                            <option value="All">
                                All Roles
                            </option>

                            <option value="employee">
                                Employee
                            </option>

                            <option value="supportAgent">
                                Support Agent
                            </option>

                            <option value="manager">
                                Department Manager
                            </option>

                            <option value="admin">
                                Admin
                            </option>

                        </select>

                    </div>

                    <div className="users-filter-group">

                        <label>Department</label>

                        <select
                            value={department}
                            onChange={(e) =>
                                setDepartment(e.target.value)
                            }
                        >

                            <option value="All">
                                All Departments
                            </option>

                            {departments.map((item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            ))}

                        </select>

                    </div>

                    <div className="users-clear-wrapper">

                        <button
                            type="button"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </button>

                    </div>

                </div>

            </div>

            {/* Error */}

            {error && (
                <div className="users-error">

                    <span>{error}</span>

                    <button onClick={fetchUsers}>
                        Retry
                    </button>

                </div>
            )}

            {/* Summary */}

            <div className="users-summary">

                <div>
                    <strong>{users.length}</strong>
                    <span>Total Users</span>
                </div>

                <div>
                    <strong>
                        {
                            users.filter(
                                user => user.role === "employee"
                            ).length
                        }
                    </strong>
                    <span>Employees</span>
                </div>

                <div>
                    <strong>
                        {
                            users.filter(
                                user => user.role === "supportAgent"
                            ).length
                        }
                    </strong>
                    <span>Support Agents</span>
                </div>

                <div>
                    <strong>
                        {
                            users.filter(
                                user => user.isActive
                            ).length
                        }
                    </strong>
                    <span>Active Users</span>
                </div>

            </div>

            {/* Loading */}

            {loading ? (

                <div className="users-loading">

                    <div className="users-spinner"></div>

                    <p>Loading users...</p>

                </div>

            ) : users.length === 0 ? (

                <div className="users-empty">

                    <div>👥</div>

                    <h4>No users found</h4>

                    <p>
                        Try changing your search or filters.
                    </p>

                </div>

            ) : (

                <div className="users-table-card">

                    <div className="users-table-wrapper">

                        <table className="users-table">

                            <thead>

                                <tr>
                                    <th>User</th>
                                    <th>Employee ID</th>
                                    <th>Email</th>
                                    <th>Department</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                    <th>Action</th>
                                </tr>

                            </thead>

                            <tbody>

                                {users.map((user) => (

                                    <tr key={user._id}>

                                        <td>

                                            <div className="user-name-cell">

                                                <div className="user-avatar">
                                                    {user.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase() || "U"}
                                                </div>

                                                <div>
                                                    <strong>
                                                        {user.name}
                                                    </strong>

                                                    <small>
                                                        {user.phone || "No phone"}
                                                    </small>
                                                </div>

                                            </div>

                                        </td>

                                        <td>
                                            {user.employeeId || "—"}
                                        </td>

                                        <td>
                                            {user.email}
                                        </td>

                                        <td>
                                            {user.department || "—"}
                                        </td>

                                        <td>

                                            <span
                                                className={`user-role ${getRoleClass(
                                                    user.role
                                                )}`}
                                            >
                                                {getRoleLabel(user.role)}
                                            </span>

                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    user.isActive
                                                        ? "user-status active"
                                                        : "user-status inactive"
                                                }
                                            >
                                                {user.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>

                                        </td>

                                        <td>
                                            {formatDate(user.createdAt)}
                                        </td>

                                        <td>

                                            <button
                                                className={
                                                    user.isActive
                                                        ? "deactivate-btn"
                                                        : "activate-btn"
                                                }
                                                onClick={() =>
                                                    updateUserStatus(
                                                        user._id,
                                                        user.isActive
                                                    )
                                                }
                                            >
                                                {user.isActive
                                                    ? "Deactivate"
                                                    : "Activate"}
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}

        </div>
    );
};

export default AdminUsers;