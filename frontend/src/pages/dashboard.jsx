import "../App.css";
import React, { useState } from "react";

export default function Dashboard() {
    const [meetingCode, setMeetingCode] = useState("");

    const createMeeting = () => {
        const code = Math.random()
            .toString(36)
            .substring(2, 8);

        window.location.href = `/meeting/${code}`;
    };

    const joinMeeting = () => {
        if (!meetingCode.trim()) {
            alert("Please enter a meeting code");
            return;
        }

        window.location.href = `/meeting/${meetingCode.trim()}`;
    };

    return (
        <div className="dashboard-page">

            {/* NAVBAR */}
            <nav className="dashboard-navbar">

                <div className="dashboard-logo">
                    <div className="dashboard-logo-icon">
                        V
                    </div>

                    <span>VIORA</span>
                </div>

                <div className="dashboard-nav-right">
                    <span className="dashboard-nav-active">
                        Dashboard
                    </span>

                    <button
                        className="dashboard-logout"
                        onClick={() => {
                            localStorage.removeItem("token");
                            window.location.href = "/auth";
                        }}
                    >
                        Logout
                    </button>
                </div>

            </nav>


            {/* MAIN CONTENT */}
            <main className="dashboard-content">

                <section className="dashboard-welcome">

                    <p className="dashboard-small-title">
                        WELCOME BACK
                    </p>

                    <h1>
                        Where conversations
                        <br />
                        <span>come alive.</span>
                    </h1>

                    <p className="dashboard-subtitle">
                        Connect. Collaborate. Close.
                    </p>

                </section>


                {/* ACTION CARDS */}
                <section className="dashboard-actions">

                    {/* CREATE MEETING */}
                    <div className="dashboard-card create-card">

                        <div className="card-icon create-icon">
                            +
                        </div>

                        <h2>
                            Create a Meeting
                        </h2>

                        <p>
                            Start a new meeting and invite
                            others to join instantly.
                        </p>

                        <button
                            className="primary-dashboard-button"
                            onClick={createMeeting}
                        >
                            Create Meeting
                        </button>

                    </div>


                    {/* JOIN MEETING */}
                    <div className="dashboard-card join-card">

                        <div className="card-icon join-icon">
                            →
                        </div>

                        <h2>
                            Join a Meeting
                        </h2>

                        <p>
                            Have a meeting code?
                            Enter it below to join.
                        </p>

                        <div className="join-input-wrapper">

                            <input
                                type="text"
                                placeholder="Enter meeting code"
                                value={meetingCode}
                                onChange={(e) =>
                                    setMeetingCode(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        joinMeeting();
                                    }
                                }}
                            />

                            <button
                                className="primary-dashboard-button join-button"
                                onClick={joinMeeting}
                            >
                                Join
                            </button>

                        </div>

                    </div>

                </section>


                {/* BOTTOM TAGLINE */}
                <div className="dashboard-bottom-text">
                    <span>
                        VIORA
                    </span>

                    <p>
                        Talk like you're there.
                    </p>
                </div>

            </main>

        </div>
    );
}