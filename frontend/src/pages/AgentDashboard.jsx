// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import API from "../api/api";
// import AgentSidebar from "../components/AgentSidebar";
// import "../styles/agent-dashboard.css";

// function AgentDashboard() {
//     const [user, setUser] = useState(null);
//     const [tickets, setTickets] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         fetchAgentData();
//     }, []);

//     const fetchAgentData = async () => {
//         try {
//             setLoading(true);
//             setError("");

//             const [profileResponse, ticketsResponse] =
//                 await Promise.all([
//                     API.get("/users/me"),
//                     API.get("/tickets/agent/all")
//                 ]);

//             setUser(profileResponse.data.user);
//             setTickets(ticketsResponse.data.tickets || []);

//         } catch (error) {
//             console.error("Agent dashboard error:", error);

//             setError(
//                 error.response?.data?.message ||
//                 "Unable to load agent dashboard."
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     const totalTickets = tickets.length;

//     const openTickets = tickets.filter(
//         ticket => ticket.status === "Open"
//     ).length;

//     const inProgressTickets = tickets.filter(
//         ticket => ticket.status === "In Progress"
//     ).length;

//     const resolvedTickets = tickets.filter(
//         ticket => ticket.status === "Resolved"
//     ).length;

//     const criticalTickets = tickets.filter(
//         ticket => ticket.priority === "Critical"
//     ).length;

//     const recentTickets = tickets.slice(0, 5);

//     const getTicketId = (id) => {
//         if (!id) return "TK-000000";

//         return `TK-${id.slice(-6).toUpperCase()}`;
//     };

//     const getStatusClass = (status) => {
//         switch (status) {
//             case "Open":
//                 return "status-open";

//             case "In Progress":
//                 return "status-progress";

//             case "Resolved":
//                 return "status-resolved";

//             case "Closed":
//                 return "status-closed";

//             default:
//                 return "";
//         }
//     };

//     const getPriorityClass = (priority) => {
//         switch (priority) {
//             case "Critical":
//                 return "priority-critical";

//             case "High":
//                 return "priority-high";

//             case "Medium":
//                 return "priority-medium";

//             case "Low":
//                 return "priority-low";

//             default:
//                 return "";
//         }
//     };

//     if (loading) {
//         return (
//             <Layout
//                 role="supportAgent"
//                 userName="Support Agent"
//             >
//                 <div className="agent-dashboard-loading">
//                     Loading dashboard...
//                 </div>
//             </Layout>
//         );
//     }

//     return (
//         <Layout
//             role="supportAgent"
//             userName={user?.name || "Support Agent"}
//         >
//             <div className="agent-dashboard">

//                 {/* Header */}

//                 <div className="agent-dashboard-header">

//                     <div>
//                         <span className="page-label">
//                             SUPPORT CENTER
//                         </span>

//                         <h1>
//                             Agent Dashboard
//                         </h1>

//                         <p>
//                             Manage and resolve employee support tickets.
//                         </p>
//                     </div>

//                     <Link
//                         to="/agent/tickets"
//                         className="view-all-btn"
//                     >
//                         <i className="bi bi-ticket-perforated"></i>
//                         View All Tickets
//                     </Link>

//                 </div>

//                 {/* Error */}

//                 {error && (
//                     <div className="agent-error">
//                         {error}
//                     </div>
//                 )}

//                 {/* Statistics */}

//                 <div className="agent-stats-grid">

//                     <div className="agent-stat-card">
//                         <div className="agent-stat-icon">
//                             <i className="bi bi-ticket"></i>
//                         </div>

//                         <div>
//                             <span>Total Tickets</span>
//                             <strong>{totalTickets}</strong>
//                         </div>
//                     </div>

//                     <div className="agent-stat-card">
//                         <div className="agent-stat-icon">
//                             <i className="bi bi-folder"></i>
//                         </div>

//                         <div>
//                             <span>Open</span>
//                             <strong>{openTickets}</strong>
//                         </div>
//                     </div>

//                     <div className="agent-stat-card">
//                         <div className="agent-stat-icon">
//                             <i className="bi bi-arrow-repeat"></i>
//                         </div>

//                         <div>
//                             <span>In Progress</span>
//                             <strong>{inProgressTickets}</strong>
//                         </div>
//                     </div>

//                     <div className="agent-stat-card">
//                         <div className="agent-stat-icon">
//                             <i className="bi bi-check-circle"></i>
//                         </div>

//                         <div>
//                             <span>Resolved</span>
//                             <strong>{resolvedTickets}</strong>
//                         </div>
//                     </div>

//                     <div className="agent-stat-card">
//                         <div className="agent-stat-icon">
//                             <i className="bi bi-exclamation-triangle"></i>
//                         </div>

//                         <div>
//                             <span>Critical</span>
//                             <strong>{criticalTickets}</strong>
//                         </div>
//                     </div>

//                 </div>

//                 {/* Recent Tickets */}

//                 <div className="agent-tickets-card">

//                     <div className="agent-card-header">

//                         <div>
//                             <h2>
//                                 Recent Tickets
//                             </h2>

//                             <p>
//                                 Latest employee support requests
//                             </p>
//                         </div>

//                         <Link to="/agent/tickets">
//                             View All
//                         </Link>

//                     </div>

//                     {recentTickets.length === 0 ? (

//                         <div className="no-agent-tickets">
//                             No tickets available.
//                         </div>

//                     ) : (

//                         <div className="agent-table-wrapper">

//                             <table className="agent-ticket-table">

//                                 <thead>
//                                     <tr>
//                                         <th>Ticket</th>
//                                         <th>Title</th>
//                                         <th>Department</th>
//                                         <th>Priority</th>
//                                         <th>Status</th>
//                                         <th>Action</th>
//                                     </tr>
//                                 </thead>

//                                 <tbody>

//                                     {recentTickets.map(ticket => (

//                                         <tr key={ticket._id}>

//                                             <td>
//                                                 <strong>
//                                                     {getTicketId(ticket._id)}
//                                                 </strong>
//                                             </td>

//                                             <td>
//                                                 {ticket.title}
//                                             </td>

//                                             <td>
//                                                 {ticket.department ||
//                                                     ticket.createdBy?.department ||
//                                                     "-"}
//                                             </td>

//                                             <td>
//                                                 <span
//                                                     className={`ticket-priority ${getPriorityClass(ticket.priority)}`}
//                                                 >
//                                                     {ticket.priority}
//                                                 </span>
//                                             </td>

//                                             <td>
//                                                 <span
//                                                     className={`ticket-status ${getStatusClass(ticket.status)}`}
//                                                 >
//                                                     {ticket.status}
//                                                 </span>
//                                             </td>

//                                             <td>
//                                                 <Link
//                                                     to={`/agent/tickets/${ticket._id}`}
//                                                     className="agent-view-btn"
//                                                 >
//                                                     View
//                                                 </Link>
//                                             </td>

//                                         </tr>

//                                     ))}

//                                 </tbody>

//                             </table>

//                         </div>

//                     )}

//                 </div>

//             </div>
//         </Layout>
//     );
// }

// export default AgentDashboard;


import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/agent-dashboard.css";

function AgentDashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // FETCH AGENT DATA
    // ==========================================

    useEffect(() => {
        fetchAgentData();
    }, []);

    const fetchAgentData = async () => {
        try {
            setLoading(true);
            setError("");

            const [profileResponse, ticketsResponse] =
                await Promise.all([
                    API.get("/users/me"),
                    API.get("/tickets/agent/all")
                ]);

            setUser(profileResponse.data.user);

            setTickets(
                ticketsResponse.data.tickets || []
            );

        } catch (error) {
            console.error("Agent dashboard error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load agent dashboard."
            );

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        navigate("/login");
    };

    // ==========================================
    // STATISTICS
    // ==========================================

    const totalTickets = tickets.length;

    const openTickets = tickets.filter(
        ticket => ticket.status === "Open"
    ).length;

    const assignedTickets = tickets.filter(
        ticket => ticket.status === "Assigned"
    ).length;

    const inProgressTickets = tickets.filter(
        ticket => ticket.status === "In Progress"
    ).length;

    const waitingTickets = tickets.filter(
        ticket => ticket.status === "Waiting for Employee"
    ).length;

    const resolvedTickets = tickets.filter(
        ticket => ticket.status === "Resolved"
    ).length;

    const closedTickets = tickets.filter(
        ticket => ticket.status === "Closed"
    ).length;

    const criticalTickets = tickets.filter(
        ticket => ticket.priority === "Critical"
    ).length;

    // ==========================================
    // RECENT TICKETS
    // ==========================================

    const recentTickets = tickets.slice(0, 5);

    // ==========================================
    // TICKET ID
    // ==========================================

    const getTicketId = (id) => {
        if (!id) {
            return "TK-000000";
        }

        return `TK-${id.slice(-6).toUpperCase()}`;
    };

    // ==========================================
    // STATUS CLASS
    // ==========================================

    const getStatusClass = (status) => {
        switch (status) {
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

    // ==========================================
    // PRIORITY CLASS
    // ==========================================

    const getPriorityClass = (priority) => {
        switch (priority) {
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

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="agent-dashboard-loading">

                <div className="agent-loading-spinner">
                    <i className="bi bi-arrow-repeat"></i>
                </div>

                <p>
                    Loading dashboard...
                </p>

            </div>
        );
    }

    // ==========================================
    // DASHBOARD
    // ==========================================

    return (
        <div className="agent-dashboard-page">

            <div className="agent-dashboard">

                {/* ======================================
                    HEADER
                ====================================== */}

                <div className="agent-dashboard-header">

                    <div>

                        <span className="page-label">
                            SUPPORT CENTER
                        </span>

                        <h1>
                            Agent Dashboard
                        </h1>

                        <p>
                            Manage and resolve employee
                            support tickets.
                        </p>

                    </div>

                    <div className="agent-header-actions">

                        {/* VIEW ALL TICKETS */}

                        <Link
                            to="/agent/tickets"
                            className="view-all-btn"
                        >
                            <i className="bi bi-ticket-perforated"></i>

                            View All Tickets
                        </Link>

                        {/* LOGOUT */}

                        <button
                            type="button"
                            className="agent-logout-btn"
                            onClick={handleLogout}
                        >
                            <i className="bi bi-box-arrow-right"></i>

                            Logout
                        </button>

                    </div>

                </div>


                {/* ======================================
                    WELCOME
                ====================================== */}

                {user && (

                    <div className="agent-welcome">

                        <div className="agent-welcome-icon">

                            <i className="bi bi-person-badge"></i>

                        </div>

                        <div>

                            <span>
                                Welcome back
                            </span>

                            <strong>
                                {user.name}
                            </strong>

                        </div>

                    </div>

                )}


                {/* ======================================
                    ERROR
                ====================================== */}

                {error && (

                    <div className="agent-error">

                        <i className="bi bi-exclamation-circle"></i>

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {/* ======================================
                    STATISTICS
                ====================================== */}

                <div className="agent-stats-grid">

                    <div className="agent-stat-card">

                        <div className="agent-stat-icon">
                            <i className="bi bi-ticket"></i>
                        </div>

                        <div>
                            <span>Total Tickets</span>
                            <strong>{totalTickets}</strong>
                        </div>

                    </div>


                    <div className="agent-stat-card">

                        <div className="agent-stat-icon">
                            <i className="bi bi-folder"></i>
                        </div>

                        <div>
                            <span>Open</span>
                            <strong>{openTickets}</strong>
                        </div>

                    </div>


                    <div className="agent-stat-card">

                        <div className="agent-stat-icon">
                            <i className="bi bi-person-check"></i>
                        </div>

                        <div>
                            <span>Assigned</span>
                            <strong>{assignedTickets}</strong>
                        </div>

                    </div>


                    <div className="agent-stat-card">

                        <div className="agent-stat-icon">
                            <i className="bi bi-arrow-repeat"></i>
                        </div>

                        <div>
                            <span>In Progress</span>
                            <strong>{inProgressTickets}</strong>
                        </div>

                    </div>


                    <div className="agent-stat-card">

                        <div className="agent-stat-icon">
                            <i className="bi bi-hourglass-split"></i>
                        </div>

                        <div>
                            <span>Waiting</span>
                            <strong>{waitingTickets}</strong>
                        </div>

                    </div>


                    <div className="agent-stat-card">

                        <div className="agent-stat-icon">
                            <i className="bi bi-check-circle"></i>
                        </div>

                        <div>
                            <span>Resolved</span>
                            <strong>{resolvedTickets}</strong>
                        </div>

                    </div>


                    <div className="agent-stat-card">

                        <div className="agent-stat-icon">
                            <i className="bi bi-check2-all"></i>
                        </div>

                        <div>
                            <span>Closed</span>
                            <strong>{closedTickets}</strong>
                        </div>

                    </div>


                    <div className="agent-stat-card">

                        <div className="agent-stat-icon">
                            <i className="bi bi-exclamation-triangle"></i>
                        </div>

                        <div>
                            <span>Critical</span>
                            <strong>{criticalTickets}</strong>
                        </div>

                    </div>

                </div>


                {/* ======================================
                    RECENT TICKETS
                ====================================== */}

                <div className="agent-tickets-card">

                    <div className="agent-card-header">

                        <div>

                            <h2>
                                Recent Tickets
                            </h2>

                            <p>
                                Latest employee support requests
                            </p>

                        </div>

                        <Link to="/agent/tickets">
                            View All
                        </Link>

                    </div>


                    {/* NO TICKETS */}

                    {recentTickets.length === 0 ? (

                        <div className="no-agent-tickets">

                            <div className="no-ticket-icon">

                                <i className="bi bi-ticket-perforated"></i>

                            </div>

                            <h3>
                                No tickets available
                            </h3>

                            <p>
                                There are currently no support
                                tickets available.
                            </p>

                        </div>

                    ) : (

                        <div className="agent-table-wrapper">

                            <table className="agent-ticket-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Ticket
                                        </th>

                                        <th>
                                            Title
                                        </th>

                                        <th>
                                            Department
                                        </th>

                                        <th>
                                            Priority
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {recentTickets.map(
                                        (ticket) => (

                                            <tr
                                                key={ticket._id}
                                            >

                                                <td>

                                                    <strong>
                                                        {getTicketId(
                                                            ticket._id
                                                        )}
                                                    </strong>

                                                </td>


                                                <td>

                                                    <div className="agent-ticket-title">

                                                        {ticket.title}

                                                    </div>

                                                </td>


                                                <td>

                                                    {ticket.department ||
                                                        ticket.createdBy?.department ||
                                                        "-"}

                                                </td>


                                                <td>

                                                    <span
                                                        className={`ticket-priority ${getPriorityClass(
                                                            ticket.priority
                                                        )}`}
                                                    >
                                                        {ticket.priority ||
                                                            "Medium"}
                                                    </span>

                                                </td>


                                                <td>

                                                    <span
                                                        className={`ticket-status ${getStatusClass(
                                                            ticket.status
                                                        )}`}
                                                    >
                                                        {ticket.status}
                                                    </span>

                                                </td>


                                                <td>

                                                    <Link
                                                        to={`/agent/tickets/${ticket._id}`}
                                                        className="agent-view-btn"
                                                    >

                                                        <i className="bi bi-eye"></i>

                                                        View

                                                    </Link>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default AgentDashboard;