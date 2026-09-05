import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/admin-ticket.css";

const AdminTickets = () => {
    const navigate = useNavigate();

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [priority, setPriority] = useState("All");
    const [department, setDepartment] = useState("All");
    const [category, setCategory] = useState("All");

    const [departments, setDepartments] = useState([]);
    const [agents, setAgents] = useState([]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            setError("");

            const params = {};

            if (search.trim()) params.search = search.trim();
            if (status !== "All") params.status = status;
            if (priority !== "All") params.priority = priority;
            if (department !== "All") params.department = department;
            if (category !== "All") params.category = category;

            const response = await API.get("/admin/tickets", {
                params
            });

            if (response.data.success) {
                setTickets(response.data.tickets || []);
            }

        } catch (err) {
            console.error("Admin tickets error:", err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }

            if (err.response?.status === 403) {
                setError("Access denied. Admins only.");
                return;
            }

            setError(
                err.response?.data?.message ||
                "Failed to load tickets."
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await API.get("/admin/departments");

            if (response.data.success) {
                setDepartments(response.data.departments || []);
            }
        } catch (err) {
            console.error("Department loading error:", err);
        }
    };

    const fetchAgents = async () => {
        try {
            const response = await API.get("/admin/users", {
                params: {
                    role: "supportAgent"
                }
            });

            if (response.data.success) {
                setAgents(response.data.users || []);
            }
        } catch (err) {
            console.error("Agent loading error:", err);
        }
    };

    useEffect(() => {
        fetchTickets();
        fetchDepartments();
        fetchAgents();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchTickets();
    };

    const clearFilters = () => {
        setSearch("");
        setStatus("All");
        setPriority("All");
        setDepartment("All");
        setCategory("All");

        setTimeout(() => {
            fetchTickets();
        }, 0);
    };

    const getStatusClass = (ticketStatus) => {
        switch (ticketStatus) {
            case "Open":
                return "status-open";

            case "Assigned":
                return "status-assigned";

            case "In Progress":
                return "status-progress";

            case "Waiting for Employee":
                return "status-waiting";

            case "Resolved":
                return "status-resolved";

            case "Closed":
                return "status-closed";

            default:
                return "";
        }
    };

    const getPriorityClass = (ticketPriority) => {
        switch (ticketPriority) {
            case "Critical":
                return "priority-critical";

            case "High":
                return "priority-high";

            case "Medium":
                return "priority-medium";

            case "Low":
                return "priority-low";

            default:
                return "";
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const isOverdue = (ticket) => {
        if (!ticket.slaDeadline) return false;

        if (
            ticket.status === "Resolved" ||
            ticket.status === "Closed"
        ) {
            return false;
        }

        return new Date(ticket.slaDeadline) < new Date();
    };

    return (
        <div className="admin-tickets-page">

            {/* HEADER */}
            <div className="admin-tickets-header">

                <div>
                    <button
                        className="back-button"
                        onClick={() => navigate("/admin-dashboard")}
                    >
                        ← Dashboard
                    </button>

                    <h1>Ticket Management</h1>

                    <p>
                        View, search and manage all HelpDesk tickets.
                    </p>
                </div>

                <button
                    className="refresh-button"
                    onClick={fetchTickets}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "↻ Refresh"}
                </button>

            </div>


            {/* ERROR */}
            {error && (
                <div className="admin-ticket-error">
                    <span>{error}</span>

                    <button onClick={fetchTickets}>
                        Retry
                    </button>
                </div>
            )}


            {/* FILTER CARD */}
            <div className="ticket-filter-card">

                <div className="filter-title">
                    <div>
                        <h3>Search & Filter Tickets</h3>
                        <p>Find tickets quickly using the filters below.</p>
                    </div>
                </div>

                <form
                    className="ticket-filter-form"
                    onSubmit={handleSearch}
                >

                    {/* SEARCH */}
                    <div className="filter-group search-group">

                        <label>Search</label>

                        <div className="search-wrapper">

                            <span>⌕</span>

                            <input
                                type="text"
                                placeholder="Search title, description, employee..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>

                    </div>


                    {/* STATUS */}
                    <div className="filter-group">

                        <label>Status</label>

                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }
                        >
                            <option value="All">All Status</option>
                            <option value="Open">Open</option>
                            <option value="Assigned">Assigned</option>
                            <option value="In Progress">
                                In Progress
                            </option>
                            <option value="Waiting for Employee">
                                Waiting for Employee
                            </option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                        </select>

                    </div>


                    {/* PRIORITY */}
                    <div className="filter-group">

                        <label>Priority</label>

                        <select
                            value={priority}
                            onChange={(e) =>
                                setPriority(e.target.value)
                            }
                        >
                            <option value="All">All Priority</option>
                            <option value="Critical">Critical</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>

                    </div>


                    {/* DEPARTMENT */}
                    <div className="filter-group">

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
                                    key={item._id}
                                    value={item.name}
                                >
                                    {item.name}
                                </option>
                            ))}

                        </select>

                    </div>


                    {/* CATEGORY */}
                    <div className="filter-group">

                        <label>Category</label>

                        <select
                            value={category}
                            onChange={(e) =>
                                setCategory(e.target.value)
                            }
                        >
                            <option value="All">All Categories</option>
                            <option value="Technical">
                                Technical
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
                            <option value="Account">
                                Account
                            </option>
                            <option value="Other">
                                Other
                            </option>
                        </select>

                    </div>


                    {/* BUTTONS */}
                    <div className="filter-actions">

                        <button
                            type="submit"
                            className="apply-button"
                        >
                            Search
                        </button>

                        <button
                            type="button"
                            className="clear-button"
                            onClick={clearFilters}
                        >
                            Clear
                        </button>

                    </div>

                </form>

            </div>


            {/* TICKET COUNT */}
            <div className="ticket-list-heading">

                <div>
                    <h2>All Tickets</h2>

                    <span>
                        {tickets.length} ticket
                        {tickets.length !== 1 ? "s" : ""}
                    </span>
                </div>

            </div>


            {/* TABLE */}
            <div className="ticket-table-card">

                {loading ? (

                    <div className="ticket-loading">

                        <div className="spinner"></div>

                        <p>Loading tickets...</p>

                    </div>

                ) : tickets.length === 0 ? (

                    <div className="empty-tickets">

                        <div className="empty-icon">
                            🎫
                        </div>

                        <h3>No tickets found</h3>

                        <p>
                            Try changing your search or filters.
                        </p>

                    </div>

                ) : (

                    <div className="table-responsive">

                        <table className="admin-ticket-table">

                            <thead>
                                <tr>
                                    <th>Ticket</th>
                                    <th>Employee</th>
                                    <th>Department</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Assigned Agent</th>
                                    <th>SLA</th>
                                    <th>Created</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {tickets.map((ticket) => (

                                    <tr key={ticket._id}>

                                        {/* TICKET */}
                                        <td>

                                            <div className="ticket-info">

                                                <strong>
                                                    {ticket.title}
                                                </strong>

                                                <small>
                                                    {ticket.category}
                                                </small>

                                                <span className="ticket-id">
                                                    #{ticket._id.slice(-6)}
                                                </span>

                                            </div>

                                        </td>


                                        {/* EMPLOYEE */}
                                        <td>

                                            <div className="employee-info">

                                                <strong>
                                                    {ticket.createdBy?.name || "-"}
                                                </strong>

                                                <small>
                                                    {ticket.createdBy?.employeeId || ""}
                                                </small>

                                            </div>

                                        </td>


                                        {/* DEPARTMENT */}
                                        <td>
                                            {ticket.department || "-"}
                                        </td>


                                        {/* PRIORITY */}
                                        <td>

                                            <span
                                                className={`ticket-badge ${getPriorityClass(
                                                    ticket.priority
                                                )}`}
                                            >
                                                {ticket.priority}
                                            </span>

                                        </td>


                                        {/* STATUS */}
                                        <td>

                                            <span
                                                className={`ticket-badge ${getStatusClass(
                                                    ticket.status
                                                )}`}
                                            >
                                                {ticket.status}
                                            </span>

                                            {isOverdue(ticket) && (
                                                <div className="overdue-label">
                                                    ⚠ Overdue
                                                </div>
                                            )}

                                        </td>


                                        {/* AGENT */}
                                        <td>

                                            {ticket.assignedTo ? (

                                                <div className="employee-info">

                                                    <strong>
                                                        {ticket.assignedTo.name}
                                                    </strong>

                                                    <small>
                                                        {ticket.assignedTo.employeeId}
                                                    </small>

                                                </div>

                                            ) : (

                                                <span className="unassigned">
                                                    Unassigned
                                                </span>

                                            )}

                                        </td>


                                        {/* SLA */}
                                        <td>

                                            {ticket.slaDeadline ? (

                                                <div
                                                    className={
                                                        isOverdue(ticket)
                                                            ? "sla-overdue"
                                                            : "sla-normal"
                                                    }
                                                >
                                                    {formatDate(
                                                        ticket.slaDeadline
                                                    )}

                                                    {isOverdue(ticket) && (
                                                        <small>
                                                            Overdue
                                                        </small>
                                                    )}
                                                </div>

                                            ) : (
                                                "-"
                                            )}

                                        </td>


                                        {/* CREATED */}
                                        <td>
                                            {formatDate(
                                                ticket.createdAt
                                            )}
                                        </td>


                                        {/* ACTION */}
                                        <td>

                                            <button
                                                className="view-ticket-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/tickets/${ticket._id}`
                                                    )
                                                }
                                            >
                                                View
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
};

export default AdminTickets;