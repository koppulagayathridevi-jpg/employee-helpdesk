import React, { useEffect, useState } from "react";
import API from "../api/api";

function TestAuth() {

    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {

        const getProfile = async () => {

            try {

                const response = await API.get("/users/me");

                console.log("Profile response:", response.data);

                setUser(response.data.user);

            } catch (error) {

                console.error("Profile error:", error);

                setError(
                    error.response?.data?.message ||
                    "Unable to fetch profile"
                );
            }
        };

        getProfile();

    }, []);

    return (
        <div style={{ padding: "40px" }}>

            <h1>Authentication Test</h1>

            {error && (
                <p>{error}</p>
            )}

            {user && (
                <div>

                    <h2>Authenticated Successfully ✅</h2>

                    <p>
                        <strong>Name:</strong> {user.name}
                    </p>

                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>

                    <p>
                        <strong>Employee ID:</strong> {user.employeeId}
                    </p>

                    <p>
                        <strong>Department:</strong> {user.department}
                    </p>

                    <p>
                        <strong>Role:</strong> {user.role}
                    </p>

                </div>
            )}

        </div>
    );
}

export default TestAuth;