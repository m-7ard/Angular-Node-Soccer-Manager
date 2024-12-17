
# Angular & Node Soccer Team Manager




## Run Locally

### Setup


Clone the project

```bash
  >> git clone https://github.com/m-7ard/Angular-Node-Soccer-Manager.git
```

```bash
  In the "backend" folder, go to index.ts, and fill it with your mySQL database access data
```

**BACKEND** Install npm dependencies

```bash
  >> cd backend
  >> npm run i
  >> npm run test (optional)
  >> npm run dev (start server)
```

Go to the frontend directory

```bash
  >> cd frontend
  >> npm run i
  >> ng serve
```

## Features

- Manage Teams, Players and Team Memberships
- User auth using Jwts (using frontend interceptors for managing request authorization headers)
- Backend Integration Tests
- Layered architecture & DDD methodology
- Use of manual database migrations

## Backend Documentation

# Actions and Related Components Documentation

## Overview

This project uses **Actions** as an abstraction to encapsulate request handling logic in a clean and reusable way. Each Action is responsible for:

1. **Validating the request**.
2. **Dispatching business logic** via a request dispatcher.
3. **Generating an appropriate response**.

The overall structure promotes separation of concerns, testability, and scalability.

---

## Core Interfaces and Classes

### 1. `IAction` Interface

The `IAction` interface defines the contract for all actions.

**Purpose**: Standardize how actions are defined and used.

```typescript
interface IAction<ActionReq, ActionRes = IActionResponse> {
    handle(request: ActionReq): Promise<ActionRes>;
    bind(request: Request, response: Response): ActionReq;
}
```

#### Methods:
- **`handle(request: ActionReq): Promise<ActionRes>`**  
  Executes the action's logic and returns a response.

- **`bind(request: Request, response: Response): ActionReq`**  
  Maps an Express request to the action-specific request type (`ActionReq`).

---

### 2. `IActionResponse` Interface

Defines a response returned by an action.

```typescript
export interface IActionResponse {
    handle(res: Response): void;
}
```

#### Method:
- **`handle(res: Response): void`**  
  Handles sending the response back to the client.

---

### 3. `JsonResponse` Class

A concrete implementation of `IActionResponse` that formats responses as JSON.

**Purpose**: To simplify JSON responses for actions.

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

#### Usage:
```typescript
const response = new JsonResponse({
    status: 201,
    body: { id: "1234" }
});
response.handle(res); // Sends { id: "1234" } with HTTP status 201
```

---

## Exammple: CreatePlayerAction

### Purpose

Handles the creation of a player, including:
1. **Validation** of incoming request data.
2. **Dispatching a `CreatePlayerCommand`** to the business logic layer.
3. **Generating a success or error JSON response**.

### Implementation

```typescript
class CreatePlayerAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto } = request;

        // Validate request DTO
        const validation = createPlayerValidator(dto);
        if (validation.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.typeBoxErrorToApiErrors(validation.error),
            });
        }

        // Generate unique ID and dispatch command
        const guid = crypto.randomUUID();
        const command = new CreatePlayerCommand({
            id: guid,
            name: dto.name,
            activeSince: dto.activeSince,
        });

        const result = await this._requestDispatcher.dispatch(command);

        if (result.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.applicationErrorToApiErrors(result.error),
            });
        }

        // Return success response
        return new JsonResponse({
            status: StatusCodes.CREATED,
            body: { id: guid },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            dto: {
                name: request.body.name,
                activeSince: new Date(request.body.activeSince),
            },
        };
    }
}
```

---

## `registerAction` Utility

**Purpose**: Simplifies the wiring of actions and routes.

### Implementation

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
    const handleRequest = async (req: Request, res: Response, next: NextFunction) => {
        const action = initialiseAction(req, res);
        const arg = action.bind(req, res);

        try {
            const result = await action.handle(arg);
            result.handle(res);
        } catch (err) {
            next(err);
        }
    };

    if (method === "POST") {
        router.post(path, guards, handleRequest);
    } else if (method === "GET") {
        router.get(path, guards, handleRequest);
    } else if (method === "PUT") {
        router.put(path, guards, handleRequest);
    } else if (method === "DELETE") {
        router.delete(path, guards, handleRequest);
    }
}
```

#### Parameters:
- **`router`**: Express router instance.
- **`initialiseAction`**: A function that initializes the action (inject dependencies, etc.).
- **`path`**: URL path where the action is registered.
- **`method`**: HTTP method (`POST`, `GET`, `PUT`, `DELETE`).
- **`guards`**: Array of middleware functions for pre-processing requests (e.g., authentication).

#### Usage Example:

```typescript
registerAction({
    router: playersRouter,
    path: "/create",
    method: "POST",
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new CreatePlayerAction(requestDispatcher);
    },
});
```

---

## Example: `playersRouter`

```typescript
registerAction({
    router: playersRouter,
    path: "/:playerId",
    method: "GET",
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new ReadPlayerAction(requestDispatcher);
    },
});
```

### Actions Registered:
| Path                 | Method   | Action               |
|----------------------|----------|----------------------|
| `/create`            | `POST`   | `CreatePlayerAction` |
| `/`                  | `GET`    | `ListPlayersAction`  |
| `/:playerId/update`  | `PUT`    | `UpdatePlayerAction` |
| `/:playerId/delete`  | `DELETE` | `DeletePlayerAction` |
| `/:playerId`         | `GET`    | `ReadPlayerAction`   |

---

# Integration Test Documentation

`Here is documentation for the **integration test setup** code and its related components. This documentation is tailored for developers and testers working on this system.

---

# **Integration Test Setup Documentation**

## **Overview**
This module provides utilities to initialize, manage, and clean up integration tests in an Express-based application. It sets up a MySQL database, creates the application server, applies database migrations, and provides cleanup logic for test environments.

---

## **Exports**
The module exports three key functions and two global objects:

1. `setUpIntegrationTest` - Initializes the database and starts the test server.
2. `disposeIntegrationTest` - Cleans up resources after tests complete.
3. `resetIntegrationTest` - Resets the database state for clean test runs.
4. `db` - An instance of the `IDatabaseService` for database operations.
5. `server` - The running HTTP server instance.

---

## **Global Objects**

### **db**
- **Type:** `IDatabaseService`  
- **Description:**  
  An instance of the database service used to interact with the MySQL database for integration tests.

---

### **server**
- **Type:** `Server` (Node.js `http.Server`)  
- **Description:**  
  The running Express server instance used during tests.

---

## **Functions**

### **1. setUpIntegrationTest**
Initializes the database service, starts the Express application server, and binds middleware.

**Signature:**
```typescript
export async function setUpIntegrationTest(): Promise<void>
```

**Description:**
- Creates a new instance of the `MySQLDatabaseService` configured with test credentials.
- Starts the Express application with `responseLogger` middleware and the database instance.
- Listens on port `3000`.

**Parameters:**  
_None_

**Usage Example:**
```typescript
beforeAll(async () => {
    await setUpIntegrationTest();
});
```

---

### **2. disposeIntegrationTest**
Cleans up resources after test execution.

**Signature:**
```typescript
export async function disposeIntegrationTest(): Promise<void>
```

**Description:**
- Restores the global `console` to its original state.
- Gracefully stops the Express server.
- Closes the database connection using `db.dispose()`.

**Parameters:**  
_None_

**Usage Example:**
```typescript
afterAll(async () => {
    await disposeIntegrationTest();
});
```

---

### **3. resetIntegrationTest**
Resets the database state before running a new test suite.

**Signature:**
```typescript
export async function resetIntegrationTest(): Promise<void>
```

**Description:**
- Restores the `console` object.
- Retrieves the list of database migrations using `getMigrations`.
- Re-initializes the database schema by running all migrations.

**Parameters:**  
_None_

**Usage Example:**
```typescript
beforeEach(async () => {
    await resetIntegrationTest();
});
```

---

## **Test Lifecycle Example**

Here’s a typical test lifecycle using the provided functions:

```typescript
import { setUpIntegrationTest, disposeIntegrationTest, resetIntegrationTest } from "./testSetup";

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

    it("should create a new player", async () => {
        // Your test logic here
    });

    it("should return a list of players", async () => {
        // Your test logic here
    });
});
```


Here is the documentation for your **`createApplication`** function and its related components.

---

# **Application Factory - `createApplication`**

## **Overview**

The `createApplication` function creates and configures an Express application. It registers dependencies into a dependency injection (DI) container, configures middleware, initializes repositories, and sets up routers. It also includes error handling and static file serving.

---

## **Signature**

```typescript
export default function createApplication(config: {
    port: number;
    middleware: Array<(req: Request, res: Response, next: NextFunction) => void>;
    database: IDatabaseService;
}): Express.Application
```

---

## **Parameters**

### **`config` (Object)**
| **Property** | **Type**                                                                                  | **Description**                                      |
|--------------|-------------------------------------------------------------------------------------------|------------------------------------------------------|
| `port`       | `number`                                                                                 | Port number for the application. *(Currently unused)*|
| `middleware` | `Array<(req: Request, res: Response, next: NextFunction) => void>`                       | List of middleware functions to apply globally.      |
| `database`   | [`IDatabaseService`](#idatabaseservice)                                                  | Database service implementation for queries.         |

---

## **Dependencies**

### **1. Middleware**

- **`cors`**  
  Configures CORS to allow cross-origin resource sharing.

- **`express.json` and `express.urlencoded`**  
  Parses incoming JSON and URL-encoded request bodies.

- **Custom Middleware**  
  Configurable middleware passed via `config.middleware`.

- **`errorLogger`**  
  Custom error-handling middleware to log errors.

---

### **2. Dependency Injection (DI)**

The DI container registers the following tokens:

| **Token**                  | **Description**                                      | **Implementation**                     |
|----------------------------|------------------------------------------------------|----------------------------------------|
| `DI_TOKENS.DATABASE`       | Database service for queries and operations.         | Provided via `config.database`.        |
| `DI_TOKENS.TEAM_REPOSITORY`| Repository for team data operations.                 | `TeamRepository`                       |
| `DI_TOKENS.PLAYER_REPOSITORY`| Repository for player data operations.             | `PlayerRepository`                     |
| `DI_TOKENS.USER_REPOSITORY`| Repository for user data operations.                 | `UserRepository`                       |
| `DI_TOKENS.JWT_TOKEN_SERVICE` | Service for generating and validating JWT tokens. | `JsonWebTokenService`                  |
| `DI_TOKENS.PASSWORD_HASHER` | Service for password hashing.                       | `BcryptPasswordHasher`                 |
| `DI_TOKENS.REQUEST_DISPATCHER` | Custom request dispatcher for handling actions.  | `createRequestDispatcher()`            |

---

### **3. Routers**

The application uses the following routers:

| **Router**                | **Endpoint Prefix** | **Description**                  |
|---------------------------|---------------------|----------------------------------|
| `teamsRouter`             | `/api/teams/`       | Routes for team-related actions. |
| `playersRouter`           | `/api/players/`     | Routes for player-related actions. |
| `usersRouter`             | `/api/users/`       | Routes for user-related actions. |

---

### **4. Static File Serving**

| **Endpoint** | **Directory**     | **Description**                  |
|--------------|-------------------|----------------------------------|
| `/media`     | `media` folder    | Serves files from the `media` folder. |
| `/static`    | `static` folder   | Serves files from the `static` folder. |

---

## **Return Value**

The function returns an **Express application** instance, configured with all middleware, routers, and dependencies.

---

## **IDatabaseService Interface**

The `IDatabaseService` interface defines a contract for database operations.

```typescript
interface IDatabaseService {
    initialise(migrations: string[]): Promise<void>;
    dispose(): Promise<void>;
    query<T = ResultSetHeader>(args: { statement: string }): Promise<T[]>;
    execute<T = undefined>(args: { statement: string; parameters: Array<unknown> }): Promise<T extends undefined ? ResultSetHeader : T[]>;
}
```

| **Method**        | **Description**                                             |
|-------------------|-------------------------------------------------------------|
| `initialise`      | Initializes the database schema with migrations.           |
| `dispose`         | Closes the database connection.                            |
| `query`           | Executes a read-only query.                                |
| `execute`         | Executes a write operation with parameters.                |

---

## **Usage Example**

```typescript
import createApplication from "./createApplication";
import responseLogger from "./middleware/responseLogger";
import MySQLDatabaseService from "./infrastructure/MySQLDatabaseService";

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

---

## **Notes**

1. **Database Initialization**:  
   Ensure that the `database` service implements the `IDatabaseService` interface.

2. **Middleware Registration**:  
   All middleware provided in the `config.middleware` array will be applied globally.

3. **DI Container**:  
   Repositories and services are registered into the `diContainer` for dependency injection.

4. **Static File Serving**:  
   Place static files in the `media` and `static` directories as needed.

---
