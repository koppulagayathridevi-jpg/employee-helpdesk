import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";

import API from "../api/api";
import AdminSidebar from "../components/AdminSidebar";

import "../styles/admin-dashboard.css";


const AdminDashboard = () => {

    const navigate = useNavigate();


    // =========================================================
    // STATE
    // =========================================================

    const [stats, setStats] = useState({
        totalTickets: 0,
        openTickets: 0,
        assignedTickets: 0,
        inProgressTickets: 0,
        waitingTickets: 0,
        resolvedTickets: 0,
        closedTickets: 0,
        criticalTickets: 0,
        overdueTickets: 0
    });


    const [reports, setReports] = useState({
        ticketsByStatus: [],
        ticketsByPriority: [],
        ticketsByDepartment: [],
        ticketsByCategory: [],
        agentWorkload: []
    });


    const [latestTickets, setLatestTickets] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =========================================================
    // AUTHENTICATION
    // =========================================================

    useEffect(() => {

        const token = localStorage.getItem("token");

        const storedUser = JSON.parse(
            localStorage.getItem("user") || "null"
        );

        const role =
            storedUser?.role ||
            localStorage.getItem("role");


        if (!token) {

            navigate("/login");

            return;
        }


        if (role && role !== "admin") {

            navigate("/");

            return;
        }


        fetchDashboardData();

    }, []);


    // =========================================================
    // FETCH DASHBOARD DATA
    // =========================================================

    const fetchDashboardData = async () => {

        try {

            setLoading(true);
            setError("");


            // -------------------------------------------------
            // DASHBOARD STATISTICS
            // -------------------------------------------------

            const statsResponse =
                await API.get("/admin/dashboard");


            if (statsResponse.data.success) {

                setStats(
                    statsResponse.data.statistics
                );

            }


            // -------------------------------------------------
            // REPORT DATA
            // -------------------------------------------------

            const reportsResponse =
                await API.get("/admin/reports");


            if (reportsResponse.data.success) {

                setReports({

                    ticketsByStatus:
                        reportsResponse.data.ticketsByStatus || [],

                    ticketsByPriority:
                        reportsResponse.data.ticketsByPriority || [],

                    ticketsByDepartment:
                        reportsResponse.data.ticketsByDepartment || [],

                    ticketsByCategory:
                        reportsResponse.data.ticketsByCategory || [],

                    agentWorkload:
                        reportsResponse.data.agentWorkload || []

                });

            }


            // -------------------------------------------------
            // LATEST TICKETS
            // -------------------------------------------------

            const ticketsResponse =
                await API.get("/admin/tickets");


            if (ticketsResponse.data.success) {

                const tickets =
                    ticketsResponse.data.tickets ||
                    ticketsResponse.data.data ||
                    [];


                setLatestTickets(
                    tickets.slice(0, 10)
                );

            }

        } catch (err) {

            console.error(
                "Admin dashboard error:",
                err
            );


            // Unauthorized
            if (err.response?.status === 401) {

                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("user");

                navigate("/login");

                return;
            }


            // Forbidden
            if (err.response?.status === 403) {

                setError(
                    "Access denied. Admins only."
                );

                return;
            }


            setError(
                err.response?.data?.message ||
                "Failed to load dashboard data."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        navigate("/login");

    };


    // =========================================================
    // STATUS COLORS
    // =========================================================

    const statusColors = {

        Open: "#6366f1",

        Assigned: "#8b5cf6",

        "In Progress": "#f97316",

        Waiting: "#f59e0b",

        Resolved: "#22c55e",

        Closed: "#64748b"

    };


    // =========================================================
    // STATUS DATA
    // =========================================================

    const statusData = [

        {
            name: "Open",
            value: stats.openTickets
        },

        {
            name: "Assigned",
            value: stats.assignedTickets
        },

        {
            name: "In Progress",
            value: stats.inProgressTickets
        },

        {
            name: "Waiting",
            value: stats.waitingTickets
        },

        {
            name: "Resolved",
            value: stats.resolvedTickets
        },

        {
            name: "Closed",
            value: stats.closedTickets
        }

    ].filter(
        item => item.value > 0
    );


    // =========================================================
    // AGENT DATA
    // =========================================================

    const agentData =
        reports.agentWorkload
            .map(item => ({

                name:
                    item.name ||
                    item.agentName ||
                    item._id ||
                    "Unknown",

                tickets:
                    item.count ||
                    item.ticketCount ||
                    item.total ||
                    0

            }))
            .slice(0, 8);


    // =========================================================
    // OVERVIEW DATA
    // =========================================================

    const overviewData = [

        {
            name: "Open",
            tickets: stats.openTickets
        },

        {
            name: "Assigned",
            tickets: stats.assignedTickets
        },

        {
            name: "Progress",
            tickets: stats.inProgressTickets
        },

        {
            name: "Waiting",
            tickets: stats.waitingTickets
        },

        {
            name: "Resolved",
            tickets: stats.resolvedTickets
        },

        {
            name: "Closed",
            tickets: stats.closedTickets
        }

    ];


    // =========================================================
    // DATE FORMAT
    // =========================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }


        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    // =========================================================
    // STATUS CLASS
    // =========================================================

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
                return "status-default";

        }

    };


    // =========================================================
    // PRIORITY CLASS
    // =========================================================

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
                return "priority-default";

        }

    };


    // =========================================================
    // STAT CARD
    // =========================================================

    const StatCard = ({
        title,
        value,
        icon,
        accent
    }) => {

        return (

            <div className="dashboard-stat-card">

                <div className="stat-card-content">

                    <div>

                        <p className="stat-card-title">
                            {title}
                        </p>

                        <h2 className="stat-card-value">
                            {loading ? "..." : value}
                        </h2>

                    </div>


                    <div
                        className="stat-card-icon"
                        style={{
                            background: `${accent}15`,
                            color: accent
                        }}
                    >
                        {icon}
                    </div>

                </div>

            </div>

        );

    };


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div className="admin-layout">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <AdminSidebar />


            {/* =================================================
                MAIN AREA
            ================================================= */}

            <main className="admin-dashboard-page">


                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="dashboard-top-header">


                    <div className="dashboard-page-title">

                        <h1>
                            Dashboard
                        </h1>

                        <p>
                            Welcome back, Admin
                        </p>

                    </div>


                    <div className="dashboard-header-actions">




                        {/* New */}

                        <button
                            className="header-new-btn"
                            onClick={() =>
                                navigate("/admin/tickets")
                            }
                        >
                            + New
                        </button>


                        {/* Notifications */}

                    


                        {/* Admin */}

                        <div className="admin-profile">

                            <div className="profile-avatar">
                                A
                            </div>

                            <div className="profile-info">

                                <strong>
                                    Admin
                                </strong>

                                <span>
                                    Administrator
                                </span>

                            </div>

                            <span className="profile-arrow">
                                ▾
                            </span>

                        </div>


                    </div>

                </header>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="dashboard-error">

                        <span>
                            {error}
                        </span>

                        <button
                            onClick={fetchDashboardData}
                        >
                            Retry
                        </button>

                    </div>

                )}


                {/* =================================================
                    CONTENT
                ================================================= */}

                <section className="dashboard-main-content">


                    {/* =================================================
                        STATISTICS
                    ================================================= */}

                    <div className="stats-grid">


                        <StatCard
                            title="New Tickets"
                            value={stats.openTickets}
                            icon="🎫"
                            accent="#22c55e"
                        />


                        <StatCard
                            title="Open Tickets"
                            value={stats.openTickets}
                            icon="📂"
                            accent="#6366f1"
                        />


                        <StatCard
                            title="Pending Tickets"
                            value={
                                stats.assignedTickets +
                                stats.waitingTickets
                            }
                            icon="⏳"
                            accent="#f59e0b"
                        />


                        <StatCard
                            title="In Progress"
                            value={stats.inProgressTickets}
                            icon="⚙️"
                            accent="#f97316"
                        />


                        <StatCard
                            title="Resolved Tickets"
                            value={stats.resolvedTickets}
                            icon="✅"
                            accent="#22c55e"
                        />


                        <StatCard
                            title="Closed Tickets"
                            value={stats.closedTickets}
                            icon="🔒"
                            accent="#64748b"
                        />


                    </div>


                    {/* =================================================
                        ACTIVITY + STATUS
                    ================================================= */}

                    <div className="dashboard-middle-grid">


                        {/* Ticket Activity */}

                        <div className="dashboard-panel trend-panel">


                            <div className="panel-header">

                                <div>

                                    <h3>
                                        Ticket Activity
                                    </h3>

                                    <p>
                                        Current HelpDesk ticket distribution
                                    </p>

                                </div>


                                <button
                                    className="panel-action"
                                    onClick={() =>
                                        navigate("/admin/reports")
                                    }
                                >
                                    View Reports
                                </button>

                            </div>


                            <div className="overview-chart">

                                <ResponsiveContainer
                                    width="100%"
                                    height={300}
                                >

                                    <BarChart
                                        data={overviewData}
                                        margin={{
                                            top: 10,
                                            right: 15,
                                            left: -10,
                                            bottom: 5
                                        }}
                                    >

                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                        />

                                        <XAxis
                                            dataKey="name"
                                        />

                                        <YAxis
                                            allowDecimals={false}
                                        />

                                        <Tooltip />


                                        <Bar
                                            dataKey="tickets"
                                            name="Tickets"
                                            radius={[
                                                7,
                                                7,
                                                0,
                                                0
                                            ]}
                                        >

                                            {overviewData.map(
                                                (entry, index) => {

                                                    const colors = [
                                                        "#6366f1",
                                                        "#8b5cf6",
                                                        "#f97316",
                                                        "#f59e0b",
                                                        "#22c55e",
                                                        "#64748b"
                                                    ];


                                                    return (

                                                        <Cell
                                                            key={`bar-${index}`}
                                                            fill={colors[index]}
                                                        />

                                                    );

                                                }
                                            )}

                                        </Bar>

                                    </BarChart>

                                </ResponsiveContainer>

                            </div>

                        </div>


                        {/* Ticket Status */}

                        <div className="dashboard-panel status-panel">


                            <div className="panel-header">

                                <div>

                                    <h3>
                                        Ticket Status
                                    </h3>

                                    <p>
                                        Current ticket status
                                    </p>

                                </div>


                                <span className="period-label">
                                    All Time
                                </span>

                            </div>


                            <div className="status-chart">

                                {statusData.length > 0 ? (

                                    <ResponsiveContainer
                                        width="100%"
                                        height={270}
                                    >

                                        <PieChart>

                                            <Pie
                                                data={statusData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="48%"
                                                innerRadius={55}
                                                outerRadius={95}
                                                paddingAngle={3}
                                            >

                                                {statusData.map(
                                                    (entry, index) => (

                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={
                                                                statusColors[
                                                                    entry.name
                                                                ] ||
                                                                "#6366f1"
                                                            }
                                                        />

                                                    )
                                                )}

                                            </Pie>


                                            <Tooltip />


                                            <Legend
                                                verticalAlign="bottom"
                                                height={45}
                                                iconType="circle"
                                            />

                                        </PieChart>

                                    </ResponsiveContainer>

                                ) : (

                                    <div className="empty-chart">
                                        No ticket data available
                                    </div>

                                )}

                            </div>


                            <div className="total-ticket-box">

                                <span>
                                    Total No. of Tickets
                                </span>

                                <strong>
                                    {loading
                                        ? "..."
                                        : stats.totalTickets}
                                </strong>

                            </div>

                        </div>


                    </div>


                    {/* =================================================
                        AGENT + SLA
                    ================================================= */}

                    <div className="dashboard-bottom-grid">


                        {/* Agent */}

                        <div className="dashboard-panel team-panel">


                            <div className="panel-header">

                                <div>

                                    <h3>
                                        Tickets Solved by Team
                                    </h3>

                                    <p>
                                        Assigned ticket workload
                                    </p>

                                </div>


                                <button
                                    className="panel-action"
                                    onClick={() =>
                                        navigate("/admin/reports")
                                    }
                                >
                                    View All
                                </button>

                            </div>


                            {agentData.length > 0 ? (

                                <div className="agent-list">

                                    {agentData.map(
                                        (agent, index) => {

                                            const maxTickets =
                                                Math.max(
                                                    ...agentData.map(
                                                        item =>
                                                            item.tickets
                                                    ),
                                                    1
                                                );


                                            const percentage =
                                                Math.round(
                                                    (
                                                        agent.tickets /
                                                        maxTickets
                                                    ) * 100
                                                );


                                            return (

                                                <div
                                                    className="agent-row"
                                                    key={`${agent.name}-${index}`}
                                                >

                                                    <div className="agent-name">
                                                        {agent.name}
                                                    </div>


                                                    <div className="agent-progress">

                                                        <div className="agent-progress-track">

                                                            <div
                                                                className="agent-progress-fill"
                                                                style={{
                                                                    width: `${percentage}%`
                                                                }}
                                                            />

                                                        </div>

                                                    </div>


                                                    <div className="agent-count">
                                                        {agent.tickets}
                                                    </div>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            ) : (

                                <div className="empty-state">
                                    No agent workload data available.
                                </div>

                            )}

                        </div>


                        {/* SLA */}

                        <div className="dashboard-panel sla-panel">


                            <div className="panel-header">

                                <div>

                                    <h3>
                                        SLA Monitoring
                                    </h3>

                                    <p>
                                        Current service level status
                                    </p>

                                </div>

                            </div>


                            <div className="sla-list">


                                <div className="sla-item">

                                    <div className="sla-icon critical">
                                        🚨
                                    </div>

                                    <div className="sla-info">

                                        <strong>
                                            Critical Tickets
                                        </strong>

                                        <span>
                                            High priority attention
                                        </span>

                                    </div>

                                    <strong className="sla-number critical-number">
                                        {stats.criticalTickets}
                                    </strong>

                                </div>


                                <div className="sla-item">

                                    <div className="sla-icon overdue">
                                        ⚠️
                                    </div>

                                    <div className="sla-info">

                                        <strong>
                                            Overdue Tickets
                                        </strong>

                                        <span>
                                            SLA deadline exceeded
                                        </span>

                                    </div>

                                    <strong className="sla-number overdue-number">
                                        {stats.overdueTickets}
                                    </strong>

                                </div>


                                <div className="sla-item">

                                    <div className="sla-icon active">
                                        🎫
                                    </div>

                                    <div className="sla-info">

                                        <strong>
                                            Active Tickets
                                        </strong>

                                        <span>
                                            Currently being handled
                                        </span>

                                    </div>

                                    <strong className="sla-number active-number">

                                        {
                                            stats.openTickets +
                                            stats.assignedTickets +
                                            stats.inProgressTickets +
                                            stats.waitingTickets
                                        }

                                    </strong>

                                </div>


                            </div>

                        </div>


                    </div>


                    {/* =================================================
                        LATEST TICKETS
                    ================================================= */}

                    <div className="dashboard-panel latest-tickets-panel">


                        <div className="panel-header">

                            <div>

                                <h3>
                                    Latest Tickets
                                </h3>

                                <p>
                                    Recently created support requests
                                </p>

                            </div>


                            <button
                                className="view-all-btn"
                                onClick={() =>
                                    navigate("/admin/tickets")
                                }
                            >
                                View All Tickets
                            </button>

                        </div>


                        <div className="tickets-table-wrapper">

                            <table className="latest-tickets-table">

                                <thead>

                                    <tr>

                                        <th>ID</th>

                                        <th>Requester</th>

                                        <th>Subject</th>

                                        <th>Department</th>

                                        <th>Status</th>

                                        <th>Priority</th>

                                        <th>Assignee</th>

                                        <th>Created Date</th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {latestTickets.length > 0 ? (

                                        latestTickets.map(
                                            (ticket, index) => (

                                                <tr
                                                    key={
                                                        ticket._id ||
                                                        index
                                                    }
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/tickets/${ticket._id}`
                                                        )
                                                    }
                                                >

                                                    <td>

                                                        <strong>
                                                            #
                                                            {String(
                                                                ticket._id
                                                            ).slice(-6)}
                                                        </strong>

                                                    </td>


                                                    <td>

                                                        <div className="requester-cell">

                                                            <div className="requester-avatar">

                                                                {(
                                                                    ticket
                                                                        .createdBy
                                                                        ?.name ||
                                                                    "U"
                                                                )
                                                                    .charAt(0)
                                                                    .toUpperCase()}

                                                            </div>


                                                            <div>

                                                                <strong>
                                                                    {
                                                                        ticket
                                                                            .createdBy
                                                                            ?.name ||
                                                                        "Unknown"
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    {
                                                                        ticket
                                                                            .createdBy
                                                                            ?.email ||
                                                                        "-"
                                                                    }
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    <td className="subject-cell">

                                                        {
                                                            ticket.title ||
                                                            "Untitled Ticket"
                                                        }

                                                    </td>


                                                    <td>

                                                        {
                                                            ticket.department ||
                                                            "-"
                                                        }

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={`status-badge ${getStatusClass(
                                                                ticket.status
                                                            )}`}
                                                        >

                                                            {
                                                                ticket.status ||
                                                                "-"
                                                            }

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={`priority-badge ${getPriorityClass(
                                                                ticket.priority
                                                            )}`}
                                                        >

                                                            {
                                                                ticket.priority ||
                                                                "-"
                                                            }

                                                        </span>

                                                    </td>


                                                    <td>

                                                        {
                                                            ticket
                                                                .assignedTo
                                                                ?.name ||
                                                            "Unassigned"
                                                        }

                                                    </td>


                                                    <td>

                                                        {
                                                            formatDate(
                                                                ticket.createdAt
                                                            )
                                                        }

                                                    </td>

                                                </tr>

                                            )
                                        )

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="8"
                                                className="empty-table"
                                            >

                                                {loading
                                                    ? "Loading tickets..."
                                                    : "No tickets found."}

                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>


                    {/* =================================================
                        QUICK ACTIONS
                    ================================================= */}

                    <div className="quick-actions-panel">

                        <div>

                            <h3>
                                Admin Management
                            </h3>

                            <p>
                                Manage HelpDesk operations
                            </p>

                        </div>


                        <div className="quick-action-buttons">

                            <button
                                onClick={() =>
                                    navigate("/admin/tickets")
                                }
                            >
                                🎫 Manage Tickets
                            </button>


                            <button
                                onClick={() =>
                                    navigate("/admin/users")
                                }
                            >
                                👥 Manage Users
                            </button>


                            <button
                                onClick={() =>
                                    navigate("/admin/departments")
                                }
                            >
                                🏢 Departments
                            </button>


                            <button
                                onClick={() =>
                                    navigate("/admin/reports")
                                }
                            >
                                📊 Reports
                            </button>


                            <button
                                className="logout-action"
                                onClick={handleLogout}
                            >
                                🚪 Logout
                            </button>

                        </div>

                    </div>


                </section>

            </main>

        </div>

    );

};


export default AdminDashboard;