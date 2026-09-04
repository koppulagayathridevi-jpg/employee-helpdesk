import React from "react";
import { Link } from "react-router-dom";

function TicketCard({
    id,
    title,
    department,
    priority,
    status,
    time
}) {

    return (
        <div className="recent-ticket">

            <div className="ticket-main">

                <div className="ticket-icon">
                    <i className="bi bi-ticket-perforated"></i>
                </div>

                <div className="ticket-content">

                    <Link to="/ticket-details">
                        {title}
                    </Link>

                    <div className="ticket-meta">
                        <span>{id}</span>
                        <span>•</span>
                        <span>{department}</span>
                    </div>

                </div>

            </div>


            <div className="ticket-right">

                <span className={`priority-badge ${priority.toLowerCase()}`}>
                    {priority}
                </span>

                <span className={`status-badge ${status.toLowerCase().replace(" ", "-")}`}>
                    {status}
                </span>

                <span className="ticket-time">
                    {time}
                </span>

            </div>

        </div>
    );
}

export default TicketCard;