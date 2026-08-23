import "../App.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Guest() {

    const navigate = useNavigate();

    const [guestName, setGuestName] = useState("");
    const [meetingCode, setMeetingCode] = useState("");

    const joinAsGuest = () => {

        if (!guestName.trim()) {
            alert("Please enter your name");
            return;
        }

        if (!meetingCode.trim()) {
            alert("Please enter a meeting code");
            return;
        }

        sessionStorage.setItem(
            "guestName",
            guestName.trim()
        );

        navigate(`/meeting/${meetingCode.trim()}`);
    };

    return (
        <div className="guest-page">

            <div className="guest-card">

                <div className="guest-logo">
                    <div className="guest-logo-icon">
                        V
                    </div>

                    <span>VIORA</span>
                </div>

                <p className="guest-label">
                    JOIN AS GUEST
                </p>

                <h1>
                    Join the conversation.
                </h1>

                <p className="guest-subtitle">
                    Enter your name and meeting code
                    to join without creating an account.
                </p>

                <div className="guest-form">

                    <input
                        type="text"
                        placeholder="Your name"
                        value={guestName}
                        onChange={(e) =>
                            setGuestName(e.target.value)
                        }
                    />

                    <input
                        type="text"
                        placeholder="Meeting code"
                        value={meetingCode}
                        onChange={(e) =>
                            setMeetingCode(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                joinAsGuest();
                            }
                        }}
                    />

                    <button onClick={joinAsGuest}>
                        Join Meeting
                    </button>

                </div>

                <button
                    className="guest-back"
                    onClick={() => navigate("/")}
                >
                    ← Back to home
                </button>

            </div>

        </div>
    );
}