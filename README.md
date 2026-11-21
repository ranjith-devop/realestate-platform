# PropNest — Full-Stack Real Estate Platform

> A production-ready real estate search and listing platform inspired by **NoBroker** and **99acres**. Built from the ground up with **Next.js 15 (App Router)**, **Node.js/Express**, **Prisma ORM**, and **Neon PostgreSQL**.

---

### 🔗 Live Deployments

| Resource | URL |
| :--- | :--- |
| **Live Web App** | [https://realestate-platform-horous.vercel.app](https://realestate-platform-horous.vercel.app) |
| **API Base URL** | [https://realestate-platform-jv8l.onrender.com](https://realestate-platform-jv8l.onrender.com) |
| **Interactive API Docs (Swagger)** | [https://realestate-platform-jv8l.onrender.com/api-docs/](https://realestate-platform-jv8l.onrender.com/api-docs/) |
| **Backend Health Check** | [https://realestate-platform-jv8l.onrender.com/api/health](https://realestate-platform-jv8l.onrender.com/api/health) |

---

## 📌 Project Overview

PropNest tackles two major friction points in traditional property search: **unsolicited telemarketing spam** and **opaque brokerage fees**. 

The platform enforces clean role isolation across four distinct user personas:
1. **Buyers & Tenants** get a direct, zero-brokerage search interface with gated inquiry dispatching so personal phone numbers are never harvested or sold.
2. **Direct Property Owners** post listings free with a verified "Direct Owner" shield, custom availability hours, and direct inquiry management.
3. **Certified Agents** showcase their RERA registration number, agency brand banner, and portfolio counter to build buyer trust.
4. **SuperAdmins** govern platform integrity via a dedicated console for user oversight, listing moderation, and platform statistics.

---

## 🛠️ Tech Stack

```
Frontend:   Next.js 15 (App Router) • TypeScript • Tailwind CSS • Lucide Icons
Backend:    Node.js • Express.js • TypeScript • Prisma ORM • Zod
Database:   Neon Serverless PostgreSQL (Composite B-Tree & GIN Indexes)
Storage:    ImageKit CDN (Image compression & document upload)
Auth:       JWT Access/Refresh Token Rotation with bcrypt password hashing
Docs:       OpenAPI 3.0 via Swagger UI
Deploy:     Vercel (Frontend) • Render (Backend)
```

---

## 👥 Role-Based Experience Matrix

| Feature | Buyer | Direct Owner | Certified Agent | SuperAdmin |
| :--- | :---: | :---: | :---: | :---: |
| Browse & Filter Listings | ✅ | ✅ | ✅ | ✅ |
| Save Favorites & Send Inquiries | ✅ | — | — | — |
| Post & Manage Listings | — | ✅ (Zero Brokerage) | ✅ (RERA Badged) | All Listings |
| Agency Header & RERA ID Display | — | — | ✅ | — |
| Lead Pipeline (Status Updates) | Sent Only | Received & Sent | Received & Sent | Audit Log |
| User & Content Moderation | — | — | — | ✅ |
| Role Modification | ❌ | ❌ | ❌ | Immutable |

---

## ⚡ Engineering Highlights

### 1. Database Indexing & Scalability (50,000+ Records)
Search queries stay sub-20ms through targeted composite B-Tree indexes matching high-frequency query patterns:
* `[city, status, price]`: Powers location-based searches sorted by budget.
* `[city, propertyType, bedrooms]`: Accelerates bedroom/type filters (e.g., "3 BHK in Bangalore").
* `[city, locality]`: Locality-level autocomplete and geo-filtering.
* `[email, propertyId, createdAt]`: Compound index for instant 24-hour lead deduplication.

### 2. Multi-Criteria Recommendation Algorithm
When viewing any property, the platform ranks similar properties with a 100-point weighted score:
* **Locality Match (+35 pts)**: Same neighbourhood.
* **Property Type Match (+25 pts)**: Apartment, Villa, Independent House, or Commercial.
* **Bedroom Match (+20 pts)**: Exact BHK count.
* **Price Proximity (up to 15 pts)**: Inverse ratio based on variance from target budget.
* **Area Proximity (up to 10 pts)**: Square footage proximity.
* **Furnishing Match (+5 pts)**: Furnished, Semi-Furnished, or Unfurnished match.

### 3. Anti-Spam & Lead Protection
* **Honeypot Trap**: Invisible field caught by autofill bots; submissions with this field populated are dropped instantly.
* **24-Hour Deduplication**: Prevents repeated inquiries from the same user to the same property within 24 hours.
* **Rate Limiting**: `express-rate-limit` throttles API submissions to 5 inquiries per IP per 15 minutes.
* **Self-Inquiry Guard**: Owners cannot send inquiries on their own listings.

### 4. Authentication & Token Lifecycle
* **Access Tokens**: Short-lived (15 minutes), signed with `JWT_SECRET`.
* **Refresh Tokens**: Long-lived (7 days), stored in the database with revocation tracking.
* **Automatic Rotation**: On expiration, `/api/auth/refresh` issues a fresh pair and revokes the used token.

---

## 📁 Repository Structure

```
realestate-project/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema with composite indexes
│   │   └── seed.ts              # Seed data for top Indian metros
│   ├── src/
│   │   ├── config/              # Prisma, Swagger, ImageKit, Environment
│   │   ├── controllers/         # Auth, Property, Lead, Admin controllers
│   │   ├── middlewares/         # JWT auth, role authorization, rate limiters
│   │   ├── routes/              # Express API endpoints
│   │   ├── services/            # Business logic, recommendations, admin stats
│   │   ├── validators/          # Zod validation schemas
│   │   ├── app.ts               # Express application configuration
│   │   └── server.ts            # Server entrypoint
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/           # SuperAdmin management console
│   │   │   ├── dashboard/       # Role-isolated dashboard
│   │   │   ├── properties/      # Search, detail, post, and edit flows
│   │   │   ├── profile/         # User profile and avatar upload
│   │   │   ├── about/           # About Us page
│   │   │   ├── privacy/         # Privacy Policy (DPDP Act 2023 compliant)
│   │   │   ├── terms/           # Terms of Service
│   │   │   └── rera-guidelines/ # Official State RERA guidelines & checklist
│   │   ├── components/          # Modular UI components (Navbar, Footer, Cards)
│   │   ├── context/             # AuthContext with token rotation
│   │   ├── lib/                 # Typed API client and utilities
│   │   └── types/               # TypeScript interfaces
│   └── package.json
└── package.json
```

---

## 🔑 Demo Credentials

Test the platform instantly with preconfigured accounts:

| Role | Email | Password | Primary Experience |
| :--- | :--- | :--- | :--- |
| **SuperAdmin** | `admin@realestate.com` | `Admin@123` | Full admin console at `/admin` |
| **Property Owner** | `owner@realestate.com` | `Password@123` | Direct Owner Shield, lead tracker |
| **Certified Agent** | `agent@realestate.com` | `Password@123` | Agency header, RERA badge, portfolio count |
| **Buyer / Tenant** | `buyer@realestate.com` | `Password@123` | Zero-brokerage search, sent inquiries |

*(1-click demo login buttons are also available directly on the `/login` screen).*

---

## 💻 Local Development Setup

### 1. Prerequisites
* **Node.js** v20+
* **PostgreSQL** 16+ (or a free [Neon](https://neon.tech) cloud database)

### 2. Backend Setup
```bash
cd backend
npm install

# Copy environment variables
cp .env.example .env
```

Configure your `.env`:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/realestate?schema=public"
JWT_SECRET="your_jwt_secret_key"
REFRESH_TOKEN_SECRET="your_refresh_token_secret"
CORS_ORIGIN="http://localhost:3000"
IMAGEKIT_PUBLIC_KEY="your_imagekit_public_key"
IMAGEKIT_PRIVATE_KEY="your_imagekit_private_key"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_id"
```

Sync database and run:
```bash
npx prisma db push
npm run seed              # Seeds sample properties & users
npm run dev               # Starts backend on http://localhost:5000
```

> **API Documentation**: Open `http://localhost:5000/api-docs` for the interactive Swagger UI.

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Configure `frontend/.env.local` (optional, defaults to `http://localhost:5000/api`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev               # Starts Next.js on http://localhost:3000
```

---

## 📄 Compliance & Public Pages

* **RERA Compliance**: Educational guide on the Real Estate (Regulation and Development) Act, carpet area calculation rules, escrow accounts, and direct links to official State portals (MahaRERA, K-RERA, UP RERA, TNRERA). Accessible at `/rera-guidelines`.
* **Privacy Policy**: Details our data collection, anti-spam guarantees, and user rights under the Digital Personal Data Protection (DPDP) Act 2023. Accessible at `/privacy`.
* **Terms of Service**: Outlines acceptable use, intermediary status under Section 79 of the IT Act 2000, and financial safety advisories. Accessible at `/terms`.

---

## 📜 License

This project is licensed under the **MIT License**. Free to use for educational, evaluation, or commercial adaptation.
