import "../App.css";
import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";


export default function Meeting() {
    const localVideoRef = useRef(null);
    const socketRef = useRef(null);
    const localStreamRef = useRef(null);
    const peerConnections = useRef({});
    const processingOffers = useRef({});
    const [videos, setVideos] = React.useState([]);
    const [videoEnabled, setVideoEnabled] = React.useState(true);
    const [audioEnabled, setAudioEnabled] = React.useState(true);

    const [messages, setMessages] = React.useState([]);
    const [message, setMessage] = React.useState("");

    const createPeerConnection = (socketId) => {
        const peer = new RTCPeerConnection();

        peerConnections.current[socketId] = peer;

        return peer;
    };



    // 2. Toggle functions
    const toggleVideo = () => {
        if (!localStreamRef.current) return;

        const videoTrack = localStreamRef.current.getVideoTracks()[0];

        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setVideoEnabled(videoTrack.enabled);
        }
    };

    const toggleAudio = () => {
        if (!localStreamRef.current) return;

        const audioTrack = localStreamRef.current.getAudioTracks()[0];

            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setAudioEnabled(audioTrack.enabled);
            }
    };
    //leave meeting
    const leaveMeeting = () => {
        // Stop camera and microphone

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
                track.stop();
            });
        }

        // Close all WebRTC connections
        Object.values(peerConnections.current).forEach((peer) => {
         peer.close();
        });

        peerConnections.current = {};

        // Disconnect Socket.IO
        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        // Go back to authentication page
        window.location.href = "/dashboard";
    };

    const sendMessage = () => {
        if (!message.trim()) return;

        socketRef.current.emit(
            "chat-message",
            message,
            "You"
        );

        setMessage("");
    };


    // 3. WebRTC / Socket.IO useEffect
    useEffect(() => {
    const startMeeting = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            localVideoRef.current.srcObject = stream;
            localStreamRef.current = stream;

            const token = localStorage.getItem("token");
            const guestName = sessionStorage.getItem("guestName");

            socketRef.current = io("https://viora-backend-g4i0.onrender.com", {
                auth: {
                    token: token || null,
                    guestName: guestName || null
                }
            });

            socketRef.current.on("connect", () => {
                 console.log("Socket connected:", socketRef.current.id);
            });

            socketRef.current.on("connect_error", (error) => {
                console.error("Socket connection error:", error)           
            });
            
            

            const meetingCode = window.location.pathname.split("/").pop();

            

            //chat listener
            socketRef.current.on("chat-message", (data, sender, socketIdSender) => {
                console.log("Chat message received:", data, sender);

                setMessages((prev) => [
                    ...prev,
                    {
                        data: data,
                        sender: sender,
                        socketIdSender: socketIdSender
                    }
                ]);
            });


            socketRef.current.on("user-list", async (users) => {
                console.log("Users already in meeting:", users);

                for (const socketId of users) {
                    const peer = createPeerConnection(socketId);
                    
                    //add tracks
                    localStreamRef.current.getTracks().forEach((track) => {
                        peer.addTrack(track, localStreamRef.current);
                    });

                    peer.onicecandidate = (event) => {
                        if (event.candidate) {
                            socketRef.current.emit("signal", socketId, {
                                type: "candidate",
                                candidate: event.candidate
                            });
                        }
                    };
                    //remote video
                    peer.ontrack = (event) => {
                        console.log("REMOTE TRACK RECEIVED:", event);
                        console.log(
                            "REMOTE STREAM TRACKS:",
                            event.streams[0]?.getTracks().map((track) => ({
                                kind: track.kind,
                                enabled: track.enabled,
                                readyState: track.readyState
                            }))
                        );
                        setVideos((prev) => {
                            const existing = prev.find(
                                (video) => video.socketId === socketId
                            );

                            if (existing) {
                                return prev;
                            }

                            return [
                                ...prev,
                                {
                                    socketId: socketId,
                                    stream: event.streams[0]
                                }
                            ];
                        });
                    };

                    //create offer
                    const offer = await peer.createOffer();

                    await peer.setLocalDescription(offer);

                    socketRef.current.emit("signal", socketId, {
                        type: "offer",
                        sdp: offer
                    });
                }
            });

            socketRef.current.on("user-joined", (socketId) => {
                console.log("New user joined:", socketId);
            });

            socketRef.current.on("signal", async (fromId, message) => {
                let peer = peerConnections.current[fromId];

                // Someone sent us an offer
                if (message.type === "offer") {

                // Ignore another offer while this peer is already processing one
                    if (processingOffers.current[fromId]) {
                        return;
                    }

                    processingOffers.current[fromId] = true;

                    try {
                        if (!peer) {
                            peer = createPeerConnection(fromId);

                            localStreamRef.current.getTracks().forEach((track) => {
                                peer.addTrack(track, localStreamRef.current);
                            });

                            peer.onicecandidate = (event) => {
                                if (event.candidate) {
                                    socketRef.current.emit("signal", fromId, {
                                        type: "candidate",
                                        candidate: event.candidate
                                    });
                                }
                            };

                            peer.ontrack = (event) => {

                                console.log("REMOTE TRACK RECEIVED:", event);
                                console.log(
                                    "REMOTE STREAM TRACKS:",
                                    event.streams[0]?.getTracks().map((track) => ({
                                        kind: track.kind,
                                        enabled: track.enabled,
                                        readyState: track.readyState
                                    }))
                                );
                                setVideos((prev) => {
                                    const existing = prev.find(
                                        (video) => video.socketId === fromId
                                    );

                                    if (existing) {
                                        return prev;
                                    }

                                    return [
                                        ...prev,
                                        {
                                            socketId: fromId,
                                            stream: event.streams[0]
                                        }
                                    ];
                                });
                            };
                        }

                        if (peer.signalingState !== "stable") {
                            return;
                        }

                        await peer.setRemoteDescription(
                            new RTCSessionDescription(message.sdp)
                        );

                        const answer = await peer.createAnswer();

                        await peer.setLocalDescription(answer);

                        socketRef.current.emit("signal", fromId, {
                            type: "answer",
                            sdp: answer
                        });

                    } finally {
                        processingOffers.current[fromId] = false;
                    }
                }

                // Someone sent us an answer
                if (message.type === "answer") {
                    if (
                        peer &&
                        peer.signalingState === "have-local-offer"
                    ) {
                        await peer.setRemoteDescription(
                            new RTCSessionDescription(message.sdp)
                        );
                    }
                }

                // ICE candidate received
                if (message.type === "candidate") {
                    if (peer) {
                        try {
                            await peer.addIceCandidate(
                                new RTCIceCandidate(message.candidate)
                            );
                        } catch (error) {
                            console.error("Error adding ICE candidate:", error);
                        }
                    }
                }
            });

            socketRef.current.on("user-left", (socketId) => {
                console.log("User left:", socketId);
            });

            socketRef.current.emit("join-call", meetingCode);

    }   catch (error) {
            console.error("Could not start meeting:", error);
        }
    };

    startMeeting();

    return () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
    };
}, []);

     
     // 4. UI
    return (
    <div className="meeting-page">

        {/* HEADER */}
        <header className="meeting-header">
            <div className="brand">
                <div className="brand-icon">V</div>
                <span>Meeting Room</span>
            </div>

            <div className="meeting-info">
                Meeting: {window.location.pathname.split("/").pop()}
            </div>
        </header>


        {/* MAIN AREA */}
        <div className="meeting-main">

            {/* VIDEO SECTION */}
            <section className="video-section">

                <div className="video-grid">

                    {/* LOCAL VIDEO */}
                    <div className="video-card">

                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                        />

                        <div className="video-name">
                            You
                        </div>

                    </div>


                    {/* REMOTE VIDEOS */}
                    {videos.map((video) => (

                        <div
                            className="video-card"
                            key={video.socketId}
                        >

                            <video
                                autoPlay
                                playsInline
                                ref={(videoElement) => {
                                    if (videoElement) {
                                        videoElement.srcObject =
                                            video.stream;
                                    }
                                }}
                                
                            />

                            <div className="video-name">
                                {video.socketId}
                            </div>

                        </div>

                    ))}

                </div>

            </section>


            {/* CHAT SECTION */}
            <aside className="chat-panel">

                <div className="chat-header">
                    <h2>Chat</h2>
                </div>


                <div className="chat-messages">

                    {messages.length === 0 ? (

                        <div className="empty-chat">
                            No messages yet
                        </div>

                    ) : (

                        messages.map((msg, index) => (

                            <div
                                className={
                                    msg.socketIdSender ===
                                    socketRef.current?.id
                                        ? "message own-message"
                                        : "message"
                                }
                                key={index}
                            >

                                <div className="message-sender">
                                    {msg.sender}
                                </div>

                                <div className="message-text">
                                    {msg.data}
                                </div>

                            </div>

                        ))

                    )}

                </div>


                {/* CHAT INPUT */}
                <div className="chat-input-area">

                    <input
                        type="text"
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        placeholder="Type a message..."
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                sendMessage();
                            }
                        }}
                    />

                    <button onClick={sendMessage}>
                        Send
                    </button>

                </div>

            </aside>

        </div>


        {/* CONTROLS */}
        <div className="meeting-controls">

            <button
                className="control-button"
                onClick={toggleAudio}
            >
                {audioEnabled
                    ? "Mute"
                    : "Unmute"}
            </button>


            <button
                className="control-button"
                onClick={toggleVideo}
            >
                {videoEnabled
                    ? "Camera Off"
                    : "Camera On"}
            </button>


            <button
                className="leave-button"
                onClick={leaveMeeting}
            >
                Leave Meeting
            </button>

        </div>

    </div>
);

}
    
