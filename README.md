# Planora - Full-Stack Events Platform 🚀

Planora is a modern, responsive, and robust full-stack web application designed for seamless event management. It allows users to discover, join, and pay for events, while empowering event owners and administrators to manage participants and moderate the platform.

### 🌐 Live URLs

- **Frontend Live**: [https://planora-frontend-green.vercel.app](https://planora-frontend-green.vercel.app)
- **Backend Live**: [https://planora-backend-sigma.vercel.app](https://planora-backend-sigma.vercel.app)
- **Frontend Repo**: [https://github.com/wasif23ahad/planora-frontend](https://github.com/wasif23ahad/planora-frontend)
- **Backend Repo**: [https://github.com/wasif23ahad/planora-backend](https://github.com/wasif23ahad/planora-backend)

---

## 📖 Project Overview

Built as a submission for **Assignment 5**, this project perfectly aligns with the requirements of a production-style full-stack application. It implements comprehensive authentication, full CRUD operations, strict Role-Based Access Control (RBAC), and a highly polished UI/UX design.

### ✨ Key Features

*   **Beautiful Homepage Design**: Features a dynamic Hero section, comprehensive Categories, a grid of Upcoming Events, and a compelling Call-to-Action, framed by a responsive Navbar and Footer.
*   **Premium UI/UX**: Built with Tailwind CSS, the application boasts a fully responsive design across all devices, consistent styling, interactive hover states, dynamic loading indicators, and intuitive toast notifications.
*   **Secure Authentication**: Implements robust JWT-based authentication alongside seamless **Google OAuth 2.0** integration.
*   **Role-Based Access Control (RBAC)**:
    *   **User**: Can browse events, join free events, purchase tickets, and write reviews.
    *   **Owner**: Can create and manage their own events, and send private email invitations.
    *   **Admin**: Has access to a dedicated moderation dashboard to oversee the platform and safely delete user accounts.
*   **Comprehensive CRUD**: Full Create, Read, Update, and Delete functionality applied to Events, Reviews, and Users.
*   **Payment Integration**: Integrated with **SSLCommerz** for secure, real-time ticket purchases and seamless redirect flows.
*   **Error Handling**: Complete with frontend form validation (React Hook Form + Zod), backend error catchers, and user-friendly error messages.

---

## 🛠️ Technology Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Router, Server-Side Rendering)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **State Management & Data Fetching**: React Hooks, Axios
*   **Form Validation**: React Hook Form + Zod
*   **Icons**: Google Material Symbols
*   **Deployment**: Vercel

---

## 🚀 Setup Instructions

Follow these steps to run the frontend application locally on your machine.

### 1. Prerequisites
*   Node.js (v18 or higher)
*   The Planora Backend API running locally (or you can connect to the deployed backend).

### 2. Installation
Clone the repository and install the dependencies:
```bash
git clone <repository-url>
cd frontend
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and configure the following variables:
```env
# Point this to your local backend (e.g., http://localhost:4000) or the deployed API
NEXT_PUBLIC_API_URL=https://planora-backend-sigma.vercel.app

# The URL of this frontend application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Running the Development Server
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.

---

## 👨‍💻 Demo Credentials for Testing

The platform has three roles, each with a seeded demo account. Click the matching role button on the login page to autofill credentials.

| Role    | Email                  | Password    | Can do |
|---------|------------------------|-------------|--------|
| User    | user@planora.com       | password123 | Browse, join, pay, host events, write reviews |
| Manager | manager@planora.com    | password123 | Read all events/users, toggle featured, read reviews and support messages |
| Admin   | admin@planora.com      | password123 | Everything, including suspend / delete users and delete events |
