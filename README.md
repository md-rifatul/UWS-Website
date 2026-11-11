# WoodTech Solutions - Premium Industrial Machinery Platform
### Enterprise Machinery Catalog, Dynamic Specification Builder & RFQ Engine

A modern, production-grade industrial equipment catalog platform built with a decoupled **React 18 + Vite** frontend (optimized for **Vercel** serverless CDN edge deployment) and an **ASP.NET Core 8 Web API** Clean Architecture backend (containerized for **Render / Azure** with **PostgreSQL 16** JSONB dynamic technical schemas).

---

## 1. Architecture & Technology Stack

### Frontend Architecture
- **Framework**: React 18 with TypeScript & Vite
- **State Management**: Redux Toolkit (Persistent Spec Builder Basket, 4-Way Compare Tray, Catalog Filters, Auth)
- **Styling**: Tailwind CSS with custom corporate industrial design system (`#101D2C` Deep Navy, `#F28C28` Industrial Orange, `#202A35` Charcoal)
- **Icons & Motion**: Lucide React, Framer Motion
- **Networking**: Axios instance with automatic JWT Bearer injection and HTTP-only cookie-based refresh token rotation
- **Deployment**: Independently deployable to **Vercel** with `vercel.json` SPA routing rewrites

### Backend Architecture (Clean Architecture)
- **Runtime**: ASP.NET Core 8 Web API (C#)
- **Layers**:
  - `IndustrialCatalog.Domain`: Core entities, value objects, and domain enums.
  - `IndustrialCatalog.Application`: DTOs, service contracts, and dynamic schema validators.
  - `IndustrialCatalog.Infrastructure`: EF Core 8 PostgreSQL, BCrypt password hashing, JWT and cryptographic token generation, and database seeder.
  - `IndustrialCatalog.API`: RESTful controllers, global exception middleware, Swagger with Bearer authorization, and restricted CORS.
- **Dynamic Attributes**: Hybrid relational core + PostgreSQL `JSONB` for category-specific technical attributes (e.g. spindle power, feed speed, pressing pressure) without requiring database migrations.
- **Security**: Stateless JWT access tokens + HTTP-only `SameSite=None; Secure=true` refresh token cookies with automatic rotation.

---

## 2. Project Directory Structure

```
├── client/                               # Frontend Single Page Application
│   ├── src/
│   │   ├── components/                   # Cards, Filters, TopBar, Header, Footer, Drawers
│   │   ├── features/                     # Redux slices (auth, rfqBasket, compare, catalog)
│   │   ├── pages/
│   │   │   ├── public/                   # Home, Catalog, Details, Compare, RFQ, About, Services, Contact
│   │   │   └── admin/                    # Dashboard, Products CRUD, Dynamic Specs Builder, RFQs
│   │   ├── services/                     # Axios API clients & fallback offline demo datasets
│   │   └── types/                        # Strongly typed interfaces
│   ├── vercel.json                       # Vercel SPA routing rewrite rules
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                               # ASP.NET Core 8 Clean Architecture Solution
│   ├── IndustrialCatalog.Domain/         # Domain entities
│   ├── IndustrialCatalog.Application/    # Business services & DTOs
│   ├── IndustrialCatalog.Infrastructure/ # EF Core 8 PostgreSQL, BCrypt, TokenService
│   ├── IndustrialCatalog.API/            # Controllers, Swagger, CORS, Dockerfile
│   ├── IndustrialCatalog.sln
│   └── Dockerfile                        # Multi-stage production container
```

---

## 3. Local Development Setup

### Prerequisites
- Node.js v18+ and npm v9+
- .NET 8 SDK or .NET 9 SDK
- PostgreSQL 14+ (or Docker)

### Running the Frontend Locally
```bash
cd client
npm install
npm run dev
```
The application will launch at `http://localhost:3000`.

### Running the Backend Web API Locally
```bash
cd server
dotnet build
cd IndustrialCatalog.API
dotnet run
```
The API will launch at `http://localhost:5000` with Swagger available at `http://localhost:5000/swagger`.

### Pre-configured Demo Accounts
- **Platform Administrator**: `admin@woodtech.com` / `Admin@123456`
- **Corporate Buyer**: `buyer@apexwoodcraft.com` / `Buyer@123456`

---

## 4. Vercel Frontend Deployment Guide

The frontend is configured for independent deployment to **Vercel** with complete client-side routing support.

### Step 1: Connect GitHub Repository to Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository: `UWS-Website`.

### Step 2: Configure Root Directory
- In the project configuration modal, click **Edit** next to **Root Directory**.
- Select the `client` directory and click **Continue**.

### Step 3: Verify Build Settings
- **Framework Preset**: `Vite` (automatically detected)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Configure Environment Variables
Under the **Environment Variables** section, add:
- `VITE_API_BASE_URL`: The public HTTPS URL of your deployed backend API (e.g., `https://uws-api.onrender.com/api/v1`).

### Step 5: Deploy
- Click **Deploy**. Vercel will build and assign a production URL (e.g. `https://uws-machinery.vercel.app`).
- The included `vercel.json` ensures direct page loads and refreshes on all routes (`/products`, `/products/:slug`, `/compare`, `/request-quote`, `/admin/*`) route smoothly to `index.html`.

### Troubleshooting Vercel Deployments
- **404 on Page Refresh**: Ensure `client/vercel.json` exists in your repository root with the rewrite rule to `/index.html`.
- **CORS Errors**: Ensure the backend's `Cors:AllowedOrigins` includes your Vercel deployment URL.

---

## 5. Render / Azure Backend Deployment Guide

The backend can be deployed either as a Docker container or directly as a Web App service.

### Deployment on Render (Web Service)
1. In your [Render Dashboard](https://dashboard.render.com), click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Choose **Docker** as the runtime:
   - **Docker Context**: `server`
   - **Docker Path**: `server/Dockerfile`
4. Set Environment Variables in Render:
   - `ConnectionStrings__DefaultConnection`: Your managed PostgreSQL connection string (from Supabase, Neon, or Render Postgres).
   - `Jwt__SecretKey`: A strong cryptographically random 64-character string.
   - `Cors__AllowedOrigins__0`: Your frontend Vercel URL (e.g. `https://uws-machinery.vercel.app`).
   - `ASPNETCORE_ENVIRONMENT`: `Production`
5. Click **Create Web Service**. The API exposes `/health` and will initialize and seed the catalog automatically upon startup.

---

## 6. Key Features & Business Workflows

1. **Enterprise Equipment Catalog (`/products`)**:
   - Faceted search by model, SKU, machinery category, and manufacturer.
   - Dynamic specification filters populated on the fly according to the selected category schema.
2. **Interactive 4-Way Comparison Matrix (`/compare`)**:
   - Compare up to 4 machinery units simultaneously.
   - Dynamic specification union matrix highlighting technical variance.
3. **Spec Builder & Quotation Basket (`/request-quote`)**:
   - Persistent quotation basket allowing configuration of multiple machines, custom voltages, and delivery requirements.
   - Issues unique reference numbers (`RFQ-YYYY-XXXX`) and records audit status logs.
4. **Administrative Portal (`/admin`)**:
   - KPI metrics and pipeline valuation telemetry.
   - Dynamic Attribute Builder: allows administrators to define custom technical attributes per category without modifying code.
   - Commercial RFQ management and assignment of Senior Sales Directors.
