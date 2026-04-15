# 📘 PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Product Name: QuickKlinik

## Category: Clinic & Hospital Appointment + OTC Self-Dispensary Platform

## Target Market: Private Clinics → Medical Centers → Hospital Groups

---

# 1️⃣ Executive Summary

QuickKlinik is a web-based clinic management system that:

1. Manages appointments and walk-in queues
2. Optimizes patient flow
3. Enables OTC self-checkout or self-collection
4. Tracks inventory and audit logs
5. Reduces front desk workload

The system is modular and designed to scale from:

* Single GP clinic
* Multi-branch clinic networks
* Private hospitals

---

# 2️⃣ Problem Statement

Clinics currently face:

* Long queues at front desk
* Manual appointment handling
* OTC medicine bottlenecks
* Poor inventory tracking
* No real-time patient flow visibility

Patients face:

* Waiting uncertainty
* Double queues (consult + payment)
* Slow OTC purchases
* No digital history

---

# 3️⃣ Objectives

### Primary Goals

* Reduce patient waiting time by at least 30%
* Reduce front desk workload by at least 40%
* Automate OTC purchase flow safely
* Ensure complete auditability

### Secondary Goals

* Provide scalable infrastructure
* Enable kiosk deployments
* Enable future integration (insurance, labs, EHR)

---

# 4️⃣ Product Scope

## Core Modules

### A. Appointment System

* Online booking (time-slot based)
* Walk-in queue token system
* QR check-in
* Doctor schedule management
* Room allocation
* Status tracking workflow

Status Flow:

```
Booked → Arrived → Waiting → In Consultation → Completed → Checkout
```

---

### B. Queue Management

* Real-time queue dashboard
* Estimated waiting time
* Priority queue (elderly, emergency)
* SMS / WhatsApp notification (optional integration)
* Display screen mode for waiting areas

---

### C. OTC Self-Dispensary Module

Purpose:
Allow patients to purchase non-prescription medications without overloading staff.

#### Features:

* OTC catalog browsing
* Smart dosage guidance display
* Age verification
* Quantity limit enforcement
* Mandatory health disclaimer acknowledgment
* Digital payment
* QR-based pickup system
* Self-collection locker integration (API-ready)

Fulfillment Options:

1. Staff-assisted counter pickup
2. Automated locker collection
3. Future: Smart vending integration

---

### D. Inventory Management

* Product listing
* Batch tracking
* Expiry tracking
* Stock movement logs
* Low-stock alerts
* Automatic deduction upon OTC purchase
* Manual stock adjustment with audit trail

---

### E. User & Role Management

Roles:

* Super Admin
* Clinic Admin
* Doctor
* Nurse
* Counter Staff
* Inventory Staff

Each action must:

* Be logged
* Be traceable
* Include timestamp & user ID

---

### F. Audit & Compliance Layer

* Every transaction logged
* OTC purchases logged with disclaimer confirmation
* Admin override logs
* Exportable daily reports
* Inventory discrepancy report
* Access log history

---

# 5️⃣ Technical Architecture

## Frontend

* Modern React-based framework (Next.js App Router)
* Server-driven UI where possible
* Mobile-first responsive design
* Kiosk mode UI (full-screen hardened view)
* **Whitelabel**: all branding (name, logo, colors) from tenant config; no hardcoded clinic names
* **Design system**: semantic theme tokens (CSS variables + Tailwind) with a shared palette and tenant overrides

### UI Theme + Palette (Default)

QuickKlinik uses semantic theme tokens (`background`, `foreground`, `primary`, `accent`, `ring`, etc.) that map to a **healthcare-appropriate baseline theme**: clean, high-contrast light surfaces for readability, with calm teal/blue accents for actions and status.

| Role | Default | Use |
|------|---------|-----|
| Background | Soft clinical white-blue (`--background`) | App surfaces |
| Foreground | Deep navy (`--foreground`) | Default text |
| Primary | Teal (`--primary`) | Primary CTAs |
| Accent | Blue (`--accent`) | Links, emphasis |
| Focus ring | Teal (`--ring`) | Focus states |

UI must reference semantic tokens (e.g. `bg-background`, `text-foreground`, `bg-primary`, `ring-ring`) rather than hardcoded hex colors.

**Brand defaults** (CSS variables in `app/globals.css`): `--brand-bg`, `--brand-fg`, `--brand-primary`, `--brand-accent`, `--brand-tint`, `--brand-border`, `--brand-muted`, `--brand-muted-fg`, `--brand-danger`. Extended shade families (baltic-blue, teal, verdigris, mint-leaf, cream 50–950) remain available for one-off use.

**Whitelabel theme overrides**:

- Tenant branding can override semantic tokens via CSS variables (HSL triplets) such as `--tenant-primary`, `--tenant-primary-foreground`, `--tenant-accent`, `--tenant-ring` (resolved server-side from tenant config).

This preserves a consistent baseline aesthetic while still enforcing “no hardcoded clinic branding” in the UI layer.

## Backend

* **Supabase** as primary backend: PostgreSQL, Auth, optional Realtime and Storage
* Server-side business logic in server actions and API routes when needed
* Role-based authorization (Supabase Auth + app roles)
* Structured logging and audit tables

## Database (Supabase PostgreSQL)

* Relational schema managed via Supabase migrations (SQL in repo)
* Soft deletes for compliance (`deletedAt` timestamptz)
* Indexed queries for queue speed
* **Multi-tenant**: every clinic-scoped table has `clinicId` (or `organizationId`); Supabase RLS enforces tenant isolation so the same codebase serves multiple clinics/hospitals

## Whitelabel / Multi-Tenant

* **Single codebase**: one deployment can serve many clinics; tenant selected by subdomain, custom domain, or post-login context
* **Tenant config** (e.g. `clinics` or `tenant_settings`): `displayName`, `logoUrl`, `primaryColor`, `supportEmail`, optional `customDomain`
* **No hardcoded branding** in UI: header, login screen, emails, and kiosk display read from tenant config
* **RLS**: all queries filtered by current tenant so data never leaks across clinics

## Hosting Strategy

Phase 1: Vercel (or similar) + Supabase Cloud  
Phase 2: Malaysia-local infrastructure option (self-hosted Supabase or managed Postgres + compatible Auth)

---

# 5a. Whitelabel & Multi-Tenant Strategy

QuickKlinik is designed so one deployment can serve many clinics and hospitals without code changes.

| Concern | Approach |
|--------|----------|
| **Data isolation** | Every clinic-scoped table has `clinicId`. Supabase RLS ensures users only see data for their tenant. |
| **Branding** | Store per-tenant: `displayName`, `logoUrl`, `primaryColor`, `supportEmail`. UI reads from this (no "QuickKlinik" or clinic name in code). |
| **Tenant selection** | By login (user belongs to a clinic), subdomain (e.g. `acme.quickklinik.com`), or custom domain. Resolve in middleware and set for RLS. |
| **Adding a new clinic** | Insert row in `clinics` (and optionally tenant_settings), configure branding, assign users. No new deploy. |
| **Super Admin** | Can manage multiple tenants; RLS bypass or separate service role for cross-tenant admin only where needed. |

This makes it easy to whitelabel for other clinics and hospitals: same codebase, different branding and data per tenant.

---

# 6️⃣ High-Level Data Model

**Platform**: Supabase (PostgreSQL). Schema via SQL migrations in repo.

Core Entities:

* users (Supabase Auth; link to app profile with role and clinicId)
* roles
* clinics (tenant root; include displayName, logoUrl, primaryColor, supportEmail, customDomain for whitelabel)
* doctors
* rooms
* patients
* appointments
* queue_tokens
* otc_products
* otc_batches
* otc_orders
* payments
* inventory_logs
* audit_logs

All tables:

* Standard columns: id (uuid), createdAt, updatedAt, deletedAt (nullable)
* Tenant-scoped tables include clinicId (FK to clinics); RLS policies enforce isolation per tenant

---

# 7️⃣ User Flows

## Patient – Appointment Flow

1. Select clinic
2. Choose doctor
3. Choose time slot
4. Confirm details
5. Receive booking confirmation
6. QR check-in on arrival

---

## Walk-In Flow

1. Enter details at kiosk
2. Receive queue number
3. Wait for display notification
4. Proceed to consultation

---

## OTC Purchase Flow

1. Browse OTC products
2. Select item
3. Review dosage & warning
4. Confirm acknowledgment
5. Make payment
6. Receive QR code
7. Scan QR at collection point

---

# 8️⃣ Non-Functional Requirements

* High availability
* Fast page load
* Secure authentication
* Encrypted data at rest
* Encrypted data in transit
* Role-based access enforcement
* Audit immutability

---

# 9️⃣ Security Requirements

* Rate limiting
* Input validation
* Role-based authorization
* Anti-tampering logging
* Payment provider secure redirect
* No client-side business logic enforcement
* Secure kiosk mode (restricted navigation)

---

# 🔟 Compliance Considerations (Malaysia-Focused)

* OTC-only restriction enforcement
* Digital disclaimer logging
* Purchase limit enforcement
* Personal data protection compliance
* Audit retention policy configuration

---

# 1️⃣1️⃣ MVP Definition

MVP Includes:

* Appointment booking
* Walk-in queue
* Admin dashboard
* OTC product catalog
* Basic inventory tracking
* Payment integration
* QR pickup

MVP Excludes:

* Prescription handling
* Insurance integration
* Smart locker automation (API-ready only)
* Multi-hospital federation

---

# 1️⃣2️⃣ Future Expansion Roadmap

Phase 2:

* Prescription module
* Insurance claims submission
* Teleconsult integration
* Multi-branch sync (same tenant, multiple locations)

Phase 3:

* Hospital network mode
* AI patient flow optimization
* Government reporting interface
* Malaysia-local hosting cluster

**Whitelabel**: From day one, the product is built for multi-tenant use. Adding a new clinic or hospital is a matter of creating a new tenant row (and optional custom domain), not deploying a separate codebase.

---

# 1️⃣3️⃣ Success Metrics

* Queue time reduction
* Staff workload reduction
* OTC purchase self-service adoption rate
* System uptime
* Inventory discrepancy rate
* Clinic owner retention rate

---

# 1️⃣4️⃣ Strategic Positioning

QuickKlinik is not just:

“Clinic software”

It is:

> A clinic flow optimization system with embedded dispensary automation.

This gives you:

* SaaS revenue
* Hardware upsell (kiosk / locker)
* Maintenance contracts
* Infrastructure control (later Malaysia-only hosting)

---