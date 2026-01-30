# RaktSetu 🩸  
*Real-Time Blood Donation & Inventory Management Platform*

RaktSetu is a full-stack web application built to solve blood shortages caused by *poor coordination and lack of real-time data*, not the lack of donors.

---

## 🚨 Problem
- Outdated blood inventory systems  
- No real-time visibility during emergencies  
- Poor coordination between donors, hospitals, and NGOs  

---

## 💡 Solution
RaktSetu connects *donors, hospitals, and NGOs* on a single platform to provide:
- 🧾 Live blood inventory tracking  
- 🚑 Emergency blood requests  
- 📍 Location-based donor discovery  
- 🔐 Secure role-based access  

---

## 🧠 Tech Stack
- ⚛️ **Next.js** – Frontend + Backend (API Routes)  
- 🗄️ **PostgreSQL** – Relational database  
- 🔗 **Prisma** – Type-safe ORM  
- 🐳 **Docker** – Containerization  
- ☁️ **AWS / Azure** – Cloud deployment  

---

## 🎯 MVP Features
- 👤 Role-based authentication  
- 🩸 Blood inventory dashboard  
- 🚨 Emergency request system  
- 📍 Nearby donor discovery  
- 🛠️ Admin / NGO panel  

---

## 👥 Team
- **Aryaman** – Backend (APIs, DB, Prisma)  
- **Manvi** – Frontend (UI, Dashboards)  
- **Arnav** – DevOps & Testing (Docker, CI/CD)  

---

## 🎓 Context
Built as part of **Kalvium – Simulated Work (AP)**  
Sprint #1: *Full-Stack Development with Next.js & Cloud*

---

## 🌱 Vision
To ensure **no life is lost due to missing or delayed blood availability data**.

---

🚧 *Project under active development*

---

## Input Validation with Zod

Input validation ensures our API routes reject bad data early, preventing runtime errors and keeping database writes clean and predictable.

### Where schemas live
- `src/lib/schemas/` contains shared Zod schemas used by API routes (POST/PUT).

### Example success response (global handler)

```json
{
  "success": true,
  "message": "Success",
  "data": { "id": 1, "name": "Alice", "email": "alice@example.com" },
  "timestamp": "2026-01-27T10:00:00.000Z"
}
```

### Example validation error response (400)

```json
{
  "success": false,
  "message": "Invalid input",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {
      "formErrors": [],
      "fieldErrors": {
        "email": ["Email must be a valid email address"]
      }
    }
  },
  "timestamp": "2026-01-27T10:00:00.000Z"
}
```

### Maintainability note
Keeping schemas centralized makes validation consistent across routes and easier to update as a team without duplicating checks in every API file.

---

## Authentication APIs (Signup / Login)

### Signup flow (`POST /api/auth/signup`)
- Validates `name`, `email`, `password` using Zod
- Checks for duplicate email
- Hashes password using bcrypt (salt rounds = 10)
- Stores the hashed password in the database
- Returns the created user **without** the password

Sample request:

```json
{ "name": "Alice", "email": "alice@example.com", "password": "password123" }
```

Sample success response:

```json
{
  "success": true,
  "message": "Success",
  "data": { "id": 1, "name": "Alice", "email": "alice@example.com" },
  "timestamp": "2026-01-27T10:00:00.000Z"
}
```

### Login flow (`POST /api/auth/login`)
- Validates `email` and `password` using Zod
- Checks if the user exists
- Compares password with bcrypt
- On success, generates a JWT token (payload: user `id` + `email`)
- Token expiry is **1 hour**

Sample request:

```json
{ "email": "alice@example.com", "password": "password123" }
```

Sample success response:

```json
{
  "success": true,
  "message": "Success",
  "data": { "token": "<jwt-token>" },
  "timestamp": "2026-01-27T10:00:00.000Z"
}
```

### JWT expiry (1 hour)
The token is signed with `process.env.JWT_SECRET` and expires in **1 hour**. After expiry, the client must log in again to get a new token.

### Token storage (cookies vs localStorage)
- Cookies (HttpOnly) are safer against XSS and are commonly used for auth tokens.
- localStorage is simpler for demos but can be accessed by injected scripts if XSS exists.

### Password hashing
Passwords are never stored in plain text. We hash passwords using bcrypt so even if the database is exposed, raw passwords are not directly readable.

### Maintainability reflection
Keeping validation + auth logic consistent (Zod + global response handler + clear status codes) makes it easier for a team to extend endpoints without breaking API behavior.

## Deployment Verification & Rollback

- Health check endpoint: /api/health
- CI verifies deployment using curl
- Smoke tests using Jest
- Automatic rollback on failure

Metrics Impact:
- MTTD reduced by immediate health checks
- MTTR reduced by rollback automation
- CFR reduced by blocking bad deployments
