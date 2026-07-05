# atDrive Coding Assessment — MEAN Stack

A full-stack CRUD application built with **MongoDB, Express.js, Angular, and Node.js**, integrating **MySQL** for user authentication and a third-party **Weather API**.

---

## Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* MySQL (mysql2)
* JWT Authentication
* bcrypt
* validatorjs
* Axios

### Frontend

* Angular 18 (Standalone Components)
* TypeScript
* Bootstrap 5
* RxJS

---

## Project Structure

```text
atDriveProject/
├── backend/
│   ├── connections/       # MongoDB & MySQL connection setup
│   ├── controllers/       # Route handlers
│   ├── middleware/        # JWT authentication middleware
│   ├── tests/             # Jest unit tests + in-memory DB setup
│   ├── models/
│   │   └── mongoose/      # Product & Order schemas
│   ├── routes/
│   ├── validators/        # Request validation (validatorjs)
│   └── jes.config.js
│   ├── .env
│   └── server.js
│
└── frontEnd/
    ├── src/app/
    │   ├── components/
    │   │   └── product/
    │   └── core/
    │       ├── models/
    │       └── services/
    └── ...
```

---

## Prerequisites

Make sure the following are installed:

* Node.js (v18 or later)
* npm
* MongoDB
* MySQL Server

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone "https://github.com/sahilchunara-1/atDrive-coding-assessment.git"
cd atDriveProject
```

---

# Backend Setup

Navigate to backend:

```bash
cd backend
npm install
```

> ⏳ **First-time setup note:** Running `npm install` in `backend/` for the first time may take a few extra minutes. This is because `mongodb-memory-server` (a testing-only dependency) downloads a real MongoDB binary so tests run in full isolation from any external database. This only happens once — subsequent installs are fast.
>
> If you only want to run the application (not the test suite), you can skip this entirely:
> ```bash
> npm install --omit=dev
> ```


Create a `.env` file inside the `backend` folder:

```env
PORT=3000

MONGO_URI=mongodb://localhost:27017/atdrive_db

MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=atdrive_db

JWT_SECRET=<your_super_secret_key>
JWT_EXPIRES_IN=1d

WEATHER_API_URL=https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true
```

---

## Create MySQL Users Table

```sql
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Start Backend Server

```bash
npm start
```

Backend runs on:

```text
http://localhost:3000
```

---

# Frontend Setup

Navigate to frontend:

```bash
cd frontEnd
npm install
ng serve
```

Frontend runs on:

```text
http://localhost:4200
```

---

# Authentication

Protected endpoints require the following header:

```http
Authorization: Bearer <jwt_token>
```

---

# API Endpoints

## Authentication (MySQL)

| Method | Endpoint              | Description               |
| ------ | --------------------- | ------------------------- |
| POST   | `/api/users/register` | Register new user         |
| POST   | `/api/users/login`    | Login user and return JWT |

---

## Products (MongoDB)

| Method | Endpoint                           | Description       |
| ------ | ---------------------------------- | ----------------- |
| GET    | `/api/products/getAllProducts`     | Get all products  |
| GET    | `/api/products/getProductById/:id` | Get product by ID |
| POST   | `/api/products/addProduct`         | Create product    |
| PUT    | `/api/products/updateProduct/:id`  | Update product    |
| DELETE | `/api/products/deleteProduct/:id`  | Delete product    |

---

## Orders (JWT Protected)

| Method | Endpoint                       | Description                 |
| ------ | ------------------------------ | --------------------------- |
| POST   | `/api/orders/createOrder`      | Create order                |
| GET    | `/api/orders/getAllOrders`     | Get logged-in user's orders |
| GET    | `/api/orders/getOrderById/:id` | Get order by ID             |
| PUT    | `/api/orders/updateOrder/:id`  | Update order                |
| DELETE | `/api/orders/deleteOrder/:id`  | Delete order                |

---

## Weather API

| Method | Endpoint                           | Description                     |
| ------ | ---------------------------------- | ------------------------------- |
| GET    | `/api/weather?lat={lat}&lon={lon}` | Get current weather information |

---

# Features Implemented

✅ User Registration and Login

✅ Password Hashing using bcrypt

✅ JWT Authentication and Authorization

✅ Full CRUD Operations for Products

✅ Order Management

✅ Server-side Total Amount Calculation

✅ Third-party Weather API Integration

✅ Browser Geolocation Integration

✅ Centralized Request Validation using validatorjs

✅ Unit Tests for Product and Order Critical Logic (Jest)

✅ Responsive Angular UI using Bootstrap

✅ Consistent API Response Structure:

```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

---

# Order Processing Logic

* Orders are associated with authenticated users.
* Product prices are fetched directly from MongoDB.
* `totalAmount` is calculated on the server.
* Client-provided amounts are never trusted.
* Invalid or missing products are rejected during order creation.

---

# Validation

The application uses `validatorjs` for request validation.

Implemented validations include:

* Required field validation
* Password length validation
* MongoDB ObjectId validation
* Array validation
* Duplicate product validation
* Custom validation messages

---

# Testing

Unit tests are written using **Jest**, with **mongodb-memory-server** to spin up an in-memory MongoDB instance so tests never touch the real database.

## Jest Configuration

`jest.config.js` (in `backend/`):

```javascript
export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/tests/**/*.test.js'],
};
```

Since the backend uses ES Modules, Jest is run with the `--experimental-vm-modules` flag via this `package.json` script:

```json
"scripts": {
  "test": "cross-env NODE_OPTIONS=--experimental-vm-modules jest --runInBand"
}
```

## Running Tests

```bash
cd backend
npm test
```

## Test Coverage

| File | What's tested |
|------|----------------|
| `tests/product.test.js` | Product CRUD — create, read, partial update, delete, 404 handling |
| `tests/order.test.js` | Order total calculation (including duplicate product IDs), non-existent product rejection, cross-user order access is blocked (403) |

The Order tests specifically validate two critical pieces of business logic: that `totalAmount` is calculated correctly even when the same product appears multiple times in one order, and that a user cannot view another user's order by ID.

---

# Design Decisions

* **MongoDB** is used for Products and Orders because of its flexible document structure.
* **MySQL** is used for User Authentication and relational consistency.
* **JWT** is used for stateless authentication.
* Product pricing logic is handled entirely on the server to avoid client-side manipulation.
* Angular uses Standalone Components and service-based architecture.

---

# Future Improvements

* Refresh Token Authentication
* Pagination and Filtering
* Role-Based Authorization
* Docker Support
* File Upload Support
* CI/CD Pipeline

---

# Notes

* Product CRUD and Weather integration are fully available in the Angular UI.
* Authentication and Order APIs were primarily tested through Postman.
* Passwords are never stored in plaintext and are securely hashed using bcrypt with salt rounds.

---

# Author

**Sahil Chunara**

Full Stack Developer | MEAN Stack Developer
