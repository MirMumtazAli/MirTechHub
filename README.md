
# MirTechHub - Digital E-Commerce Platform

![MirTechHub Showcase](httpshttps://via.placeholder.com/1200x600.png?text=MirTechHub+Application+Showcase)
*(Replace the above placeholder with a banner screenshot of your application)*

**MirTechHub** is a modern, full-stack e-commerce platform designed for digital creators to sell products like study notes, mini-software, and publish insightful blog content. It features a clean, responsive user interface and a powerful, secure admin dashboard for complete content and site management.

[![Angular](https://img.shields.io/badge/Angular-20%2B-DD0031?style=for-the-badge&logo=angular)](https://angular.io/)
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET-8-512BD4?style=for-the-badge&logo=dotnet)](https://dotnet.microsoft.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![SQL Server](https://img.shields.io/badge/SQL_Server-22-CC2927?style=for-the-badge&logo=microsoft-sql-server)](https://www.microsoft.com/en-us/sql-server)

---

## ✨ Key Features

The platform is split into two main experiences: the public-facing user storefront and the secure admin dashboard.

### 👤 User Features

*   **Product Browsing:** Explore digital notes and software with search and pagination.
*   **Shopping Cart:** A seamless, client-side cart experience.
*   **User Authentication:** Secure registration and login using JWT.
*   **Order Management:** Users can view their order history and status.
*   **Blog Platform:** Read articles, view details, and engage in discussions.
*   **Reviews & Comments:** Leave ratings and comments on products and blog posts, including nested replies.
*   **Responsive Design:** Fully accessible and beautifully designed for all screen sizes, from mobile to desktop.
*   **Dynamic Content:** Pages like Notes, Software, and Blog can be toggled on/off by the admin in real-time.

### 👑 Admin Features

*   **Secure Dashboard:** Role-protected admin area for managing the entire platform.
*   **Full CRUD Operations:** Create, Read, Update, and Delete **Notes**, **Software**, and **Blog Posts** using a rich text (Quill) editor.
*   **Order Management:** View all user orders, and update their status (e.g., Pending, Processing, Completed).
*   **Review Moderation:** Manage all user-submitted reviews and comments, with options to toggle visibility or delete them.
*   **Site Configuration:** A unique settings panel allows admins to dynamically show or hide entire sections of the site (e.g., disable the Blog page) without touching any code.
*   **Featured Content:** Mark any product or blog post as "featured" to highlight it on the homepage.

---

## 📸 Screenshots

*(Replace these placeholders with your own application screenshots)*

| Homepage                                        | Product Details Page                                    |
| ----------------------------------------------- | ------------------------------------------------------- |
| ![Homepage](https://via.placeholder.com/600x400.png?text=Homepage) | ![Product Details](https://via.placeholder.com/600x400.png?text=Product+Details) |

| Admin Dashboard (Manage Notes)                        | Admin Site Settings                                       |
| ----------------------------------------------------- | --------------------------------------------------------- |
| ![Admin Dashboard](https://via.placeholder.com/600x400.png?text=Admin+Dashboard) | ![Admin Settings](https://via.placeholder.com/600x400.png?text=Admin+Settings)   |

---

## 🛠️ Technology Stack

This project is built with a modern, robust technology stack chosen for performance, scalability, and developer experience.

### Frontend

*   **Framework:** **Angular 20+** (Standalone Components, Signals, Zoneless)
*   **Styling:** **Tailwind CSS**
*   **State Management:** **Angular Signals** for reactive and performant state.
*   **Rich Text Editing:** **Quill.js** for a powerful WYSIWYG editor.

### Backend

*   **Framework:** **.NET 8** / **ASP.NET Core Web API**
*   **Database:** **Entity Framework Core 8** with **SQL Server** (uses LocalDB by default).
*   **Authentication:** **JWT (JSON Web Tokens)** with ASP.NET Core Identity.
*   **Architecture:** Follows a clean, repository pattern for data access.

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

*   **.NET 8 SDK:** [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)
*   **Node.js and npm:** [Download here](https://nodejs.org/) (LTS version is recommended)
*   **SQL Server:** **SQL Server Express LocalDB** is recommended, as it is pre-configured in `appsettings.json`. It typically comes with Visual Studio.

### 1. Backend Setup (.NET API)

The backend API handles all data, authentication, and business logic.

```bash
# 1. Navigate to the API directory
cd api

# 2. Restore dependencies
dotnet restore

# 3. Run the application
dotnet run
```

The API will start on `https://localhost:5001`. The first time you run it, **Entity Framework Core will automatically create and seed the database** based on the `DbInitializer` configuration.

### 2. Frontend Setup (Angular)

The frontend is a standalone Angular application built with Vite.

```bash
# 1. In a new terminal, navigate to the project root
# (if you are in the `api` directory, run `cd ..`)

# 2. Install npm dependencies
npm install

# 3. Start the development server
npm start
```

Your browser should automatically open to `http://localhost:5173`, and the application will be running. The Vite development server is pre-configured to proxy all `/api` requests to your backend at `https://localhost:5001`.

### ⚙️ Configuration

#### Default Admin Users

The backend is configured to automatically create two admin users when it first starts up. You can find their credentials in `api/appsettings.json`.

*   **Email:** `main.admin@example.com`, **Password:** `MainAdmin123!`
*   **Email:** `backup.admin@example.com`, **Password:** `BackupAdmin123!`

You can change these credentials or add more admin users in this file before running the API for the first time.

## 📧 Contact

Mir Mumtaz Ali - mirmumtazali7278@gmail.com

Project Link: [https://github.com/your-username/mirtechhub](https://github.com/your-username/mirtechhub)
