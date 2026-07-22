# Merkato Store — Pan-African & Middle East E-Commerce Platform

## Tech Stack
**MERN Stack:** MongoDB, Express.js, React 19, Node.js  
**Frontend:** Next.js 16, Tailwind CSS v4, Material UI, Axios  
**Backend:** Express.js, Mongoose, JWT Authentication, Stripe Payment Gateway  
**Database:** MongoDB (local & production-ready)

---

## Key Features

### ✅ Full-Stack E-Commerce Platform
- **Product Catalog:** 12 seeded products across 6 categories (Electronics, Fashion, Groceries, Beauty, Household, Accessories)
- **Shopping Cart:** Persistent cart with localStorage fallback, real-time totals, quantity controls
- **Checkout Flow:** Multi-step checkout with shipping form, promo code validation, and Stripe payment integration
- **Order Management:** Complete order tracking with status updates (Processing, In Transit, Delivered, Cancelled)

### 🔐 Secure Authentication & Authorization
- **JWT-based authentication** with bcrypt password hashing
- **Role-based access control:** Customer vs Admin roles
- **Protected routes:** Account dashboard, checkout, and admin panel require authentication
- **Session management:** Auto logout with token expiration, secure credential storage

### 💳 Payment Integration
- **Stripe Payment Gateway:** Test mode integration with hosted checkout page
- **Order creation:** Orders saved to MongoDB on checkout initiation
- **Payment confirmation:** Webhook support for real-time order status updates (optional)
- **Test card:** 4242 4242 4242 4242 for development testing

### 📊 Admin Dashboard
- **Product CRUD:** Create, read, update, delete products with SKU management
- **Order Management:** View all orders, update shipping status, track fulfillment pipeline
- **Business Intelligence:** Real-time metrics (revenue, sales count, active sessions, conversion rate)
- **Admin-only routes:** Protected by role-based middleware

### 🌍 Multi-Region & Multi-Language Support
- **6 Target Regions:** Nigeria, Kenya, Ethiopia, UAE, Saudi Arabia, Egypt
- **Dynamic Currency:** NGN, KES, ETB, AED, SAR, EGP with live symbol display
- **7 Languages:** English, Arabic (RTL support), Amharic, French, Spanish, Portuguese, Swahili
- **Regional Pricing:** Freight costs and tax rates per region

### 🎨 Modern UI/UX
- **Responsive Design:** Mobile-first approach with Tailwind CSS v4
- **Dark Mode Ready:** Professional slate color palette
- **Smooth Animations:** Page transitions, hover effects, loading states
- **Accessibility:** Semantic HTML, ARIA labels, keyboard navigation

### 🔍 Advanced Features
- **Real-time Search & Filtering:** Category tabs, search bar with query params
- **Product Reviews:** Star ratings, comment system (API ready, UI pending)
- **Wishlist Support:** Backend API implemented
- **Order History:** User-specific order tracking with delivery status
- **Featured & Sale Products:** Dynamic homepage sections with discount badges

---

## Database Schema (MongoDB Collections)

### **Users**
- `name`, `email`, `password` (hashed), `role`, `region`, `addresses[]`

### **Products**
- `name`, `nameAm`, `nameAr`, `brand`, `category`, `price`, `discountPrice`, `sku`, `images[]`, `stock`, `status`, `isFeatured`

### **Orders**
- `user` (ref), `items[]` (product, name, price, quantity), `total`, `status`, `destination`, `courier`, `timestamps`

### **Reviews**
- `user` (ref), `product` (ref), `rating`, `comment` (one review per user per product enforced)

---

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login with JWT token
- `POST /api/auth/forgot-password` — Password reset flow

### Products
- `GET /api/products` — List products (filters: category, search, featured)
- `GET /api/products/:id` — Single product details
- `POST /api/products` — Create product (admin only)
- `PUT /api/products/:id` — Update product (admin only)
- `DELETE /api/products/:id` — Delete product (admin only)

### Orders
- `POST /api/orders` — Place order (protected)
- `GET /api/orders/my` — User's order history (protected)
- `GET /api/orders` — All orders (admin only)
- `PUT /api/orders/:id/status` — Update order status (admin only)

### Payment
- `POST /api/payment/stripe/create-session` — Initiate Stripe checkout (protected)
- `POST /api/payment/stripe/webhook` — Stripe payment confirmation webhook

### Account
- `GET /api/account` — User profile (protected)
- `PUT /api/account` — Update profile, addresses (protected)
- `PUT /api/account/password` — Change password (protected)

### Reviews
- `GET /api/reviews?product=:id` — Get product reviews (public)
- `POST /api/reviews` — Submit review (protected)
- `DELETE /api/reviews/:id` — Delete review (protected, owner or admin)

---

## Project Structure

```
merkato_store/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── seed.js            # Product seeder script
│   ├── controllers/           # Business logic
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── accountController.js
│   │   ├── reviewController.js
│   │   └── paymentController.js
│   ├── models/                # Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Review.js
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── accountRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── paymentRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT protect & adminOnly
│   ├── server.js              # Express app entry
│   ├── package.json
│   └── .env
│
├── src/
│   ├── app/                   # Next.js 16 App Router
│   │   ├── auth/              # Login, signup, forgot-password
│   │   ├── account/           # User dashboard (orders, profile, wishlist, reviews)
│   │   ├── admin/             # Admin panel (products, orders)
│   │   ├── products/          # Product listing & detail pages
│   │   ├── cart/              # Standalone cart page
│   │   ├── checkout/          # Checkout flow + success page
│   │   └── page.js            # Homepage with featured products
│   ├── components/            # Reusable components
│   │   ├── DynamicNavbar.js
│   │   ├── DynamicFooter.js
│   │   ├── ProductCard.js
│   │   └── EfficientSearchInput.js
│   ├── context/               # React Context API
│   │   ├── AppContext.js      # Cart, user, products, region
│   │   └── LanguageContext.js # Multi-language translations
│   └── lib/
│       └── axios.js           # Axios config with JWT auto-injection
│
├── public/                    # Static assets
├── package.json
├── next.config.js
├── tailwind.config.js
└── .env.local
```

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Stripe account (test keys)

### Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/merkato_store
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
CLIENT_URL=http://localhost:3000
```

Seed products:
```bash
node config/seed.js
```

Start backend:
```bash
npm run dev
```

### Frontend Setup
```bash
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Start frontend:
```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## Deployment Notes
- **Backend:** Deploy on Render, Railway, or Heroku with MongoDB Atlas
- **Frontend:** Deploy on Vercel (optimized for Next.js)
- **Environment Variables:** Set all `.env` vars in production dashboard
- **Stripe Webhook:** Update webhook URL to production domain in Stripe dashboard

---

## Future Enhancements
- Chapa payment gateway for Ethiopian market
- Wishlist UI implementation
- Product reviews UI in detail pages
- Email verification for registration
- Admin analytics dashboard with charts
- Real-time inventory sync
- Product image uploads to cloud storage

---

## Contributors
Built as a group project for backend integration practice with MERN stack.

---

## License
MIT License — Free for educational and commercial use.
