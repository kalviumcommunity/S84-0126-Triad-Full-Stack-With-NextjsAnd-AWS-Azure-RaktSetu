# Authentication & Authorization Flow

## 1. Introduction

Authentication is the cornerstone of security for **RaktSetu**. In a platform managing blood donation and health-related coordination, verifying the identity of users and ensuring data privacy is non-negotiable. Our authentication system prevents unauthorized access to sensitive donor records and ensures that emergency blood requests are managed by verified individuals.

---

## 2. Login Flow

The login process follows a secure, stateless implementation using JSON Web Tokens (JWT).

### 2.1 Credential Submission
The client sends a POST request to `/api/auth/login` containing:
- `email`
- `password`

### 2.2 Validation
1. **Input Validation**: The request body is validated against a **Zod** schema.
2. **User Lookup**: The backend queries the PostgreSQL database via **Prisma** to find a user with the matching email.
3. **Password Verification**: If the user exists, the provided password is compared with the hashed password stored in the database using **bcryptjs**.

### 2.3 Token Generation
Upon successful verification, the server generates a JWT signed with the `JWT_SECRET` environment variable.

### 2.4 Token Storage
The generated token is handled in two ways:
1. **Cookie-Based (Primary)**: The server sets an `httpOnly` cookie named `token`. This is the source of truth for the browser. It includes the `secure` flag in production and `sameSite: "lax"` for CSRF protection.
2. **JSON Response**: The token is also returned in the response body for clients that prefer to handle it manually (e.g., mobile apps).

---

## 3. Token Structure

RaktSetu uses signed JWTs to maintain session state statelessly.

### 3.1 Payload (Claims)
The decoded JWT payload contains:
```json
{
  "id": 123,
  "email": "user@example.com",
  "role": "user",
  "iat": 1707654000,
  "exp": 1707657600
}
```
- **id**: Unique database identifier for the user.
- **email**: User's registered email address.
- **role**: User's permission level (`user`, `admin`, or `ngo`).
- **iat/exp**: Issued At and Expiration timestamps.

### 3.2 Expiration Strategy
Tokens are configured with a **1-hour expiration time**. This short lifespan reduces the risk associated with token theft while providing a balance for user experience.

---

## 4. Middleware Protection

Every request to a protected route (e.g., `/dashboard/*` or `/api/requests/*`) passes through a central security layer.

### 4.1 Route Guarding
The `middleware.ts` file intercepts requests to protected paths. It checks for the presence of a token in:
1. The `token` cookie.
2. The `Authorization: Bearer <token>` header.

### 4.2 Validation Logic
1. If no token is found, the user is redirected to `/login` (for frontend routes) or receives a `401 Unauthorized` (for API routes).
2. The token is verified using the server-side `JWT_SECRET`.
3. If the token is invalid or expired, the middleware clears the cookie and returns an error response.

---

## 5. Authorization

Authentication confirms identity, while Authorization confirms permissions.

### 5.1 User-Scoped Access
Most API routes include logic to ensure users can only access their own data. For example:
- A user can only view their own appointments.
- A donor can only update their own profile.

### 5.2 Role-Based Access
Certain operations check the `role` claim within the validated token:
- **Admin**: Can manage campaigns and view all user records.
- **NGO**: Can view and fulfill blood requests from the dashboard.

### 5.3 Error Responses
If a user attempts to access a resource without proper authentication or permissions:
- **401 Unauthorized**: Missing or invalid credentials.
- **403 Forbidden**: Valid credentials, but insufficient permissions for the specific action.

---

## 6. Summary

RaktSetu implements a modern, secure authentication stack using Next.js API routes and JWT. By combining secure password hashing, cookie-based token storage, and middleware-enforced route protection, we ensure that blood donation workflows remain secure and private for all participants.

---

**Last Updated**: February 11, 2026  
**Project**: RakthSetu  
**Auth Strategy**: Stateless JWT + Cookie Storage  
