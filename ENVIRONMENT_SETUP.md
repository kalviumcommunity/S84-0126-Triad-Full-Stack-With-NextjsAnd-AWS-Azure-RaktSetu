# Environment Setup Guide

## 1. Introduction

This document outlines the environment variables and configuration required to set up the **RaktSetu** full-stack application. Environment variables are essential for managing sensitive configuration details (like database credentials and JWT secrets) without hardcoding them in the source code.

### Security Importance
- **Never commit `.env` files**: Sensitive credentials must never be pushed to version control.
- **Environment Separation**: Maintain different variables for local development, staging, and production environments.
- **Restricted Access**: Public variables (prefixed with `NEXT_PUBLIC_`) are accessible to the browser; all other variables are server-side only.

---

## 2. Required Environment Variables

Create a file named `.env` in the root of your project and populate it with the following variables.


### 2.2 Public Variables (Browser-Accessible)

| Variable | Description | Example Value | Category |
|----------|-------------|---------------|----------|
| `NEXT_PUBLIC_API_URL` | The base URL for client-side API calls. | `http://localhost:3000` | API |

---

## 3. Local Development Setup

Follow these steps to configure your local environment for development.

### 3.1 Create Environment File
Copy the example environment file if available, or create a new one:
```bash
cp .env.example .env
```
Ensure all variables listed in Section 2 are correctly populated.

### 3.2 Database Configuration & Migrations
Once your `DATABASE_URL` is set, synchronize your database schema using Prisma:

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run migrations to set up the database schema
npx prisma migrate dev --name init
```

### 3.3 Start Development Server
Run the application in development mode:

```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

---

## 4. Production Deployment Notes

### 4.1 AWS Configuration (App Runner / Elastic Beanstalk)
- **Environment Variables**: Navigate to the **Configuration** or **Environment variables** section in the AWS Console.
- **Database**: Use AWS RDS (Postgres) and paste the RDS connection string into the `DATABASE_URL` field.
- **Build Command**: Set the build command to `npm run build`.
- **Start Command**: Set the start command to `npm start`.

### 4.2 Azure Configuration (App Service / Static Web Apps)
- **Application Settings**: In the Azure Portal, go to **Configuration** > **Application settings**.
- **Add New Setting**: Add each environment variable as a Key/Value pair.
- **Connection Strings**: For Azure Database for PostgreSQL, use the **Connection strings** section or add to Application Settings as `DATABASE_URL`.

### 4.3 Key Security Notes
- **JWT Rotation**: Rotate your `JWT_SECRET` periodically in production.
- **Direct Database Access**: Never expose your database port (5432) to the public internet; use VPCs or IP whitelisting.

---

## 5. Common Errors

### ⚠️ Database Connection Error
**Symptoms**: Error message starting with `P1001: Can't reach database server...`
**Solution**:
- Check if your PostgreSQL service is running.
- Verify the credentials in `DATABASE_URL`.
- Ensure your IP is whitelisted if using a cloud database.

### ⚠️ Missing JWT Secret
**Symptoms**: Application returns `500 Internal Server Error` during login or returns "Server error" with details about missing `JWT_SECRET`.
**Solution**:
- Ensure `JWT_SECRET` is defined in your `.env` file (local) or cloud configuration (production).
- Restart the application after adding the variable.

### ⚠️ Prisma Migration Failure
**Symptoms**: `Error: P3005: The database schema is not empty...`
**Solution**:
- If you are okay with data loss in development, run `npx prisma migrate reset`.
- Otherwise, ensure you have correctly run `npx prisma migrate deploy` for production.

---

**Last Updated**: February 11, 2026  
**Project**: RakthSetu  
**Target Architecture**: Full-Stack Next.js (PostgreSQL + Prisma)
