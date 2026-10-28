# 🎬 IMovies — Movie Ticket Booking Made Simple

<div align="center">

![IMovies Banner](https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80)

[![Live Demo](https://img.shields.io/badge/Live_Demo-IMovies_Web_App-rose?style=for-the-badge&logo=google-chrome&logoColor=white)](https://yuvrajsharma96.github.io/IMovies---Movie-ticket-booking-made-simple/)

[![License: MIT](https://img.shields.io/badge/License-MIT-rose.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-black.svg)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3-06B6D4.svg)](https://tailwindcss.com/)
[![Database](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)

**🌐 Interactive Live Demo:** [https://yuvrajsharma96.github.io/IMovies---Movie-ticket-booking-made-simple/](https://yuvrajsharma96.github.io/IMovies---Movie-ticket-booking-made-simple/)

**A modern, production-grade Full-Stack MERN Movie Ticket Booking platform featuring real-time seat locking with Socket.io, multi-tier interactive cinema seat grids, simulated payment gateways, and scannable digital QR-code passes.**

</div>

---

## 🌟 Key Features

### 💺 Real-Time Seat Concurrency & Visual Grid
- **Concurrency Lock Engine**: When a user selects a seat, it is temporarily locked across all active users in that show's room for 10 minutes with an active countdown timer.
- **Interactive Tiered Seating**: Distinct tiers for **VIP Recliners (₹450)**, **Premium Club (₹320)**, and **Standard Executive (₹220)**.
- **Cinematic Curved Screen**: Curved projection glow effect simulating modern IMAX / Laser auditorium perspectives.
- **Live Status Visuals**: Available, Selected (Rose/Red), Held by another user (Amber pulsing), and Booked (Dimmed with cross).

### 🎫 Scannable Digital QR Passes & Printable Tickets
- **Verified QR Tickets**: High-resolution scannable QR code generated per booking containing verifiable credentials, theatre address, auditorium screen, showtime, and seat list.
- **Luxury Boarding Pass Style**: Printable digital ticket layout with quick `Print / Save as PDF` support and confetti celebration.

### 💳 Simulated Payment Gateway & Concessions
- **Multi-Method Gateway**: Simulated payment authorization with instant validation for **Credit/Debit Cards**, **UPI (Google Pay, PhonePe, Paytm)**, and **Net Banking**.
- **Concessions & F&B Add-ons**: Add gourmet popcorn tubs, nachos with cheese dip, and beverages directly to your order summary.

### 🛡️ Role-Based Authentication & Security
- **JWT Authentication**: Secure Bearer tokens with encrypted passwords using `bcryptjs`.
- **Preconfigured Demo Access**: One-click quick login buttons on the login modal to test as **Demo User** or **Demo Admin** without manually typing credentials.
- **Role Guards**: Route middleware protecting user booking actions and restricting admin operations.

### 📊 Comprehensive Admin Dashboard
- **Live KPI Analytics**: Total gross revenue, active bookings count, tickets issued, scheduled shows, and real-time transaction stream.
- **Movie Catalog Manager**: Add, update, and delete movies with cast, duration, poster, trailer embed, and ratings.
- **Theatre & Show Scheduler**: Schedule shows across theatres and cities; auto-generates 2D seat matrices.

---

## 🏗️ System Architecture

```
                               ┌────────────────────────────────┐
                               │   Client Browser / Mobile App   │
                               │  (React 18 + Tailwind + Vite)  │
                               └──────────────┬─────────────────┘
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      │ HTTP REST APIs               WebSockets (WS) │
                      │ (Axios + JWT)                (Socket.io-cli) │
                      ▼                                               ▼
      ┌────────────────────────────────────────────────────────────────────────┐
      │                      IMovies Node.js / Express Server                  │
      │                                                                        │
      │  ┌───────────────────┐  ┌───────────────────┐  ┌────────────────────┐ │
      │  │  Auth & Users     │  │  Movies & Shows   │  │  Real-Time Socket  │ │
      │  │  Middleware & JWT │  │  Seat Matrix Mgr  │  │  Seat Locking Room │ │
      │  └─────────┬─────────┘  └─────────┬─────────┘  └─────────┬──────────┘ │
      │            │                      │                      │             │
      │            ▼                      ▼                      ▼             │
      │  ┌───────────────────┐  ┌───────────────────┐  ┌────────────────────┐ │
      │  │  Booking Engine   │  │  Payment Gateway  │  │  QR Code Pass Gen  │ │
      │  │  Concurrency Lock │  │  (Simulated Auth) │  │  (qrcode / Base64) │ │
      │  └───────────────────┘  └───────────────────┘  └────────────────────┘ │
      └───────────────────────────────────┬────────────────────────────────────┘
                                          │
                                          ▼
                               ┌─────────────────────┐
                               │  MongoDB (Mongoose) │
                               │  Persistent Storage │
                               └─────────────────────┘
```

---

## 🗂️ Project Directory Structure

```text
IMovies/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & fallback handler
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile
│   │   ├── movieController.js    # Movies CRUD & query filters
│   │   ├── theatreController.js  # Theatres management & city filtering
│   │   ├── showController.js     # Show scheduling & seat matrix generator
│   │   ├── bookingController.js  # Concurrency lock, booking, cancellation, analytics
│   │   └── paymentController.js  # Multi-channel payment simulator
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT protection & admin verification
│   │   └── errorMiddleware.js    # Centralized error formatter
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt password hashing
│   │   ├── Movie.js              # Movie catalog schema with cast & trailer
│   │   ├── Theatre.js            # Theatre details, city, screens
│   │   ├── Show.js               # Show schema with live 2D seat matrix
│   │   └── Booking.js            # Booking records & QR code data
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── movieRoutes.js
│   │   ├── theatreRoutes.js
│   │   ├── showRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── paymentRoutes.js
│   ├── seed/
│   │   ├── seedData.js           # Sample blockbusters, theatres, and pricing
│   │   └── seeder.js             # Automated database populator
│   ├── sockets/
│   │   └── seatSocket.js         # Socket.io room management & broadcast
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express server & Socket.io entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation, city picker, search, quick demo login
│   │   │   ├── Footer.jsx        # Footer & links
│   │   │   ├── MovieCard.jsx     # Cinema poster card with badges & CTA
│   │   │   ├── TrailerModal.jsx  # Embedded YouTube trailer player
│   │   │   └── ProtectedRoute.jsx# Auth & Admin route guards
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Global session state & demo login helpers
│   │   │   └── CityContext.jsx   # Selected location persistence
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Hero banner, trending in city, genre filters
│   │   │   ├── MoviesPage.jsx    # Catalog with search, language, genre, sort
│   │   │   ├── MovieDetailsPage.jsx # Synopsis, cast, date selector, theatres list
│   │   │   ├── SeatSelectionPage.jsx # Interactive 2D seat map with live socket sync
│   │   │   ├── CheckoutPage.jsx  # Order breakdown, snacks add-ons, payment form
│   │   │   ├── ConfirmationPage.jsx # Confetti burst, QR ticket, printable layout
│   │   │   ├── UserDashboardPage.jsx # My bookings, QR pass view, cancellation
│   │   │   ├── AdminDashboardPage.jsx # KPI analytics, movie/theatre/show management
│   │   │   ├── LoginPage.jsx     # Credentials login with one-click demo access
│   │   │   ├── RegisterPage.jsx  # Account signup
│   │   │   └── NotFoundPage.jsx  # 404 handler
│   │   ├── services/
│   │   │   ├── api.js            # Axios client with JWT interceptor
│   │   │   └── socket.js         # Socket.io connection singleton
│   │   ├── App.jsx               # Router & provider hierarchy
│   │   ├── index.css             # Tailwind base & cinema projection styles
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── IMovies.postman_collection.json # Complete Postman test collection
├── .gitignore
├── package.json                  # Root runner with concurrently
└── README.md
```

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **MongoDB**: Local MongoDB instance running on port `27017` or a MongoDB Atlas URI

### 2. Clone Repository
```bash
git clone https://github.com/yuvrajsharma96/IMovies---Movie-ticket-booking-made-simple.git
cd IMovies---Movie-ticket-booking-made-simple
```

### 3. Install Dependencies
Install dependencies for root, backend, and frontend with a single command:
```bash
npm run install:all
```
*(Or install individually: `npm install && cd backend && npm install && cd ../frontend && npm install`)*

### 4. Configure Environment Variables
Both backend and frontend contain `.env.example` templates. Create `.env` files:

**`backend/.env`**:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/imovies
JWT_SECRET=imovies_super_secret_jwt_key_2026_secure
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
SEAT_LOCK_DURATION_MINUTES=10
```

**`frontend/.env`**:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 5. Seed the Database
Populate the database with sample movies (*Oppenheimer*, *Dune: Part Two*, *Interstellar*, *The Dark Knight*, etc.), multiplexes across Mumbai, Delhi-NCR, Bengaluru, Hyderabad, and scheduled showtimes:
```bash
npm run seed
```

### 6. Run the Application
Launch both backend API server and frontend client concurrently:
```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Default Demo Accounts

For effortless testing, the application includes pre-seeded demo accounts with one-click login buttons on the Sign In page:

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@imovies.com` | `admin123` | Full access to Admin Console, add movies, schedule shows, revenue metrics |
| **Customer** | `user@imovies.com` | `user123` | Book tickets, real-time seat lock, digital passes, view booking history |

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/profile` | Private | Retrieve current user profile and bookings |
| `PUT` | `/api/auth/profile` | Private | Update name, phone, or avatar |

### 🎬 Movies (`/api/movies`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/movies` | Public | List movies with search, genre, and sort filters |
| `GET` | `/api/movies/:id` | Public | Get single movie with cast & details |
| `POST` | `/api/movies` | Admin | Create a new movie |
| `PUT` | `/api/movies/:id` | Admin | Update movie details |
| `DELETE` | `/api/movies/:id` | Admin | Delete movie |

### 🏢 Theatres (`/api/theatres`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/theatres` | Public | List theatres with city filter |
| `GET` | `/api/theatres/:id` | Public | Get single theatre details |
| `POST` | `/api/theatres` | Admin | Add a new theatre / multiplex |
| `DELETE` | `/api/theatres/:id` | Admin | Delete theatre |

### 🕒 Shows & Schedules (`/api/shows`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/shows` | Public | Get shows filtered by `movieId`, `date`, `city` |
| `GET` | `/api/shows/:id` | Public | Get show details with live seat matrix |
| `POST` | `/api/shows` | Admin | Schedule a show (auto-generates seat layout) |
| `DELETE` | `/api/shows/:id` | Admin | Delete show schedule |

### 🎟️ Bookings & Concurrency (`/api/bookings`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings/lock-seats` | Private | Hold selected seats for 10 minutes |
| `POST` | `/api/bookings/unlock-seats`| Private | Release held seats |
| `POST` | `/api/bookings` | Private | Confirm booking & generate QR pass |
| `GET` | `/api/bookings/my-bookings`| Private | List current user's bookings |
| `GET` | `/api/bookings/:id` | Private | Get single booking pass details |
| `PUT` | `/api/bookings/:id/cancel` | Private | Cancel booking and free up seats |
| `GET` | `/api/bookings/analytics` | Admin | Gross revenue, tickets count, recent bookings |

### 💳 Payments (`/api/payments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payments/process` | Private | Simulate multi-channel payment authorization |

---

## ⚡ Real-Time Socket.io Events

The platform implements WebSocket rooms partitioned by `showId` for real-time seat lock synchronization:

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `join-show` | Client ➔ Server | `showId` | Join the real-time room for a specific show |
| `leave-show` | Client ➔ Server | `showId` | Leave the show room |
| `seatLocked` | Server ➔ Clients | `{ showId, seatNumbers, lockedBy, expiryTime }` | Broadcast that seats have been held |
| `seatUnlocked`| Server ➔ Clients | `{ showId, seatNumbers }` | Broadcast that seats have been released |
| `seatsBooked` | Server ➔ Clients | `{ showId, seatNumbers }` | Broadcast permanent reservation |

---

## 📮 Postman Collection

Import `IMovies.postman_collection.json` located at the root of the repository into Postman. It includes pre-configured environment variables, auth bearer token extraction scripts, and sample payloads for all endpoints.

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).

---

<div align="center">
  <b>Built with ❤️ by <a href="https://github.com/yuvrajsharma96">Yuvraj Sharma</a></b>
</div>
