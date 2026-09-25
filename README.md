# Task Management System ⏳📈

A premium, state-of-the-art productivity application designed with a dark glassmorphism obsidian theme, native ambient audio synthesis, dynamic calendars, and intelligent analytics. Built on the MERN (MongoDB, Express, React, Node.js) stack.

---

## 🌟 Key Features

### 1. Unified Dashboard & Task Manager 📋
* **Add Task Modal**: Create and schedule tasks with customizable properties (Title, Description, Due Date, Priority, Category) in a highly styled modal instead of cluttering the primary canvas.
* **Filter & Search Bar**: Search for tasks instantly and filter them by Status, Priority (High, Medium, Low), or Category (Personal, Work, Urgent, Others).
* **Double-Click Lock Protection**: Automatic absolute-positioned loading overlays block user inputs and show a spinner during toggle or delete operations, preventing double submissions.
* **Premium Warning Dialog**: Custom confirmation overlay with backdrop blur for task deletion, replacing standard browser alert dialogs.

### 2. Productivity Analytics 📊
* **Efficiency Score Gauge**: A circular SVG progress indicator tracking task completion efficiency.
* **Overdue Tracker**: Highlights tasks that remain incomplete past their scheduled due dates.
* **Priorities & Categories Breakdowns**: Graphical bar layouts displaying task distributions to track workload balances.

### 3. Schedule Calendar 📅
* **Interactive Month Grid**: Fully navigable calendar grid displaying tasks mapped directly to their due dates.
* **Day Trigger Scheduling**: Click on any calendar day to automatically open the Add Task modal with the selected date preset.
* **Action Routing**: Click on tasks within calendar days to open the editing menu instantly.

### 4. Focus Space & Pomodoro Timer 🧘
* **Pulsing Timer**: Integrated Pomodoro timer supporting Focus Sessions (25 min), Short Breaks (5 min), and Long Breaks (15 min).
* **Focus Task Association**: Bind any active pending task to your focus timer.
* **Native Ambient Audio Synthesizer**: Uses the browser's Web Audio API to dynamically synthesize soft low-frequency **Binaural Waves 🌀** and filtered white-noise **Rain Sound 🌧️** on the fly without using external audio assets.
* **Auto-Complete Prompt**: Custom modal popup to mark the focus task as completed once the timer runs down, playing a native notification chime.

---

## 📂 Project Architecture

```
TimeManagment/
├── backend/
│   ├── config/              # Database connection
│   ├── controllers/         # Request handling logic (auth, task, analytics)
│   ├── middleware/          # JWT protection middlewares
│   ├── models/              # Mongoose database schemas (User, Task)
│   ├── routes/              # Express endpoint routers (userRoutes, taskRoutes)
│   ├── server.js            # Main entrypoint
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/             # Axios request configurations
    │   ├── components/      # Reusable UI (TaskCard, TaskForm, Sidebar, ConfirmModal)
    │   ├── context/         # Auth state context manager
    │   ├── pages/           # Pages (Dashboard, Analytics, Calendar, FocusSpace, Login, Register)
    │   ├── App.jsx          # Routing setup
    │   ├── index.css        # Core custom utility classes, colors, glassmorphism config
    │   └── main.jsx
    └── package.json
```

---

## 🛠️ Tech Stack & Dependencies

### Backend
* **Node.js & Express.js**: Application server framework.
* **MongoDB & Mongoose**: Object Data Modeling (ODM) for database transactions.
* **JSON Web Tokens (JWT)**: Secure stateless authentication.
* **Bcryptjs**: Password hashing.
* **Cors & Dotenv**: Cross-origin resource sharing & configuration manager.

### Frontend
* **React.js (Vite)**: Component-driven user interface.
* **Tailwind CSS**: Utility-first styling with custom configurations.
* **React Router DOM**: Dynamic routing and active navigation links.
* **React Toastify**: Toast notifications for operations.
* **Web Audio API**: Browser-native sound wave generation.

---

## 🔌 API Documentation

All routes except login/registration require the `Authorization: Bearer <JWT_TOKEN>` header.

### Authentication Endpoints
* **POST** `/api/users` - Register a new user account.
* **POST** `/api/users/login` - Authenticate credentials and return user details with a JWT token.

### Task Endpoints
* **GET** `/api/tasks` - Retrieve tasks. Supports paginated metadata and filter queries.
  * Query parameters: `page`, `limit`, `search`, `status`, `priority`, `category`.
* **POST** `/api/tasks` - Create a task.
  * Request Body: `{ title, description, priority, category, dueDate }`
* **PUT** `/api/tasks/:id` - Update task details or mark complete.
  * Request Body: `{ title, description, priority, category, dueDate, status }`
* **DELETE** `/api/tasks/:id` - Remove a task.

### Analytics Endpoints
* **GET** `/api/tasks/analytics` - Return computed statistics.
  * Returns: `{ total, completed, pending, overdue, efficiencyScore, priorityBreakdown, categoryBreakdown }`

---

## 🚀 Setup & Local Execution Guide

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+ recommended)
* MongoDB (Local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) URI)

### 1. Clone & Database Setup
Create a `.env` file inside the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/timemanagement  # Or Atlas URI
JWT_SECRET=your_jwt_super_secret_key
NODE_ENV=development
```

### 2. Run Backend Server
Navigate to the `backend/` folder:
```bash
npm install
npm run dev     # Starts server via nodemon on port 5000
```

### 3. Run Frontend Server
Create a `.env` file inside the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Navigate to the `frontend/` folder:
```bash
npm install
npm run dev     # Starts Vite development server on port 5173
```

---

## 🎨 Theme & Custom Configurations

The UI uses custom colors defined in `frontend/src/index.css` supporting both bright/light mode and a dark obsidian glassmorphism style:
* **Backgrounds**: Obsidian `#000000` (dark mode) / Soft Jade Teal `#F0FDF4` (light mode).
* **Primary Accents**: Emerald Mint `#10B981` / Teal `#0D9488`.
* **Glow Filters**: Custom `luxury-jade-glow` utilities are implemented to overlay ambient dropshadows on panels and active states.
