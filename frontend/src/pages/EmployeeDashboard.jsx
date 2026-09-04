import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../api/api";

import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import TicketCard from "../components/TicketCard";

import "../styles/dashboard.css";

function EmployeeDashboard() {

    const [user, setUser] = useState(null);
    const [tickets, setTickets] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {

        try {

            setLoading(true);
            setError("");

            // Get logged-in employee
            const profileResponse = await API.get("/users/me");

            setUser(profileResponse.data.user);


            // Get employee tickets
            const ticketsResponse = await API.get("/tickets");

            setTickets(ticketsResponse.data.tickets || []);

        } catch (error) {

            console.error(
                "Dashboard data error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load dashboard data."
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // TICKET STATISTICS
    // =========================

    const totalTickets = tickets.length;

    const openTickets = tickets.filter(
        ticket => ticket.status === "Open"
    ).length;

    const inProgressTickets = tickets.filter(
        ticket => ticket.status === "In Progress"
    ).length;

    const resolvedTickets = tickets.filter(
        ticket =>
            ticket.status === "Resolved" ||
            ticket.status === "Closed"
    ).length;


    // Recent 4 tickets
    const recentTickets = tickets.slice(0, 4);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <Layout
                role="employee"
                userName="Loading..."
            >

                <div className="dashboard-page">

                    <div className="dashboard-loading">

                        <i className="bi bi-arrow-repeat"></i>

                        <p>
                            Loading your dashboard...
                        </p>

                    </div>

                </div>

            </Layout>
        );
    }


    // =========================
    // ERROR
    // =========================

    if (error) {

        return (
            <Layout
                role="employee"
                userName="Employee"
            >

                <div className="dashboard-page">

                    <div className="dashboard-error">

                        <i className="bi bi-exclamation-circle"></i>

                        <h2>
                            Unable to load dashboard
                        </h2>

                        <p>
                            {error}
                        </p>

                        <button
                            onClick={fetchDashboardData}
                            className="dashboard-retry-btn"
                        >
                            Try Again
                        </button>

                    </div>

                </div>

            </Layout>
        );
    }


    return (

        <Layout
            role="employee"
            userName={user?.name || "Employee"}
        >

            <div className="dashboard-page">


                {/* =========================
                    PAGE HEADER
                ========================= */}

                <div className="dashboard-header">

                    <div>

                        <span className="dashboard-eyebrow">
                            EMPLOYEE WORKSPACE
                        </span>

                        <h1>
                            Good afternoon, {user?.name || "Employee"} 👋
                        </h1>

                        <p>
                            Here's what's happening with your
                            support requests today.
                        </p>

                    </div>


                    <Link
                        to="/create-ticket"
                        className="dashboard-create-btn"
                    >

                        <i className="bi bi-plus-lg"></i>

                        New Ticket

                    </Link>

                </div>


                {/* =========================
                    EMPLOYEE INFORMATION
                ========================= */}
<div className="employee-info">

    <div className="employee-info-item">
        <span className="employee-info-label">
            Employee ID
        </span>

        <strong className="employee-info-value">
            {user?.employeeId || "-"}
        </strong>
    </div>


    <div className="employee-info-item">
        <span className="employee-info-label">
            Department
        </span>

        <strong className="employee-info-value">
            {user?.department || "-"}
        </strong>
    </div>


    <div className="employee-info-item">
        <span className="employee-info-label">
            Email
        </span>

        <strong className="employee-info-value employee-email">
            {user?.email || "-"}
        </strong>
    </div>

</div>
             


                {/* =========================
                    STAT CARDS
                ========================= */}

                <div className="stats-grid">

                    <StatCard
                        title="Total Tickets"
                        value={totalTickets}
                        subtitle="All requests"
                        icon="bi-ticket-perforated"
                        type="green"
                    />

                    <StatCard
                        title="Open Tickets"
                        value={openTickets}
                        subtitle="Waiting for support"
                        icon="bi-folder2-open"
                        type="orange"
                    />

                    <StatCard
                        title="In Progress"
                        value={inProgressTickets}
                        subtitle="Being handled"
                        icon="bi-arrow-repeat"
                        type="blue"
                    />

                    <StatCard
                        title="Resolved"
                        value={resolvedTickets}
                        subtitle="Successfully solved"
                        icon="bi-check2-circle"
                        type="purple"
                    />

                </div>


                {/* =========================
                    MAIN GRID
                ========================= */}

                <div className="dashboard-grid">


                    {/* Recent Tickets */}

                    <section className="dashboard-card recent-section">

                        <div className="card-header">

                            <div>

                                <h2>
                                    Recent Tickets
                                </h2>

                                <p>
                                    Your latest support requests
                                </p>

                            </div>

                            <Link to="/tickets">

                                View all

                                <i className="bi bi-arrow-up-right"></i>

                            </Link>

                        </div>


                        <div className="ticket-list">

                            {recentTickets.length > 0 ? (

                                recentTickets.map((ticket) => (

                                    <TicketCard
                                        key={ticket._id}
                                        id={
                                            ticket._id
                                                ? ticket._id.slice(-6).toUpperCase()
                                                : "N/A"
                                        }
                                        title={ticket.title}
                                        department={
                                            ticket.department ||
                                            user?.department ||
                                            "Other"
                                        }
                                        priority={ticket.priority}
                                        status={ticket.status}
                                        time={
                                            new Date(
                                                ticket.createdAt
                                            ).toLocaleDateString()
                                        }
                                    />

                                ))

                            ) : (

                                <div className="empty-tickets">

                                    <i className="bi bi-ticket-perforated"></i>

                                    <p>
                                        You haven't created any tickets yet.
                                    </p>

                                    <Link to="/create-ticket">
                                        Create your first ticket
                                    </Link>

                                </div>

                            )}

                        </div>

                    </section>


                    {/* Ticket Overview */}

                    <section className="dashboard-card overview-card">

                        <div className="card-header">

                            <div>

                                <h2>
                                    Ticket Overview
                                </h2>

                                <p>
                                    Current ticket distribution
                                </p>

                            </div>

                        </div>


                        <div className="donut-wrapper">

                            <div
                                className="donut-chart"
                                style={{
                                    "--open": openTickets,
                                    "--progress": inProgressTickets,
                                    "--resolved": resolvedTickets
                                }}
                            >

                                <div className="donut-center">

                                    <strong>
                                        {totalTickets}
                                    </strong>

                                    <span>
                                        Total
                                    </span>

                                </div>

                            </div>

                        </div>


                        <div className="chart-legend">

                            <div>

                                <span className="legend-dot open"></span>

                                <span>
                                    Open
                                </span>

                                <strong>
                                    {openTickets}
                                </strong>

                            </div>


                            <div>

                                <span className="legend-dot progress"></span>

                                <span>
                                    In Progress
                                </span>

                                <strong>
                                    {inProgressTickets}
                                </strong>

                            </div>


                            <div>

                                <span className="legend-dot resolved"></span>

                                <span>
                                    Resolved
                                </span>

                                <strong>
                                    {resolvedTickets}
                                </strong>

                            </div>

                        </div>

                    </section>

                </div>


                {/* =========================
                    BOTTOM SECTION
                ========================= */}

                <div className="bottom-grid">


                    {/* Quick Actions */}

                    <section className="dashboard-card quick-actions">

                        <div className="card-header">

                            <div>

                                <h2>
                                    Quick Actions
                                </h2>

                                <p>
                                    Get things done faster
                                </p>

                            </div>

                        </div>


                        <div className="action-grid">

                            <Link
                                to="/create-ticket"
                                className="action-card"
                            >

                                <div className="action-icon create">

                                    <i className="bi bi-plus-lg"></i>

                                </div>

                                <div>

                                    <strong>
                                        Create Ticket
                                    </strong>

                                    <span>
                                        Report a new issue
                                    </span>

                                </div>

                                <i className="bi bi-chevron-right"></i>

                            </Link>


                            <Link
                                to="/tickets"
                                className="action-card"
                            >

                                <div className="action-icon tickets">

                                    <i className="bi bi-ticket"></i>

                                </div>

                                <div>

                                    <strong>
                                        View My Tickets
                                    </strong>

                                    <span>
                                        Track your requests
                                    </span>

                                </div>

                                <i className="bi bi-chevron-right"></i>

                            </Link>


                            <Link
                                to="/knowledge-base"
                                className="action-card"
                            >

                                <div className="action-icon knowledge">

                                    <i className="bi bi-book"></i>

                                </div>

                                <div>

                                    <strong>
                                        Knowledge Base
                                    </strong>

                                    <span>
                                        Find quick solutions
                                    </span>

                                </div>

                                <i className="bi bi-chevron-right"></i>

                            </Link>


                            <Link
                                to="/profile"
                                className="action-card"
                            >

                                <div className="action-icon profile">

                                    <i className="bi bi-person"></i>

                                </div>

                                <div>

                                    <strong>
                                        My Profile
                                    </strong>

                                    <span>
                                        Manage your account
                                    </span>

                                </div>

                                <i className="bi bi-chevron-right"></i>

                            </Link>

                        </div>

                    </section>


                    {/* Support Status */}

                    <section className="dashboard-card support-card">

                        <div className="support-icon">

                            <i className="bi bi-headset"></i>

                        </div>

                        <h2>
                            Need more help?
                        </h2>

                        <p>
                            Our support team is available to help
                            you with technical and workplace issues.
                        </p>

                        <Link to="/create-ticket">

                            Contact Support

                            <i className="bi bi-arrow-right"></i>

                        </Link>

                    </section>

                </div>

            </div>

        </Layout>
    );
}

export default EmployeeDashboard;