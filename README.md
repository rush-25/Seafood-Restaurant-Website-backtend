# Ocean's Pearl Restaurant - Backend API

This is the backend service for the Luxury Seafood Restaurant Website, built with Node.js, Express, and MongoDB. It provides RESTful APIs for user authentication, reservation management, contact form submissions, and administrative tasks.

## 🚀 Technologies Used

- **Node.js & Express.js:** Server framework
- **MongoDB & Mongoose:** Database and Object Data Modeling (ODM)
- **JWT (JSON Web Tokens):** Secure authentication and authorization
- **Bcrypt.js:** Password hashing
- **Zod:** Request payload validation
- **Nodemailer:** Email sending service
- **Cors & Dotenv:** Cross-Origin Resource Sharing and environment variable management

## 🗂️ Folder Structure

```text
backend/
├── src/
│   ├── config/          # Database connection and environment configurations
│   ├── controllers/     # Handlers for route endpoints
│   ├── middleware/      # Express middlewares (auth, validation, etc.)
│   ├── models/          # Mongoose database schemas
│   ├── routes/          # API route definitions
│   ├── schemas/         # Zod validation schemas
│   ├── services/        # Business logic and external services
│   └── index.js         # Entry point for the Express server
├── .env                 # Environment variables (create this)
└── package.json         # Project metadata and dependencies
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following variables. 

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
# Email configuration for Nodemailer (if applicable)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

## 🏃‍♂️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
# Starts the server with nodemon for auto-reloading
npm run dev
```

### 3. Start for Production
```bash
# Starts the node server in production mode
npm start
```

The server should now be running on `http://localhost:8000` (or the port specified in your `.env`).

## 📡 API Endpoints Overview

- **Auth (`/api/auth`)**: Registration and login endpoints (`/register`, `/login`).
- **Reservations (`/api/reservations`)**: Create, view, and manage table reservations.
- **Contact (`/api/contact`)**: Submit and manage customer inquiries.
- **Admin (`/api/admin`)**: Administrative endpoints to manage users, view all reservations, and respond to contact messages. Requires an admin JWT token.
