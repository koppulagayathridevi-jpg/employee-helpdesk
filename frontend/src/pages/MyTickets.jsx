import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../api/api";

import "../styles/mytickets.css";


function MyTickets() {

    // =========================
    // STATE
    // =========================

    const [tickets, setTickets] = useState([]);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("All Status");

    const [priorityFilter, setPriorityFilter] = useState("All Priorities");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =========================
    // FETCH TICKETS
    // =========================

    useEffect(() => {
        fetchTickets();
    }, []);


    const fetchTickets = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await API.get("/tickets");

            console.log(
                "Tickets response:",
                response.data
            );

            setTickets(
                response.data.tickets || []
            );

        } catch (error) {

            console.error(
                "Fetch tickets error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load tickets."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // FILTER TICKETS
    // =========================

    const filteredTickets = tickets.filter((ticket) => {

        const searchText =
            search.toLowerCase().trim();


        const ticketId =
            ticket._id
                ? ticket._id.toLowerCase()
                : "";


        const ticketTitle =
            ticket.title
                ? ticket.title.toLowerCase()
                : "";


        const matchesSearch =
            ticketTitle.includes(searchText) ||
            ticketId.includes(searchText);


        const matchesStatus =
            statusFilter === "All Status" ||
            ticket.status === statusFilter;


        const matchesPriority =
            priorityFilter === "All Priorities" ||
            ticket.priority === priorityFilter;


        return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority
        );

    });


    // =========================
    // STATUS CLASS
    // =========================

    const getStatusClass = (status) => {

        switch (status) {

            case "Open":
                return "status-open";

            case "In Progress":
                return "status-progress";

            case "Resolved":
                return "status-resolved";

            case "Closed":
                return "status-resolved";

            default:
                return "";

        }

    };


    // =========================
    // PRIORITY CLASS
    // =========================

    const getPriorityClass = (priority) => {

        switch (priority) {

            case "Critical":
                return "priority-high";

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


    // =========================
    // FORMAT DATE
    // =========================

    const formatDate = (date) => {

        if (!date) {

            return {
                date: "-",
                time: "-"
            };

        }


        const ticketDate = new Date(date);


        if (Number.isNaN(ticketDate.getTime())) {

            return {
                date: "-",
                time: "-"
            };

        }


        return {

            date: ticketDate.toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            ),

            time: ticketDate.toLocaleTimeString(
                "en-US",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            )

        };

    };


    // =========================
    // LOADING SCREEN
    // =========================

    if (loading) {

        return (

            <div className="mytickets-page">

                <div className="tickets-loading">

                    <i className="bi bi-arrow-repeat"></i>

                    <h3>
                        Loading your tickets...
                    </h3>

                    <p>
                        Please wait while we fetch your support requests.
                    </p>

                </div>

            </div>

        );

    }


    // =========================
    // ERROR SCREEN
    // =========================

    if (error) {

        return (

            <div className="mytickets-page">

                <div className="tickets-error">

                    <i className="bi bi-exclamation-circle"></i>

                    <h3>
                        Unable to load tickets
                    </h3>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        className="filter-reset"
                        onClick={fetchTickets}
                    >

                        <i className="bi bi-arrow-repeat"></i>

                        Try Again

                    </button>

                </div>

            </div>

        );

    }


    return (

        <div className="mytickets-page">


            {/* =====================================
                PAGE HEADER
            ===================================== */}

            <div className="mytickets-header">

                <div>

                    <span className="page-label">
                        SUPPORT CENTER
                    </span>

                    <h1>
                        My Tickets
                    </h1>

                    <p>
                        Track and manage all your support requests.
                    </p>

                </div>


                <Link
                    to="/create-ticket"
                    className="new-ticket-btn"
                >

                    <i className="bi bi-plus-lg"></i>

                    New Ticket

                </Link>

            </div>


            {/* =====================================
                FILTER BAR
            ===================================== */}

            <div className="ticket-filter-card">


                {/* Search */}

                <div className="ticket-search">

                    <i className="bi bi-search"></i>

                    <input
                        type="text"
                        placeholder="Search by ticket ID or subject..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>


                {/* Status */}

                <div className="ticket-filter">

                    <i className="bi bi-funnel"></i>

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                    >

                        <option value="All Status">
                            All Status
                        </option>

                        <option value="Open">
                            Open
                        </option>

                        <option value="In Progress">
                            In Progress
                        </option>

                        <option value="Resolved">
                            Resolved
                        </option>

                        <option value="Closed">
                            Closed
                        </option>

                    </select>

                </div>


                {/* Priority */}

                <div className="ticket-filter">

                    <select
                        value={priorityFilter}
                        onChange={(e) =>
                            setPriorityFilter(e.target.value)
                        }
                    >

                        <option value="All Priorities">
                            All Priorities
                        </option>

                        <option value="Critical">
                            Critical
                        </option>

                        <option value="High">
                            High
                        </option>

                        <option value="Medium">
                            Medium
                        </option>

                        <option value="Low">
                            Low
                        </option>

                    </select>

                </div>


                {/* Reset */}

                <button
                    type="button"
                    className="filter-reset"
                    onClick={() => {

                        setSearch("");

                        setStatusFilter("All Status");

                        setPriorityFilter("All Priorities");

                    }}
                >

                    <i className="bi bi-arrow-counterclockwise"></i>

                    Reset

                </button>

            </div>


            {/* =====================================
                TICKET SUMMARY
            ===================================== */}

            <div className="ticket-summary">

                <div>

                    <strong>
                        {filteredTickets.length}
                    </strong>

                    <span>
                        tickets found
                    </span>

                </div>


                <span className="last-updated">

                    <i className="bi bi-clock"></i>

                    Updated just now

                </span>

            </div>


            {/* =====================================
                TICKET TABLE
            ===================================== */}

            <div className="tickets-table-card">

                <div className="table-wrapper">

                    <table className="tickets-table">

                        <thead>

                            <tr>

                                <th>
                                    TICKET
                                </th>

                                <th>
                                    SUBJECT
                                </th>

                                <th>
                                    CATEGORY
                                </th>

                                <th>
                                    PRIORITY
                                </th>

                                <th>
                                    STATUS
                                </th>

                                <th>
                                    CREATED
                                </th>

                                <th>
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredTickets.length > 0 ? (

                                filteredTickets.map((ticket) => {

                                    const formattedDate =
                                        formatDate(ticket.createdAt);


                                    return (

                                        <tr
                                            key={ticket._id}
                                        >


                                            {/* =================================
                                                TICKET ID
                                            ================================= */}

                                            <td>

                                                <div className="ticket-id">

                                                    <div className="ticket-icon">

                                                        <i className="bi bi-ticket-perforated"></i>

                                                    </div>

                                                    <strong>

                                                        TK-
                                                        {ticket._id
                                                            ? ticket._id
                                                                .slice(-6)
                                                                .toUpperCase()
                                                            : "N/A"
                                                        }

                                                    </strong>

                                                </div>

                                            </td>


                                            {/* =================================
                                                SUBJECT
                                            ================================= */}

                                            <td>

                                                <div className="ticket-subject">

                                                    <strong>
                                                        {ticket.title || "Untitled Ticket"}
                                                    </strong>

                                                    <span>
                                                        Support request
                                                    </span>

                                                </div>

                                            </td>


                                            {/* =================================
                                                CATEGORY
                                            ================================= */}

                                            <td>

                                                <span className="category-text">

                                                    <i className="bi bi-folder2"></i>

                                                    {ticket.category || "Other"}

                                                </span>

                                            </td>


                                            {/* =================================
                                                PRIORITY
                                            ================================= */}

                                            <td>

                                                <span
                                                    className={`priority-badge ${getPriorityClass(ticket.priority)}`}
                                                >

                                                    <span className="badge-dot"></span>

                                                    {ticket.priority || "Medium"}

                                                </span>

                                            </td>


                                            {/* =================================
                                                STATUS
                                            ================================= */}

                                            <td>

                                                <span
                                                    className={`status-badge ${getStatusClass(ticket.status)}`}
                                                >

                                                    {ticket.status || "Open"}

                                                </span>

                                            </td>


                                            {/* =================================
                                                CREATED
                                            ================================= */}

                                            <td>

                                                <div className="created-date">

                                                    <strong>
                                                        {formattedDate.date}
                                                    </strong>

                                                    <span>
                                                        {formattedDate.time}
                                                    </span>

                                                </div>

                                            </td>


                                            {/* =================================
                                                VIEW TICKET
                                            ================================= */}

                                            <td>

                                                <Link
                                                    to={`/tickets/${ticket._id}`}
                                                    className="view-ticket-btn"
                                                    title="View ticket"
                                                >

                                                    <i className="bi bi-arrow-up-right"></i>

                                                </Link>

                                            </td>

                                        </tr>

                                    );

                                })

                            ) : (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="no-tickets"
                                    >

                                        <div>

                                            <i className="bi bi-search"></i>

                                            <h3>
                                                No tickets found
                                            </h3>

                                            <p>
                                                Try changing your search
                                                or filters.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>


                {/* =================================
                    PAGINATION
                ================================= */}

                <div className="tickets-pagination">

                    <span>

                        Showing {filteredTickets.length}
                        {" "}
                        of {tickets.length} tickets

                    </span>


                    <div className="pagination-buttons">

                        <button
                            type="button"
                            disabled
                        >

                            <i className="bi bi-chevron-left"></i>

                        </button>


                        <button
                            type="button"
                            className="active-page"
                        >
                            1
                        </button>


                        <button
                            type="button"
                            disabled
                        >
                            2
                        </button>


                        <button
                            type="button"
                            disabled
                        >
                            3
                        </button>


                        <button
                            type="button"
                            disabled
                        >

                            <i className="bi bi-chevron-right"></i>

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default MyTickets;