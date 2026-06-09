# Routebase TMS

**Status:** Deployed | **Live:** [routebase.cloud](https://routebase.cloud)

> A full-stack Transportation Management System built from scratch with architectural and design decisions based on 5+ years of professional experience configuring and integrating enterprise TMS platforms.

---

## What It Does

Routebase is a Transportation Management System that manages the full order-to-shipment lifecycle through a dual portal platform for both shippers and carriers. It handles everything from order creation and carrier assignment to live shipment tracking and delivery confirmation.

Proven with its companion ERP app, [purepath-erp.com](https://purepath-erp.com), Routebase integrates with enterprise software to execute bidirectional tasks such as order ingestion from the ERP to Routebase, and transmitting status updates from Routebase back to the ERP.

---

## Tech Stack

| Layer | Routebase TMS | PurePath ERP |
|---|---|---|
| Frontend | React, Vite, Mantine, Leaflet | React, Vite, Mantine |
| Backend | Node.js, Express | Node.js, Express |
| Database | PostgreSQL (AWS RDS) | PostgreSQL (Supabase) |
| Auth | JWT (users), API Keys (system) | JWT (users), API Keys (system) |
| Hosting | AWS EC2, Amplify, ALB, Route 53 | AWS EC2, Amplify, ALB, Route 53 |
| Other | Geoapify, Puppeteer, node-cron, Nodemailer | Supabase JS |

---

## Architecture

### Deployment
- **Routebase TMS** — EC2 backend, Amplify frontend, RDS (PostgreSQL), ALB, Route 53
- **PurePath ERP** — EC2 backend, Amplify frontend, Supabase (PostgreSQL), ALB, Route 53

### Database
- **UUID Primary Keys** — Unique keys to prevent the risk of sequential record exposure
- **Custom ENUM Types** — Enforces valid state transitions at the database level, preventing unexpected state updates from the application level
- **Multi-tenant Architecture** — `company_id` field included on core tables to support multiple shippers on a single instance
- **Junction Tables** — `shipment_orders` represents a one-to-many relationship; by constraining `order_id` to be UNIQUE, orders cannot be assigned to multiple shipments
- **Append-Only Events Log** — `shipment_events` table captures each status update with a timestamp to provide a complete shipment audit trail
- **Location Type Separation** — Shipper, customer, and supplier location types are contained in their own tables for flexibility when determining origin and destination
- **JSONB Route Geometry** — Route geometry is stored directly on shipment records rather than a separate geometry table
- **Database-Level Validation** — Triggers validate order/shipment creation, status changes, and spot bid validation at the database level

### Backend
- Layered Controller/Service/Repository pattern
- JWT auth for users, API key auth for system-to-system integration
- Cron jobs for live truck position simulation and TMS-to-ERP order status sync
- BOL generation via Puppeteer
- Forward geocoding via Geoapify on location creation to get and store coordinates

### Frontend
- React + Vite + Mantine
- Leaflet maps for live shipment tracking
- Role-based portal rendering (shipper vs carrier)

### Integration
- System-to-system integration handled by API keys and API middleware
- TMS pushes status updates back to ERP via cron job, only when status has changed since last sync
- **Order Creation** — ERP creates orders and posts them to the TMS ingestion endpoint, which normalizes and stores order details
- **TMS-First Creation Flow** — Customers and locations are created in the TMS first; IDs are returned and stored on the ERP record, ensuring referential integrity across both systems and mirroring patterns used in real enterprise middleware integrations

---

## Features

- Dual portals (shipper & carrier)
- Full order-to-shipment lifecycle
- Bidirectional freight planning (inbound & outbound)
- Rate calculation with distance bands and fuel surcharges
- Freight contract management
- BOL generation via Puppeteer
- Live shipment tracking with Geoapify supplying route geometry and Leaflet displaying polyline
- Truck position simulation via cron job
- Messaging system between shippers and carriers
- Forward geocoding on location creation
- Role-based access control

---

## Running Locally

### Prerequisites
- Node.js
- NPM
- Geoapify API key
- Supabase project (for ERP database)
- Local PostgreSQL instance (for TMS database)
- Both backends must be configured with each other's API URLs and keys in their `.env` files — the systems communicate bidirectionally and sync jobs will error without this

### PurePath ERP Frontend
```bash
git clone <repo>
cd purepath-erp-frontend
npm install
cp .env.example .env  # set VITE_API_URL
npm run dev
```

### PurePath ERP Backend
```bash
git clone <repo>
cd purepath-erp-backend
npm install
cp .env.example .env  # set DB credentials, TMS_API_URL, TMS_API_KEY, Supabase credentials
node index.js
```

### Routebase TMS Frontend
```bash
git clone <repo>
cd routebase-frontend
npm install
cp .env.example .env  # set VITE_API_URL
npm run dev
```

### Routebase TMS Backend
```bash
git clone <repo>
cd routebase-backend
npm install
cp .env.example .env  # set DB_URL, JWT_SECRET, PORT, ERP_API_URL, ERP_API_KEY, Geoapify keys
node index.js
```

---

## Author

Samuel Brown — [github.com/samuelwbrown4](https://github.com/samuelwbrown4)