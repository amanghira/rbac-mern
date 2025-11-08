<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/en/2/2f/Chandigarh_University_Logo.png" width="200" alt="Chandigarh University Logo"/>
</p>

<h1 align="center">🎓 Chandigarh University Capstone Project</h1>

<h2 align="center">Role-Based Access Control (RBAC) System using MERN Stack</h2>

---

## 📚 Project Overview

This project implements a **fine-grained Role-Based Access Control (RBAC)** system using the **MERN Stack (MongoDB, Express.js, React, Node.js)**.  
The system enforces secure and scalable role management for three roles — **Admin**, **Editor**, and **Viewer** — ensuring that each user can only perform actions permitted to their role.

---

## 🧩 Features

- 🔐 **JWT-Based Authentication** — Secure user login with short-lived tokens.
- 👥 **Role & Permission Matrix** — Custom roles (Admin, Editor, Viewer) with specific privileges.
- ⚙️ **Express Middleware** — Authorization checks using role-based and ownership-based access control.
- 💾 **MongoDB Data Scoping** — Ensures editors can only modify their own content.
- 🖥️ **Dynamic React UI** — Components, routes, and buttons are automatically shown or hidden based on user roles.
- 🧰 **Admin Dashboard** — Allows user management, role assignment, and auditing of changes.
- 🛡️ **Security Enhancements** — Input validation, rate limiting, and secure password hashing using bcrypt.
- 🔍 **API Logging** — Server-side logs for authentication, authorization, and errors.

---

## 🧱 Tech Stack

| Layer | Technology Used |
|-------|------------------|
| **Frontend** | React.js, Vite, Axios, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Authentication** | JSON Web Tokens (JWT) |
| **Containerization** | Docker, Docker Compose |

---

## 🧑‍💻 Roles and Permissions

| Role | Permissions |
|------|--------------|
| **Admin** | Full access to all users, posts, and admin settings |
| **Editor** | Create, edit, and delete **only their own posts** |
| **Viewer** | Can only read content, no modifications allowed |

---

## 🚀 Getting Started

### 1️⃣ Prerequisites
- [Node.js](https://nodejs.org/en/download) installed  
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) running  
- Internet connection (for pulling MongoDB image)

### 2️⃣ Clone the Repository
```bash
git clone https://github.com/amanghira/rbac-mern.git
cd rbac-mern
