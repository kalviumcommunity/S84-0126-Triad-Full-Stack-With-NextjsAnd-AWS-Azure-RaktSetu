# 🛡 Threat Model

## Potential Threats

### 1. Unauthorized API Access
Mitigation:
- JWT verification
- Middleware blocking

### 2. Password Exposure
Mitigation:
- bcrypt hashing

### 3. Role Escalation
Mitigation:
- Role stored in DB
- Verified via token

### 4. Injection Attacks
Mitigation:
- Prisma ORM (parameterized queries)
- Input validation (Zod)

### 5. Production Secret Exposure
Mitigation:
- Environment variables
- No hardcoded secrets
