## OpenHardware

**OpenHardware** is a community-driven platform for discovering, sharing, and collaborating on open‑source hardware projects. It combines a modern React frontend with a Node.js/Express backend and MongoDB to help makers showcase projects, manage repositories, and connect with others.

### Project Preview

> Replace the placeholder below with an actual screenshot or hero image of your app (e.g. from the homepage or a featured project view).

OpenHardware Screenshot

---

### Key Features

- **User accounts & profiles**: Sign up, log in, and manage your personal profile.
- **Project repositories**: Create and manage hardware project repositories with descriptions and related assets.
- **Project view pages**: Dedicated pages for exploring individual projects and their details.
- **Search & discovery**: Search projects and browse featured/community projects from the homepage.
- **Public profiles**: View other users’ public profiles and their shared repositories.
- **Modern UI**: Responsive, Tailwind‑styled interface with a landing page highlighting features, community, and contact.

---

### Tech Stack

- **Frontend**: React (Vite), React Router, Tailwind CSS, lucide-react
- **3D & visualization**: three.js, @react-three/fiber, @react-three/drei
- **Backend**: Node.js, Express
- **Database**: MongoDB (via Mongoose)
- **Auth & security**: JSON Web Tokens (JWT), bcryptjs
- **Uploads & assets**: multer, archiver

---

### How It Works (High Level)

- **Authentication & session**
  - Users register and log in via `/api/auth/register` and `/api/auth/login`.
  - The backend issues a **JWT** (`JWT_SECRET`) which the frontend stores in `localStorage` (`token` + `user`).
  - An Axios interceptor automatically attaches `Authorization: Bearer <token>` to protected API calls.
- **User profiles**
  - `/api/user/:id` returns the authenticated user’s full profile; `/api/user/publicUser/:id` exposes a public-safe view.
  - Users can update their **name** and **occupation** and change their **password**.
  - Profile pictures are uploaded via `/api/user/profile-picture` (Multer stores them under `uploads/profile-pictures/`, and the DB stores a full URL).
- **Repositories (projects)**
  - A repository is stored in MongoDB with: `title`, `description`, `readme` (Markdown), `owner`, `files.cad`, `files.docs`, `images`, and a flexible `bom` (Bill of Materials) object.
  - Creating a repo (`POST /api/repositories`) uses a `FormData` payload from the frontend’s `CreateRepo` screen:
    - **CAD files** (`.stl`, `.step`, `.stp`, `.iges`, `.igs`) and **docs** (`.pdf`, `.doc(x)`, `.txt`, `.md`) are uploaded via Multer and saved under `uploads/files/...`.
    - **Images** are uploaded to `uploads/images/` and are later used for thumbnails and galleries.
    - The **BOM** is built interactively in the UI and sent as JSON, then stored as `bom` in the `Repository` document.
  - Updating a repo (`PUT /api/repositories/:id`) lets the owner change metadata, add/remove files and images, and update the BOM.
  - Deleting a repo (`DELETE /api/repositories/:id`) also removes linked files from disk where possible.
- **Search & discovery**
  - `/api/repositories/search?q=...` performs a case‑insensitive search on `title` and `description`, returning repositories with populated owner info for the `SearchPage` UI.
  - Public project and profile pages (`/project/:id`, `/public-profile/:userId`) are accessible without being logged in.
- **Downloads & packaging**
  - `/api/repositories/:id/download` streams a ZIP archive built on the fly using **archiver**:
    - Adds all CAD and documentation files into logical subfolders.
    - Includes the project’s README as `README.md` and the BOM as `bom.json`.
  - The frontend calls this endpoint and triggers a browser download (`project-<id>.zip`).

---

### Typical User Journey

1. **Landing & exploration**
  - Visitor lands on the marketing‑style `HomePage` with sections for Features, About, Projects, Community, and Contact.
  - They can search existing projects immediately using the navbar search, which opens the `SearchPage`.
2. **Sign up & login**
  - User creates an account from `/signup` and then logs in at `/login`.
  - On successful login, the JWT and user profile are stored in `localStorage`, and the navbar switches to an authenticated state.
3. **Profile & account management**
  - From `/profile`, the user sees their avatar, bio (name, occupation, username), and **list of their projects**.
  - They can:
    - Edit profile info and password via the `EditProfile` flow.
    - Upload/change their profile picture, which is immediately reflected in the navbar and public profile.
4. **Creating a project (repository)**
  - On `/create-repo`, the user:
    - Fills in project **title**, **description**, and **README** (Markdown).
    - Uploads documentation files (PDFs, docs, text, Markdown).
    - Uploads CAD files for mechanical/electronic design.
    - Uploads multiple images, which will later form the project gallery and carousel.
    - Optionally configures the **Bill of Materials** using a dynamic table (add/remove columns and rows).
  - When they submit, the frontend builds a `FormData` object and calls `repositoryApi.createRepository`, which hits the protected backend route and persists everything.
5. **Viewing a project**
  - On `/project/:id`, viewers see:
    - **Header**: project title, description, and owner info (with a link to the owner’s public profile).
    - **Project preview**: an image carousel showing all uploaded images.
    - **Tabs**:
      - `README`: nicely rendered Markdown using `react-markdown` and `remark-gfm`.
      - `Files`: list of documentation files with in‑browser PDF preview and download support.
      - `3D Models`: list of CAD files with a 3D viewer (`CADFileViewer` + three.js/@react-three/fiber) and a download option.
      - `Images`: tiled gallery with click‑to‑zoom modal.
      - `Bill of Materials`: table view of the stored BOM columns/rows.
6. **Searching & discovering projects**
  - From anywhere, the navbar search sends the query to `/search?q=...` and shows matching repositories.
  - Each result card shows an image (if provided), owner avatar, title, short description, and actions to **view** or **download** the project.
7. **Public profile viewing**
  - `/public-profile/:userId` displays another user’s public information and their repositories (fetched by owner ID), enabling community discovery.

---

### Getting Started

#### Prerequisites

- **Node.js** (LTS recommended)
- **npm** (bundled with Node.js)
- **MongoDB** running locally or a MongoDB connection URI

---

### Installation & Setup

1. **Clone the repository**
  - `git clone <this-repo-url>`
  - `cd OPEN-HARDWARE - MAIN`
2. **Install backend dependencies**
  - `cd backend`
  - `npm install`
3. **Install frontend dependencies**
  - In a new terminal:
  - `cd frontend`
  - `npm install`
4. **Configure environment variables (backend)**
  - In the `backend` folder, create a `.env` file (if not already present) with values similar to:
    - `PORT=5000`
    - `MONGODB_URI=<your-mongodb-uri>`
    - `JWT_SECRET=<your-secret-key>`
  - Adjust names/values to match your actual configuration.

---

### Running the Project

From the project root:

1. **Start the backend**
  - `cd backend`
  - `npm run dev`  
  - Backend will typically run on `http://localhost:5000` (or your configured `PORT`).
2. **Start the frontend**
  - Open another terminal.
  - `cd frontend`
  - `npm run dev`  
  - Vite will start the React app, usually at `http://localhost:5173` (or the port shown in the terminal).
3. **Open the app**
  - Visit the frontend URL in your browser.
  - Sign up, log in, and start creating or browsing hardware projects.

---

### Project Structure (High Level)

- `backend/` – Express server, API routes, authentication, database models, file handling.
- `frontend/` – React + Vite app, pages and components like `HomePage`, `Profile`, `CreateRepo`, `ProjectView`, `SearchPage`, etc.
- `docs/` (optional) – Suggested place to store screenshots and additional documentation (e.g. `project-screenshot-placeholder.png`).

---

### Contributing

- **Issues & ideas**: Open an issue describing bugs, feature requests, or improvements.
- **Pull requests**: Fork the repo, create a feature branch, and submit a PR with a clear description of your changes.

---

