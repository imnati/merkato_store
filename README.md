# Merkato Store

Pan-African & Middle East e-commerce marketplace built with Next.js.

## Frontend

Next.js 16 + React 19 + Tailwind CSS v4

### Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Backend

Express.js + MongoDB API located in the `backend/` folder.

See [backend/README.md](./backend/README.md) for setup instructions.

### Quick Start

```bash
cd backend
npm install
npm run seed
npm run dev
```

Server runs on `http://localhost:5000`

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the Vercel Platform.
