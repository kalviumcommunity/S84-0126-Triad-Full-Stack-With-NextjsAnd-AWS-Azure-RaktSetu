# Contributing Guidelines

Thank you for your interest in contributing to **RaktSetu**! To maintain a high-quality codebase and ensure smooth collaboration, we follow a set of standards and processes outlined below.

---

## 1. Branch Naming Convention

We use a prefix-based naming convention to categorize changes. All branch names should be lowercase and hyphen-separated.

| Prefix | Usage | Example |
|--------|-------|---------|
| `feat/` | New features or functionality | `feat/blood-request-api` |
| `fix/` | Bug fixes | `fix/auth-token-expiry` |
| `docs/` | Documentation updates | `docs/update-api-specs` |
| `refactor/` | Code refactoring without functionality changes | `refactor/prisma-client` |
| `perf/` | Performance optimizations | `perf/query-optimization` |
| `test/` | Adding or updating tests | `test/user-service-smoke` |

---

## 2. Commit Message Format

We follow the **Conventional Commits** specification. This helps in generating automated changelogs and understanding the project history.

**Format**: `<type>(<scope>): <description>`

- **type**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.
- **scope**: Optional; indicates the part of the project (e.g., `auth`, `api`, `db`).
- **description**: Short, imperative mood description (e.g., "add login endpoint").

**Example**: `feat(auth): implement JWT cookie storage`

---

## 3. Pull Request Process

1. **Synchronize**: Ensure your branch is up to date with `main`.
2. **Push**: Push your changes to your feature branch.
3. **Open PR**: Create a Pull Request against the `main` branch.
4. **Description**: Use the PR template to describe:
   - What changes were made.
   - Any breaking changes.
   - How to test the changes.
5. **Checks**: Ensure all CI checks (linting, tests) pass before requesting a review.

---

## 4. Code Review Guidelines

- **Respectful Feedback**: Provide constructive, polite, and actionable feedback.
- **Approval Logic**: At least one approval from a lead developer is required for merging.
- **Self-Review**: Before requesting a review, read through your own code to catch obvious issues like console logs or commented-out code.

---

## 5. Backend Coding Standards

As a full-stack Next.js project with Prisma, we adhere to the following standards:

- **Type Safety**: Use TypeScript for all backend logic. Avoid the `any` type.
- **Validation**: Every API endpoint must validate its input using **Zod** schemas found in `src/lib/schemas/`.
- **Error Handling**: Use the centralized `handleError` and `sendError` utilities for consistent responses.
- **ORM Usage**: Use Prisma Client for all database interactions. Avoid writing raw SQL unless absolutely necessary.
- **Naming**: Use `camelCase` for variables/functions and `PascalCase` for classes/types.

---

## 6. Environment Setup Before Contributing

Ensure your environment matches the project requirements:
1. **Node.js**: Version 18 or higher.
2. **Local Database**: Have a running PostgreSQL instance.
3. **Env Configuration**: Create a `.env` file based on `ENVIRONMENT_SETUP.md`.
4. **Prisma**: Run `npx prisma generate` after installing dependencies.
5. **Testing**: Run `npm test` to verify your environment is working correctly.

---

## 7. Best Practices

- **Atomic Commits**: Keep commits focused on a single logical change.
- **Don't Repeat Yourself (DRY)**: Abstract common logic into the `src/lib/` folder.
- **Data Minimization**: Never return sensitive fields (like passwords) in API responses.
- **Security First**: Always check for role-based permissions in the middleware or API handler.

---

**Last Updated**: February 11, 2026  
**Project**: RakthSetu  
**Team**: Backend / DevOps
