# Routebase — Backend

REST API for Routebase, a full-stack Transportation Management System built from scratch — informed by 5+ years of professional experience configuring and integrating enterprise TMS platforms.

🚧 **Status:** In active development

**Frontend repo:** [routebase-tms-app-frontend](https://github.com/samuelwbrown4/routebase-tms-app-frontend)

---

## Architecture

The backend follows a layered architecture with strict separation of concerns:

```
Route → Controller → Service → Repository → Database
```

| Layer | Responsibility |
|---|---|
| **Routes** | Define endpoints and HTTP methods |
| **Controllers** | Handle request/response cycle, input validation |
| **Services** | Business logic and operation orchestration |
| **Repos** | Raw database queries — nothing else |
| **DB** | PostgreSQL connection pool |
| **Middleware** | JWT authentication and route protection |
| **Email** | Nodemailer initialization and email service |

This separation means business logic in services is completely decoupled from the database layer. Swapping the data store would only require changes to the repos layer.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL |
| Auth | JWT |
| Email | Nodemailer |

---

## Database Design

13 normalized tables built around the core entities of a real TMS:

```
companies / carriers / customers / suppliers
    ↓
shipper_locations / customer_locations / supplier_locations
    ↓
products / equipment_types
    ↓
orders / order_line_items
    ↓
shipments / shipment_orders (junction) / shipment_events
```

**Key design decisions:**

- **UUID primary keys** via `pgcrypto` — avoids sequential ID exposure
- **Custom ENUM types** for status workflows — enforces valid state transitions at the database level, not just the application layer
- **Multi-tenant architecture** — `company_id` threads through companies, locations, and products
- **Junction table** (`shipment_orders`) — models the many-to-many relationship between shipments and orders, with `order_id` constrained as UNIQUE to prevent double-assignment
- **Shipment event log** — append-only audit trail with optional user attribution
- **Separate location types** — shipper, customer, and supplier locations in distinct tables, reflecting how origin/destination logic differs by party type in a real TMS

---

## Current Functionality

- JWT authentication with role-based access (admin / user)
- Open orders loading and management
- Order consolidation into shipments with carrier and equipment type assignment
- Carrier rate tables with distance band pricing
- Carrier-shipper relationship management and contract proposals
- Shipment status workflow tracking
- Transactional email notifications via Nodemailer

---

## Running Locally

### Prerequisites
- Node.js v18+
- PostgreSQL instance

### Setup
```bash
git clone https://github.com/samuelwbrown4/routebase-tms-app-backend
cd routebase-tms-app-backend
npm install
cp .env.example .env
```

Update `.env`:
```
DATABASE_URL=postgresql://user:password@host:5432/routebase
JWT_SECRET=your_jwt_secret
PORT=3000
EMAIL_HOST=smtp.your-provider.com
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

```bash
psql -d your_db_name -f schema.sql
npm start
```

---

## Background

This project came out of direct experience managing logistics operations and implementing enterprise TMS platforms (e2open, SAP WM) across 44 distribution sites. The schema, feature set, and API design reflect real operational requirements — not a tutorial interpretation of what a TMS might look like.

The carrier rate table and contract proposal features specifically address a gap I observed professionally — too much carrier-shipper communication happening over email and phone instead of being managed within the platform itself.

---

## Author

Samuel Brown — [github.com/samuelwbrown4](https://github.com/samuelwbrown4)