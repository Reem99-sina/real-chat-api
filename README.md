Real-Time Chat Application (Node.js + Express + Sequelize + Socket.io)
🧠 Overview

This project is a real-time chat application built using Node.js, Express, Sequelize (MySQL), and Socket.io.
It supports creating chat rooms, adding members, sending and receiving messages instantly, and managing message delivery statuses (sent, delivered, seen).

The app is designed with authentication, real-time updates, and a clean RESTful API architecture.

🗂️ Main Features

🔐 JWT Authentication for secure access

💬 Real-time messaging using Socket.io

👥 Private & group chat rooms

🧩 Sequelize ORM for managing MySQL models and relations

🕒 Message status tracking (sent, delivered, seen)

👤 User-based access — users can only access chats they belong to

Real-Time Chat API Documentation

https://cloudy-sunset-901741.postman.co/workspace/My-Workspace~13f3400d-51e0-4b09-82c2-8bc207ac20f4/collection/19716445-824f0e7c-0656-4357-b927-4fbc629a4d8d?action=share&creator=19716445

user
POST /api/user/signup → Register new user
POST /api/user/signin → Login user and get token
GET /api/user/profile→ get user profile by send token
PATCH /api/user/profile→ edit user profile by send token (email,name,status)
PATCH /api/user/send-code→ get code to change password
PATCH /api/user/check-code→ check code send by user to change password
PATCH /api/user/new-password → change password

Chat API

POST /api/create-chat → create new chat (private or group) by authenticated user
GET /api/chats → get all chats of authenticated user
GET /api/chats/:id → get chat by id including members and messages
POST /api/add-member-chat → add member to existing chat

Messages API

POST /api/chats/:chatId/send-message → send a message to a specific chat (authenticated user)
GET /api/chats/:chatId/messages → get all messages of a specific chat (authenticated user)
