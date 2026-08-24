# Viora – Peer-to-Peer Video Calling Platform

## Overview

Viora is a full-stack peer-to-peer video calling application that I built to explore real-time communication using WebRTC. The application allows users to connect through video and audio calls while using Socket.IO as the signaling server to establish direct peer-to-peer connections. It also includes user authentication and real-time messaging for a complete communication experience.

This project helped me understand how WebRTC works behind the scenes, including signaling, SDP exchange, ICE candidate negotiation, and socket-based communication.

## Features

- One-to-one peer-to-peer video calling
- Real-time audio communication
- Instant messaging using Socket.IO
- User authentication and authorization
- Responsive user interface
- MongoDB integration for user management
- RESTful APIs using Express.js

## Tech Stack

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3

### Backend

- Node.js
- Express.js

### Database

- MongoDB

### Real-Time Communication

- WebRTC
- Socket.IO

## Project Structure

```text
VIDEO_CALLING_WEB
│
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   └── app.js
│   ├── package.json
│   └── .env
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## How It Works

1. A user signs in to the application.
2. The user joins a room.
3. Socket.IO creates a signaling channel between peers.
4. WebRTC exchanges SDP offers, answers, and ICE candidates.
5. A direct peer-to-peer connection is established.
6. Video, audio, and chat data are transmitted in real time.

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```
## What I Learned

While building this project, I gained practical experience with:

- Building peer-to-peer communication using WebRTC
- Implementing real-time communication with Socket.IO
- Managing signaling between connected peers
- Developing REST APIs using Express.js
- Integrating MongoDB with a Node.js backend
- Managing application state in React
- Working with asynchronous and event-driven programming

## Future Improvements

- Group video calling
- Screen sharing
- File sharing
- Call recording
- End-to-end encryption
- Online user status
- Push notifications

## Author

**Emily Bhattacharjee**

B.Tech in Computer Science Engineering

GitHub: github.com/Emily-bhat

LinkedIn: www.linkedin.com/in/ebhattacharjee
