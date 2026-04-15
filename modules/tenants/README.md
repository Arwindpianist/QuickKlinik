# Tenants module

Purpose: manage top-level tenants (clinic, hospital, pharmacy, etc.) for SuperAdmin. Each tenant has type, subscription package, size, features, and branding. For type=clinic, a row in `clinics` is created and linked via `tenant_id`.

Data flow:
- **List**: `listTenants()` → `getTenants(filters)` → `tenants` table.
- **Create**: `createTenantAction(formData)` → parse → `createTenant()` → insert `tenants`; if type=clinic, insert `clinics` with `tenant_id`; audit log.
- **Update**: `updateTenantAction(id, formData)` → parse → `updateTenant()`; if type=clinic, sync branding to linked clinic; audit log.
- **Delete**: `deleteTenantAction(id)` → `softDeleteTenant()` (cascades soft-delete to clinic when type=clinic); audit log.

Authority: SuperAdmin only (enforced in actions).
