import React from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({
    children,
    role = "employee",
    userName = "John Doe"
}) {

    const roleName = {
    employee: "Employee",
    supportAgent: "Support Agent",
    manager: "Department Manager",
    admin: "Administrator"
};
    return (

        <div className="app-layout">

            <Sidebar role={role} />

            <Navbar
                userName={userName}
                role={roleName[role]}
            />

            <main className="main-content">

                {children}

            </main>

        </div>

    );
}

export default Layout;