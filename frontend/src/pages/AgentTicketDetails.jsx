// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import API from "../api/api";
// import Layout from "../components/Layout";
// import "../styles/agent-ticket-details.css";

// function AgentTicketDetails() {
//     const { id } = useParams();

//     const [ticket, setTicket] = useState(null);
//     const [agents, setAgents] = useState([]);
//     const [selectedAgent, setSelectedAgent] = useState("");

//     const [loading, setLoading] = useState(true);
//     const [assigning, setAssigning] = useState(false);
//     const [accepting, setAccepting] = useState(false);
//     const [updatingPriority, setUpdatingPriority] =
//     useState(false);
//     const [transferAgent, setTransferAgent] = useState("");
// const [transferring, setTransferring] = useState(false);

//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");
//     const [updatingStatus, setUpdatingStatus] = useState(false);
//     const [comment, setComment] = useState("");
//     const [addingComment, setAddingComment] = useState(false);

//     const [resolution, setResolution] = useState("");
//     const [resolving, setResolving] = useState(false);

//     useEffect(() => {
//         fetchTicket();
//         fetchAgents();
//     }, [id]);

//     // ==============================
//     // FETCH TICKET
//     // ==============================

//     const fetchTicket = async () => {
//         try {
//             setLoading(true);
//             setError("");

//             const response = await API.get(`/tickets/${id}`);

//             const ticketData = response.data.ticket;

//             setTicket(ticketData);

//             if (ticketData?.assignedTo?._id) {
//                 setSelectedAgent(ticketData.assignedTo._id);
//             }

//         } catch (error) {
//             console.error(
//                 "Ticket details error:",
//                 error
//             );

//             setError(
//                 error.response?.data?.message ||
//                 "Unable to load ticket."
//             );

//         } finally {
//             setLoading(false);
//         }
//     };

//     // ==============================
//     // FETCH SUPPORT AGENTS
//     // ==============================

//     const fetchAgents = async () => {
//         try {
//             const response = await API.get(
//                 "/users/support-agents"
//             );

//             setAgents(response.data.agents || []);

//         } catch (error) {
//             console.error(
//                 "Agents error:",
//                 error
//             );
//         }
//     };

//     // ==============================
//     // ASSIGN TICKET
//     // ==============================

//     const handleAssign = async () => {

//         if (!selectedAgent) {
//             setError(
//                 "Please select a support agent."
//             );
//             return;
//         }

//         try {
//             setAssigning(true);
//             setError("");
//             setSuccess("");

//             const response = await API.put(
//                 `/tickets/${id}/assign`,
//                 {
//                     assignedTo: selectedAgent
//                 }
//             );

//             setTicket(response.data.ticket);

//             setSuccess(
//                 "Ticket assigned successfully."
//             );

//         } catch (error) {

//             console.error(
//                 "Assign ticket error:",
//                 error
//             );

//             setError(
//                 error.response?.data?.message ||
//                 "Unable to assign ticket."
//             );

//         } finally {
//             setAssigning(false);
//         }
//     };

//     // ==============================
//     // ACCEPT TICKET
//     // ==============================

//     const handleAccept = async () => {

//         try {
//             setAccepting(true);
//             setError("");
//             setSuccess("");

//             const response = await API.put(
//                 `/tickets/${id}/accept`
//             );

//             setTicket(response.data.ticket);

//             setSuccess(
//                 "Ticket accepted successfully. Work has started."
//             );

//         } catch (error) {

//             console.error(
//                 "Accept ticket error:",
//                 error
//             );

//             setError(
//                 error.response?.data?.message ||
//                 "Unable to accept ticket."
//             );

//         } finally {
//             setAccepting(false);
//         }
//     };

//     // ==============================
// // ADD COMMENT
// // ==============================

// const handleAddComment = async () => {
//     if (!comment.trim()) {
//         setError("Please enter a comment.");
//         return;
//     }

//     try {
//         setAddingComment(true);
//         setError("");
//         setSuccess("");

//         const response = await API.post(
//             `/tickets/${id}/comments`,
//             {
//                 message: comment.trim()
//             }
//         );

//         setTicket(response.data.ticket);
//         setComment("");

//         setSuccess("Comment added successfully.");

//     } catch (error) {
//         console.error(
//             "Add comment error:",
//             error
//         );

//         setError(
//             error.response?.data?.message ||
//             "Unable to add comment."
//         );

//     } finally {
//         setAddingComment(false);
//     }
// };

// // ==============================
// // RESOLVE TICKET
// // ==============================

// const handleResolve = async () => {
//     if (!resolution.trim()) {
//         setError("Please enter resolution notes.");
//         return;
//     }

//     try {
//         setResolving(true);
//         setError("");
//         setSuccess("");

//         const response = await API.put(
//             `/tickets/${id}/resolve`,
//             {
//                 resolution: resolution.trim()
//             }
//         );

//         setTicket(response.data.ticket);
//         setResolution("");

//         setSuccess("Ticket resolved successfully.");

//     } catch (error) {
//         console.error("Resolve ticket error:", error);

//         setError(
//             error.response?.data?.message ||
//             "Unable to resolve ticket."
//         );

//     } finally {
//         setResolving(false);
//     }
// };

// {/* ================= RESOLUTION ================= */}

// {ticket.status !== "Closed" && (
//     <div className="agent-resolution-section">

//         <div className="agent-resolution-header">
//             <h3>
//                 <i className="bi bi-check-circle"></i>
//                 Resolution
//             </h3>

//             <p>
//                 Add the solution provided for this ticket.
//             </p>
//         </div>

//         <div className="agent-resolution-form">

//             <label>
//                 Resolution Notes
//             </label>

//             <textarea
//                 value={resolution}
//                 onChange={(e) =>
//                     setResolution(e.target.value)
//                 }
//                 placeholder="Describe how this issue was resolved..."
//                 rows="5"
//                 disabled={
//                     resolving ||
//                     ticket.status === "Resolved"
//                 }
//             />

//             {ticket.status === "Resolved" ? (
//                 <div className="resolution-completed">
//                     <i className="bi bi-check-circle-fill"></i>

//                     <span>
//                         This ticket has been resolved.
//                     </span>
//                 </div>
//             ) : (
//                 <button
//                     type="button"
//                     onClick={handleResolve}
//                     disabled={
//                         resolving ||
//                         !resolution.trim()
//                     }
//                 >
//                     <i className="bi bi-check-circle"></i>

//                     {resolving
//                         ? "Resolving..."
//                         : "Resolve Ticket"}
//                 </button>
//             )}

//         </div>

//     </div>
// )}

//     // ==============================
//     // CURRENT USER
//     // ==============================

//     const getCurrentUser = () => {
//         try {
//             return JSON.parse(
//                 localStorage.getItem("user")
//             );
//         } catch {
//             return null;
//         }
//     };

//     const currentUser = getCurrentUser();

//     // ==============================
//     // TICKET ID
//     // ==============================

//     const getTicketId = (ticketId) => {

//         if (!ticketId) {
//             return "TK-000000";
//         }

//         return `TK-${ticketId
//             .slice(-6)
//             .toUpperCase()}`;
//     };

//     // ==============================
//     // FORMAT DATE
//     // ==============================

//     const formatDate = (date) => {

//         if (!date) {
//             return "-";
//         }

//         const value = new Date(date);

//         if (Number.isNaN(value.getTime())) {
//             return "-";
//         }

//         return value.toLocaleDateString(
//             "en-GB",
//             {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric"
//             }
//         );
//     };


//     const handleStatusChange = async (newStatus) => {
//     try {
//         setUpdatingStatus(true);
//         setError("");
//         setSuccess("");

//         const response = await API.put(
//             `/tickets/${id}/status`,
//             {
//                 status: newStatus
//             }
//         );

//         setTicket(response.data.ticket);

//         setSuccess(
//             `Ticket status changed to ${newStatus}.`
//         );

//     } catch (error) {
//         console.error(
//             "Status update error:",
//             error
//         );

//         setError(
//             error.response?.data?.message ||
//             "Unable to update ticket status."
//         );
//     } finally {
//         setUpdatingStatus(false);
//     }
// };
//     // ==============================
//     // PRIORITY CLASS
//     // ==============================

//     const getPriorityClass = (priority) => {

//         switch (priority) {

            

//             case "High":
//                 return "agent-detail-high";

//             case "Medium":
//                 return "agent-detail-medium";

//             case "Low":
//                 return "agent-detail-low";

//             default:
//                 return "";
//         }
//     };

//     // ==============================
//     // STATUS CLASS
//     // ==============================

//     const getStatusClass = (status) => {

//         switch (status) {

//             case "Open":
//                 return "agent-detail-open";

//             case "Assigned":
//                 return "agent-detail-assigned";

//             case "In Progress":
//                 return "agent-detail-progress";

//             case "Waiting for Employee":
//                 return "agent-detail-waiting";

//             case "Resolved":
//                 return "agent-detail-resolved";

//             case "Closed":
//                 return "agent-detail-closed";

//             default:
//                 return "";
//         }
//     };

//     // ==============================
//     // LOADING
//     // ==============================

//     if (loading) {

//         return (
//             <Layout
//                 role="supportAgent"
//                 userName="Support Agent"
//             >
//                 <div className="agent-detail-loading">
//                     Loading ticket...
//                 </div>
//             </Layout>
//         );
//     }

//     // ==============================
//     // TICKET NOT FOUND
//     // ==============================

//     if (!ticket) {

//         return (
//             <Layout
//                 role="supportAgent"
//                 userName="Support Agent"
//             >
//                 <div className="agent-detail-error">
//                     {error || "Ticket not found."}
//                 </div>
//             </Layout>
//         );
//     }
//     const handlePriorityChange = async (newPriority) => {
//     try {
//         setUpdatingPriority(true);
//         setError("");
//         setSuccess("");

//         const response = await API.put(
//             `/tickets/${id}/priority`,
//             {
//                 priority: newPriority
//             }
//         );

//         setTicket(response.data.ticket);

//         setSuccess(
//             `Ticket priority changed to ${newPriority}.`
//         );

//     } catch (error) {
//         console.error(
//             "Priority update error:",
//             error
//         );

//         setError(
//             error.response?.data?.message ||
//             "Unable to update ticket priority."
//         );
//     } finally {
//         setUpdatingPriority(false);
//     }
// };



// const handleTransfer = async () => {
//   if (!transferAgent) {
//     setError("Please select an agent");
//     return;
//   }

//   try {
//     setTransferring(true);
//     setError("");
//     setSuccess("");

//     const response = await API.put(
//       `/tickets/${id}/transfer`,
//       {
//         assignedTo: transferAgent
//       }
//     );

//     setTicket(response.data.ticket);
//     setTransferAgent("");

//     setSuccess("Ticket transferred successfully.");
//   } catch (error) {
//     console.error("Transfer error:", error);

//     setError(
//       error.response?.data?.message ||
//       "Unable to transfer ticket."
//     );
//   } finally {
//     setTransferring(false);
//   }
// };

//     // ==============================
//     // UI
//     // ==============================

//     return (
//         <Layout
//             role="supportAgent"
//             userName={
//                 currentUser?.name ||
//                 ticket.assignedTo?.name ||
//                 "Support Agent"
//             }
//         >

//             <div className="agent-ticket-details-page">

//                 {/* ================= HEADER ================= */}

//                 <div className="agent-detail-header">

//                     <div>

//                         <span className="agent-detail-label">
//                             SUPPORT CENTER
//                         </span>

//                         <h1>
//                             Ticket Details
//                         </h1>

//                         <p>
//                             {getTicketId(ticket._id)}
//                         </p>

//                     </div>

//                     <Link
//                         to="/agent/tickets"
//                         className="agent-detail-back"
//                     >
//                         <i className="bi bi-arrow-left"></i>

//                         Back to Tickets
//                     </Link>

//                 </div>


//                 {/* ================= MESSAGES ================= */}

//                 {error && (
//                     <div className="agent-detail-message error">
//                         {error}
//                     </div>
//                 )}

//                 {success && (
//                     <div className="agent-detail-message success">
//                         {success}
//                     </div>
//                 )}


//                 {/* ================= MAIN GRID ================= */}

//                 <div className="agent-detail-grid">


//                     {/* ================= TICKET CARD ================= */}

//                     <div className="agent-ticket-main-card">

//                         <div className="agent-ticket-main-header">

//                             <div>

//                                 <span className="agent-ticket-id">
//                                     {getTicketId(
//                                         ticket._id
//                                     )}
//                                 </span>

//                                 <h2>
//                                     {ticket.title}
//                                 </h2>

//                             </div>

//                             <span
//                                 className={`agent-detail-badge ${getStatusClass(
//                                     ticket.status
//                                 )}`}
//                             >
//                                 {ticket.status}
//                             </span>

//                         </div>


//                         {/* ================= INFO ================= */}

//                         <div className="agent-ticket-info-row">

//                             <div>

//                                 <span>
//                                     Department
//                                 </span>

//                                 <strong>
//                                     {ticket.department ||
//                                         ticket.createdBy
//                                             ?.department ||
//                                         "-"}
//                                 </strong>

//                             </div>


//                             <div>

//                                 <span>
//                                     Category
//                                 </span>

//                                 <strong>
//                                     {ticket.category ||
//                                         "-"}
//                                 </strong>

//                             </div>


//                             <div>

//                                 <span>
//                                     Priority
//                                 </span>

//                                 <strong>

//                                     <span
//                                         className={`agent-detail-badge ${getPriorityClass(
//                                             ticket.priority
//                                         )}`}
//                                     >
//                                         {ticket.priority}
//                                     </span>

//                                 </strong>

//                             </div>


//                             <div>

//                                 <span>
//                                     Created
//                                 </span>

//                                 <strong>
//                                     {formatDate(
//                                         ticket.createdAt
//                                     )}
//                                 </strong>

//                             </div>

//                         </div>


//                         {/* ================= DESCRIPTION ================= */}

//                         <div className="agent-description-section">

//                             <h3>
//                                 Description
//                             </h3>

//                             <p>
//                                 {ticket.description}
//                             </p>

//                         </div>


//                         {/* ================= EMPLOYEE ================= */}

//                         <div className="agent-employee-section">

//                             <h3>
//                                 Employee
//                             </h3>

//                             <div className="agent-employee-info">

//                                 <div className="agent-employee-avatar">

//                                     {ticket.createdBy?.name
//                                         ?.charAt(0)
//                                         ?.toUpperCase() ||
//                                         "E"}

//                                 </div>

//                                 <div>

//                                     <strong>
//                                         {ticket.createdBy?.name ||
//                                             "-"}
//                                     </strong>

//                                     <span>
//                                         {ticket.createdBy?.email ||
//                                             "-"}
//                                     </span>

//                                     <small>
//                                         Employee ID:{" "}
//                                         {ticket.createdBy
//                                             ?.employeeId ||
//                                             "-"}
//                                     </small>

//                                 </div>

//                             </div>

//                         </div>


//                         {/* ================= ATTACHMENT ================= */}

//                         {ticket.attachment && (

//                             <div className="agent-attachment-section">

//                                 <h3>
//                                     Attachment
//                                 </h3>

//                                 <a
//                                     href={`http://localhost:5000${ticket.attachment}`}
//                                     target="_blank"
//                                     rel="noreferrer"
//                                 >

//                                     <i className="bi bi-paperclip"></i>

//                                     View Attachment

//                                 </a>

//                             </div>
                            

//                         )}
//                         {/* ================= COMMENTS ================= */}

// <div className="agent-comments-section">

//     <div className="agent-comments-header">
//         <div>
//             <h3>
//                 <i className="bi bi-chat-left-text"></i>
//                 Comments & Replies
//             </h3>

//             <p>
//                 Communicate with the employee about this ticket.
//             </p>
//         </div>
//     </div>

//     {/* EXISTING COMMENTS */}

//     <div className="agent-comments-list">

//         {ticket.comments &&
//         ticket.comments.length > 0 ? (

//             ticket.comments.map((item, index) => (

//                 <div
//                     className="agent-comment"
//                     key={item._id || index}
//                 >

//                     <div className="agent-comment-avatar">
//                         {item.user?.name
//                             ?.charAt(0)
//                             ?.toUpperCase() || "U"}
//                     </div>

//                     <div className="agent-comment-content">

//                         <div className="agent-comment-top">

//                             <strong>
//                                 {item.user?.name ||
//                                     "User"}
//                             </strong>

//                             <small>
//                                 {item.createdAt
//                                     ? formatDate(
//                                         item.createdAt
//                                     )
//                                     : ""}
//                             </small>

//                         </div>

//                         <p>
//                             {item.message}
//                         </p>

//                     </div>

//                 </div>

//             ))

//         ) : (

//             <div className="agent-no-comments">
//                 <i className="bi bi-chat-square-text"></i>

//                 <p>
//                     No comments yet.
//                 </p>

//             </div>

//         )}

//     </div>

//     {/* ADD COMMENT */}

//     <div className="agent-add-comment">

//         <label>
//             Add Comment
//         </label>

//         <textarea
//             value={comment}
//             onChange={(e) =>
//                 setComment(e.target.value)
//             }
//             placeholder="Write a reply or update..."
//             rows="4"
//             disabled={addingComment}
//         />

//         <button
//             type="button"
//             onClick={handleAddComment}
//             disabled={
//                 addingComment ||
//                 !comment.trim()
//             }
//         >
//             <i className="bi bi-send"></i>

//             {addingComment
//                 ? "Adding..."
//                 : "Add Comment"}
//         </button>

//     </div>

// </div>

//                     </div>


//                     {/* ================= ASSIGNMENT CARD ================= */}

//                     <div className="agent-assignment-card">

//                         <h3>
//                             Ticket Assignment
//                         </h3>

//                         <p>
//                             Assign this ticket to a support
//                             agent.
//                         </p>


//                         <label>
//                             Support Agent
//                         </label>


//                         <select
//                             value={selectedAgent}
//                             onChange={(e) =>
//                                 setSelectedAgent(
//                                     e.target.value
//                                 )
//                             }
//                         >

//                             <option value="">
//                                 Select Support Agent
//                             </option>


//                             {agents.map((agent) => (

//                                 <option
//                                     key={agent._id}
//                                     value={agent._id}
//                                 >
//                                     {agent.name} —{" "}
//                                     {agent.department}
//                                 </option>

//                             ))}

//                         </select>


//                         {/* ================= ASSIGN BUTTON ================= */}

//                         <button
//                             type="button"
//                             onClick={handleAssign}
//                             disabled={assigning}
//                         >

//                             <i className="bi bi-person-check"></i>

//                             {assigning
//                                 ? "Assigning..."
//                                 : "Assign Ticket"}

//                         </button>


//                         {/* ================= ACCEPT BUTTON ================= */}
// {ticket.status === "Assigned" &&
//     ticket.assignedTo &&
//     (ticket.assignedTo._id === currentUser?._id ||
//         ticket.assignedTo._id === currentUser?.id) && (

//         <button
//             type="button"
//             className="accept-ticket-btn"
//             onClick={handleAccept}
//             disabled={accepting}
//         >
//             <i className="bi bi-play-circle"></i>

//             {accepting
//                 ? "Starting..."
//                 : "Accept & Start Working"}
//         </button>
// )}

//                         {/* ================= CURRENT ASSIGNMENT ================= */}

//                         {ticket.assignedTo && (

//                             <div className="currently-assigned">

//                                 <span>
//                                     Currently Assigned To
//                                 </span>

//                                 <strong>
//                                     {ticket.assignedTo.name}
//                                 </strong>

//                                 <small>
//                                     {ticket.assignedTo.email}
//                                 </small>

//                             </div>

//                         )}

//                     </div>
//                     <div className="ticket-status-control">

//     <label>
//         Update Status
//     </label>

//     <select
//         value={ticket.status}
//         onChange={(e) =>
//             handleStatusChange(e.target.value)
//         }
//         disabled={updatingStatus}
//     >
//         <option value="Open">
//             Open
//         </option>

//         <option value="Assigned">
//             Assigned
//         </option>

//         <option value="In Progress">
//             In Progress
//         </option>

//         <option value="Waiting for Employee">
//             Waiting for Employee
//         </option>

//         <option value="Resolved">
//             Resolved
//         </option>

//         <option value="Closed">
//             Closed
//         </option>

//     </select>

//     {updatingStatus && (
//         <small>
//             Updating status...
//         </small>
//     )}

// </div>
// <div className="ticket-priority-control">

//     <label>
//         Update Priority
//     </label>

//     <select
//         value={ticket.priority}
//         onChange={(e) =>
//             handlePriorityChange(e.target.value)
//         }
//         disabled={updatingPriority}
//     >
//         <option value="Low">
//             Low
//         </option>

//         <option value="Medium">
//             Medium
//         </option>

//         <option value="High">
//             High
//         </option>

        

//     </select>

//     {updatingPriority && (
//         <small>
//             Updating priority...
//         </small>
//     )}

// </div>
// <div className="transfer-ticket-section">

//   <h3>
//     <i className="bi bi-arrow-left-right"></i>
//     Transfer Ticket
//   </h3>

//   <p>
//     Transfer this ticket to another support agent.
//   </p>

//   <select
//     value={transferAgent}
//     onChange={(e) => setTransferAgent(e.target.value)}
//     disabled={transferring}
//   >
//     <option value="">
//       Select Support Agent
//     </option>

//     {agents
//       .filter(
//         (agent) =>
//           agent._id !== ticket.assignedTo?._id
//       )
//       .map((agent) => (
//         <option
//           key={agent._id}
//           value={agent._id}
//         >
//           {agent.name} - {agent.email}
//         </option>
//       ))}
//   </select>

//   <button
//     type="button"
//     onClick={handleTransfer}
//     disabled={transferring || !transferAgent}
//   >
//     <i className="bi bi-arrow-right-circle"></i>

//     {transferring
//       ? "Transferring..."
//       : "Transfer Ticket"}
//   </button>

// </div>
//                 </div>

//             </div>

//         </Layout>
//     );
// }

// export default AgentTicketDetails
// 

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/api";
import Layout from "../components/Layout";
import "../styles/agent-ticket-details.css";

function AgentTicketDetails() {
    const { id } = useParams();

    // ==============================
    // STATES
    // ==============================

    const [ticket, setTicket] = useState(null);
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState("");
    const [transferAgent, setTransferAgent] = useState("");

    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(false);
    const [accepting, setAccepting] = useState(false);
    const [updatingPriority, setUpdatingPriority] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [transferring, setTransferring] = useState(false);
    const [addingComment, setAddingComment] = useState(false);
    const [resolving, setResolving] = useState(false);

    const [comment, setComment] = useState("");
    const [resolution, setResolution] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ==============================
    // FETCH DATA
    // ==============================

    useEffect(() => {
        fetchTicket();
        fetchAgents();
    }, [id]);

    // ==============================
    // FETCH TICKET
    // ==============================

    const fetchTicket = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get(`/tickets/${id}`);

            const ticketData = response.data.ticket;

            setTicket(ticketData);

            if (ticketData?.assignedTo?._id) {
                setSelectedAgent(ticketData.assignedTo._id);
            }
        } catch (error) {
            console.error("Ticket details error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load ticket."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // FETCH SUPPORT AGENTS
    // ==============================

    const fetchAgents = async () => {
        try {
            const response = await API.get(
                "/users/support-agents"
            );

            setAgents(response.data.agents || []);
        } catch (error) {
            console.error("Agents error:", error);
        }
    };

    // ==============================
    // CURRENT USER
    // ==============================

    const getCurrentUser = () => {
        try {
            const user = localStorage.getItem("user");

            if (!user) {
                return null;
            }

            return JSON.parse(user);
        } catch (error) {
            console.error("Current user error:", error);
            return null;
        }
    };

    const currentUser = getCurrentUser();

    // ==============================
    // TICKET ID
    // ==============================

    const getTicketId = (ticketId) => {
        if (!ticketId) {
            return "TK-000000";
        }

        return `TK-${ticketId
            .slice(-6)
            .toUpperCase()}`;
    };

    // ==============================
    // FORMAT DATE
    // ==============================

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const value = new Date(date);

        if (Number.isNaN(value.getTime())) {
            return "-";
        }

        return value.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    // ==============================
    // ASSIGN TICKET
    // ==============================

    const handleAssign = async () => {
        if (!selectedAgent) {
            setError("Please select a support agent.");
            return;
        }

        try {
            setAssigning(true);
            setError("");
            setSuccess("");

            const response = await API.put(
                `/tickets/${id}/assign`,
                {
                    assignedTo: selectedAgent
                }
            );

            setTicket(response.data.ticket);

            setSuccess(
                "Ticket assigned successfully."
            );
        } catch (error) {
            console.error(
                "Assign ticket error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to assign ticket."
            );
        } finally {
            setAssigning(false);
        }
    };

    // ==============================
    // ACCEPT TICKET
    // ==============================

    const handleAccept = async () => {
        try {
            setAccepting(true);
            setError("");
            setSuccess("");

            const response = await API.put(
                `/tickets/${id}/accept`
            );

            setTicket(response.data.ticket);

            setSuccess(
                "Ticket accepted successfully. Work has started."
            );
        } catch (error) {
            console.error(
                "Accept ticket error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to accept ticket."
            );
        } finally {
            setAccepting(false);
        }
    };

    // ==============================
    // STATUS CHANGE
    // ==============================

    const handleStatusChange = async (newStatus) => {
        try {
            setUpdatingStatus(true);
            setError("");
            setSuccess("");

            const response = await API.put(
                `/tickets/${id}/status`,
                {
                    status: newStatus
                }
            );

            setTicket(response.data.ticket);

            setSuccess(
                `Ticket status changed to ${newStatus}.`
            );
        } catch (error) {
            console.error(
                "Status update error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to update ticket status."
            );
        } finally {
            setUpdatingStatus(false);
        }
    };

    // ==============================
    // PRIORITY CHANGE
    // ==============================

    const handlePriorityChange = async (newPriority) => {
        try {
            setUpdatingPriority(true);
            setError("");
            setSuccess("");

            const response = await API.put(
                `/tickets/${id}/priority`,
                {
                    priority: newPriority
                }
            );

            setTicket(response.data.ticket);

            setSuccess(
                `Ticket priority changed to ${newPriority}.`
            );
        } catch (error) {
            console.error(
                "Priority update error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to update ticket priority."
            );
        } finally {
            setUpdatingPriority(false);
        }
    };

    // ==============================
    // ADD COMMENT
    // ==============================

    const handleAddComment = async () => {
        if (!comment.trim()) {
            setError("Please enter a comment.");
            return;
        }

        try {
            setAddingComment(true);
            setError("");
            setSuccess("");

            const response = await API.post(
                `/tickets/${id}/comments`,
                {
                    message: comment.trim()
                }
            );

            setTicket(response.data.ticket);
            setComment("");

            setSuccess(
                "Comment added successfully."
            );
        } catch (error) {
            console.error(
                "Add comment error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to add comment."
            );
        } finally {
            setAddingComment(false);
        }
    };

    // ==============================
    // TRANSFER TICKET
    // ==============================

    const handleTransfer = async () => {
        if (!transferAgent) {
            setError("Please select an agent.");
            return;
        }

        try {
            setTransferring(true);
            setError("");
            setSuccess("");

            const response = await API.put(
                `/tickets/${id}/transfer`,
                {
                    assignedTo: transferAgent
                }
            );

            setTicket(response.data.ticket);
            setTransferAgent("");

            setSuccess(
                "Ticket transferred successfully."
            );
        } catch (error) {
            console.error(
                "Transfer error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to transfer ticket."
            );
        } finally {
            setTransferring(false);
        }
    };

    // ==============================
    // RESOLVE TICKET
    // ==============================

    const handleResolve = async () => {
        if (!resolution.trim()) {
            setError(
                "Please enter resolution notes."
            );
            return;
        }

        try {
            setResolving(true);
            setError("");
            setSuccess("");

            const response = await API.put(
                `/tickets/${id}/resolve`,
                {
                    resolution: resolution.trim()
                }
            );

            setTicket(response.data.ticket);
            setResolution("");

            setSuccess(
                "Ticket resolved successfully."
            );
        } catch (error) {
            console.error(
                "Resolve ticket error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to resolve ticket."
            );
        } finally {
            setResolving(false);
        }
    };

    // ==============================
    // PRIORITY CLASS
    // ==============================

    const getPriorityClass = (priority) => {
        switch (priority) {
            case "High":
                return "agent-detail-high";

            case "Medium":
                return "agent-detail-medium";

            case "Low":
                return "agent-detail-low";

            case "Critical":
                return "agent-detail-critical";

            default:
                return "";
        }
    };

    // ==============================
    // STATUS CLASS
    // ==============================

    const getStatusClass = (status) => {
        switch (status) {
            case "Open":
                return "agent-detail-open";

            case "Assigned":
                return "agent-detail-assigned";

            case "In Progress":
                return "agent-detail-progress";

            case "Waiting for Employee":
                return "agent-detail-waiting";

            case "Resolved":
                return "agent-detail-resolved";

            case "Closed":
                return "agent-detail-closed";

            default:
                return "";
        }
    };

    // ==============================
    // LOADING
    // ==============================

    if (loading) {
        return (
            <Layout
                role="supportAgent"
                userName="Support Agent"
            >
                <div className="agent-detail-loading">
                    Loading ticket...
                </div>
            </Layout>
        );
    }

    // ==============================
    // TICKET NOT FOUND
    // ==============================

    if (!ticket) {
        return (
            <Layout
                role="supportAgent"
                userName="Support Agent"
            >
                <div className="agent-detail-error">
                    {error || "Ticket not found."}
                </div>
            </Layout>
        );
    }

    // ==============================
    // UI
    // ==============================

    return (
        <Layout
            role="supportAgent"
            userName={
                currentUser?.name ||
                ticket.assignedTo?.name ||
                "Support Agent"
            }
        >

            <div className="agent-ticket-details-page">

                {/* ================= HEADER ================= */}

                <div className="agent-detail-header">

                    <div>

                        <span className="agent-detail-label">
                            SUPPORT CENTER
                        </span>

                        <h1>
                            Ticket Details
                        </h1>

                        <p>
                            {getTicketId(ticket._id)}
                        </p>

                    </div>

                    <Link
                        to="/agent/tickets"
                        className="agent-detail-back"
                    >
                        <i className="bi bi-arrow-left"></i>
                        Back to Tickets
                    </Link>

                </div>


                {/* ================= MESSAGES ================= */}

                {error && (
                    <div className="agent-detail-message error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="agent-detail-message success">
                        {success}
                    </div>
                )}


                {/* ================= MAIN GRID ================= */}

                <div className="agent-detail-grid">


                    {/* ================= MAIN TICKET CARD ================= */}

                    <div className="agent-ticket-main-card">

                        {/* HEADER */}

                        <div className="agent-ticket-main-header">

                            <div>

                                <span className="agent-ticket-id">
                                    {getTicketId(ticket._id)}
                                </span>

                                <h2>
                                    {ticket.title}
                                </h2>

                            </div>

                            <span
                                className={`agent-detail-badge ${getStatusClass(
                                    ticket.status
                                )}`}
                            >
                                {ticket.status}
                            </span>

                        </div>


                        {/* ================= INFO ================= */}

                        <div className="agent-ticket-info-row">

                            <div>

                                <span>
                                    Department
                                </span>

                                <strong>
                                    {ticket.department ||
                                        ticket.createdBy?.department ||
                                        "-"}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Category
                                </span>

                                <strong>
                                    {ticket.category || "-"}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Priority
                                </span>

                                <strong>

                                    <span
                                        className={`agent-detail-badge ${getPriorityClass(
                                            ticket.priority
                                        )}`}
                                    >
                                        {ticket.priority}
                                    </span>

                                </strong>

                            </div>


                            <div>

                                <span>
                                    Created
                                </span>

                                <strong>
                                    {formatDate(
                                        ticket.createdAt
                                    )}
                                </strong>

                            </div>

                        </div>


                        {/* ================= DESCRIPTION ================= */}

                        <div className="agent-description-section">

                            <h3>
                                Description
                            </h3>

                            <p>
                                {ticket.description}
                            </p>

                        </div>


                        {/* ================= EMPLOYEE ================= */}

                        <div className="agent-employee-section">

                            <h3>
                                Employee
                            </h3>

                            <div className="agent-employee-info">

                                <div className="agent-employee-avatar">

                                    {ticket.createdBy?.name
                                        ?.charAt(0)
                                        ?.toUpperCase() ||
                                        "E"}

                                </div>

                                <div>

                                    <strong>
                                        {ticket.createdBy?.name ||
                                            "-"}
                                    </strong>

                                    <span>
                                        {ticket.createdBy?.email ||
                                            "-"}
                                    </span>

                                    <small>
                                        Employee ID:{" "}
                                        {ticket.createdBy
                                            ?.employeeId ||
                                            "-"}
                                    </small>

                                </div>

                            </div>

                        </div>


                        {/* ================= ATTACHMENT ================= */}

                        {ticket.attachment && (

                            <div className="agent-attachment-section">

                                <h3>
                                    Attachment
                                </h3>

                                <a
                                    href={`http://localhost:5000${ticket.attachment}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <i className="bi bi-paperclip"></i>
                                    View Attachment
                                </a>

                            </div>

                        )}


                        {/* ================= COMMENTS ================= */}

                        <div className="agent-comments-section">

                            <div className="agent-comments-header">

                                <div>

                                    <h3>
                                        <i className="bi bi-chat-left-text"></i>
                                        Comments & Replies
                                    </h3>

                                    <p>
                                        Communicate with the employee about this ticket.
                                    </p>

                                </div>

                            </div>


                            {/* EXISTING COMMENTS */}

                            <div className="agent-comments-list">

                                {ticket.comments &&
                                ticket.comments.length > 0 ? (

                                    ticket.comments.map(
                                        (item, index) => (

                                            <div
                                                className="agent-comment"
                                                key={
                                                    item._id ||
                                                    index
                                                }
                                            >

                                                <div className="agent-comment-avatar">

                                                    {item.user?.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase() ||
                                                        "U"}

                                                </div>


                                                <div className="agent-comment-content">

                                                    <div className="agent-comment-top">

                                                        <strong>
                                                            {item.user?.name ||
                                                                "User"}
                                                        </strong>

                                                        <small>
                                                            {item.createdAt
                                                                ? formatDate(
                                                                    item.createdAt
                                                                )
                                                                : ""}
                                                        </small>

                                                    </div>

                                                    <p>
                                                        {item.message}
                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    )

                                ) : (

                                    <div className="agent-no-comments">

                                        <i className="bi bi-chat-square-text"></i>

                                        <p>
                                            No comments yet.
                                        </p>

                                    </div>

                                )}

                            </div>


                            {/* ADD COMMENT */}

                            <div className="agent-add-comment">

                                <label>
                                    Add Comment
                                </label>

                                <textarea
                                    value={comment}
                                    onChange={(e) =>
                                        setComment(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Write a reply or update..."
                                    rows="4"
                                    disabled={addingComment}
                                />

                                <button
                                    type="button"
                                    onClick={handleAddComment}
                                    disabled={
                                        addingComment ||
                                        !comment.trim()
                                    }
                                >

                                    <i className="bi bi-send"></i>

                                    {addingComment
                                        ? "Adding..."
                                        : "Add Comment"}

                                </button>

                            </div>

                        </div>


                        {/* ================= RESOLUTION ================= */}

                        {ticket.status !== "Closed" && (

                            <div className="agent-resolution-section">

                                <div className="agent-resolution-header">

                                    <h3>
                                        <i className="bi bi-check-circle"></i>
                                        Resolution
                                    </h3>

                                    <p>
                                        Add the solution provided for this ticket.
                                    </p>

                                </div>


                                <div className="agent-resolution-form">

                                    <label>
                                        Resolution Notes
                                    </label>

                                    <textarea
                                        value={resolution}
                                        onChange={(e) =>
                                            setResolution(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Describe how this issue was resolved..."
                                        rows="5"
                                        disabled={
                                            resolving ||
                                            ticket.status ===
                                            "Resolved"
                                        }
                                    />


                                    {ticket.status === "Resolved" ? (

                                        <div className="resolution-completed">

                                            <i className="bi bi-check-circle-fill"></i>

                                            <span>
                                                This ticket has been resolved.
                                            </span>

                                        </div>

                                    ) : (

                                        <button
                                            type="button"
                                            onClick={handleResolve}
                                            disabled={
                                                resolving ||
                                                !resolution.trim()
                                            }
                                        >

                                            <i className="bi bi-check-circle"></i>

                                            {resolving
                                                ? "Resolving..."
                                                : "Resolve Ticket"}

                                        </button>

                                    )}

                                </div>

                            </div>

                        )}

                    </div>


                    {/* ================= RIGHT SIDEBAR ================= */}

                    <div>


                        {/* ================= ASSIGNMENT CARD ================= */}

                        <div className="agent-assignment-card">

                            <h3>
                                Ticket Assignment
                            </h3>

                            <p>
                                Assign this ticket to a support agent.
                            </p>


                            <label>
                                Support Agent
                            </label>


                            <select
                                value={selectedAgent}
                                onChange={(e) =>
                                    setSelectedAgent(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Select Support Agent
                                </option>


                                {agents.map((agent) => (

                                    <option
                                        key={agent._id}
                                        value={agent._id}
                                    >
                                        {agent.name} —{" "}
                                        {agent.department}
                                    </option>

                                ))}

                            </select>


                            {/* ASSIGN BUTTON */}

                            <button
                                type="button"
                                onClick={handleAssign}
                                disabled={assigning}
                            >

                                <i className="bi bi-person-check"></i>

                                {assigning
                                    ? "Assigning..."
                                    : "Assign Ticket"}

                            </button>


                            {/* ACCEPT BUTTON */}

                            {ticket.status === "Assigned" &&
                            ticket.assignedTo &&
                            (
                                ticket.assignedTo._id ===
                                currentUser?._id ||
                                ticket.assignedTo._id ===
                                currentUser?.id
                            ) && (

                                <button
                                    type="button"
                                    className="accept-ticket-btn"
                                    onClick={handleAccept}
                                    disabled={accepting}
                                >

                                    <i className="bi bi-play-circle"></i>

                                    {accepting
                                        ? "Starting..."
                                        : "Accept & Start Working"}

                                </button>

                            )}


                            {/* CURRENT ASSIGNMENT */}

                            {ticket.assignedTo && (

                                <div className="currently-assigned">

                                    <span>
                                        Currently Assigned To
                                    </span>

                                    <strong>
                                        {ticket.assignedTo.name}
                                    </strong>

                                    <small>
                                        {ticket.assignedTo.email}
                                    </small>

                                </div>

                            )}

                        </div>


                        {/* ================= STATUS ================= */}

                        <div className="ticket-status-control">

                            <label>
                                Update Status
                            </label>

                            <select
                                value={ticket.status}
                                onChange={(e) =>
                                    handleStatusChange(
                                        e.target.value
                                    )
                                }
                                disabled={updatingStatus}
                            >

                                <option value="Open">
                                    Open
                                </option>

                                <option value="Assigned">
                                    Assigned
                                </option>

                                <option value="In Progress">
                                    In Progress
                                </option>

                                <option value="Waiting for Employee">
                                    Waiting for Employee
                                </option>

                                <option value="Resolved">
                                    Resolved
                                </option>

                                <option value="Closed">
                                    Closed
                                </option>

                            </select>

                            {updatingStatus && (
                                <small>
                                    Updating status...
                                </small>
                            )}

                        </div>


                        {/* ================= PRIORITY ================= */}

                        <div className="ticket-priority-control">

                            <label>
                                Update Priority
                            </label>

                            <select
                                value={ticket.priority}
                                onChange={(e) =>
                                    handlePriorityChange(
                                        e.target.value
                                    )
                                }
                                disabled={updatingPriority}
                            >

                                <option value="Low">
                                    Low
                                </option>

                                <option value="Medium">
                                    Medium
                                </option>

                                <option value="High">
                                    High
                                </option>

                                <option value="Critical">
                                    Critical
                                </option>

                            </select>

                            {updatingPriority && (
                                <small>
                                    Updating priority...
                                </small>
                            )}

                        </div>


                        {/* ================= TRANSFER ================= */}

                        <div className="transfer-ticket-section">

                            <h3>
                                <i className="bi bi-arrow-left-right"></i>
                                Transfer Ticket
                            </h3>

                            <p>
                                Transfer this ticket to another support agent.
                            </p>


                            <select
                                value={transferAgent}
                                onChange={(e) =>
                                    setTransferAgent(
                                        e.target.value
                                    )
                                }
                                disabled={transferring}
                            >

                                <option value="">
                                    Select Support Agent
                                </option>


                                {agents
                                    .filter(
                                        (agent) =>
                                            agent._id !==
                                            ticket.assignedTo?._id
                                    )
                                    .map((agent) => (

                                        <option
                                            key={agent._id}
                                            value={agent._id}
                                        >
                                            {agent.name} -{" "}
                                            {agent.email}
                                        </option>

                                    ))}

                            </select>


                            <button
                                type="button"
                                onClick={handleTransfer}
                                disabled={
                                    transferring ||
                                    !transferAgent
                                }
                            >

                                <i className="bi bi-arrow-right-circle"></i>

                                {transferring
                                    ? "Transferring..."
                                    : "Transfer Ticket"}

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </Layout>
    );
}

export default AgentTicketDetails;;