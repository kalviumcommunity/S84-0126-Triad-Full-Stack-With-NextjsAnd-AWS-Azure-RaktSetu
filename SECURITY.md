# Backend Security Documentation

## 1. Introduction

Security is paramount in healthcare-related systems like **RaktSetu**, where sensitive data involving donors, patients, and health records are managed. Ensuring a secure API design prevents unauthorized access, data breaches, and maintains the integrity of the blood donation ecosystem.

### Why Secure API Design Matters
- **Confidentiality**: Protects user identity and health information.
- **Integrity**: Ensures that blood requests and inventory data cannot be tampered with.
- **Availability**: Prevents malicious actors from disrupting emergency blood services.

---

## 2. Authentication Security

RaktSetu implements a robust authentication layer to verify identity before granting access to resources.

### 2.1 JWT-Based Authentication
The system uses **JSON Web Tokens (JWT)** for stateless authentication.
- **Generation**: Upon successful login, a token is generated containing the user's `id`, `email`, and `role`.
- **Signing**: Tokens are signed using a robust HS256 algorithm with a server-side `JWT_SECRET`.
- **Expiration**: Tokens are configured with a 1-hour expiration to minimize the window for replay attacks.

### 2.2 Token Storage & Exposure Prevention
- **HTTP-Only Cookies**: Tokens are primarily stored in cookies with the `httpOnly` flag set to `false` for frontend flexibility but the `secure` and `sameSite: "lax"` flags for production protection.
- **Bearer Tokens**: API routes also support `Authorization: Bearer <token>` headers for cross-platform compatibility.
- **Anti-XSS**: By managing authentication server-side and using structured response handlers, we minimize the exposure of tokens to client-side scripts.

---

## 3. Authorization Strategy

Authentication verifies *who* you are; Authorization verifies *what* you can do.

### 3.1 Middleware Protection
The `middleware.ts` acts as a security gatekeeper for both frontend and backend routes:
- **Protected Paths**: Routes like `/api/users`, `/api/requests`, and `/api/appointments` are intercepted.
- **Validation**: The middleware checks for a valid token before the request ever reaches the API route handler.
- **Unauthorized Access**: Missing or invalid tokens result in an immediate `401 Unauthorized` response.

### 3.2 Role-Based Access Control (RBAC)
- **Roles**: Users are assigned roles such as `user`, `admin`, or `ngo`.
- **Scoped Access**: API routes individually verify if the authenticated user has the necessary permissions (e.g., only admins can delete users or manage global campaigns).

---

## 4. Environment Variable Protection

Sensitive configurations are strictly managed outside the source code.

- **Secrets Management**: Variables like `DATABASE_URL` and `JWT_SECRET` are kept in `.env` files locally.
- **Repository Security**: The `.gitignore` file explicitly excludes `.env` files to prevent secrets from being committed to GitHub.
- **Cloud Configuration**: In production (**AWS/Azure**), environment variables are injected via the platform's native secret management services (App Service Settings or AWS App Runner Config).

---

## 5. Database Security

We leverage **Prisma ORM** to ensure a secure database layer.

- **SQL Injection Prevention**: Prisma avoids raw SQL strings. Instead, it uses parameterized queries, making it virtually impossible for attackers to inject malicious SQL through user inputs.
- **Type Safety**: Prisma Client enforces strict typing, ensuring that only data conforming to the `schema.prisma` definition can be written to the database.
- **Data Validation**: Before any database write, data is validated against **Zod** schemas to ensure logical and structural integrity.

---

## 6. API Security Practices

### 6.1 Input Validation
Every POST and PUT request is validated using Zod. If the input doesn't match the expected schema, the request is rejected with a `400 Bad Request` before any business logic is executed.

### 6.2 Structured Error Handling
- **Minimal Disclosure**: Error responses provide helpful messages to legitimate users but never expose internal stack traces, database schema details, or server-side paths in production.
- **Consistent Format**: All errors follow the same JSON structure, preventing side-channel attacks through meta-data analysis.

### 6.3 Data Minimization
API responses are carefully mapped to return only the necessary fields. For example, user profiles omit the `password` field entirely to ensure hashes are never exposed to the frontend.

---

## 7. Deployment Security (AWS & Azure)

### 7.1 HTTPS Enforcement
In production, all traffic is encrypted via **SSL/TLS**. Environment variables are configured to ensure cookies are marked as `Secure`, enforcing transmission over HTTPS only.

### 7.2 Production Hardening
- **NODE_ENV**: Set to `production` disables Verbose logging and detailed error responses.
- **Least Privilege**: Database users are configured with only the permissions required for the application to function.

---

## 8. Summary

The backend of **RaktSetu** is built on the principles of **Security by Design**. By combining JWT-based authentication, middleware-enforced authorization, Prisma's parameterized queries, and strict input validation, we provide a secure and scalable foundation for life-saving blood donation coordination.

---

**Last Updated**: February 11, 2026  
**Project**: RakthSetu  
**Target Environments**: AWS App Runner, Azure App Service  
