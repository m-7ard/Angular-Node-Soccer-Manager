
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

Here’s the complete **documentation** for the actions and their related components, focusing on their purpose, functionality, and usage. This document is structured to help developers understand and extend the codebase effectively.

---

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

## CreatePlayerAction

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

The `registerAction` function registers an action to an Express router.

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

The `playersRouter` is an Express router that registers all player-related actions.

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

## High-Level Flow

1. **Request** hits the registered route.
2. **`registerAction`** initializes the appropriate Action.
3. Action **binds** the request into an ActionRequest.
4. Action **validates** the request and dispatches commands (if applicable).
5. Action generates a response (e.g., `JsonResponse`) and sends it back.

---

## Conclusion

This structure allows for:
- **Decoupled request handling** through Actions.
- **Reusable response generation** with `JsonResponse`.
- **Cleaner route registration** with `registerAction`.
- Easy extensibility for adding new actions.

By following this pattern, developers can efficiently maintain and scale the API.