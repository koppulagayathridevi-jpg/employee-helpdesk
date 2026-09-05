// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";

// import API from "../api/api";

// import "../styles/ticketdetails.css";


// function TicketDetails() {

//     const { id } = useParams();


//     // =========================
//     // STATE
//     // =========================

//     const [ticket, setTicket] = useState(null);

//     const [loading, setLoading] = useState(true);

//     const [error, setError] = useState("");


//     // =========================
//     // FETCH TICKET
//     // =========================

//     useEffect(() => {

//         fetchTicket();

//     }, [id]);


//     const fetchTicket = async () => {

//         try {

//             setLoading(true);

//             setError("");

//             const response = await API.get(
//                 `/tickets/${id}`
//             );

//             console.log(
//                 "Ticket details:",
//                 response.data
//             );

//             setTicket(
//                 response.data.ticket
//             );

//         } catch (error) {

//             console.error(
//                 "Fetch ticket error:",
//                 error
//             );

//             setError(
//                 error.response?.data?.message ||
//                 "Unable to load ticket details."
//             );

//         } finally {

//             setLoading(false);

//         }

//     };


//     // =========================
//     // FORMAT DATE
//     // =========================

//     const formatDate = (date) => {

//         if (!date) {
//             return "-";
//         }


//         const formattedDate =
//             new Date(date);


//         if (
//             Number.isNaN(
//                 formattedDate.getTime()
//             )
//         ) {

//             return "-";

//         }


//         return formattedDate.toLocaleDateString(
//             "en-GB",
//             {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric"
//             }
//         );

//     };


//     // =========================
//     // FORMAT DATE + TIME
//     // =========================

//     const formatDateTime = (date) => {

//         if (!date) {
//             return "-";
//         }


//         const formattedDate =
//             new Date(date);


//         if (
//             Number.isNaN(
//                 formattedDate.getTime()
//             )
//         ) {

//             return "-";

//         }


//         return formattedDate.toLocaleString(
//             "en-US",
//             {
//                 month: "short",
//                 day: "numeric",
//                 year: "numeric",
//                 hour: "2-digit",
//                 minute: "2-digit"
//             }
//         );

//     };


//     // =========================
//     // STATUS CLASS
//     // =========================

//     const getStatusClass = (status) => {

//         switch (status) {

//             case "Open":
//                 return "status-open";

//             case "In Progress":
//                 return "status-progress";

//             case "Resolved":
//                 return "status-resolved";

//             case "Closed":
//                 return "status-resolved";

//             default:
//                 return "";

//         }

//     };


//     // =========================
//     // PRIORITY CLASS
//     // =========================

//     const getPriorityClass = (priority) => {

//         switch (priority) {

//             case "Critical":
//                 return "priority-high";

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


//     // =========================
//     // TICKET DISPLAY ID
//     // =========================

//     const getTicketDisplayId = () => {

//         if (!ticket?._id) {
//             return "N/A";
//         }

//         return `TK-${ticket._id
//             .slice(-6)
//             .toUpperCase()}`;

//     };


//     // =========================
//     // REQUESTER INITIALS
//     // =========================

//     const getRequesterInitials = () => {

//         const name =
//             ticket?.createdBy?.name ||
//             "Employee";


//         return name
//             .split(" ")
//             .map((word) => word.charAt(0))
//             .join("")
//             .slice(0, 2)
//             .toUpperCase();

//     };


//     // =========================
//     // LOADING
//     // =========================

//     if (loading) {

//         return (

//             <div className="ticket-details-page">

//                 <div className="tickets-loading">

//                     <i className="bi bi-arrow-repeat"></i>

//                     <h3>
//                         Loading ticket...
//                     </h3>

//                     <p>
//                         Please wait while we fetch the ticket details.
//                     </p>

//                 </div>

//             </div>

//         );

//     }


//     // =========================
//     // ERROR
//     // =========================

//     if (error || !ticket) {

//         return (

//             <div className="ticket-details-page">

//                 <div className="tickets-error">

//                     <i className="bi bi-exclamation-circle"></i>

//                     <h3>
//                         Unable to load ticket
//                     </h3>

//                     <p>
//                         {error || "Ticket not found."}
//                     </p>

//                     <Link
//                         to="/tickets"
//                         className="details-back-btn"
//                     >

//                         <i className="bi bi-arrow-left"></i>

//                         Back to Tickets

//                     </Link>

//                 </div>

//             </div>

//         );

//     }


//     return (

//         <div className="ticket-details-page">


//             {/* =================================
//                 HEADER
//             ================================= */}

//             <div className="ticket-details-header">

//                 <div>


//                     {/* Breadcrumb */}

//                     <div className="ticket-breadcrumb">

//                         <Link to="/tickets">
//                             My Tickets
//                         </Link>

//                         <i className="bi bi-chevron-right"></i>

//                         <span>
//                             {getTicketDisplayId()}
//                         </span>

//                     </div>


//                     {/* Title */}

//                     <div className="ticket-title-row">

//                         <h1>
//                             {ticket.title}
//                         </h1>

//                         <span
//                             className={`ticket-status-badge ${getStatusClass(ticket.status)}`}
//                         >
//                             {ticket.status || "Open"}
//                         </span>

//                     </div>


//                     <p>

//                         Ticket #{getTicketDisplayId()}

//                         {" · "}

//                         Created {formatDateTime(ticket.createdAt)}

//                     </p>

//                 </div>


//                 {/* Back Button */}

//                 <Link
//                     to="/tickets"
//                     className="details-back-btn"
//                 >

//                     <i className="bi bi-arrow-left"></i>

//                     Back to Tickets

//                 </Link>

//             </div>


//             {/* =================================
//                 CONTENT
//             ================================= */}

//             <div className="ticket-details-layout">


//                 {/* =================================
//                     MAIN TICKET
//                 ================================= */}

//                 <main className="ticket-main-card">


//                     {/* =================================
//                         TICKET INFORMATION
//                     ================================= */}

//                     <div className="ticket-info-grid">


//                         {/* Department */}

//                         <div className="detail-item">

//                             <span>
//                                 Department
//                             </span>

//                             <strong>

//                                 <i className="bi bi-building"></i>

//                                 {ticket.department ||
//                                     ticket.createdBy?.department ||
//                                     "Not assigned"}

//                             </strong>

//                         </div>


//                         {/* Category */}

//                         <div className="detail-item">

//                             <span>
//                                 Category
//                             </span>

//                             <strong>

//                                 <i className="bi bi-grid"></i>

//                                 {ticket.category ||
//                                     "Other"}

//                             </strong>

//                         </div>


//                         {/* Priority */}

//                         <div className="detail-item">

//                             <span>
//                                 Priority
//                             </span>

//                             <strong
//                                 className={getPriorityClass(
//                                     ticket.priority
//                                 )}
//                             >

//                                 <i className="bi bi-exclamation-circle"></i>

//                                 {ticket.priority ||
//                                     "Medium"}

//                             </strong>

//                         </div>


//                         {/* Last Updated */}

//                         <div className="detail-item">

//                             <span>
//                                 Last Updated
//                             </span>

//                             <strong>

//                                 <i className="bi bi-clock"></i>

//                                 {formatDateTime(
//                                     ticket.updatedAt
//                                 )}

//                             </strong>

//                         </div>

//                     </div>


//                     {/* =================================
//                         DESCRIPTION
//                     ================================= */}

//                     <section className="ticket-description-section">


//                         <div className="section-heading">

//                             <div className="section-heading-icon">

//                                 <i className="bi bi-file-text"></i>

//                             </div>

//                             <div>

//                                 <h2>
//                                     Issue Description
//                                 </h2>

//                                 <span>
//                                     Details provided with this ticket
//                                 </span>

//                             </div>

//                         </div>


//                         <div className="description-box">

//                             <p>
//                                 {ticket.description ||
//                                     "No description provided."}
//                             </p>

//                         </div>

//                     </section>


//                     {/* =================================
//                         ATTACHMENTS
//                     ================================= */}

//                     <section className="ticket-attachment-section">


//                         <div className="section-heading">

//                             <div className="section-heading-icon">

//                                 <i className="bi bi-paperclip"></i>

//                             </div>

//                             <div>

//                                 <h2>
//                                     Attachments
//                                 </h2>

//                                 <span>
//                                     Files attached to this ticket
//                                 </span>

//                             </div>

//                         </div>


//                         {ticket.attachment ? (

//                             <div className="attachment-file">

//                                 <i className="bi bi-file-earmark"></i>

//                                 <a
//                                     href={ticket.attachment}
//                                     target="_blank"
//                                     rel="noreferrer"
//                                 >
//                                     View Attachment
//                                 </a>

//                             </div>

//                         ) : (

//                             <div className="attachment-empty">

//                                 <i className="bi bi-file-earmark"></i>

//                                 <span>
//                                     No attachments added
//                                 </span>

//                             </div>

//                         )}

//                     </section>


//                     {/* =================================
//                         CONVERSATION
//                     ================================= */}

//                     <section className="conversation-section">


//                         <div className="section-heading">

//                             <div className="section-heading-icon">

//                                 <i className="bi bi-chat-left-text"></i>

//                             </div>

//                             <div>

//                                 <h2>
//                                     Conversation
//                                 </h2>

//                                 <span>
//                                     Communication about this ticket
//                                 </span>

//                             </div>

//                         </div>


//                         <div className="conversation-empty">

//                             <i className="bi bi-chat-dots"></i>

//                             <p>
//                                 No replies yet.
//                             </p>

//                             <span>
//                                 Your support team will respond here.
//                             </span>

//                         </div>

//                     </section>


//                     {/* =================================
//                         REPLY BOX
//                     ================================= */}

//                     <div className="reply-box">

//                         <textarea
//                             placeholder="Write a reply..."
//                             rows="4"
//                         ></textarea>


//                         <div className="reply-actions">


//                             <button
//                                 type="button"
//                                 className="attach-reply-btn"
//                             >

//                                 <i className="bi bi-paperclip"></i>

//                                 Attach

//                             </button>


//                             <button
//                                 type="button"
//                                 className="send-reply-btn"
//                             >

//                                 <i className="bi bi-send"></i>

//                                 Send Reply

//                             </button>

//                         </div>

//                     </div>

//                 </main>


//                 {/* =================================
//                     SIDEBAR
//                 ================================= */}

//                 <aside className="ticket-side-card">


//                     {/* =================================
//                         REQUESTER
//                     ================================= */}

//                     <div className="side-section">


//                         <div className="side-section-title">

//                             <i className="bi bi-person"></i>

//                             <span>
//                                 Requester
//                             </span>

//                         </div>


//                         <div className="requester-info">


//                             <div className="requester-avatar">

//                                 {getRequesterInitials()}

//                             </div>


//                             <div>

//                                 <strong>

//                                     {ticket.createdBy?.name ||
//                                         "Employee"}

//                                 </strong>

//                                 <span>

//                                     {ticket.createdBy?.email ||
//                                         "No email available"}

//                                 </span>

//                             </div>

//                         </div>

//                     </div>


//                     <div className="side-divider"></div>


//                     {/* =================================
//                         ASSIGNED TO
//                     ================================= */}

//                     <div className="side-section">


//                         <div className="side-section-title">

//                             <i className="bi bi-person-check"></i>

//                             <span>
//                                 Assigned To
//                             </span>

//                         </div>


//                         <div className="assigned-team">


//                             <div className="team-icon">

//                                 <i className="bi bi-headset"></i>

//                             </div>


//                             <span>

//                                 {ticket.assignedTo?.name ||
//                                     "Not assigned"}

//                             </span>

//                         </div>

//                     </div>


//                     <div className="side-divider"></div>


//                     {/* =================================
//                         TICKET TIMELINE
//                     ================================= */}

//                     <div className="side-section">


//                         <div className="side-section-title">

//                             <i className="bi bi-clock-history"></i>

//                             <span>
//                                 Ticket Timeline
//                             </span>

//                         </div>


//                         <div className="timeline">


//                             {/* Created */}

//                             <div className="timeline-item">

//                                 <div className="timeline-dot"></div>

//                                 <div>

//                                     <strong>
//                                         Ticket Created
//                                     </strong>

//                                     <span>

//                                         {formatDate(
//                                             ticket.createdAt
//                                         )}

//                                     </span>

//                                 </div>

//                             </div>


//                             {/* Current Status */}

//                             <div className="timeline-item">

//                                 <div className="timeline-dot"></div>

//                                 <div>

//                                     <strong>

//                                         Ticket {ticket.status}

//                                     </strong>

//                                     <span>

//                                         {ticket.status === "Open"
//                                             ? "Awaiting support response"
//                                             : `Current status: ${ticket.status}`}

//                                     </span>

//                                 </div>

//                             </div>


//                             {/* Updated */}

//                             {ticket.updatedAt &&
//                                 ticket.updatedAt !== ticket.createdAt && (

//                                     <div className="timeline-item">

//                                         <div className="timeline-dot"></div>

//                                         <div>

//                                             <strong>
//                                                 Last Updated
//                                             </strong>

//                                             <span>

//                                                 {formatDate(
//                                                     ticket.updatedAt
//                                                 )}

//                                             </span>

//                                         </div>

//                                     </div>

//                                 )}

//                         </div>

//                     </div>


//                     <div className="side-divider"></div>


//                     {/* =================================
//                         ACTIONS
//                     ================================= */}

//                     <div className="side-actions">


//                         <Link
//                             to="/create-ticket"
//                             className="new-ticket-side-btn"
//                         >

//                             <i className="bi bi-plus-lg"></i>

//                             Create Another Ticket

//                         </Link>


//                         <Link
//                             to="/tickets"
//                             className="view-tickets-side-btn"
//                         >

//                             <i className="bi bi-ticket"></i>

//                             View All Tickets

//                         </Link>

//                     </div>

//                 </aside>

//             </div>

//         </div>

//     );

// }


// export default TicketDetails;

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import API from "../api/api";

import "../styles/ticketdetails.css";


function TicketDetails() {

    const { id } = useParams();


    // =========================
    // STATE
    // =========================

    const [ticket, setTicket] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =========================
    // FETCH TICKET
    // =========================

    useEffect(() => {

        fetchTicket();

    }, [id]);


    const fetchTicket = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await API.get(
                `/tickets/${id}`
            );

            console.log(
                "Ticket details:",
                response.data
            );

            setTicket(
                response.data.ticket
            );

        } catch (error) {

            console.error(
                "Fetch ticket error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load ticket details."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // FORMAT DATE
    // =========================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }


        const formattedDate =
            new Date(date);


        if (
            Number.isNaN(
                formattedDate.getTime()
            )
        ) {

            return "-";

        }


        return formattedDate.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    // =========================
    // FORMAT DATE + TIME
    // =========================

    const formatDateTime = (date) => {

        if (!date) {
            return "-";
        }


        const formattedDate =
            new Date(date);


        if (
            Number.isNaN(
                formattedDate.getTime()
            )
        ) {

            return "-";

        }


        return formattedDate.toLocaleString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    // =========================
    // STATUS CLASS
    // =========================

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
    // TICKET DISPLAY ID
    // =========================

    const getTicketDisplayId = () => {

        if (!ticket?._id) {
            return "N/A";
        }

        return `TK-${ticket._id
            .slice(-6)
            .toUpperCase()}`;

    };


    // =========================
    // REQUESTER INITIALS
    // =========================

    const getRequesterInitials = () => {

        const name =
            ticket?.createdBy?.name ||
            "Employee";


        return name
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .slice(0, 2)
            .toUpperCase();

    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div className="ticket-details-page">

                <div className="tickets-loading">

                    <i className="bi bi-arrow-repeat"></i>

                    <h3>
                        Loading ticket...
                    </h3>

                    <p>
                        Please wait while we fetch the
                        ticket details.
                    </p>

                </div>

            </div>

        );

    }


    // =========================
    // ERROR
    // =========================

    if (error || !ticket) {

        return (

            <div className="ticket-details-page">

                <div className="tickets-error">

                    <i className="bi bi-exclamation-circle"></i>

                    <h3>
                        Unable to load ticket
                    </h3>

                    <p>
                        {error || "Ticket not found."}
                    </p>

                    <Link
                        to="/tickets"
                        className="details-back-btn"
                    >

                        <i className="bi bi-arrow-left"></i>

                        Back to Tickets

                    </Link>

                </div>

            </div>

        );

    }


    // =========================
    // MAIN PAGE
    // =========================

    return (

        <div className="ticket-details-page">


            {/* =================================
                HEADER
            ================================= */}

            <div className="ticket-details-header">

                <div>


                    {/* Breadcrumb */}

                    <div className="ticket-breadcrumb">

                        <Link to="/tickets">
                            My Tickets
                        </Link>

                        <i className="bi bi-chevron-right"></i>

                        <span>
                            {getTicketDisplayId()}
                        </span>

                    </div>


                    {/* Title */}

                    <div className="ticket-title-row">

                        <h1>
                            {ticket.title}
                        </h1>

                        <span
                            className={`ticket-status-badge ${getStatusClass(
                                ticket.status
                            )}`}
                        >
                            {ticket.status || "Open"}
                        </span>

                    </div>


                    <p>

                        Ticket #{getTicketDisplayId()}

                        {" · "}

                        Created {formatDateTime(ticket.createdAt)}

                    </p>

                </div>


                {/* Back Button */}

                <Link
                    to="/tickets"
                    className="details-back-btn"
                >

                    <i className="bi bi-arrow-left"></i>

                    Back to Tickets

                </Link>

            </div>


            {/* =================================
                CONTENT
            ================================= */}

            <div className="ticket-details-layout">


                {/* =================================
                    MAIN TICKET
                ================================= */}

                <main className="ticket-main-card">


                    {/* =================================
                        TICKET INFORMATION
                    ================================= */}

                    <div className="ticket-info-grid">


                        {/* Department */}

                        <div className="detail-item">

                            <span>
                                Department
                            </span>

                            <strong>

                                <i className="bi bi-building"></i>

                                {ticket.department ||
                                    ticket.createdBy?.department ||
                                    "Not assigned"}

                            </strong>

                        </div>


                        {/* Category */}

                        <div className="detail-item">

                            <span>
                                Category
                            </span>

                            <strong>

                                <i className="bi bi-grid"></i>

                                {ticket.category ||
                                    "Other"}

                            </strong>

                        </div>


                        {/* Priority */}

                        <div className="detail-item">

                            <span>
                                Priority
                            </span>

                            <strong
                                className={getPriorityClass(
                                    ticket.priority
                                )}
                            >

                                <i className="bi bi-exclamation-circle"></i>

                                {ticket.priority ||
                                    "Medium"}

                            </strong>

                        </div>


                        {/* Last Updated */}

                        <div className="detail-item">

                            <span>
                                Last Updated
                            </span>

                            <strong>

                                <i className="bi bi-clock"></i>

                                {formatDateTime(
                                    ticket.updatedAt
                                )}

                            </strong>

                        </div>

                    </div>


                    {/* =================================
                        REQUESTER INFORMATION
                    ================================= */}

                    <section className="ticket-requester-section">

                        <div className="section-heading">

                            <div className="section-heading-icon">

                                <i className="bi bi-person"></i>

                            </div>

                            <div>

                                <h2>
                                    Requester
                                </h2>

                                <span>
                                    Employee who created this ticket
                                </span>

                            </div>

                        </div>


                        <div className="requester-main-info">

                            <div className="requester-avatar">

                                {getRequesterInitials()}

                            </div>


                            <div className="requester-details">

                                <strong>

                                    {ticket.createdBy?.name ||
                                        "Employee"}

                                </strong>

                                <span>

                                    {ticket.createdBy?.email ||
                                        "No email available"}

                                </span>

                                <span>

                                    Department:{" "}

                                    {ticket.createdBy?.department ||
                                        ticket.department ||
                                        "Not assigned"}

                                </span>

                            </div>

                        </div>

                    </section>


                    {/* =================================
                        ASSIGNED TO
                    ================================= */}

                    <section className="ticket-assigned-section">

                        <div className="section-heading">

                            <div className="section-heading-icon">

                                <i className="bi bi-person-check"></i>

                            </div>

                            <div>

                                <h2>
                                    Assigned To
                                </h2>

                                <span>
                                    Current support team assignment
                                </span>

                            </div>

                        </div>


                        <div className="assigned-main-info">

                            <div className="team-icon">

                                <i className="bi bi-headset"></i>

                            </div>


                            <div>

                                <strong>

                                    {ticket.assignedTo?.name ||
                                        "Not assigned"}

                                </strong>

                                {ticket.assignedTo?.email && (

                                    <span>

                                        {ticket.assignedTo.email}

                                    </span>

                                )}

                            </div>

                        </div>

                    </section>


                    {/* =================================
                        DESCRIPTION
                    ================================= */}

                    <section className="ticket-description-section">


                        <div className="section-heading">

                            <div className="section-heading-icon">

                                <i className="bi bi-file-text"></i>

                            </div>

                            <div>

                                <h2>
                                    Issue Description
                                </h2>

                                <span>
                                    Details provided with this ticket
                                </span>

                            </div>

                        </div>


                        <div className="description-box">

                            <p>

                                {ticket.description ||
                                    "No description provided."}

                            </p>

                        </div>

                    </section>


                    {/* =================================
                        ATTACHMENTS
                    ================================= */}

                    <section className="ticket-attachment-section">


                        <div className="section-heading">

                            <div className="section-heading-icon">

                                <i className="bi bi-paperclip"></i>

                            </div>

                            <div>

                                <h2>
                                    Attachments
                                </h2>

                                <span>
                                    Files attached to this ticket
                                </span>

                            </div>

                        </div>


                        {ticket.attachment ? (

                            <div className="attachment-file">

                                <i className="bi bi-file-earmark"></i>

                                <a
                                    href={ticket.attachment}
                                    target="_blank"
                                    rel="noreferrer"
                                >

                                    View Attachment

                                </a>

                            </div>

                        ) : (

                            <div className="attachment-empty">

                                <i className="bi bi-file-earmark"></i>

                                <span>
                                    No attachments added
                                </span>

                            </div>

                        )}

                    </section>


                    {/* =================================
                        TICKET TIMELINE
                    ================================= */}

                    <section className="ticket-timeline-section">

                        <div className="section-heading">

                            <div className="section-heading-icon">

                                <i className="bi bi-clock-history"></i>

                            </div>

                            <div>

                                <h2>
                                    Ticket Timeline
                                </h2>

                                <span>
                                    Track ticket activity
                                </span>

                            </div>

                        </div>


                        <div className="timeline">


                            {/* Created */}

                            <div className="timeline-item">

                                <div className="timeline-dot"></div>

                                <div>

                                    <strong>
                                        Ticket Created
                                    </strong>

                                    <span>
                                        {formatDate(
                                            ticket.createdAt
                                        )}
                                    </span>

                                </div>

                            </div>


                            {/* Current Status */}

                            <div className="timeline-item">

                                <div className="timeline-dot"></div>

                                <div>

                                    <strong>
                                        Ticket {ticket.status}
                                    </strong>

                                    <span>

                                        {ticket.status === "Open"
                                            ? "Awaiting support response"
                                            : `Current status: ${ticket.status}`}

                                    </span>

                                </div>

                            </div>


                            {/* Updated */}

                            {ticket.updatedAt &&
                                ticket.updatedAt !== ticket.createdAt && (

                                    <div className="timeline-item">

                                        <div className="timeline-dot"></div>

                                        <div>

                                            <strong>
                                                Last Updated
                                            </strong>

                                            <span>

                                                {formatDate(
                                                    ticket.updatedAt
                                                )}

                                            </span>

                                        </div>

                                    </div>

                                )}

                        </div>

                    </section>


                    {/* =================================
                        CONVERSATION
                    ================================= */}

                    <section className="conversation-section">


                        <div className="section-heading">

                            <div className="section-heading-icon">

                                <i className="bi bi-chat-left-text"></i>

                            </div>

                            <div>

                                <h2>
                                    Conversation
                                </h2>

                                <span>
                                    Communication about this ticket
                                </span>

                            </div>

                        </div>


                        {ticket.comments &&
                            ticket.comments.length > 0 ? (

                            <div className="conversation-list">

                                {ticket.comments.map(
                                    (comment, index) => (

                                        <div
                                            className="conversation-item"
                                            key={
                                                comment._id ||
                                                index
                                            }
                                        >

                                            <div className="conversation-avatar">

                                                {comment.user?.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase() ||
                                                    "U"}

                                            </div>


                                            <div className="conversation-content">

                                                <div className="conversation-header">

                                                    <strong>

                                                        {comment.user?.name ||
                                                            "User"}

                                                    </strong>

                                                    <span>

                                                        {formatDateTime(
                                                            comment.createdAt
                                                        )}

                                                    </span>

                                                </div>


                                                <p>

                                                    {comment.message}

                                                </p>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        ) : (

                            <div className="conversation-empty">

                                <i className="bi bi-chat-dots"></i>

                                <p>
                                    No replies yet.
                                </p>

                                <span>
                                    Your support team will respond here.
                                </span>

                            </div>

                        )}

                    </section>


                    {/* =================================
                        REPLY BOX
                    ================================= */}

                    <div className="reply-box">


                        <textarea
                            placeholder="Write a reply..."
                            rows="4"
                        ></textarea>


                        <div className="reply-actions">


                            <button
                                type="button"
                                className="attach-reply-btn"
                            >

                                <i className="bi bi-paperclip"></i>

                                Attach

                            </button>


                            <button
                                type="button"
                                className="send-reply-btn"
                            >

                                <i className="bi bi-send"></i>

                                Send Reply

                            </button>

                        </div>

                    </div>


                    {/* =================================
                        BOTTOM ACTIONS
                    ================================= */}

                    <div className="ticket-bottom-actions">

                        <Link
                            to="/create-ticket"
                            className="new-ticket-side-btn"
                        >

                            <i className="bi bi-plus-lg"></i>

                            Create Another Ticket

                        </Link>


                        <Link
                            to="/tickets"
                            className="view-tickets-side-btn"
                        >

                            <i className="bi bi-ticket"></i>

                            View All Tickets

                        </Link>

                    </div>

                </main>

            </div>

        </div>

    );

}


export default TicketDetails;