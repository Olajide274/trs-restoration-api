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