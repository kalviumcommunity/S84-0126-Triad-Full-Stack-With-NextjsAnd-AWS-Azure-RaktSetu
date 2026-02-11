# API Response Structure

## 1. Introduction

Consistency in API responses is vital for a smooth integration between the backend and frontend. In **RaktSetu**, every API endpoint follows a standardized JSON structure. This predictability allows the client-side application to implement unified handling for data rendering, loading states, and error notifications.

---

## 2. Success Response Format

All successful API calls return a JSON object with a `success` boolean set to `true` and the requested data wrapped in a `data` property.

### 2.1 JSON Structure
```json
{
  "success": true,
  "message": "String describing the outcome",
  "data": { ... },
  "timestamp": "ISO-8601-DateTime"
}
```

### 2.2 Example Response (GET /api/profile)
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "bloodGroup": "O+"
  },
  "timestamp": "2026-02-11T14:30:00.000Z"
}
```

---

## 3. Error Response Format

Errors are returned with a `success` boolean set to `false`. They include a human-readable `message` and a structured `error` object containing a stable `code`.

### 3.1 JSON Structure
```json
{
  "success": false,
  "message": "Human-readable error description",
  "error": {
    "code": "STABLE_ERROR_CODE",
    "details": { ... }
  },
  "timestamp": "ISO-8601-DateTime"
}
```

### 3.2 Validation Error Example (400)
Returned when request body validation (Zod) fails.
```json
{
  "success": false,
  "message": "Invalid input",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {
      "fieldErrors": {
        "email": ["Invalid email address"]
      }
    }
  },
  "timestamp": "2026-02-11T14:32:00.000Z"
}
```

### 3.3 Unauthorized Example (401)
Returned when a token is missing, invalid, or expired.
```json
{
  "success": false,
  "message": "Missing token",
  "error": {
    "code": "UNAUTHORIZED"
  },
  "timestamp": "2026-02-11T14:35:00.000Z"
}
```

### 3.4 Server Error Example (500)
Returned for unexpected exceptions. Details are hidden in production for security.
```json
{
  "success": false,
  "message": "An internal server error occurred. Please try again later.",
  "error": {
    "code": "INTERNAL_ERROR"
  },
  "timestamp": "2026-02-11T14:40:00.000Z"
}
```

---

## 4. HTTP Status Codes

RaktSetu uses standard HTTP status codes to communicate the high-level result of a request:

| Status Code | Label | Description |
|-------------|-------|-------------|
| **200** | OK | Request successful. Data returned in body. |
| **201** | Created | Resource successfully created (e.g., after signup). |
| **400** | Bad Request | Validation failed or request malformed. |
| **401** | Unauthorized | Authentication required or failed. |
| **404** | Not Found | The requested resource does not exist. |
| **500** | Internal Error | Unexpected server failure. |

---

## 5. Best Practices

- **Clear Error Messages**: Messages are written for end-users to understand what went wrong without technical jargon.
- **Fail Fast**: Input validation (via Zod) happens at the very beginning of the request lifecycle to prevent unnecessary processing.
- **No Data Leakage**: Sensitive database fields (like password hashes) or internal stack traces (in production) are never included in the response.
- **Atomic Operations**: We aim for responses to represent a complete operation to avoid the client having to make multiple dependent calls for basic status updates.

---

**Last Updated**: February 11, 2026  
**Project**: RakthSetu  
**Utilities**: `src/lib/responseHandler.ts` | `src/lib/errorHandler.ts`
