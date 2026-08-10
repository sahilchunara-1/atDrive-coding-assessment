# Full-Stack Product & Order Management Platform

A full-stack web application built to demonstrate **modern MEAN-stack development, multi-database architecture, secure authentication, RESTful API design, server-side business logic, third-party API integration, and automated testing**.

The application uses **Angular 18** for the frontend, **Node.js + Express.js** for the backend, **MongoDB** for product and order data, and **MySQL** for user authentication.

---

## Architecture Overview

The application follows a layered frontend/backend architecture with separate databases chosen according to the nature of the data.

```text
                    ┌─────────────────────────┐
                    │       Angular 18        │
                    │                         │
                    │  Standalone Components  │
                    │  Services               │
                    │  Reactive Forms         │
                    │  Angular Router         │
                    └────────────┬────────────┘
                                 │
                              HTTP/REST
                                 │
                    ┌────────────▼────────────┐
                    │    Node.js + Express    │
                    │                         │
                    │  Routes                 │
                    │  Validators             │
                    │  Middleware             │
                    │  Controllers            │
                    └───────┬─────────┬───────┘
                            │         │
                 ┌──────────▼───┐ ┌──▼────────────┐
                 │    MySQL     │ │   MongoDB     │
                 │              │ │               │
                 │    Users     │ │   Products    │
                 │ Authentication│ │   Orders      │
                 └──────────────┘ └───────────────┘
                            │
                    ┌───────▼────────┐
                    │  Weather API   │
                    │ Open-Meteo     │
                    └────────────────┘
```

### Why two databases?

The project intentionally separates data according to its characteristics:

* **MySQL** stores user accounts and authentication-related data where a relational structure is appropriate.
* **MongoDB** stores products and orders using document-oriented models and Mongoose.
* The backend acts as the integration layer between both databases and the Angular client.

This demonstrates how different persistence technologies can coexist within the same application when they solve different data requirements.

---

## Tech Stack

### Frontend

* Angular 18
* TypeScript
* Standalone Components
* Angular Router
* Reactive Forms
* RxJS
* Bootstrap
* Angular HTTP Client

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* MySQL
* mysql2
* JWT
* bcrypt
* validatorjs
* Axios

### Testing

* Jest
* Supertest
* mongodb-memory-server

---

## Key Technical Features

### Authentication & Authorization

* User registration using MySQL
* Secure password hashing with bcrypt
* JWT-based authentication
* Bearer-token authentication middleware
* Token expiration through environment configuration
* Protected order endpoints
* User-specific order access control
* Inactive and deleted user checks

Authentication flow:

```text
Registration
    ↓
Validate request
    ↓
Check existing user in MySQL
    ↓
Hash password with bcrypt
    ↓
Store user


Login
    ↓
Validate credentials
    ↓
Fetch user from MySQL
    ↓
Compare password with bcrypt
    ↓
Generate JWT
    ↓
Return authenticated user + token
```

---

## Product Management

The application provides complete product CRUD functionality:

* Create product
* Retrieve all products
* Retrieve product by ID
* Update product
* Delete product

Product data is stored in MongoDB using Mongoose schemas with validation for:

* Product name
* Product price
* Product description
* Automatic creation/update timestamps

---

## Order Management

Orders are associated with authenticated users and stored in MongoDB.

Available operations:

* Create order
* Retrieve logged-in user's orders
* Retrieve an individual order
* Update order
* Delete order

### Server-Side Price Calculation

The client does **not** provide the trusted order total.

Instead:

```text
Client
  │
  │ productIds
  ▼
Backend
  │
  ├── Fetch products from MongoDB
  │
  ├── Read actual product prices
  │
  ├── Build price map
  │
  └── Calculate totalAmount
         │
         ▼
      Save Order
```

For example:

```text
Product A = ₹100
Product B = ₹200

Order:
[A, B]

Server-calculated total:
₹100 + ₹200 = ₹300
```

The same product can also appear multiple times:

```text
Product A = ₹150

Order:
[A, A]

Server-calculated total:
₹150 + ₹150 = ₹300
```

This prevents the application from trusting a client-supplied price or total amount.

---

## Order Authorization

Order access is restricted to the authenticated owner.

```text
User A
  │
  └── Order #123
        │
        └── userId = A


User B requests Order #123
        ↓
Authentication succeeds
        ↓
Order ownership checked
        ↓
403 Forbidden
```

This prevents an authenticated user from accessing another user's order simply by knowing its MongoDB ObjectId.

---

## Request Validation

The backend uses `validatorjs` together with custom validation logic.

Validation includes:

* Required fields
* String length constraints
* Numeric constraints
* MongoDB ObjectId validation
* Product array validation
* Empty update prevention
* Invalid product ID detection
* Registration validation
* Login validation
* Custom validation messages

Validation is handled before controller execution:

```text
HTTP Request
     ↓
Validation Middleware
     ↓
Authentication Middleware
     ↓
Controller
     ↓
Database
```

---

## Weather API Integration

The application integrates a third-party weather service through the backend.

The Angular application:

1. Requests browser geolocation permission.
2. Obtains latitude and longitude.
3. Sends the coordinates to the backend.
4. The backend requests weather information from the external API.
5. The weather response is returned to Angular.

```text
Browser Geolocation
        ↓
Latitude + Longitude
        ↓
Angular WeatherService
        ↓
Express Weather API
        ↓
Third-Party Weather API
        ↓
Angular UI
```

This keeps third-party API communication behind the backend rather than coupling the frontend directly to the external service.

---

## Frontend Architecture

The Angular application uses standalone components and a service-based structure.

```text
src/app/
│
├── components/
│   └── product/
│       ├── add-product/
│       └── product-list/
│
└── core/
    ├── models/
    └── services/
```

### Product Flow

```text
Product List Component
        ↓
ProductService
        ↓
HttpClient
        ↓
Express REST API
        ↓
MongoDB
```

### Create / Edit Flow

The same Angular component is used for both creating and editing products.

```text
/add-products
     ↓
Create Mode


/edit-product/:id
     ↓
Edit Mode
     ↓
Fetch existing product
     ↓
Populate Reactive Form
     ↓
Update product
```

Reactive Forms provide client-side validation and user feedback before API requests are submitted.

---

## REST API

### Authentication

| Method | Endpoint              | Description                      |
| ------ | --------------------- | -------------------------------- |
| POST   | `/api/users/register` | Register a new user              |
| POST   | `/api/users/login`    | Authenticate user and return JWT |

### Products

| Method | Endpoint                           | Description            |
| ------ | ---------------------------------- | ---------------------- |
| GET    | `/api/products/getAllProducts`     | Retrieve all products  |
| GET    | `/api/products/getProductById/:id` | Retrieve product by ID |
| POST   | `/api/products/addProduct`         | Create product         |
| PUT    | `/api/products/updateProduct/:id`  | Update product         |
| DELETE | `/api/products/deleteProduct/:id`  | Delete product         |

### Orders

All order endpoints require JWT authentication.

| Method | Endpoint                       | Description                      |
| ------ | ------------------------------ | -------------------------------- |
| POST   | `/api/orders/createOrder`      | Create order                     |
| GET    | `/api/orders/getAllOrders`     | Retrieve logged-in user's orders |
| GET    | `/api/orders/getOrderById/:id` | Retrieve an order                |
| PUT    | `/api/orders/updateOrder/:id`  | Update order                     |
| DELETE | `/api/orders/deleteOrder/:id`  | Delete order                     |

### Weather

| Method | Endpoint                           | Description              |
| ------ | ---------------------------------- | ------------------------ |
| GET    | `/api/weather?lat={lat}&lon={lon}` | Retrieve current weather |

### Health

| Method | Endpoint  | Description              |
| ------ | --------- | ------------------------ |
| GET    | `/health` | Application health check |

---

## API Response Structure

The backend follows a consistent response structure:

```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

Error responses follow the same general structure:

```json
{
  "success": false,
  "message": "Error message"
}
```

---

## Testing Strategy

The backend uses **Jest** and **mongodb-memory-server** to test critical application behavior without modifying the real MongoDB database.

A separate in-memory MongoDB instance is created for the test suite.

```text
Jest
  ↓
MongoDB Memory Server
  ↓
Isolated MongoDB instance
  ↓
Controller Tests
```

### Product Tests

The product test suite covers:

* Product creation
* Product retrieval
* Newest-first sorting
* Non-existent product handling
* Partial product updates
* Product deletion

### Order Tests

The order test suite focuses on business-critical behavior:

* Correct order total calculation
* Multiple products in an order
* Duplicate product IDs
* Non-existent product rejection
* Cross-user order access protection

One important edge case is explicitly tested:

```text
Product price = ₹150

productIds = [A, A]

Expected total = ₹300
```

This ensures product lookup deduplication does not incorrectly remove repeated products from the final calculation.

---

## Project Structure

```text
project/
│
├── backend/
│   ├── connections/
│   │   ├── mongoose.js
│   │   └── mysql.js
│   │
│   ├── controllers/
│   │   ├── health.controller.js
│   │   ├── order.controller.js
│   │   ├── product.controller.js
│   │   ├── user.controller.js
│   │   └── weather.controller.js
│   │
│   ├── helpers/
│   ├── middleware/
│   ├── models/
│   │   └── mongoose/
│   ├── routes/
│   ├── tests/
│   ├── validators/
│   └── server.js
│
├── frontEnd/
│   └── src/
│       └── app/
│           ├── components/
│           └── core/
│
├── .gitignore
├── README.md
└── Postman Collection
```

---

## Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js 18+
* npm
* MongoDB
* MySQL

### Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=3000

MONGO_URI=mongodb://localhost:27017/your_database

MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=your_database

JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d

WEATHER_API_URL=your_weather_api_url
```

Create the MySQL users table:

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

Start the backend using the appropriate npm script configured in `backend/package.json`.

---

## Frontend Setup

```bash
cd frontEnd
npm install
npm start
```

The Angular application runs on:

```text
http://localhost:4200
```

The backend runs on:

```text
http://localhost:3000
```

---

## Environment Variables

The application uses environment variables for configuration and secrets.

Never commit the real `.env` file to the repository.

Recommended repository structure:

```text
.env
.env.example
```

The `.env.example` file should contain placeholders only.

---

## Engineering Decisions

### Why MongoDB for Products and Orders?

Products and orders are represented as document-oriented data and are modeled using Mongoose.

MongoDB provides flexible document modeling and straightforward object-based interaction from the Node.js backend.

### Why MySQL for Users?

User authentication data has a naturally relational structure with fields such as:

* User ID
* Username
* Password hash
* Active status
* Deleted status
* Creation timestamp

MySQL provides a structured relational model for this data.

### Why JWT?

JWT provides stateless authentication for the REST API.

The server validates the token on protected requests without maintaining server-side session state.

### Why Server-Side Order Calculation?

Prices and totals are business-critical values.

Allowing the client to submit the final amount would create a security vulnerability because a malicious client could modify the request.

Therefore, the backend retrieves product prices from MongoDB and calculates the order total independently.

### Why In-Memory MongoDB for Tests?

Tests should not depend on a developer's local MongoDB instance.

`mongodb-memory-server` provides an isolated MongoDB environment so the test suite can run without modifying real application data.

---

## Current Scope

The current application focuses on demonstrating backend architecture, database integration, product management, order business logic, authentication, API validation, testing, and third-party API integration.

The Angular UI currently provides the product management and weather experience, while authentication and order APIs are primarily exercised through API testing tools.

---

## Future Improvements

Potential improvements include:

* Refresh-token authentication
* Role-based authorization
* Pagination and filtering
* Centralized Angular error handling
* Production environment configuration
* Docker support
* CI/CD pipeline
* Improved product/order data integrity
* Expanded automated test coverage
* Complete authentication and order workflows in the Angular UI

---

## Author

**Sahil Chunara**

Full Stack Developer | MEAN Stack Developer

---

## License

This project is intended as a technical showcase and learning project.
