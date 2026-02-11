# Deployment Guide

## 1. Introduction

This guide provides step-by-step instructions for deploying the **RaktSetu** full-stack application. RaktSetu is built with the Next.js App Router, PostgreSQL, and Prisma ORM. The instructions cover local setup as well as production deployments on **AWS** and **Azure**.

---

## 2. Environment Variables Required

Before deploying, ensure you have the following environment variables configured in your deployment environment.

| Variable | Description | Recommendation |
|----------|-------------|----------------|
| `DATABASE_URL` | PostgreSQL connection string. | Use a managed DB (RDS/Azure DB for Postgres) |
| `JWT_SECRET` | Secret key for signing authentication tokens. | Use a long, random string. |
| `NODE_ENV` | Application environment mode. | Set to `production` for all deployments. |
| `NEXT_PUBLIC_API_URL` | Base URL for API requests. | The public URL of your deployment. |

---

## 3. Local Deployment Steps

To run the production build locally for testing:

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Setup Database**:
   Ensure your `.env` has a valid `DATABASE_URL`, then run:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```
3. **Build and Start**:
   ```bash
   npm run build
   npm start
   ```

---

## 4. AWS Deployment Guide (App Runner / ECS)

### 4.1 Setting Environment Variables
- Navigate to the **AWS Management Console** > **App Runner** (or ECS).
- Under **Configuration**, locate the **Environment variables** section.
- Add `DATABASE_URL`, `JWT_SECRET`, and `NODE_ENV=production`.

### 4.2 Database Configuration (AWS RDS)
- Create an **Amazon RDS for PostgreSQL** instance.
- Ensure the Security Group allows inbound traffic from your application's security group on port 5432.
- Use the provided RDS endpoint to construct your `DATABASE_URL`.

### 4.3 Production Notes
- Use **AWS Secrets Manager** for `JWT_SECRET` if high security is required.
- Enable **Auto-scaling** to handle traffic spikes during emergency blood requests.

---

## 5. Azure Deployment Guide (App Service)

### 5.1 App Service Configuration
- Create a new **Web App** in the Azure Portal choosing the Node.js runtime.
- Go to **Settings** > **Configuration** > **Application settings**.
- Add each environment variable as a new application setting.

### 5.2 Environment Setup (Azure Database for PostgreSQL)
- Provision an **Azure Database for PostgreSQL flexible server**.
- Under **Networking**, enable "Allow public access from any Azure service within Azure" to allow the App Service to connect.
- Copy the connection string and update your application's `DATABASE_URL`.

---

## 6. Security Notes

- **HTTPS Only**: Ensure your cloud provider enforces HTTPS redirection.
- **Secrets Management**: Never commit your `.env` file to version control.
- **Database Access**: Restrict database access to only the application's IP addresses using firewalls/VPCs.
- **Audit Logs**: Enable logging in AWS CloudWatch or Azure Monitor to track deployment health and security events.

---

## 7. Common Deployment Errors

### ⚠️ Prisma Migration Failed
**Error**: `P3005: The database schema is not empty...`
**Solution**: Ensure you use `npx prisma migrate deploy` in production, which applies migrations without resetting the database.

### ⚠️ Database Connection Timeout
**Error**: `P1001: Can't reach database server...`
**Solution**: Check firewall rules in AWS/Azure. Ensure the database port (5432) is open to the application service.

### ⚠️ 401 Unauthorized on API
**Error**: Token validation fails immediately after deployment.
**Solution**: Ensure the `JWT_SECRET` matches between your local dev (for testing) and the production environment.

---

**Last Updated**: February 11, 2026  
**Project**: RakthSetu  
**Version**: 1.0.0  
