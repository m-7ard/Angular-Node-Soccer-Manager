# Angular & Node Soccer Team Manager Documentation

## Table of Contents
1. [Local Setup](#run-locally)
2. [Features](#features)
3. [Backend Documentation](#backend-documentation)
    - [Actions and Related Components](#actions-and-related-components-documentation)
    - [Integration Test Setup](#integration-test-setup-documentation)
    - [Application Factory](#application-factory---createapplication)

## Run Locally

### Setup

1. Clone the project
```bash
git clone https://github.com/m-7ard/Angular-Node-Soccer-Manager.git
```

2.a Launch (Docker)
```bash
    >> docker compose up
```

2.b Launch (Manually)
```bash
# Navigate to backend directory
cd backend
npm install
npm run test  # Optional
npm run dev   # Start server
```


## Features

- Manage Teams, Players, and Team Memberships
- User authentication using JWTs
- Frontend interceptors for managing request authorization headers
- Separation between Domain Models and Api Models
- Separation of concerns for data fetching in the frontend
- Global error handling
- Backend Integration Tests
- Layered architecture & Domain-Driven Design (DDD) methodology
- Manual database migrations

## Backend Documentation

### Actions and Related Components Documentation

#### Overview

This project uses **Actions** as an abstraction to encapsulate request handling logic in a clean and reusable way. Each Action is responsible for:

1. Validating the request
2. Dispatching business logic via a request dispatcher
3. Generating an appropriate response

The overall structure promotes separation of concerns, testability, and scalability.

#### Core Interfaces and Classes

##### 1. `IAction` Interface

Defines the contract for all actions:

```typescript
interface IAction<ActionReq, ActionRes = IActionResponse> {
    handle(request: ActionReq): Promise<ActionRes>;
    bind(request: Request, response: Response): ActionReq;
}
```

##### 2. `IActionResponse` Interface

Defines a response returned by an action:

```typescript
export interface IActionResponse {
    handle(res: Response): void;
}
```

##### 3. `JsonResponse` Class

A concrete implementation of `IActionResponse` that formats responses as JSON:

```typescript
class JsonResponse<T extends object | unknown[]> implements IActionResponse {
    constructor({ status, body }: { status: number; body: T }) {
        this.status = status;
        this.body = body;
    }

    handle(res: Response): void {
        res.status(this.status).json(this.body);
    }

    public status: number;
    public body: T;
}
```

##### Example: CreatePlayerAction

Demonstrates handling player creation, including validation, command dispatch, and response generation:

```typescript
class CreatePlayerAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        // Validation, command dispatch, and response generation logic
    }

    bind(request: Request): ActionRequest {
        // Request binding logic
    }
}
```

##### `registerAction` Utility

Simplifies the wiring of actions and routes:

```typescript
function registerAction({
    router,
    initialiseAction,
    path,
    method,
    guards = []
}: {
    router: Router;
    initialiseAction: (req: Request, res: Response) => IAction<unknown, IActionResponse>;
    path: string;
    method: "POST" | "GET" | "PUT" | "DELETE";
    guards?: Array<(req: Request, res: Response, next: NextFunction) => void | Promise<void>>;
}) {
    // Implementation details
}
```

### Integration Test Setup Documentation

#### Overview

Provides utilities to initialize, manage, and clean up integration tests in an Express-based application.

#### Key Functions

- `setUpIntegrationTest()`: Initializes database and test server
- `disposeIntegrationTest()`: Cleans up resources
- `resetIntegrationTest()`: Resets database state

#### Usage Example

```typescript
describe("Player API Integration Tests", () => {
    beforeAll(async () => {
        await setUpIntegrationTest();
    });

    afterAll(async () => {
        await disposeIntegrationTest();
    });

    beforeEach(async () => {
        await resetIntegrationTest();
    });

    // Test cases
});
```

### Application Factory - `createApplication`

#### Overview

Creates and configures an Express application with dependency injection, middleware, and routers.

#### Function Signature

```typescript
export default function createApplication(config: {
    port: number;
    middleware: Array<(req: Request, res: Response, next: NextFunction) => void>;
    database: IDatabaseService;
}): Express.Application
```

#### Dependency Injection Tokens

| Token | Description | Implementation |
|-------|-------------|-----------------|
| `DI_TOKENS.DATABASE` | Database service | Provided via `config.database` |
| `DI_TOKENS.TEAM_REPOSITORY` | Team data repository | `TeamRepository` |
| `DI_TOKENS.PLAYER_REPOSITORY` | Player data repository | `PlayerRepository` |
| `DI_TOKENS.USER_REPOSITORY` | User data repository | `UserRepository` |

#### Usage Example

```typescript
const db = new MySQLDatabaseService({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "adminword",
});

const app = createApplication({
    port: 3000,
    middleware: [responseLogger],
    database: db,
});

const server = app.listen(3000, () => {
    console.log("Server running on port 3000");
});
```