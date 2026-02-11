# 🔐 Role-Based Access Control (RBAC)

## Overview

Rakt Setu uses RBAC to restrict access to sensitive APIs and dashboards.

Implemented using:

- JWT verification
- Next.js Middleware
- Role-based validation before API execution

---

## Roles

| Role     | Access Level |
|----------|-------------|
| user     | Basic access |
| admin    | System management |
| ngo      | NGO dashboards |
| hospital | Blood inventory |

---

## Flow

1. User logs in
2. JWT issued
3. Middleware verifies JWT
4. Role extracted
5. Access granted or rejected

---

## Why Middleware?

Middleware blocks unauthorized requests
BEFORE backend logic executes.

This reduces attack surface.
