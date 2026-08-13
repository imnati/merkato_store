# Merkato Store Backend

Express.js + MongoDB backend API for the Merkato Store marketplace.

## Features

- User authentication (register/login) with JWT tokens
- Password hashing with bcrypt
- Role-based authorization (customer/admin)
- Product CRUD operations
- Order management
- CORS enabled for Next.js frontend

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Auth:** JWT + bcrypt
- **Validation:** express-validator

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Product.js         # Product schema
│   │   └── Order.js           # Order schema
│   ├── middleware/
│   │   └── auth.js            # JWT auth middleware
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   ├── productController.js # Product logic
│   │   └── orderController.js # Order logic
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   ├── products.js        # Product routes
│   │   └── orders.js          # Order routes
│   ├── app.js                 # Express app setup
│   └── seed.js                # Database seeder
├── server.js                  # Entry point
├── package.json
├── .env
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/merkato-store
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

### Seed Database

```bash
npm run seed
```

This creates:
- 12 sample products
- 1 admin user (`admin@merkato.com` / `123456`)

### Run Server

```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products (supports `?category=Electronics&search=laptop`)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:id` - Get single order (protected)
- `POST /api/orders` - Create order (protected)
- `PUT /api/orders/:id/status` - Update order status (admin)

### Health
- `GET /api/health` - Health check

## Frontend Integration

The Next.js frontend connects to this backend via `src/lib/api.js`. Ensure `NEXT_PUBLIC_API_URL` is set in the frontend `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
