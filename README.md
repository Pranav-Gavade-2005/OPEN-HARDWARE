# OpenHardware

**OpenHardware** is a platform for discovering, sharing, and collaborating on open-source hardware projects.
Built using **React + Node.js + MongoDB**, it allows makers to publish projects with CAD files, documentation, images, and BOM — all in one place.

---

## ✨ Features

* JWT-based authentication
* Public & private user profiles
* Create and manage hardware repositories
* Upload CAD, docs, and images
* Markdown README support
* 3D CAD viewer (Three.js)
* Bill of Materials (BOM)
* Search projects
* Download full project as ZIP

---

## 🛠 Tech Stack

**Frontend**

* React (Vite)
* React Router
* Tailwind CSS
* three.js / @react-three/fiber
* react-markdown

**Backend**

* Node.js
* Express
* MongoDB (Mongoose)
* JWT
* Multer (file uploads)
* Archiver (ZIP generation)

---

## ⚙ How It Works (High Level)

1. **Authentication**

   * User registers/logs in.
   * Backend issues JWT.
   * Frontend stores token and attaches it to protected requests.

2. **Repository Creation**

   * User submits title, description, README (Markdown).
   * Uploads CAD, docs, images.
   * Optional BOM JSON is included.
   * Backend stores metadata in MongoDB and files on disk.

3. **Project Viewing**

   * Public route fetches repository data.
   * README rendered as Markdown.
   * CAD files visualized using Three.js.
   * Files available for preview/download.

4. **Download Packaging**

   * Backend dynamically generates ZIP.
   * Includes files + `README.md` + `bom.json`.

---

## 🔌 Core API Endpoints

### Auth

```
POST   /api/auth/register
POST   /api/auth/login
```

### User

```
GET    /api/user/:id
GET    /api/user/publicUser/:id
PUT    /api/user/update
POST   /api/user/profile-picture
```

### Repositories

```
POST   /api/repositories
GET    /api/repositories/:id
PUT    /api/repositories/:id
DELETE /api/repositories/:id
GET    /api/repositories/search?q=keyword
GET    /api/repositories/:id/download
```

Protected routes require:

```
Authorization: Bearer <token>
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js (LTS)
* npm
* MongoDB (local or Atlas)

---

### Installation

```bash
git clone <repo-url>
cd openhardware
```

**Backend**

```bash
cd backend
npm install
```

**Frontend**

```bash
cd frontend
npm install
```

---

### Environment Variables (`/backend/.env`)

```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

---

## ▶ Running

**Backend**

```bash
npm run dev
```

**Frontend**

```bash
npm run dev
```

Visit the frontend URL shown in terminal (usually `http://localhost:5173`).

---

## 📁 Structure

```
backend/   → API, auth, DB models, file handling
frontend/  → React UI, pages, components
```

---

## 📌 Summary

OpenHardware provides a clean workflow for sharing hardware projects — combining documentation, CAD visualization, structured BOM, and downloadable packaging into a single collaborative platform.
