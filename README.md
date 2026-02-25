# Masterplan: Inventory & Invoice CRM

A web-based application for wholesale stores to manage inventory, track customers (CRM), and generate professional PDF invoices.

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + React + Tailwind CSS
- **Backend**: Next.js API Routes + Prisma ORM
- **Database**: Neon (Free Serverless PostgreSQL)
- **Auth**: NextAuth.js (Credentials)
- **PDF**: jsPDF + jsPDF-AutoTable
- **Charts**: Recharts

## Features
- **Dashboard** — Profit calculator, Revenue vs Expenses charts, Transaction feed (Red=Import, Green=Export)
- **Inventory** — Add/Edit/Delete products, Cost/Selling price, Stock tracking, Restock with auto-transaction logging
- **Customers** — CRM with Name, Phone, Email, Address, Typeahead search
- **Invoices** — Create invoices, Auto-calculate tax & discount, Stock validation, Professional PDF generation
- **Settings** — Store profile, Logo, Tax rate, Currency

## Setup

### 1. Create Neon Database (Free)
1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project
3. Copy the connection string

### 2. Configure Environment
```bash
cp .env.example .env.local
```
Edit `.env.local`:
```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
NEXTAUTH_SECRET=any-random-string-here
NEXTAUTH_URL=http://localhost:3000
```

### 3. Setup Database
```bash
npx prisma db push
```

### 4. Run
```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel
1. Push to GitHub
2. Import in Vercel
3. Add env vars: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
4. Deploy!

## Color Coding
- **RED** — Imports (expenses, stock purchases, money out)
- **GREEN** — Exports (sales, invoices, money in)
