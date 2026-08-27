# Vehicle Control API

RESTful API for managing corporate vehicle usage, built with Node.js, TypeScript and Express.

## Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript (strict mode)
- **Framework**: Express 5
- **Validation**: Zod
- **Testing**: Jest + Supertest (50 tests, 6 suites)
- **Documentation**: Swagger UI
- **Linting**: ESLint 9 + Prettier
- **Container**: Docker (multi-stage build)

## Getting Started

### Prerequisites

- Node.js >= 20
- npm >= 10

### Install and Run

```bash
git clone https://github.com/LisboaFred/vehicle-control-api.git
cd vehicle-control-api
npm install
cp .env.example .env
npm run dev
```

The server starts at `http://localhost:3000`.

### Docker

```bash
docker build -t vehicle-control-api .
docker run -p 3000:3000 vehicle-control-api
```

## API Documentation

| Resource | URL |
|---|---|
| Swagger UI | http://localhost:3000/api-docs |
| Health Check | http://localhost:3000/api/health |
| Web Interface | http://localhost:3000 |

## Endpoints

All list endpoints support pagination via `?page=1&limit=10`.

### Automobiles `/api/automobiles`

| Method | Route | Description |
|---|---|---|
| POST | `/api/automobiles` | Create automobile |
| GET | `/api/automobiles` | List (filters: `color`, `brand`) |
| GET | `/api/automobiles/:id` | Get by ID |
| PUT | `/api/automobiles/:id` | Update |
| DELETE | `/api/automobiles/:id` | Delete |

### Drivers `/api/drivers`

| Method | Route | Description |
|---|---|---|
| POST | `/api/drivers` | Create driver |
| GET | `/api/drivers` | List (filter: `name`) |
| GET | `/api/drivers/:id` | Get by ID |
| PUT | `/api/drivers/:id` | Update |
| DELETE | `/api/drivers/:id` | Delete |

### Usages `/api/usages`

| Method | Route | Description |
|---|---|---|
| POST | `/api/usages` | Start usage |
| PATCH | `/api/usages/:id/finish` | Finish usage |
| GET | `/api/usages` | List with details (filter: `driverId`) |

## Business Rules

- A vehicle can only be used by one driver at a time.
- A driver with an active usage cannot use another vehicle.
- Duplicate license plates are not allowed.
- Vehicles and drivers with active usage cannot be deleted.

## Architecture

```
src/
├── app.ts                    # Express configuration
├── server.ts                 # Entry point + graceful shutdown
├── config/                   # Environment variables
├── controllers/              # HTTP layer
├── services/                 # Business logic
├── repositories/             # Data persistence (in-memory)
├── models/                   # TypeScript interfaces
├── schemas/                  # Zod validation schemas
├── middlewares/               # Error handler, validation, request-id
├── errors/                   # Typed error hierarchy
├── docs/                     # Swagger specification
└── utils/                    # Logger, pagination

public/                       # Web interface (HTML/CSS/JS)
```

The persistence layer uses in-memory arrays. The repository pattern allows swapping to a database (TypeORM, Prisma) without changing service or controller logic.

## Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:cov      # Coverage report
```

## Security

- **Helmet** for HTTP headers hardening
- **CORS** configurable via `CORS_ORIGIN` env variable
- **Rate limiting** on API routes (100 requests / 15 min per IP)
- **Request ID** tracking via `X-Request-Id` header

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Server port |
| `CORS_ORIGIN` | `*` | Allowed CORS origin |

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Development server (hot-reload) |
| `npm run build` | Compile TypeScript |
| `npm start` | Production server |
| `npm test` | Run all tests |
| `npm run test:cov` | Tests with coverage |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier format |

## License

ISC
