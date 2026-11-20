# PropNest - Fullstack Real Estate Platform
> High-performance, scalable real estate listing platform inspired by **99acres** and **NoBroker**. Built with **Next.js (App Router)**, **Node.js/Express.js**, **PostgreSQL**, and **TypeScript**.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Key Capabilities |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15 (App Router), Tailwind CSS, Lucide | Server Components, ISR (Incremental Static Regeneration), Dynamic SEO (`generateMetadata`, JSON-LD), Responsive UI |
| **Backend** | Node.js, Express.js, TypeScript | Layered Architecture (Controller-Service-Repository), JWT Token Rotation, Rate Limiting, Zod Validation |
| **Database** | PostgreSQL, Prisma ORM | Composite B-Tree & GIN Indexing, Foreign Key constraints, Cascade rules, Optimized for 50,000+ records |
| **API Docs** | Swagger / OpenAPI 3.0 | Hosted at `/api-docs` with JWT Bearer authentication scheme and complete endpoint specifications |

---

## 📁 Repository Structure

All code adheres strictly to the rule: **No single file exceeds 500 lines of code**.

```
realestate-project/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma           # Optimized PostgreSQL schema with composite indexes
│   │   ├── seed.ts                 # Realistic Indian metro seed data (Bangalore, Mumbai, etc.)
│   │   └── seed-50k.ts             # Scalability benchmark generator (50,000+ properties)
│   ├── src/
│   │   ├── config/                 # Env config, Prisma client, Swagger OpenAPI specs
│   │   ├── controllers/            # AuthController, PropertyController, LeadController
│   │   ├── middlewares/            # JWT auth, ownership verification, Zod validation, rate limiter, error handler
│   │   ├── routes/                 # Express API routes
│   │   ├── services/               # Core business logic, similarity recommendation engine, deduplication
│   │   ├── types/                  # Typed DTOs, Express augmentation, Enums
│   │   ├── utils/                  # Standardized ApiResponse helper, JWT utilities
│   │   ├── validators/             # Zod input schemas (Auth, Property, Lead with honeypot)
│   │   ├── app.ts                  # Express application configuration
│   │   └── server.ts               # Server startup & graceful shutdown
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx          # Root layout with AuthProvider, Navbar, Footer
│   │   │   ├── page.tsx            # Home Page with 99acres/NoBroker hero search & metro showcase
│   │   │   ├── properties/
│   │   │   │   ├── page.tsx        # Search, filter sidebar, sorting & pagination directory
│   │   │   │   ├── new/page.tsx    # Post property form (zero brokerage listing)
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx    # SEO-friendly property details with JSON-LD & similar recommendations
│   │   │   │       └── edit/       # Edit listing (authenticated owner only)
│   │   │   ├── dashboard/page.tsx  # Owner listings management & received inquiry leads tracker
│   │   │   ├── login/page.tsx      # User login with 1-click test accounts
│   │   │   ├── register/page.tsx   # User registration with role selection (Buyer, Owner, Agent)
│   │   │   ├── sitemap.ts          # Dynamic XML Sitemap
│   │   │   └── robots.ts           # Search engine robots directives
│   │   ├── components/             # Reusable UI components (Navbar, Footer, Card, Filters, Gallery, InquiryForm)
│   │   ├── context/                # AuthContext with token rotation & persistence
│   │   ├── lib/                    # Typed API client, Indian currency & area formatters
│   │   └── types/                  # TypeScript interface contracts
│   ├── package.json
│   └── tsconfig.json
│
├── scripts/
│   ├── start-db.ps1                # Start local PostgreSQL on 127.0.0.1:5433
│   └── start-db.bat                # Windows batch launcher for PostgreSQL
└── package.json                    # Workspace orchestrator
```

---

## ⚡ Scalability Thinking: Supporting 50,000+ Property Records

### 1. Database Indexing Strategy
To ensure sub-20ms queries over 50,000+ rows, the PostgreSQL schema employs targeted composite B-Tree indexes matching real-world access patterns:
* **`[city, status, price]`**: Composite index powering the most frequent search filter (e.g., active properties in Bangalore sorted by budget).
* **`[city, propertyType, bedrooms]`**: Powers standard configuration queries (e.g., "3 BHK Apartments in Bangalore").
* **`[city, locality]`**: Accelerates locality-specific searches.
* **`[email, propertyId, createdAt]`**: Powers instant deduplication checks for the Lead/Inquiry module.
* **`[ownerId]`**: Ensures instantaneous retrieval of listings for the owner dashboard.

### 2. Query & API Response Optimization
* **Lean Projections**: Listing cards query only necessary projection fields (`id`, `title`, `price`, `bedrooms`, `bathrooms`, `superAreaSqFt`, `locality`, `city`, `images`, `status`), avoiding large text payloads.
* **Dual Pagination Support**:
  1. **Keyset / Cursor-Based Pagination (`cursor`, `limit`)**: Ultra-fast $O(1)$ performance for infinite scrolling or high-throughput mobile clients.
  2. **Optimized Offset Pagination**: Executes `count` and `findMany` concurrently via `Promise.all` with indexed count scanning.

---

## 🤖 Similar Properties Recommendation Algorithm

When viewing a property, the platform recommends similar properties using a multi-criteria weighted scoring algorithm:
1. **Candidate Retrieval**: Filters properties in the same `city`, matching `listingType`, active `status`, within a $\pm 35\%$ budget bracket using composite index `[city, status, price]`.
2. **Scoring Breakdown (100 Points Total)**:
   * **Locality Match (+35 pts)**: Same neighbourhood or locality.
   * **Property Type Match (+25 pts)**: Same classification (e.g., Apartment vs Villa).
   * **Bedroom Count Match (+20 pts)**: Exact BHK alignment.
   * **Price Proximity (up to 15 pts)**: $15 \times \left(1 - \frac{|P - P_0|}{P_0}\right)$
   * **Area Proximity (up to 10 pts)**: $10 \times \left(1 - \frac{|A - A_0|}{A_0}\right)$
   * **Furnishing Match (+5 pts)**: Matching furnishing status.
3. Top results are returned with a `similarityScore` percentage badge (e.g., "94% Match").

---

## 🛡️ Lead / Inquiry Module & Anti-Spam Architecture

To prevent spam and duplicate inquiries:
1. **Rate Limiting**: `express-rate-limit` enforces a maximum of **5 inquiries per IP per 15 minutes** on the submission endpoint.
2. **Compound 24-Hour Deduplication**: Queries the indexed database for `(propertyId, email, createdAt >= 24 hours ago)`. If present, rejects the duplicate inquiry with a courteous notice.
3. **Honeypot Trap**: Forms include a hidden `website` field that is invisible to human users but autofilled by automated bot scripts; submissions with content in this field are dropped immediately.
4. **Self-Inquiry Guard**: Property owners cannot submit leads for their own listings.

---

## 🔐 Authentication & Token Rotation Strategy

* **Access Token**: Short-lived (15 minutes), signed with `JWT_SECRET`, transmitted via `Authorization: Bearer <token>`.
* **Refresh Token**: Long-lived (7 days), signed with `REFRESH_TOKEN_SECRET`, stored in the database with revocation flags and expiration tracking.
* **Automatic Token Rotation**: When an access token expires, the client calls `/api/auth/refresh`. The old refresh token is marked as `revoked: true` and a new token pair is issued.
* **Ownership Middleware (`verifyPropertyOwnership`)**: Ensures users can only update or delete their own listings (or admin users).

---

## 🌐 SEO & Web Performance Strategy

* **Next.js App Router Server Components**: Dynamic property detail pages utilize `generateMetadata()` for dynamic page titles, descriptions, OpenGraph cards, and Twitter previews.
* **Structured Data (JSON-LD)**: Injects `schema.org/RealEstateListing` and `schema.org/SingleFamilyResidence` metadata for Google Search Rich Snippets.
* **ISR (Incremental Static Regeneration)**: Property details pages are cached and revalidated every 60 seconds (`next: { revalidate: 60 }`).
* **Sitemap & Robots**: Dynamic `sitemap.xml` and `robots.txt` generated automatically at build time.

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js** v20+ / v24+
* **PostgreSQL** 16+ or 18+

### 2. Database Setup
Create database `realestate` or use the provided pre-initialized cluster:
```bash
# In backend/.env:
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5433/realestate?schema=public"
```

To start the local PostgreSQL instance:
```bash
npm run db:start
```

### 3. Backend Setup
```bash
cd backend
npm install
npm run prisma:push     # Synchronize schema to PostgreSQL
npm run seed            # Seed realistic Indian metro properties & demo users
npm run dev             # Start Express server on http://localhost:5000
```

> **API Documentation (Swagger UI)**: Open `http://localhost:5000/api-docs`

#### 50,000+ Records Benchmark
To generate 50,000 properties across Indian metros for scalability testing:
```bash
npm run seed:50k
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev             # Start Next.js on http://localhost:3000
```

### 5. Preconfigured Demo Accounts
| Role | Email | Password |
| :--- | :--- | :--- |
| **Property Owner** | `owner@realestate.com` | `Password@123` |
| **Real Estate Agent** | `agent@realestate.com` | `Password@123` |
| **Buyer / Tenant** | `buyer@realestate.com` | `Password@123` |

*(1-click login buttons are also available on the `/login` screen).*
