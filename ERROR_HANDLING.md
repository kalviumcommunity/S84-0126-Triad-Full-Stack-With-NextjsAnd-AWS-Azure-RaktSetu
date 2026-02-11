# Backend Error Handling Guide

## 1. Introduction

Structured error handling is critical for building a reliable and maintainable backend. In **RaktSetu**, consistent error responses ensure that the frontend can gracefully handle failure states, while providing developers with the necessary context to debug issues effectively.

### Why Consistent Error Responses Matter
- **Predictability**: The frontend knows exactly what JSON structure to expect on failure.
- **Security**: Prevents leaking sensitive database or system information to the client.
- **User Experience**: Allows for localized and user-friendly error messages.

---

## 2. HTTP Status Codes Used

RaktSetu follows standard RESTful status code conventions:

| Status Code | Label | Usage |
|-------------|-------|-------|
| **200** | OK | Request succeeded (GET, PUT, DELETE). |
| **201** | Created | Successfully created a new resource (POST). |
| **400** | Bad Request | Client-side validation failed or malformed request. |
| **401** | Unauthorized | Authentication required or token is invalid/expired. |
| **403** | Forbidden | User is authenticated but lacks permission for the resource. |
| **404** | Not Found | The requested resource does not exist. |
| **409** | Conflict | Resource already exists (e.g., duplicate email). |
| **500** | Internal Server Error | Unexpected server-side failure. |

---

## 3. Error Response Format

All error responses in RaktSetu follow a uniform JSON structure defined in `src/lib/responseHandler.ts`.

### 3.1 Validation Error (400)
Returned when Zod schema validation fails.
```json
{
  "success": false,
  "message": "Invalid input",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {
      "fieldErrors": {
        "email": ["Invalid email format"],
        "password": ["Password is too short"]
      }
    }
  },
  "timestamp": "2026-02-11T12:00:00.000Z"
}
```

### 3.2 Unauthorized Error (401)
Returned by middleware or auth routes when credentials/tokens are missing or invalid.
```json
{
  "success": false,
  "message": "Missing or invalid token",
  "error": {
    "code": "UNAUTHORIZED"
  },
  "timestamp": "2026-02-11T12:00:00.000Z"
}
```

### 3.3 Server Error (500)
Returned for unhandled exceptions. In production, details are stripped to avoid information leak.
```json
{
  "success": false,
  "message": "An internal server error occurred. Please try again later.",
  "error": {
    "code": "INTERNAL_ERROR"
  },
  "timestamp": "2026-02-11T12:00:00.000Z"
}
```

---

## 4. Authentication Errors

The `middleware.ts` and `auth` routes manage security checkpoints:

- **Missing Token**: When no `token` cookie or `Authorization` header is present. Returns `401 Unauthorized`.
- **Invalid Token**: When the JWT signature is invalid or the secret doesn't match. Returns `401 Unauthorized`.
- **Expired Token**: When the `exp` claim in the JWT is in the past. The client is expected to redirect to `/login`.
- **Invalid Credentials**: When login fails due to incorrect password or email. Returns `401 Unauthorized` with a specific message.

---

## 5. Database Errors

Prisma ORM errors are caught and transformed into standard responses:

- **Unique Constraint Errors**: e.g., attempting to register with an email that already exists. Mapped to `409 Conflict`.
- **Validation Errors**: When data does not match the database schema constraints. Mapped to `DATABASE_FAILURE` (400 or 500).
- **Connection Failures**: When the database is unreachable. Handled by `handleError` utility, returning a generic `500` to the user while logging the specific `P1001` error internally.

---

## 6. Best Practices Followed

### 6.1 Unified Utility Functions
We use `sendError()` and `handleError()` from `src/lib/` to ensure every route behaves identically.

### 6.2 Try/Catch Blocks
Every API route handler is wrapped in a try/catch block:
```typescript
try {
  // Logic
} catch (error) {
  return handleError(error, "ROUTE_NAME");
}
```

### 6.3 Environment Sensitivity
The backend distinguishes between `development` and `production`:
- **Development**: Returns full error stack traces and details for fast debugging.
- **Production**: Returns opaque error messages for security.

### 6.4 Logging Strategy
We use a centralized `logger.ts` to record errors. Each log entry includes:
- Request method and path
- User ID (if authenticated)
- Full error stack trace
- Timestamp

### 6.5 Safe Error Messages
Messages are written for the user, not the developer. We avoid "SQL syntax error" and instead use "Service temporarily unavailable".

---

**Last Updated**: February 11, 2026  
**Project**: RakthSetu  
**Backend Framework**: Next.js App Router  
