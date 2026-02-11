# RaktSetu Backend Documentation

## 1. Project Overview

**RaktSetu** is a real-time blood donation and inventory management platform designed to solve blood shortages by improving coordination between donors, hospitals, and NGOs. The backend serves as the core business logic layer that manages user authentication, blood requests, appointments, campaigns, and blood bank inventory.

### Role of the Backend
- Process and validate API requests
- Manage user authentication and authorization
- Handle database operations through Prisma ORM
- Enforce role-based access control
- Provide RESTful APIs for frontend consumption
- Maintain data integrity and security

---

## 2. Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.1.6 |
| **Runtime** | Node.js | Latest |
| **Database** | PostgreSQL | - |
| **ORM** | Prisma | 6.19.2 |
| **Authentication** | JWT (JSON Web Tokens) | 9.0.3 |
| **Password Hashing** | bcryptjs | 3.0.3 |
| **Validation** | Zod | 4.3.6 |
| **Deployment** | AWS / Azure | - |
| **Containerization** | Docker | - |

---

## 3. Backend Architecture

### 3.1 Directory Structure

```
src/
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── users/           # User management
│   │   ├── requests/        # Blood request endpoints
│   │   ├── appointments/    # Appointment management
│   │   ├── campaigns/       # Campaign endpoints
│   │   ├── blood-banks/     # Blood bank endpoints
│   │   ├── admin/           # Admin endpoints
│   │   ├── profile/         # User profile
│   │   └── settings/        # Settings
│   ├── [page]/              # Frontend pages
│   └── layout.tsx           # Root layout
├── lib/
│   ├── prisma.ts           # Prisma client singleton
│   ├── errorHandler.ts     # Error handling utility
│   ├── responseHandler.ts  # Response formatting utility
│   ├── errorCodes.ts       # Error code constants
│   ├── logger.ts           # Logging utility
│   ├── transactions.ts     # Database transaction helpers
│   └── schemas/            # Zod validation schemas
├── components/             # React components
├── context/               # React context providers
└── hooks/                 # Custom React hooks

prisma/
├── schema.prisma          # Database schema
├── migrations/            # Database migrations
└── seed.js               # Database seeding script
```

### 3.2 Request Lifecycle

```
Client Request
    ↓
Middleware (middleware.ts)
    ├─ Route protection
    ├─ Token validation
    └─ Role-based authorization
    ↓
API Route Handler (src/app/api/**/route.ts)
    ├─ Parse and validate input (Zod schemas)
    ├─ Extract user context from JWT
    └─ Execute business logic
    ↓
Prisma ORM
    ├─ Database query/mutation
    └─ Handle relationships
    ↓
Response Handler
    ├─ Format response (success/error)
    └─ Add metadata (timestamp, status)
    ↓
Client Response (JSON)
```

### 3.3 Middleware Architecture

The Express-like middleware (defined in `middleware.ts`) handles:

1. **Frontend Route Protection**: Redirects unauthenticated users to login page
2. **API Route Authorization**: Validates JWT tokens for API endpoints
3. **Token Sources**: Accepts tokens from:
   - `Authorization` header (Bearer token)
   - Cookies (primary source of truth)

Protected API routes require valid JWT tokens. Invalid or missing tokens return `401 Unauthorized`.

---

## 4. Database Layer

### 4.1 PostgreSQL Overview

RaktSetu uses PostgreSQL as the relational database with Prisma ORM for type-safe database access.

### 4.2 Prisma Schema & Models

#### User Model
```typescript
model User {
  id           Int
  name         String
  email        String (unique)
  phone        String?
  bloodGroup   String?
  password     String (hashed)
  role         String (default: "user")
  createdAt    DateTime
  
  // Relations
  profile      Profile?
  projects     Project[]
  bloodRequests BloodRequest[]
  appointments Appointment[]
}
```

#### BloodRequest Model
```typescript
model BloodRequest {
  id         Int
  userId     Int (foreign key)
  bloodGroup String
  quantity   Int
  urgency    String (default: "Normal")
  note       String?
  status     String (default: "Pending")
  createdAt  DateTime
  
  // Relations
  user       User (foreign key)
}
```

#### Appointment Model
```typescript
model Appointment {
  id        Int
  userId    Int (foreign key)
  date      String
  time      String
  location  String
  status    String (default: "Scheduled")
  createdAt DateTime
  
  // Relations
  user      User (foreign key)
}
```

#### Campaign Model
```typescript
model Campaign {
  id        Int
  title     String
  date      String
  location  String
  organizer String
  createdAt DateTime
}
```

#### BloodBank Model
```typescript
model BloodBank {
  id              Int
  name            String
  location        String
  contact         String
  availableGroups String?
  createdAt       DateTime
}
```

### 4.3 Relationships

- **One-to-Many**: User → BloodRequests, Appointments, Projects
- **One-to-One**: User → Profile
- **Foreign Keys**: Cascade delete enabled for data consistency

### 4.4 Migrations

Database migrations are stored in `prisma/migrations/`. Key migrations:
- Initial schema setup
- Blood requests and appointments addition
- Campaign and blood bank features

To run migrations:
```bash
npx prisma migrate deploy
```

To create a new migration:
```bash
npx prisma migrate dev --name migration_name
```

---

## 5. Authentication & Authorization

### 5.1 JWT-Based Authentication

**Token Format:**
```typescript
{
  id: number,      // User ID
  email: string,   // User email
  role: string,    // User role
  iat: number,     // Issued at
  exp: number      // Expires in 1 hour
}
```

**Token Generation (Login)**
```typescript
const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);
```

### 5.2 Token Storage

Tokens are stored in **httpOnly cookies** (source of truth):
```typescript
response.cookies.set("token", token, {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 3600
});
```

### 5.3 Protected Routes

Protected API routes check for valid JWT tokens in middleware before processing requests.

**Example validation:**
```typescript
const secret = process.env.JWT_SECRET;
const decoded = jwt.verify(token, secret);
// decoded contains { id, email, role }
```

### 5.4 Role-Based Access Control

User roles include:
- **user**: Standard donor/patient
- **admin**: Administrator with elevated privileges
- **ngo**: NGO/Blood bank staff

Role validation is enforced in individual API routes based on business requirements.

---

## 6. API Endpoints

### 6.1 Authentication (`/api/auth/*`)

#### POST `/api/auth/login`
- **Purpose**: Authenticate user and return JWT token
- **Auth Required**: No
- **Request Body**: 
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: `{ success: true, data: { token: "jwt_token" } }`
- **Status**: 200 (success), 400 (validation), 404 (not found), 401 (invalid password)

#### POST `/api/auth/signup`
- **Purpose**: Register a new user
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "bloodGroup": "O+"
  }
  ```
- **Response**: `{ success: true, data: { user: {...} } }`
- **Status**: 201 (created), 400 (validation), 409 (user exists)

---

### 6.2 Users (`/api/users/*`)

#### GET `/api/users`
- **Purpose**: List all users
- **Auth Required**: Yes (admin/ngo)
- **Response**: `{ success: true, data: [{ id, name, email, ... }] }`

#### GET `/api/users/[id]`
- **Purpose**: Get user by ID
- **Auth Required**: Yes
- **Response**: `{ success: true, data: { id, name, email, ... } }`

#### PUT `/api/users/[id]`
- **Purpose**: Update user information
- **Auth Required**: Yes (own user or admin)
- **Request Body**: `{ name?, email?, bloodGroup?, phone? }`
- **Response**: `{ success: true, data: { id, ... } }`

#### DELETE `/api/users/[id]`
- **Purpose**: Delete a user
- **Auth Required**: Yes (admin)
- **Response**: `{ success: true, message: "User deleted" }`

---

### 6.3 Blood Requests (`/api/requests/*`)

#### POST `/api/requests`
- **Purpose**: Create a blood request
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "bloodGroup": "O+",
    "quantity": 2,
    "urgency": "High",
    "note": "Emergency"
  }
  ```
- **Response**: `{ success: true, data: { id, userId, status: "Pending", ... } }`

#### GET `/api/requests`
- **Purpose**: Get blood requests (filters by user role)
- **Auth Required**: Yes
- **Response**: `{ success: true, data: [{ id, bloodGroup, quantity, status, ... }] }`

#### GET `/api/requests/[id]`
- **Purpose**: Get specific blood request
- **Auth Required**: Yes
- **Response**: `{ success: true, data: { id, ... } }`

#### PUT `/api/requests/[id]`
- **Purpose**: Update blood request status
- **Auth Required**: Yes (owner or admin)
- **Request Body**: `{ status: "Fulfilled" | "Pending" | "Rejected" }`

#### DELETE `/api/requests/[id]`
- **Purpose**: Delete blood request
- **Auth Required**: Yes (owner or admin)

---

### 6.4 Appointments (`/api/appointments/*`)

#### POST `/api/appointments`
- **Purpose**: Schedule an appointment
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "date": "2026-02-15",
    "time": "10:30",
    "location": "Main Blood Bank"
  }
  ```
- **Response**: `{ success: true, data: { id, status: "Scheduled", ... } }`

#### GET `/api/appointments`
- **Purpose**: Get appointments for logged-in user
- **Auth Required**: Yes

#### PUT `/api/appointments/[id]`
- **Purpose**: Update appointment (reschedule, cancel)
- **Auth Required**: Yes (owner)

#### DELETE `/api/appointments/[id]`
- **Purpose**: Cancel appointment
- **Auth Required**: Yes (owner)

---

### 6.5 Campaigns (`/api/campaigns/*`)

#### POST `/api/campaigns`
- **Purpose**: Create campaign (admin/ngo)
- **Auth Required**: Yes (admin/ngo)
- **Request Body**:
  ```json
  {
    "title": "World Blood Donor Day",
    "date": "2026-06-14",
    "location": "City Center",
    "organizer": "Red Cross"
  }
  ```

#### GET `/api/campaigns`
- **Purpose**: List all campaigns
- **Auth Required**: No

#### GET `/api/campaigns/[id]`
- **Purpose**: Get campaign details
- **Auth Required**: No

#### PUT `/api/campaigns/[id]`
- **Purpose**: Update campaign
- **Auth Required**: Yes (admin/organizer)

#### DELETE `/api/campaigns/[id]`
- **Purpose**: Delete campaign
- **Auth Required**: Yes (admin)

---

### 6.6 Blood Banks (`/api/blood-banks/*`)

#### GET `/api/blood-banks`
- **Purpose**: List all blood banks
- **Auth Required**: No
- **Response**: `{ success: true, data: [{ id, name, location, availableGroups, ... }] }`

#### POST `/api/blood-banks`
- **Purpose**: Register blood bank
- **Auth Required**: Yes (admin)
- **Request Body**:
  ```json
  {
    "name": "Central Blood Bank",
    "location": "Downtown",
    "contact": "+1234567890",
    "availableGroups": "O+,O-,A+,A-"
  }
  ```

#### GET `/api/blood-banks/[id]`
- **Purpose**: Get blood bank details
- **Auth Required**: No

#### PUT `/api/blood-banks/[id]`
- **Purpose**: Update blood bank info
- **Auth Required**: Yes (admin/ngo)

#### DELETE `/api/blood-banks/[id]`
- **Purpose**: Delete blood bank
- **Auth Required**: Yes (admin)

---

### 6.7 Profile (`/api/profile/*`)

#### GET `/api/profile`
- **Purpose**: Get logged-in user's profile
- **Auth Required**: Yes

#### POST `/api/profile`
- **Purpose**: Create/update profile bio
- **Auth Required**: Yes

---

### 6.8 Admin (`/api/admin/*`)

#### GET `/api/admin/stats`
- **Purpose**: Get system statistics (total users, requests, etc.)
- **Auth Required**: Yes (admin)

#### GET `/api/admin/users`
- **Purpose**: List all users with metadata
- **Auth Required**: Yes (admin)

---

## 7. Error Handling

### 7.1 Error Response Format

All error responses follow consistent structure:
```json
{
  "success": false,
  "message": "User-friendly error message",
  "error": {
    "code": "ERROR_CODE",
    "details": { ... }
  },
  "timestamp": "2026-02-11T10:30:45.123Z"
}
```

### 7.2 HTTP Status Codes

| Status | Code | Meaning |
|--------|------|---------|
| **200** | OK | Request successful |
| **201** | CREATED | Resource created successfully |
| **400** | VALIDATION_ERROR | Invalid input data |
| **401** | UNAUTHORIZED | Missing or invalid token |
| **403** | FORBIDDEN | Insufficient permissions |
| **404** | NOT_FOUND | Resource not found |
| **409** | CONFLICT | Resource already exists (e.g., duplicate email) |
| **500** | INTERNAL_ERROR | Server error |

### 7.3 Error Codes

```typescript
VALIDATION_ERROR    // Input validation failed
NOT_FOUND          // Resource not found
DATABASE_FAILURE   // Database operation failed
INTERNAL_ERROR     // Unexpected server error
```

### 7.4 Error Handling Flow

1. **Try-Catch Block**: Wraps all async operations
2. **Zod Validation**: Validates request body schema
3. **Error Logging**: Logs full error details internally
4. **User Response**: Returns safe, user-friendly message (production), or detailed error (development)

---

## 8. Security Considerations

### 8.1 Token Validation

- **JWT Secret**: Stored in `JWT_SECRET` environment variable
- **Token Expiration**: 1 hour
- **Validation**: Checked on every protected API route

### 8.2 Password Security

- **Hashing**: bcryptjs with salt rounds (10)
- **Storage**: Passwords never sent in responses
- **Comparison**: Bcrypt constant-time comparison prevents timing attacks

### 8.3 Protected Routes

All sensitive endpoints require valid JWT token:
```typescript
const token = req.cookies.get("token")?.value;
if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```

### 8.4 Data Access Restrictions

- **Users**: Can only access their own data unless admin
- **Admins**: Can access all data
- **Blood Requests**: Users see their own; admins/ngos see relevant requests
- **Appointments**: Each user sees only their own

### 8.5 HTTPS & Secure Cookies

- **Production**: Secure cookies with `secure: true` flag
- **Development**: Cookies work over HTTP for testing
- **SameSite**: Set to `lax` to prevent CSRF attacks

### 8.6 Input Validation

All inputs validated with Zod schemas before database operations:
```typescript
const parsed = loginSchema.safeParse(body);
if (!parsed.success) {
  return sendError("Invalid input", VALIDATION_ERROR, 400);
}
```

---

## 9. Deployment Notes

### 9.1 Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/raktsetu

# Authentication
JWT_SECRET=your-secret-key-here

# Application
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.raktsetu.com

# Optional: Cloud Providers
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
# OR
AZURE_SUBSCRIPTION_ID=xxx
AZURE_RESOURCE_GROUP=xxx
```

### 9.2 Database Setup

1. **Create PostgreSQL Database**: Ensure PostgreSQL is running
2. **Set DATABASE_URL**: Configure connection string
3. **Run Migrations**: 
   ```bash
   npx prisma migrate deploy
   ```
4. **Seed Data (Optional)**:
   ```bash
   npx prisma db seed
   ```

### 9.3 Build & Deployment

```bash
# Install dependencies
npm install

# Build application
npm run build

# Start production server
npm start
```

### 9.4 Docker Deployment

**Build Docker image:**
```bash
docker build -t raktsetu-backend .
```

**Run container:**
```bash
docker run -e DATABASE_URL="..." -e JWT_SECRET="..." -p 3000:3000 raktsetu-backend
```

### 9.5 AWS Deployment

- **Service**: AWS App Runner / EC2 / ECS
- **Database**: AWS RDS (PostgreSQL)
- **Storage**: S3 for file uploads (if needed)
- **CDN**: CloudFront for static assets

### 9.6 Azure Deployment

- **Service**: Azure App Service
- **Database**: Azure Database for PostgreSQL
- **Storage**: Azure Blob Storage
- **CDN**: Azure Front Door

### 9.7 Smoke Tests

Verify deployment health with provided smoke tests:
```bash
npm run smoke:local    # Local environment
npm run smoke:deploy   # Deployed environment
```

---

## 10. Development Guidelines

### 10.1 Creating New API Routes

1. Create file: `src/app/api/resource/route.ts`
2. Implement handler: `GET`, `POST`, `PUT`, `DELETE`
3. Validate input with Zod schema
4. Use `sendSuccess()` and `sendError()` helpers
5. Wrap in try-catch with `handleError()`

### 10.2 Prisma Usage

```typescript
import { prisma } from "@/lib/prisma";

// Single instance across app
const user = await prisma.user.findUnique({ where: { id: 1 } });
const created = await prisma.bloodRequest.create({ data: {...} });
const updated = await prisma.user.update({ where: {...}, data: {...} });
const deleted = await prisma.appointment.delete({ where: {...} });
```

### 10.3 Running Tests

```bash
npm test           # Run all tests
npm run smoke      # Run smoke tests
npm run lint       # Run ESLint
```

### 10.4 Development Server

```bash
npm run dev        # Start with hot reload
```

---

## 11. Troubleshooting

| Issue | Solution |
|-------|----------|
| **401 Unauthorized** | Check token validity, ensure `JWT_SECRET` is set |
| **Database connection failed** | Verify `DATABASE_URL`, ensure PostgreSQL is running |
| **Migration error** | Run `npx prisma migrate reset` (clears data) or `npx prisma migrate deploy` |
| **Prisma client not found** | Run `npm install && npm run postinstall` |
| **CORS errors** | Configure allowed origins in middleware |

---

## 12. Additional Resources

- **Prisma Docs**: https://www.prisma.io/docs/
- **Next.js API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **JWT**: https://jwt.io/introduction
- **PostgreSQL**: https://www.postgresql.org/docs/
- **bcryptjs**: https://github.com/dcodeIO/bcrypt.js

---

**Last Updated**: February 11, 2026  
**Version**: 1.0  
**Maintained by**: Backend Team (Aryaman)