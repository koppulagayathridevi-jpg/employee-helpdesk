import React from "react";

function StatCard({
    title,
    value,
    subtitle,
    icon,
    type = "green"
}) {

    return (
        <div className={`stat-card stat-${type}`}>

            <div className="stat-card-top">

                <div className="stat-icon">
                    <i className={`bi ${icon}`}></i>
                </div>

                <span className="stat-menu">
                    <i className="bi bi-three-dots"></i>
                </span>

            </div>

            <div className="stat-value">
                {value}
            </div>

            <div className="stat-title">
                {title}
            </div>

            <div className="stat-subtitle">
                {subtitle}
            </div>

        </div>
    );
}

export default StatCard;