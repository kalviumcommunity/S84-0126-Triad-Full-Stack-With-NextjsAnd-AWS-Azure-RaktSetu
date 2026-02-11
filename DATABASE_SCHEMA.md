# Database Schema Documentation

## 1. Introduction

The **RaktSetu** database is designed to handle complex relationships between donors, recipients, blood banks, and organizations. We utilize a relational database architecture to ensure strict data integrity, which is essential for managing critical health-related information such as blood groups, emergency requests, and appointment schedules.

---

## 2. Why PostgreSQL?

PostgreSQL was chosen as the primary database engine for several key reasons:

- **ACID Compliance**: Ensures that every transaction (like booking an appointment or changing inventory status) is processed reliably and stored safely even in the event of errors or power failures.
- **Data Consistency**: Its strong typing and relational constraints prevent corrupted or orphan data.
- **Production Reliability**: As a mature, open-source database, it is highly optimized for the workloads expected in cloud environments like AWS and Azure.
- **Structured Workflows**: Relational tables are ideal for the structured data models required for blood donation workflows (e.g., linking a user to multiple donation history records).

---

## 3. Why Prisma ORM?

Prisma serves as the bridge between our Next.js API routes and the PostgreSQL database.

- **Type-Safe Queries**: Automatically generates TypeScript types based on the schema, catching errors at compile time rather than runtime.
- **Schema-Based Modeling**: Centralizes the source of truth for the entire database structure in a single `schema.prisma` file.
- **Migration Management**: Provides a predictable and version-controlled way to update the database schema across different environments.
- **Developer Productivity**: Simplifies complex joins and relationship handling with an intuitive, object-oriented API.

---

## 4. Core Database Models

### 4.1 User Model
The central entity representing donors, admin staff, and general users.
- **Fields**: `id`, `name`, `email` (Unique), `password`, `phone`, `bloodGroup`, `role` (user/admin/ngo), `createdAt`.
- **Relationships**: Parent to `Profile`, `BloodRequests`, and `Appointments`.

### 4.2 BloodRequest Model
Represents an emergency or scheduled need for blood.
- **Fields**: `id`, `bloodGroup`, `quantity`, `urgency` (Normal/High/Emergency), `status` (Pending/Fulfilled/Rejected), `note`, `createdAt`.
- **Relationships**: Linked to a `User` (the requester).

### 4.3 Appointment Model
Manages the donation and visit schedule.
- **Fields**: `id`, `date`, `time`, `location`, `status` (Scheduled/Completed/Cancelled), `createdAt`.
- **Relationships**: Linked to a `User` (the donor).

### 4.4 Campaign Model
Tracks blood donation drives and community events.
- **Fields**: `id`, `title`, `date`, `location`, `organizer`, `createdAt`.
- **Relationships**: Independent entity (typically managed by admins or NGOs).

### 4.5 BloodBank Model
Stores information about physical blood storage centers.
- **Fields**: `id`, `name`, `location`, `contact`, `availableGroups`, `createdAt`.
- **Relationships**: Independent entity storing aggregate inventory metadata.

---

## 5. Relationships & Integrity

RaktSetu utilizes relational mapping to maintain data connectivity:

- **One-to-Many (1:N)**:
    - `User` → `BloodRequests`: A single user can create multiple requests over time.
    - `User` → `Appointments`: A donor can have multiple scheduled visits.
- **One-to-One (1:1)**:
    - `User` → `Profile`: Each user has one extended profile for bio information.
- **Foreign Keys**: Enforced via Prisma relations (`userId`) with `onDelete: Cascade` to ensure that when a user is removed, their associated requests and appointments are cleaned up to maintain integrity.

---

## 6. Migration Strategy

We follow a strict migration workflow to ensure environment parity:

1. **Local Development**: Developers update `schema.prisma` and run `npx prisma migrate dev` to generate a new SQL migration file.
2. **Version Control**: Migration files are committed to Git, acting as a historical record of schema changes.
3. **Production/CI**: During deployment, `npx prisma migrate deploy` is executed to apply pending migrations to the production PostgreSQL instance without resetting the data.

---

## 7. Indexing & Performance

- **Unique Constraints**: The `email` field in the `User` model and `userId` in `Profile` are indexed uniquely to ensure rapid lookup during authentication.
- **Relational Indexing**: Foreign keys are indexed by PostgreSQL to optimize the speed of "Include" queries (e.g., fetching a user along with all their blood requests).
- **Automated Management**: Prisma handles the creation of these indexes based on the model definitions.

---

## 8. Summary

The database schema of **RaktSetu** is designed to be secure, structured, and scalable. By leveraging PostgreSQL's relational power and Prisma's modern ORM capabilities, we ensure a robust foundation for coordinating life-saving blood donation activities.

---

**Last Updated**: February 11, 2026  
**Project**: RakthSetu  
**Schema Version**: 2.1 (Post-Migrations)  
