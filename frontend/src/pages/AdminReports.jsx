import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

import "../styles/admin-reports.css";

const AdminReports = () => {
    const navigate = useNavigate();

   const [reports, setReports] = useState({
    ticketsByStatus: [],
    ticketsByPriority: [],
    ticketsByDepartment: [],
    ticketsByCategory: [],
    agentWorkload: [],
    agentPerformance: []
});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // FETCH REPORTS
    // ==========================================

    const fetchReports = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/admin/reports");
if (response.data.success) {

    const reportData =
        response.data.reports || response.data;

    setReports({
        ticketsByStatus:
            reportData.ticketsByStatus || [],

        ticketsByPriority:
            reportData.ticketsByPriority || [],

        ticketsByDepartment:
            reportData.ticketsByDepartment || [],

        ticketsByCategory:
            reportData.ticketsByCategory || [],

        agentWorkload:
            reportData.agentWorkload || [],

        agentPerformance:
            reportData.agentPerformance || []
    });
}
            
    
        } catch (err) {
            console.error("Admin reports error:", err);

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
                "Failed to load reports."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    // ==========================================
    // DATA HELPERS
    // ==========================================

    const getChartName = (item) => {
        return (
            item._id ||
            item.name ||
            item.status ||
            item.priority ||
            item.department ||
            item.category ||
            "Unknown"
        );
    };

    const getChartValue = (item) => {
        return (
            item.count ??
            item.total ??
            item.ticketCount ??
            0
        );
    };

    const prepareData = (data) => {
        return data.map((item) => ({
            name: getChartName(item),
            count: Number(getChartValue(item)) || 0
        }));
    };

    const statusData = prepareData(
        reports.ticketsByStatus
    );

    const priorityData = prepareData(
        reports.ticketsByPriority
    );

    const departmentData = prepareData(
        reports.ticketsByDepartment
    );

    const categoryData = prepareData(
        reports.ticketsByCategory
    );

    const agentData = reports.agentWorkload.map(
        (item) => ({
            id: item._id,

            name:
                item.name ||
                item.agentName ||
                "Unknown Agent",

            email:
                item.email || "",

            employeeId:
                item.employeeId || "",

            department:
                item.department || "",

            count:
                Number(
                    item.count ??
                    item.ticketCount ??
                    item.total ??
                    0
                )
        })
    );
const performanceData = reports.agentPerformance.map(
    (agent) => ({
        id: agent.agentId,

        name: agent.agentName || "Unknown Agent",

        email: agent.email || "",

        employeeId: agent.employeeId || "",

        department: agent.department || "",

        totalAssigned:
            Number(agent.totalAssigned) || 0,

        inProgressTickets:
            Number(agent.inProgressTickets) || 0,

        resolvedTickets:
            Number(agent.resolvedTickets) || 0,

        closedTickets:
            Number(agent.closedTickets) || 0,

        performancePercentage:
            Number(agent.performancePercentage) || 0
    })
);
    // ==========================================
    // CHART COLORS
    // ==========================================

    const statusColors = {
        Open: "#22c55e",
        Assigned: "#3b82f6",
        "In Progress": "#8b5cf6",
        "Waiting for Employee": "#f59e0b",
        Resolved: "#14b8a6",
        Closed: "#64748b"
    };

    const priorityColors = {
        Critical: "#dc2626",
        High: "#f97316",
        Medium: "#f59e0b",
        Low: "#22c55e"
    };

    const departmentColors = [
        "#3b82f6",
        "#8b5cf6",
        "#14b8a6",
        "#f59e0b",
        "#ec4899",
        "#06b6d4"
    ];

    const categoryColors = [
        "#6366f1",
        "#ec4899",
        "#14b8a6",
        "#f59e0b",
        "#ef4444",
        "#06b6d4",
        "#8b5cf6"
    ];

    const agentColors = [
        "#2563eb",
        "#7c3aed",
        "#059669",
        "#ea580c",
        "#db2777",
        "#0891b2"
    ];

    // ==========================================
    // SUMMARY
    // ==========================================

    const totalStatusTickets = statusData.reduce(
        (sum, item) => sum + item.count,
        0
    );

    const totalPriorityTickets = priorityData.reduce(
        (sum, item) => sum + item.count,
        0
    );

    const totalAssignedTickets = agentData.reduce(
        (sum, agent) => sum + agent.count,
        0
    );

    const totalDepartments =
        departmentData.length;

    const totalAgents =
        agentData.length;

    // ==========================================
    // PERFORMANCE
    // ==========================================


    return (
        <div className="admin-reports-page">

            {/* =====================================
                HEADER
            ====================================== */}

            <div className="reports-header">

                <div className="reports-title-section">

                    <div className="reports-title-icon">
                        📊
                    </div>

                    <div>
                        <h2>
                            Reports & Analytics
                        </h2>

                        <p>
                            Monitor HelpDesk performance and
                            ticket analytics
                        </p>
                    </div>

                </div>

                <div className="reports-header-actions">

                    <button
                        className="reports-back-btn"
                        onClick={() =>
                            navigate("/admin-dashboard")
                        }
                    >
                        ← Dashboard
                    </button>

                    <button
                        className="reports-refresh-btn"
                        onClick={fetchReports}
                        disabled={loading}
                    >
                        {loading
                            ? "Refreshing..."
                            : "↻ Refresh"}
                    </button>

                </div>

            </div>

            {/* =====================================
                ERROR
            ====================================== */}

            {error && (
                <div className="reports-error">

                    <div className="reports-error-message">

                        <span className="error-icon">
                            ⚠️
                        </span>

                        <span>
                            {error}
                        </span>

                    </div>

                    <button
                        onClick={fetchReports}
                    >
                        Retry
                    </button>

                </div>
            )}

            {/* =====================================
                SUMMARY
            ====================================== */}

            <div className="reports-summary">

                <div className="report-summary-card summary-blue">

                    <div className="report-summary-icon">
                        🎫
                    </div>

                    <div className="report-summary-content">

                        <strong>
                            {loading
                                ? "..."
                                : totalStatusTickets}
                        </strong>

                        <span>
                            Total Tickets
                        </span>

                    </div>

                </div>

                <div className="report-summary-card summary-purple">

                    <div className="report-summary-icon">
                        📊
                    </div>

                    <div className="report-summary-content">

                        <strong>
                            {loading
                                ? "..."
                                : statusData.length}
                        </strong>

                        <span>
                            Status Categories
                        </span>

                    </div>

                </div>

                <div className="report-summary-card summary-orange">

                    <div className="report-summary-icon">
                        🏢
                    </div>

                    <div className="report-summary-content">

                        <strong>
                            {loading
                                ? "..."
                                : totalDepartments}
                        </strong>

                        <span>
                            Departments
                        </span>

                    </div>

                </div>

                <div className="report-summary-card summary-green">

                    <div className="report-summary-icon">
                        👨‍💻
                    </div>

                    <div className="report-summary-content">

                        <strong>
                            {loading
                                ? "..."
                                : totalAgents}
                        </strong>

                        <span>
                            Active Agents
                        </span>

                    </div>

                </div>

            </div>

            {/* =====================================
                LOADING
            ====================================== */}

            {loading ? (

                <div className="reports-loading">

                    <div className="reports-spinner"></div>

                    <h4>
                        Loading Analytics
                    </h4>

                    <p>
                        Please wait while we prepare
                        the reports...
                    </p>

                </div>

            ) : (

                <>

                    {/* =================================
                        STATUS + PRIORITY
                    ================================== */}

                    <div className="reports-chart-grid">

                        {/* STATUS */}

                        <div className="report-chart-card status-card">

                            <div className="chart-card-header">

                                <div>

                                    <span className="chart-label status-label">
                                        WORKFLOW
                                    </span>

                                    <h4>
                                        Tickets by Status
                                    </h4>

                                    <p>
                                        Current ticket workflow
                                    </p>

                                </div>

                                <div className="chart-header-icon status-icon">
                                    📌
                                </div>

                            </div>

                            <div className="chart-container">

                                {statusData.length > 0 ? (

                                    <ResponsiveContainer
                                        width="100%"
                                        height={320}
                                    >

                                        <BarChart
                                            data={statusData}
                                            margin={{
                                                top: 10,
                                                right: 10,
                                                left: 0,
                                                bottom: 10
                                            }}
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                vertical={false}
                                            />

                                            <XAxis
                                                dataKey="name"
                                                tick={{
                                                    fontSize: 12
                                                }}
                                            />

                                            <YAxis
                                                allowDecimals={false}
                                            />

                                            <Tooltip />

                                            <Legend />

                                            <Bar
                                                dataKey="count"
                                                name="Tickets"
                                                radius={[
                                                    7,
                                                    7,
                                                    0,
                                                    0
                                                ]}
                                            >

                                                {statusData.map(
                                                    (entry, index) => (

                                                        <Cell
                                                            key={`status-${index}`}
                                                            fill={
                                                                statusColors[
                                                                    entry.name
                                                                ] ||
                                                                "#64748b"
                                                            }
                                                        />

                                                    )
                                                )}

                                            </Bar>

                                        </BarChart>

                                    </ResponsiveContainer>

                                ) : (

                                    <div className="empty-chart">
                                        📭
                                        <span>
                                            No status data available
                                        </span>
                                    </div>

                                )}

                            </div>

                        </div>


                        {/* PRIORITY */}

                        <div className="report-chart-card priority-card">

                            <div className="chart-card-header">

                                <div>

                                    <span className="chart-label priority-label">
                                        PRIORITY
                                    </span>

                                    <h4>
                                        Tickets by Priority
                                    </h4>

                                    <p>
                                        Priority distribution
                                    </p>

                                </div>

                                <div className="chart-header-icon priority-icon">
                                    🚨
                                </div>

                            </div>

                            <div className="chart-container">

                                {priorityData.length > 0 ? (

                                    <ResponsiveContainer
                                        width="100%"
                                        height={320}
                                    >

                                        <PieChart>

                                            <Pie
                                                data={priorityData}
                                                dataKey="count"
                                                nameKey="name"
                                                cx="50%"
                                                cy="46%"
                                                outerRadius={105}
                                                label
                                            >

                                                {priorityData.map(
                                                    (
                                                        entry,
                                                        index
                                                    ) => (

                                                        <Cell
                                                            key={`priority-${index}`}
                                                            fill={
                                                                priorityColors[
                                                                    entry.name
                                                                ] ||
                                                                "#64748b"
                                                            }
                                                        />

                                                    )
                                                )}

                                            </Pie>

                                            <Tooltip />

                                            <Legend />

                                        </PieChart>

                                    </ResponsiveContainer>

                                ) : (

                                    <div className="empty-chart">
                                        📭
                                        <span>
                                            No priority data available
                                        </span>
                                    </div>

                                )}

                            </div>

                        </div>

                    </div>


                    {/* =================================
                        DEPARTMENT + CATEGORY
                    ================================== */}

                    <div className="reports-chart-grid">

                        {/* DEPARTMENT */}

                        <div className="report-chart-card department-card">

                            <div className="chart-card-header">

                                <div>

                                    <span className="chart-label department-label">
                                        DEPARTMENTS
                                    </span>

                                    <h4>
                                        Tickets by Department
                                    </h4>

                                    <p>
                                        Department workload
                                    </p>

                                </div>

                                <div className="chart-header-icon department-icon">
                                    🏢
                                </div>

                            </div>

                            <div className="chart-container">

                                {departmentData.length > 0 ? (

                                    <ResponsiveContainer
                                        width="100%"
                                        height={320}
                                    >

                                        <BarChart
                                            data={departmentData}
                                            layout="vertical"
                                            margin={{
                                                top: 10,
                                                right: 20,
                                                left: 15,
                                                bottom: 10
                                            }}
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                horizontal={false}
                                            />

                                            <XAxis
                                                type="number"
                                                allowDecimals={false}
                                            />

                                            <YAxis
                                                type="category"
                                                dataKey="name"
                                                width={110}
                                                tick={{
                                                    fontSize: 12
                                                }}
                                            />

                                            <Tooltip />

                                            <Legend />

                                            <Bar
                                                dataKey="count"
                                                name="Tickets"
                                                radius={[
                                                    0,
                                                    7,
                                                    7,
                                                    0
                                                ]}
                                            >

                                                {departmentData.map(
                                                    (
                                                        entry,
                                                        index
                                                    ) => (

                                                        <Cell
                                                            key={`department-${index}`}
                                                            fill={
                                                                departmentColors[
                                                                    index %
                                                                    departmentColors.length
                                                                ]
                                                            }
                                                        />

                                                    )
                                                )}

                                            </Bar>

                                        </BarChart>

                                    </ResponsiveContainer>

                                ) : (

                                    <div className="empty-chart">
                                        📭
                                        <span>
                                            No department data available
                                        </span>
                                    </div>

                                )}

                            </div>

                        </div>


                        {/* CATEGORY */}

                        <div className="report-chart-card category-card">

                            <div className="chart-card-header">

                                <div>

                                    <span className="chart-label category-label">
                                        CATEGORIES
                                    </span>

                                    <h4>
                                        Tickets by Category
                                    </h4>

                                    <p>
                                        Support request categories
                                    </p>

                                </div>

                                <div className="chart-header-icon category-icon">
                                    📁
                                </div>

                            </div>

                            <div className="chart-container">

                                {categoryData.length > 0 ? (

                                    <ResponsiveContainer
                                        width="100%"
                                        height={320}
                                    >

                                        <BarChart
                                            data={categoryData}
                                            margin={{
                                                top: 10,
                                                right: 10,
                                                left: 0,
                                                bottom: 10
                                            }}
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                vertical={false}
                                            />

                                            <XAxis
                                                dataKey="name"
                                                tick={{
                                                    fontSize: 12
                                                }}
                                            />

                                            <YAxis
                                                allowDecimals={false}
                                            />

                                            <Tooltip />

                                            <Legend />

                                            <Bar
                                                dataKey="count"
                                                name="Tickets"
                                                radius={[
                                                    7,
                                                    7,
                                                    0,
                                                    0
                                                ]}
                                            >

                                                {categoryData.map(
                                                    (
                                                        entry,
                                                        index
                                                    ) => (

                                                        <Cell
                                                            key={`category-${index}`}
                                                            fill={
                                                                categoryColors[
                                                                    index %
                                                                    categoryColors.length
                                                                ]
                                                            }
                                                        />

                                                    )
                                                )}

                                            </Bar>

                                        </BarChart>

                                    </ResponsiveContainer>

                                ) : (

                                    <div className="empty-chart">
                                        📭
                                        <span>
                                            No category data available
                                        </span>
                                    </div>

                                )}

                            </div>

                        </div>

                    </div>


                    {/* =================================
                        AGENT WORKLOAD
                    ================================== */}
{/* =================================
    AGENT WORKLOAD
================================== */}

<div className="report-chart-card agent-workload-card">

    <div className="chart-card-header">

        <div>

            <span className="chart-label agent-label">
                SUPPORT TEAM
            </span>

            <h4>
                Agent Workload
            </h4>

            <p>
                Tickets assigned to support agents
            </p>

        </div>

        <div className="chart-header-icon agent-icon">
            👨‍💻
        </div>

    </div>

    <div className="chart-container">

        {agentData.length > 0 ? (

            <ResponsiveContainer
                width="100%"
                height={350}
            >

                <BarChart
                    data={agentData}
                    margin={{
                        top: 10,
                        right: 20,
                        left: 0,
                        bottom: 10
                    }}
                >

                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="name"
                        tick={{
                            fontSize: 12
                        }}
                    />

                    <YAxis
                        allowDecimals={false}
                    />

                    <Tooltip />

                    <Legend />

                    <Bar
                        dataKey="count"
                        name="Assigned Tickets"
                        radius={[
                            7,
                            7,
                            0,
                            0
                        ]}
                    >

                        {agentData.map(
                            (entry, index) => (

                                <Cell
                                    key={`agent-${index}`}
                                    fill={
                                        agentColors[
                                            index %
                                            agentColors.length
                                        ]
                                    }
                                />

                            )
                        )}

                    </Bar>

                </BarChart>

            </ResponsiveContainer>

        ) : (

            <div className="empty-chart">

                📭

                <span>
                    No agent workload data available
                </span>

            </div>

        )}

    </div>

</div>
{/* =================================
    AGENT WORKLOAD
================================== */}

<div className="report-chart-card agent-workload-card">

    <div className="chart-card-header">

        <div>

            <span className="chart-label agent-label">
                SUPPORT TEAM
            </span>

            <h4>
                Agent Workload
            </h4>

            <p>
                Tickets assigned to support agents
            </p>

        </div>

        <div className="chart-header-icon agent-icon">
            👨‍💻
        </div>

    </div>

    <div className="chart-container">

        {agentData.length > 0 ? (

            <ResponsiveContainer
                width="100%"
                height={350}
            >

                <BarChart
                    data={agentData}
                    margin={{
                        top: 10,
                        right: 20,
                        left: 0,
                        bottom: 10
                    }}
                >

                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="name"
                        tick={{
                            fontSize: 12
                        }}
                    />

                    <YAxis
                        allowDecimals={false}
                    />

                    <Tooltip />

                    <Legend />

                    <Bar
                        dataKey="count"
                        name="Assigned Tickets"
                        radius={[
                            7,
                            7,
                            0,
                            0
                        ]}
                    >

                        {agentData.map(
                            (entry, index) => (

                                <Cell
                                    key={`agent-${index}`}
                                    fill={
                                        agentColors[
                                            index %
                                            agentColors.length
                                        ]
                                    }
                                />

                            )
                        )}

                    </Bar>

                </BarChart>

            </ResponsiveContainer>

        ) : (

            <div className="empty-chart">

                📭

                <span>
                    No agent workload data available
                </span>

            </div>

        )}

    </div>

</div>

{/* =================================
    AGENT PERFORMANCE
================================== */}

<div className="report-chart-card agent-performance-card">

    <div className="chart-card-header">

        <div>

            <span className="chart-label performance-label">
                PERFORMANCE
            </span>

            <h4>
                Agent Performance
            </h4>

            <p>
                Support agent completion performance
            </p>

        </div>

        <div className="chart-header-icon performance-icon">
            ⭐
        </div>

    </div>


    {performanceData.length === 0 ? (

        <div className="empty-performance">

            <span>
                📭
            </span>

            <p>
                No agent performance data available.
            </p>

        </div>

    ) : (

        <div className="agent-performance-list">

            {performanceData.map(
                (agent, index) => {

                    const percentage =
                        agent.performancePercentage;

                    let performanceClass =
                        "performance-low";

                    let performanceLabel =
                        "Low";


                    if (percentage >= 80) {

                        performanceClass =
                            "performance-high";

                        performanceLabel =
                            "Excellent";

                    } else if (percentage >= 50) {

                        performanceClass =
                            "performance-good";

                        performanceLabel =
                            "Good";

                    }


                    return (

                        <div
                            className="agent-performance-row"
                            key={
                                agent.id ||
                                index
                            }
                        >

                            {/* AGENT INFORMATION */}

                            <div className="agent-info">

                                <div className="agent-avatar">

                                    {(
                                        agent.name ||
                                        "A"
                                    )
                                        .charAt(0)
                                        .toUpperCase()}

                                </div>


                                <div className="agent-details">

                                    <h5>
                                        {agent.name}
                                    </h5>


                                    {agent.email && (

                                        <p>
                                            {agent.email}
                                        </p>

                                    )}


                                    {agent.employeeId && (

                                        <small>
                                            ID:{" "}
                                            {agent.employeeId}
                                        </small>

                                    )}


                                    {agent.department && (

                                        <small>
                                            Department:{" "}
                                            {agent.department}
                                        </small>

                                    )}

                                </div>

                            </div>


                            {/* TICKET INFORMATION */}

                            <div className="agent-ticket-count">

                                <strong>
                                    {agent.totalAssigned}
                                </strong>

                                <span>
                                    Assigned Tickets
                                </span>


                                <div className="agent-completion-info">

                                    <span>
                                        In Progress:{" "}
                                        {agent.inProgressTickets}
                                    </span>

                                    <span>
                                        Resolved:{" "}
                                        {agent.resolvedTickets}
                                    </span>

                                    <span>
                                        Closed:{" "}
                                        {agent.closedTickets}
                                    </span>

                                </div>

                            </div>


                            {/* PERFORMANCE */}

                            <div className="agent-performance-result">

                                <div className="performance-score">

                                    <strong>
                                        {percentage}%
                                    </strong>


                                    <span
                                        className={
                                            `performance-badge ${performanceClass}`
                                        }
                                    >
                                        {performanceLabel}
                                    </span>

                                </div>

                            </div>

                        </div>

                    );

                }
            )}

        </div>

    )}

</div>

                    {/* =================================
                        OVERVIEW
                    ================================== */}

                    <div className="report-information">

                        <div className="report-information-header">

                            <div className="information-icon">
                                📈
                            </div>

                            <div>

                                <h4>
                                    Report Overview
                                </h4>

                                <p>
                                    A quick summary of HelpDesk
                                    analytics and activity.
                                </p>

                            </div>

                        </div>

                        <div className="report-overview-grid">

                            <div className="overview-item overview-blue">

                                <strong>
                                    {totalPriorityTickets}
                                </strong>

                                <span>
                                    Priority Records
                                </span>

                            </div>

                            <div className="overview-item overview-purple">

                                <strong>
                                    {departmentData.length}
                                </strong>

                                <span>
                                    Departments with Tickets
                                </span>

                            </div>

                            <div className="overview-item overview-green">

                                <strong>
                                    {totalAssignedTickets}
                                </strong>

                                <span>
                                    Assigned Tickets
                                </span>

                            </div>

                        </div>

                    </div>

                </>

            )}

        </div>
    );
};

export default AdminReports;