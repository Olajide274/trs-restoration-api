# TRS Restoration Estimates API

REST API for managing property restoration jobs.
Built as the practical coding exercise for **Application Developer I: AI & Automation** at AllTalentz LLC.

## Project Description

This backend service allows TRS to:

- Create restoration jobs
- Retrieve jobs (with filtering and pagination)
- Update job status with validated transitions
- Calculate estimated restoration costs
- Generate structured AI-ready damage assessment payloads

## Technologies Used

- **Node.js** + **TypeScript**
- **Express**
- **PostgreSQL**
- **Prisma** (ORM)
- **Zod** (validation)
- **Jest** + **Supertest** (testing)
- **Swagger / OpenAPI**
- **Docker** + Docker Compose

## Installation

```bash
git clone <your-repo-url>
cd trs-restoration-api
npm install
```

## Configuration

Create a `.env` file in the project root (see `.env.example`):

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/trs_restoration?schema=public"
PORT=3000
NODE_ENV=development
```

| Variable       | Description                                  |
|----------------|-----------------------------------------------|
| `DATABASE_URL` | PostgreSQL connection string used by Prisma    |
| `PORT`         | Port the API server listens on                |
| `NODE_ENV`     | `development` / `production` / `test`         |

## Database Setup

This project uses Prisma to manage schema, migrations, and seed data.

```bash
# generate the Prisma client
npm run prisma:generate

# create and apply migrations
npm run prisma:migrate

# seed the database with sample jobs
npm run prisma:seed

# or run migration + seed in one step
npm run db:setup
```

> Alternatively, start Postgres via Docker: `docker-compose up -d`

## Running the Application

```bash
# development (auto-reload)
npm run dev

# production build
npm run build
npm start

# run tests
npm test
```

The API will be available at `http://localhost:3000`.

## API Documentation

Interactive Swagger/OpenAPI docs are available once the server is running:

```
http://localhost:3000/api-docs
```

### Endpoints

| Method | Endpoint                  | Description                                                                 |
|--------|----------------------------|-------------------------------------------------------------------------------|
| POST   | `/jobs`                    | Create a restoration job                                                      |
| GET    | `/jobs`                    | List jobs (filter by `status`, `damageType`; paginate with `page`, `limit`)   |
| GET    | `/jobs/:id`                | Retrieve a single job                                                         |
| PATCH  | `/jobs/:id/status`         | Update job status (validated transitions)                                     |
| POST   | `/jobs/:id/estimate`       | Calculate and persist estimated cost                                          |
| POST   | `/jobs/:id/ai-assessment`  | Generate an AI-ready damage payload                                           |

### Status Transition Rules

Valid statuses: `NEW`, `INSPECTION`, `ESTIMATING`, `PROPOSAL_SENT`, `APPROVED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`

- Jobs generally progress forward through the pipeline:
  `NEW → INSPECTION → ESTIMATING → PROPOSAL_SENT → APPROVED → IN_PROGRESS → COMPLETED`
- A job may be moved to `CANCELLED` from any non-terminal status.
- `COMPLETED` and `CANCELLED` are terminal — no transitions are allowed out of either state (e.g. `COMPLETED → ESTIMATING` and `CANCELLED → IN_PROGRESS` are rejected with a `409 Conflict`).
- Any status not in the valid list is rejected with a `400 Bad Request`.

*(Adjust this section to match the exact transition map enforced in your code.)*

## Design Decisions

- **Prisma + PostgreSQL**: chosen for type-safe queries, built-in migration tooling, and straightforward seeding — a good fit for a relational job/estimate data model.
- **Zod**: used for request validation (email format, enum checks for `damageType`/`status`, numeric checks on cost fields) to keep validation logic declarative and testable.
- **Layered structure**: routes, controllers, and data access are kept separate to make the status-transition and cost-calculation logic easy to test in isolation.
- **Consistent error shape**: all error responses follow `{ "success": false, "message": "..." }` with appropriate HTTP status codes (400 / 404 / 409 / 500).
- **AI-assessment endpoint**: does not call a real AI provider — it assembles and returns the structured payload the spec describes, demonstrating how the data would be handed off to an AI service later.

*(Expand this section with any other real trade-offs you made — e.g. in-memory vs DB choice, how you generate job IDs, pagination approach.)*
