# Gourmet - Food Ordering App

A modern, high-performance Food Ordering Web Application (Swiggy/Zomato clone) built from scratch.

## Project Architecture
- **Frontend App**: React (Vite), React Router v6, Context API, Vanilla CSS (rich aesthetics).
- **Backend App**: Node.js, Express, MongoDB, Mongoose, JWT authentication.

## Prerequisites
- Node.js (`v18+`)
- MongoDB (Running locally on default port `27017` or remote instance)

## Setup Instructions

### 1. Backend (`/server`)
```bash
cd server
npm install
```

Configure `.env` if needed (default uses `mongodb://127.0.0.1:27017/foodapp` and PORT `5000`).

Seed the database with menu items:
```bash
npm run seed
```

Start the backend (dev mode by default):
```bash
npm run dev
```

### 2. Frontend (`/client`)
```bash
cd client
npm install
npm run dev
```

The app will stream on `http://localhost:5173`.

---

## Features
- **User Roles**: Customers and Admins.
- **Cart System**: Real-time state management hooked to session storage.
- **Live Status Tracking**: Track order status (Placed > Preparing > Ready > Delivered) using steppers.
- **Admin Dashboard**: Manage menu availability, prices, and progress order flows easily.
- **Premium Design**: Dark-mode curated, glassmorphism, fully responsive structure.
