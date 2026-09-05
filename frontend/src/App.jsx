import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// ==========================================
// PAGES
// ==========================================

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



// ==========================================
// AGENT PAGES
// ==========================================

import AgentDashboard from "./pages/AgentDashboard";
import AgentTickets from "./pages/AgentTickets";
import AgentTicketDetails from "./pages/AgentTicketDetails";


// ==========================================
// ADMIN PAGES
// ==========================================

import AdminDashboard from "./pages/AdminDashboard";
import AdminTickets from "./pages/AdminTickets";
import AdminUsers from "./pages/AdminUsers";
import AdminDepartments from "./pages/AdminDepartments";
import AdminReports from "./pages/AdminReports";

// ==========================================
// COMPONENTS
// ==========================================

import ProtectedRoute from "./components/ProtectedRoute";


function App() {

    return (

        <Routes>

            {/* =====================================
                PUBLIC ROUTES
            ====================================== */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
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


            {/* =====================================
                EMPLOYEE ROUTES
            ====================================== */}

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


            {/* Ticket Details */}

            <Route
                path="/tickets/:id"
                element={
                    <ProtectedRoute>
                        <TicketDetails />
                    </ProtectedRoute>
                }
            />


            {/* Knowledge Base */}

            <Route
                path="/knowledge-base"
                element={
                    <ProtectedRoute>
                        <KnowledgeBase />
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


            {/* =====================================
                SUPPORT AGENT ROUTES
            ====================================== */}

            {/* Agent Dashboard */}

            <Route
                path="/agent-dashboard"
                element={
                    <ProtectedRoute>
                        <AgentDashboard />
                    </ProtectedRoute>
                }
            />


            {/* Agent Tickets */}

            <Route
                path="/agent/tickets"
                element={
                    <ProtectedRoute>
                        <AgentTickets />
                    </ProtectedRoute>
                }
            />


            {/* Agent Ticket Details */}

            <Route
                path="/agent/tickets/:id"
                element={
                    <ProtectedRoute>
                        <AgentTicketDetails />
                    </ProtectedRoute>
                }
            />


            {/* =====================================
                ADMIN ROUTES
            ====================================== */}

            {/* Admin Dashboard */}

            <Route
                path="/admin-dashboard"
                element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
    path="/admin/tickets"
    element={
        <ProtectedRoute>
            <AdminTickets />
        </ProtectedRoute>
    }
/>



<Route
    path="/admin/users"
    element={
        <ProtectedRoute>
            <AdminUsers />
        </ProtectedRoute>
    }
/>


<Route
    path="/admin/departments"
    element={
        <ProtectedRoute>
            <AdminDepartments />
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/reports"
    element={
        <ProtectedRoute>
            <AdminReports />
        </ProtectedRoute>
    }
/>
            {/* =====================================
                TEMPORARY AUTH TEST
            ====================================== */}

            <Route
                path="/test-auth"
                element={
                    <ProtectedRoute>
                        <TestAuth />
                    </ProtectedRoute>
                }
            />


            {/* =====================================
                UNKNOWN ROUTE
            ====================================== */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

        </Routes>

    );
}

export default App;