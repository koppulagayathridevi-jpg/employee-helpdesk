import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import Layout from "../components/Layout";
import "../styles/agent-tickets.css";

function AgentTickets() {
    const [tickets, setTickets] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [priorityFilter, setPriorityFilter] = useState("All Priorities");
    const [departmentFilter, setDepartmentFilter] = useState("All Departments");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/tickets/agent/all");

            console.log("Agent tickets:", response.data);

            setTickets(response.data.tickets || []);
        } catch (error) {
            console.error("Agent tickets error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load tickets."
            );
        } finally {
            setLoading(false);
        }
    };

    const filteredTickets = tickets.filter((ticket) => {
        const searchText = search.toLowerCase().trim();

        const ticketId = ticket._id
            ? ticket._id.toLowerCase()
            : "";

        const title = ticket.title
            ? ticket.title.toLowerCase()
            : "";

        const matchesSearch =
            title.includes(searchText) ||
            ticketId.includes(searchText);

        const matchesStatus =
            statusFilter === "All Status" ||
            ticket.status === statusFilter;

        const matchesPriority =
            priorityFilter === "All Priorities" ||
            ticket.priority === priorityFilter;

        const department =
            ticket.department ||
            ticket.createdBy?.department ||
            "";

        const matchesDepartment =
            departmentFilter === "All Departments" ||
            department === departmentFilter;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority &&
            matchesDepartment
        );
    });

    const getTicketId = (id) => {
        if (!id) return "TK-000000";

        return `TK-${id.slice(-6).toUpperCase()}`;
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Open":
                return "agent-status-open";

            case "Assigned":
                return "agent-status-assigned";

            case "In Progress":
                return "agent-status-progress";

            case "Waiting for Employee":
                return "agent-status-waiting";

            case "Resolved":
                return "agent-status-resolved";

            case "Closed":
                return "agent-status-closed";

            default:
                return "";
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case "Critical":
                return "agent-priority-critical";

            case "High":
                return "agent-priority-high";

            case "Medium":
                return "agent-priority-medium";

            case "Low":
                return "agent-priority-low";

            default:
                return "";
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";

        const formattedDate = new Date(date);

        if (Number.isNaN(formattedDate.getTime())) {
            return "-";
        }

        return formattedDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    if (loading) {
        return (
            <Layout
                role="supportAgent"
                userName="Support Agent"
            >
                <div className="agent-tickets-loading">
                    Loading tickets...
                </div>
            </Layout>
        );
    }

    return (
        <Layout
            role="supportAgent"
            userName="Support Agent"
        >
            <div className="agent-tickets-page">

                {/* Header */}

                <div className="agent-tickets-header">

                    <div>
                        <span className="agent-page-label">
                            SUPPORT CENTER
                        </span>

                        <h1>
                            All Tickets
                        </h1>

                        <p>
                            View and manage employee support requests.
                        </p>
                    </div>

                    <Link
                        to="/agent-dashboard"
                        className="back-dashboard-btn"
                    >
                        <i className="bi bi-arrow-left"></i>
                        Dashboard
                    </Link>

                </div>

                {/* Error */}

                {error && (
                    <div className="agent-tickets-error">
                        {error}
                    </div>
                )}

                {/* Filters */}

                <div className="agent-filters">

                    <div className="agent-search">
                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            placeholder="Search by ticket ID or title..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                    >
                        <option>All Status</option>
                        <option>Open</option>
                        <option>Assigned</option>
                        <option>In Progress</option>
                        <option>Waiting for Employee</option>
                        <option>Resolved</option>
                        <option>Closed</option>
                    </select>

                    <select
                        value={priorityFilter}
                        onChange={(e) =>
                            setPriorityFilter(e.target.value)
                        }
                    >
                        <option>All Priorities</option>
                        <option>Critical</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                    </select>

                    <select
                        value={departmentFilter}
                        onChange={(e) =>
                            setDepartmentFilter(e.target.value)
                        }
                    >
                        <option>All Departments</option>
                        <option>IT Support</option>
                        <option>Human Resources</option>
                        <option>Finance</option>
                        <option>Administration</option>
                    </select>

                </div>

                {/* Ticket Count */}

                <div className="agent-ticket-count">
                    Showing{" "}
                    <strong>{filteredTickets.length}</strong>{" "}
                    of{" "}
                    <strong>{tickets.length}</strong> tickets
                </div>

                {/* Tickets Table */}

                <div className="agent-all-tickets-card">

                    {filteredTickets.length === 0 ? (

                        <div className="no-agent-results">
                            <i className="bi bi-ticket-perforated"></i>

                            <h3>
                                No tickets found
                            </h3>

                            <p>
                                Try changing your search or filters.
                            </p>
                        </div>

                    ) : (

                        <div className="agent-all-table-wrapper">

                            <table className="agent-all-tickets-table">

                                <thead>
                                    <tr>
                                        <th>Ticket</th>
                                        <th>Title</th>
                                        <th>Employee</th>
                                        <th>Department</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {filteredTickets.map((ticket) => {

                                        const department =
                                            ticket.department ||
                                            ticket.createdBy?.department ||
                                            "-";

                                        return (
                                            <tr key={ticket._id}>

                                                <td>
                                                    <strong>
                                                        {getTicketId(
                                                            ticket._id
                                                        )}
                                                    </strong>
                                                </td>

                                                <td className="agent-ticket-title">
                                                    {ticket.title}
                                                </td>

                                                <td>
                                                    {ticket.createdBy?.name ||
                                                        "-"}
                                                </td>

                                                <td>
                                                    {department}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`agent-ticket-badge ${getPriorityClass(
                                                            ticket.priority
                                                        )}`}
                                                    >
                                                        {ticket.priority}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        className={`agent-ticket-badge ${getStatusClass(
                                                            ticket.status
                                                        )}`}
                                                    >
                                                        {ticket.status}
                                                    </span>
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        ticket.createdAt
                                                    )}
                                                </td>

                                                <td>
                                                    <Link
                                                        to={`/agent/tickets/${ticket._id}`}
                                                        className="agent-ticket-view-btn"
                                                    >
                                                        View
                                                    </Link>
                                                </td>

                                            </tr>
                                        );
                                    })}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>

            </div>
        </Layout>
    );
}

export default AgentTickets;