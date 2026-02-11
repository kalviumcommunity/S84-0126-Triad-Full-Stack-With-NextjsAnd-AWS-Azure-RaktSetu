# 🔑 JWT Authentication Flow

## Login Process

1. User submits credentials
2. Password verified with bcrypt
3. JWT generated containing:
   - user id
   - email
   - role
4. JWT stored in HTTP-only cookie

---

## Token Structure

{
  id: number,
  email: string,
  role: string
}

---

## Security Measures

- HTTP-only cookie
- Secure flag in production
- Expiry: 1 hour
- Secret stored in environment variables

---

## Why JWT?

- Stateless authentication
- Scalable
- Works well with middleware
