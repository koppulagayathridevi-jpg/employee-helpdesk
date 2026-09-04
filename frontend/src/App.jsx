import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import MyTickets from "./pages/MyTickets";
import CreateTicket from "./pages/CreateTicket";
import TicketDetails from "./pages/TicketDetails";
import Profile from "./pages/Profile";
import TestAuth from "./pages/TestAuth";
import KnowledgeBase from "./pages/KnowledgeBase";
import AgentDashboard from "./pages/AgentDashboard";
import AgentTickets from "./pages/AgentTickets";

import AgentTicketDetails from "./pages/AgentTicketDetails";
// Components
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Routes>

            {/* =========================
                PUBLIC ROUTES
            ========================== */}

            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />


            {/* =========================
                PROTECTED ROUTES
            ========================== */}

            {/* Employee Dashboard */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <EmployeeDashboard />
                    </ProtectedRoute>
                }
            />

            {/* My Tickets */}
            <Route
                path="/tickets"
                element={
                    <ProtectedRoute>
                        <MyTickets />
                    </ProtectedRoute>
                }
            />

            {/* Create Ticket */}
            <Route
                path="/create-ticket"
                element={
                    <ProtectedRoute>
                        <CreateTicket />
                    </ProtectedRoute>
                }
            />

            <Route
    path="/knowledge-base"
    element={
        <ProtectedRoute>
            <KnowledgeBase />
        </ProtectedRoute>
    }
/>
<Route
    path="/agent-dashboard"
    element={
        <ProtectedRoute>
            <AgentDashboard />
        </ProtectedRoute>
    }
/>
<Route
    path="/agent/tickets"
    element={
        <ProtectedRoute>
            <AgentTickets />
        </ProtectedRoute>
    }
/>
<Route
    path="/agent/tickets/:id"
    element={
        <ProtectedRoute>
            <AgentTicketDetails />
        </ProtectedRoute>
    }
/>
            {/* Ticket Details */}
            <Route
                path="/tickets/:id"
                element={
                    <ProtectedRoute>
                        <TicketDetails />
                    </ProtectedRoute>
                }
            />

            {/* Profile */}
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />


            {/* =========================
                TEMPORARY AUTH TEST
            ========================== */}

            <Route
                path="/test-auth"
                element={
                    <ProtectedRoute>
                        <TestAuth />
                    </ProtectedRoute>
                }
            />


            {/* =========================
                UNKNOWN ROUTE
            ========================== */}

            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />

        </Routes>
    );
}

export default App;