# Proposed Redis Caching Strategy for RakthSetu

## 1. Introduction

As **RakthSetu** scales to support a growing number of donors, hospitals, and NGO partners, the backend infrastructure must transition from a direct-to-database architectural pattern to a multi-tiered data access strategy. In high-traffic blood donation platforms, database-heavy operations for real-time inventory tracking and dashboard analytics become primary performance bottlenecks.

Introducing a distributed caching layer is critical to:
- Reducing CPU and I/O pressure on the primary PostgreSQL instance.
- Achieving sub-millisecond latency for read-intensive operations.
- Serving pre-aggregated metrics that are computationally expensive to generate on-the-fly.

This document outlines a **proposed architecture enhancement** utilizing Redis to optimize the RakthSetu backend performance.

---

## 2. Why Redis?

Redis is the industry-standard choice for high-performance distributed caching due to its:
- **In-Memory Performance**: Extremely low latency (sub-millisecond) for data retrieval and storage.
- **Rich Data Structures**: Support for Hashes, Lists, and Sets allows for sophisticated caching of complex objects.
- **Time-to-Live (TTL) Support**: Native support for automatic cache expiration, essential for maintaining data freshness.
- **Pub/Sub Capabilities**: Enables real-time event distribution for cache invalidation across multiple API instances.
- **Horizontal Scalability**: Support for Redis Cluster and managed service scaling (AWS ElastiCache / Azure Cache for Redis).

---

## 3. Proposed Use Cases in RakthSetu

### 3.1 Caching Dashboard Aggregated Metrics
Aggregated stats (Total Donors, Total Units Collected, Pending Emergency Requests) currently require complex `COUNT` and `SUM` operations across multiple relational tables.
- **Benefit**: Shifts heavy aggregation load from PostgreSQL to an O(1) Redis lookup.

### 3.2 Caching Blood Inventory Data
Real-time inventory lookup (e.g., availability of "O-" in a specific region) is the most frequently accessed read path.
- **Benefit**: Ensures high-speed response times during emergency searches.

### 3.3 Caching Campaign & Event Listings
Campaign data is updated infrequently but queried often by the public.
- **Benefit**: Decreases latency for landing page data loads.

### 3.4 Session & Token Management
While currently stateless using JWTs, Redis can be used as a "Token Blacklist" or to store extended session metadata.
- **Benefit**: Enables immediate revocation of compromised tokens.

---

## 4. Cache Design Strategy

### 4.1 Cache Key Naming Convention
A structured naming convention is proposed to prevent key collisions and improve manageability:
`[resource]:[identifier]:[attribute]`

**Examples**:
- `dashboard:global:stats`
- `inventory:bloodgroup:O-negative`
- `campaign:details:512`

### 4.2 Caching Patterns
- **Read-Through**: The application first checks Redis. On a cache miss, it queries PostgreSQL, then populates Redis for future requests.
- **Write-Through/Write-Around**: On data updates (e.g., status change of a blood request), the application invalidates the corresponding Redis key or updates it directly.

### 4.3 Proposed TTL Strategy
- **Short-Lived (1-5 mins)**: Dashboard metrics and high-volatility inventory.
- **Medium-Lived (1 hour)**: User profiles and active campaign lists.
- **Long-Lived (24+ hours)**: Static metadata and historical reports.

---

## 5. Data Consistency Considerations

Maintaining consistency between the PostgreSQL source of truth and the Redis cache is paramount.

- **Stale Data Mitigation**: Implementation of aggressive TTLs ensures that data eventually converges.
- **Active Invalidation**: Utilizing Prisma middleware or service-layer hooks to trigger `DEL [key]` operations upon successful database `UPDATE` or `DELETE`.
- **Event-Driven Invalidation**: As the system grows, an event-bus (Redis Pub/Sub) can notify all application instances to purge specific local or distributed cache keys simultaneously.

---

## 6. Deployment Architecture

### 6.1 Managed Services
For production reliability and simplified operations, the proposed deployment targets:
- **AWS**: Amazon ElastiCache for Redis (Cluster Mode enabled).
- **Azure**: Azure Cache for Redis (Premium Tier).

### 6.2 Connectivity
The application instance (Next.js API route) connects to Redis via a secure connection string:
`REDIS_URL=rediss://default:secret@cache-endpoint:6379`

---

## 7. Security Considerations

- **Private Networking**: Redis instances will NOT be exposed to the public internet. Access will be restricted to the Application Subnet via VPC/VNet peering.
- **Authentication**: Usage of ACLs (Access Control Lists) with strong passwords and TLS-encrypted connections (Transit Encryption).
- **Data Minimization**: No PII (Personally Identifiable Information) in its raw form should be stored in Redis unless absolutely necessary; use identifiers or masked values.

---

## 8. Performance Impact Analysis

| Metric | Without Redis (Proposed) | With Redis (Projected) |
|--------|--------------------------|-------------------------|
| **Mean API Latency** | 150ms - 350ms | 15ms - 45ms |
| **Max Concurrent Users** | 1x | ~5x - 10x |
| **Database Load (CPU)** | 70% during peak | < 20% during peak |

---

## 9. Future Enhancement Possibilities

- **Distributed Rate Limiting**: Protecting API routes from DDoS and brute-force attacks.
- **Distributed Locking**: Preventing race conditions during inventory allocation via Redis NX locks.
- **Job Queues**: Integrating **BullMQ** or similar libraries to handle background tasks like email notifications and report generation.

---

## 10. Summary

This Redis caching strategy represents a significant step towards the next stage of **RakthSetu’s** architectural evolution. By offloading expensive read operations and aggregations from PostgreSQL to a distributed, in-memory store, we ensure the platform remains responsive and reliable during high-demand emergency scenarios.

---

**Document Status**: Proposed Architecture Enhancement  
**Drafted By**: Senior Backend Architect  
**Last Updated**: February 11, 2026  
