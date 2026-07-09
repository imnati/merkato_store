# Merkato Store — Backend API

Express + MongoDB REST API for the Merkato Store marketplace.

## Setup

```bash
cd backend
npm install
```

Edit `.env` with your values:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/merkato_store
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

```bash
npm run dev     # development (nodemon)
npm start       # production
```

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint    | Access  | Description          |
|--------|-------------|---------|----------------------|
| POST   | /register   | Public  | Register new user    |
| POST   | /login      | Public  | Login, returns JWT   |
| GET    | /profile    | Private | Get own profile      |
| PUT    | /profile    | Private | Update own profile   |

**Register body:**
```json
{ "name": "Abebe", "email": "a@b.com", "password": "123456", "region": "ET" }
```

**Login body:**
```json
{ "email": "a@b.com", "password": "123456" }
```

All private routes require: `Authorization: Bearer <token>`

---

### Products — `/api/products`

| Method | Endpoint | Access       | Description              |
|--------|----------|--------------|--------------------------|
| GET    | /        | Public       | Get all (filter/sort)    |
| GET    | /:id     | Public       | Get single product       |
| POST   | /        | Admin        | Create product           |
| PUT    | /:id     | Admin        | Update product           |
| DELETE | /:id     | Admin        | Delete product           |

**Query params for GET /:**
- `search` — name or brand keyword
- `category` — e.g. `Electronics`
- `brand` — e.g. `AlphaSonic Labs`
- `maxPrice` — number
- `sortBy` — `price-asc` | `price-desc` | `popularity` | `rating` | `newest`

---

### Cart — `/api/cart`

| Method | Endpoint      | Access  | Description              |
|--------|---------------|---------|--------------------------|
| GET    | /             | Private | Get user's cart          |
| POST   | /             | Private | Add item to cart         |
| DELETE | /             | Private | Clear entire cart        |
| PUT    | /:productId   | Private | Update item quantity     |
| DELETE | /:productId   | Private | Remove item from cart    |

**Add to cart body:**
```json
{ "productId": "<id>", "quantity": 1 }
```

---

### Orders — `/api/orders`

| Method | Endpoint     | Access  | Description              |
|--------|--------------|---------|--------------------------|
| POST   | /            | Private | Create order from cart   |
| GET    | /my          | Private | Get own orders           |
| GET    | /:id         | Private | Get single order         |
| GET    | /            | Admin   | Get all orders           |
| PUT    | /:id/status  | Admin   | Update order status      |

**Create order body:**
```json
{
  "shipping": {
    "consigneeName": "Abebe",
    "contactPhone": "+251911000000",
    "streetAddress": "Bole Road",
    "city": "Addis Ababa"
  },
  "region": "ET",
  "paymentMethod": "telebirr",
  "itemsSubtotal": 289.00,
  "discountDeduction": 0,
  "freightCost": 20.00,
  "taxAmount": 43.35,
  "grandTotal": 352.35
}
```

**Update status body:**
```json
{ "status": "In Transit" }
```
Valid statuses: `Processing` | `In Transit` | `Delivered Complete` | `Cancelled / Refunded`
