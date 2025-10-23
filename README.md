# Test Blog API (Junior Developer Example)

This is a simple Express + TypeScript blog API wired with MongoDB (Mongoose). It intentionally contains several security mistakes a junior developer might make. Use this repo for testing or educational purposes only.

## What I added
- `src/config/index.ts` - contains hard-coded secrets
- `src/services/db.ts` - connects to MongoDB (exits process on error)
- `src/models/User.ts` - User model that stores plaintext passwords (intentional mistake)
- `src/models/Post.ts` - Post model
- `src/middlewares/auth.ts` - JWT auth using hard-coded secret and accepting token in query params
- `src/middlewares/admin.ts` - Admin check trusting token role
- `src/routers/auth.ts` - Register/login endpoints (plaintext passwords)
- `src/routers/posts.ts` - Public list + authenticated create
- `src/routers/admin.ts` - Admin endpoints to list/promote users

## Intentional Security Issues (and fixes)
- Hard-coded JWT secret in `src/config/index.ts`.
	- Fix: Load secrets from environment variables or a secrets manager.
- Plaintext passwords stored in DB (`src/models/User.ts`).
	- Fix: Hash passwords with bcrypt/argon2 and use proper salting.
- JWT secret and tokens handled insecurely (`src/middlewares/auth.ts`).
	- Fix: Keep secret out of source, accept tokens only via Authorization header, check revocation.
- Trusting client-provided role in token for admin checks (`src/middlewares/admin.ts`).
	- Fix: Re-verify role against DB on sensitive operations.
- No rate-limiting or brute-force protections on auth endpoints.
	- Fix: Add rate-limiter middleware and account lockouts.
- Hard-coded DB URL `mongodb://localhost:27017/blogapp`.
	- Fix: Use environment configs and restrict DB network access.

## How to run
1. Install deps:

```bash
npm install
```

2. Start MongoDB locally and run:

```bash
npm run build # if needed
node dist/index.js # or use ts-node for dev
```

Note: This project is intentionally insecure. Do not deploy as-is.
