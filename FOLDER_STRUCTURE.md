# Folder Structure Documentation

## 1. Root Structure Overview

**RaktSetu** follows the Next.js App Router architecture, with a clear separation between frontend views, backend logic, and database management. The project is organized to support scalability, maintainability, and security.

```text
/
├── prisma/               # Database schema and migrations
├── public/               # Static assets (images, icons)
├── src/
│   ├── app/              # Next.js App Router (Pages & API)
│   ├── components/       # Reusable UI components
│   ├── context/          # React context providers
│   ├── hooks/            # Custom React hooks
│   └── lib/              # Core backend logic and utilities
├── middleware.ts         # Global request interceptor
└── [Config Files]        # package.json, next.config.ts, etc.
```

---

## 2. Important Directories

### 2.1 `/src/app/api` (The Backend Core)
This directory contains all **API Route Handlers**. Each sub-folder represents a resource (e.g., `auth`, `users`, `requests`) and contains a `route.ts` file that defines the supported HTTP methods (GET, POST, etc.).

### 2.2 `/prisma`
Contains the **Prisma Schema** (`schema.prisma`), which is the single source of truth for the database structure. It also houses the `migrations/` folder (historical SQL changes) and a `seed.js` script for populating the database with initial data.

### 2.3 `/src/lib`
This is the "Engine Room" of the backend. It stores reusable logic that isn't tied to a specific API route:
- **`prisma.ts`**: A singleton Prisma Client instance.
- **`errorHandler.ts` & `responseHandler.ts`**: Utilities for standardized API communication.
- **`schemas/`**: Zod validation schemas for ensuring incoming data quality.
- **`errorCodes.ts`**: Centralized constant definitions for error tracking.

### 2.4 `/src/app` (Frontend Routes)
While primarily containing UI layouts and pages, this folder dictates the overall routing of the application. The backend `api` folder is nested here to benefit from Next.js's unified routing system.

### 2.5 `middleware.ts`
Located at the root of `src/`, this file acts as a global pre-processor for every request. It handles authentication checks and route protection before requests reach the API or page handlers.

---

## 3. Backend-Specific Files

### 3.1 `prisma/schema.prisma`
The most critical backend file. It defines the PostgreSQL models, their types, and the relationships (1:1, 1:N) between them.

### 3.2 `middleware.ts`
The security gatekeeper. It validates JWT tokens from cookies or headers and manages role-based redirection.

### 3.3 `route.ts` (inside various `/api/` subfolders)
These files act as the Controllers in our architecture. They parse request bodies, invoke validation, interact with Prisma, and return standardized responses using the `lib` utilities.

---

## 4. Separation of Concerns

RaktSetu maintains a strict separation of concerns to prevent "Spaghetti Code":

- **Validation Layer**: Handled by Zod schemas in `/lib/schemas/`.
- **Database Layer**: Handled exclusively via Prisma in `/prisma/` and `/lib/prisma.ts`.
- **Security Layer**: Managed by the root `middleware.ts` and JWT utilities.
- **Response Layer**: Standardized via helpers in `/lib/responseHandler.ts`.
- **Business Logic**: Resides within the route handlers, utilizing helper functions in `/lib/`.

---

## 5. Summary

The folder structure of **RaktSetu** is designed to keep the backend logic modular and decoupled from the frontend components. By centralizing utilities in `/lib` and database definitions in `/prisma`, the project remains easy to navigate and scale as new blood donation features are added.

---

**Last Updated**: February 11, 2026  
**Project**: RakthSetu  
**Architecture**: Next.js App Router (Full-Stack)  
