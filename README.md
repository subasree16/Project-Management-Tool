# Project Management Tool

A full-stack project management tool built with React, Express, and MongoDB.

## Stack

- Frontend: React + Vite + React Router + Axios
- Backend: Node.js + Express + MongoDB + Mongoose
- Auth: JWT + bcrypt

## Structure

```text
client/
  src/
    components/
    context/
    pages/
    services/
    App.js
server/
  controllers/
  middleware/
  models/
  routes/
  utils/
  server.js
```

## Backend Setup

1. Open a terminal in `server`.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` from `.env.example`.
4. Start the backend:

   ```bash
   npm run dev
   ```

## Frontend Setup

1. Open a terminal in `client`.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` from `.env.example` if needed.
4. Start the frontend:

   ```bash
   npm run dev
   ```

## Environment Variables

### `server/.env`

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/project_management
JWT_SECRET=change_this_to_a_long_secret
CLIENT_URL=http://localhost:5173
```

### `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

## Features

- Signup and login
- JWT-protected routes
- Project CRUD
- Task CRUD
- Dashboard summary
- Progress tracking
- Overdue and upcoming deadlines
- Project search and status filter
- Dark mode
- Task drag-and-drop board

## Deployment

- Frontend: Netlify or GitHub Pages
- Backend: Render
- Database: MongoDB Atlas

