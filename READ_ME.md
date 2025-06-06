# 🏨 Hotel Listing Fullstack App

This is a fullstack hotel listing web application built using:

- Frontend: React (or Vite + React)
- Backend: Node.js + Express
- Database: PostgreSQL

---

## 🚀 Getting Started

### Prerequisites
- Node.js & npm installed
- PostgreSQL installed and running

---

## 📁 Project Structure

-hotel-listing-fullstack/
├── hotel-listing-frontend/ # React/Vite app
├── server/ # Node + Express + PostgreSQL API


## ⚙️ Backend Setup (server)

1. Navigate to server directory:

cd server


## Install dependencies:
npm install

## Start server:
nodemon index.js


## Frontend Setup (hotel-listing-frontend)
Open a new terminal and navigate:
cd hotel-listing-frontend
npm install

## Start frontend:
npm run dev

## Access App
Frontend: http://localhost:5173

Backend API: http://localhost:5000

## 📝 Notes
Ensure PostgreSQL is installed and running before starting the backend.

The uploads/ folder (used for file/image storage) is ignored in version control via .gitignore.

Make sure to update any API endpoint URLs in your frontend code if the backend port is different.

## 📦 Deployment (optional)
To deploy, configure environment variables (like DB connection) and host the frontend and backend separately or together based on your chosen platform (e.g., Vercel + Railway/Render, or fullstack on Heroku/Render).

## 👨‍💻 Author
Developed by Sughanthan A K as part of a fullstack development task.