import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/knowledgebase.css";

function KnowledgeBase() {
    const articles = [
        {
            icon: "bi-laptop",
            title: "Laptop & Computer Problems",
            description: "Troubleshoot common laptop and computer issues.",
            category: "Hardware"
        },
        {
            icon: "bi-wifi",
            title: "Wi-Fi & Network Issues",
            description: "Find solutions for Wi-Fi, internet and VPN problems.",
            category: "Network"
        },
        {
            icon: "bi-envelope",
            title: "Email Problems",
            description: "Get help with email, Outlook and mailbox issues.",
            category: "Email"
        },
        {
            icon: "bi-shield-lock",
            title: "Account & Password",
            description: "Learn how to reset passwords and access your account.",
            category: "Account"
        },
        {
            icon: "bi-window",
            title: "Software Issues",
            description: "Troubleshoot application installation and errors.",
            category: "Software"
        },
        {
            icon: "bi-printer",
            title: "Printer Problems",
            description: "Find solutions for common printer issues.",
            category: "Hardware"
        }
    ];

    return (
        <Layout role="employee">

            <div className="knowledge-page">

                {/* Header */}
                <div className="knowledge-header">
                    <div>
                        <span className="knowledge-label">
                            HELP CENTER
                        </span>

                        <h1>Knowledge Base</h1>

                        <p>
                            Find quick solutions to common workplace problems.
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="knowledge-search">
                    <i className="bi bi-search"></i>

                    <input
                        type="text"
                        placeholder="Search for a solution..."
                    />
                </div>

                {/* Popular Articles */}
                <div className="knowledge-section">

                    <div className="section-title">
                        <div>
                            <h2>Popular Help Topics</h2>
                            <p>
                                Browse solutions to common support problems
                            </p>
                        </div>
                    </div>

                    <div className="knowledge-grid">

                        {articles.map((article, index) => (

                            <div
                                className="knowledge-card"
                                key={index}
                            >

                                <div className="knowledge-icon">
                                    <i className={`bi ${article.icon}`}></i>
                                </div>

                                <div className="knowledge-card-content">

                                    <span className="knowledge-category">
                                        {article.category}
                                    </span>

                                    <h3>
                                        {article.title}
                                    </h3>

                                    <p>
                                        {article.description}
                                    </p>

                                    <button className="read-article">
                                        Read Article
                                        <i className="bi bi-arrow-right"></i>
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

                {/* Still Need Help */}
                <div className="knowledge-help">

                    <div className="help-icon">
                        <i className="bi bi-headset"></i>
                    </div>

                    <div>
                        <h3>Still need help?</h3>

                        <p>
                            If you couldn't find the answer,
                            create a support ticket and our team
                            will help you.
                        </p>
                    </div>

                    <Link
                        to="/create-ticket"
                        className="knowledge-ticket-btn"
                    >
                        Create Ticket
                        <i className="bi bi-arrow-right"></i>
                    </Link>

                </div>

            </div>

        </Layout>
    );
}

export default KnowledgeBase;