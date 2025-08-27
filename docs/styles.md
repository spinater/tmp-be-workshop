# NestJS Style Guide

This document defines coding standards and best practices for NestJS backend projects. Follow these conventions to keep the codebase consistent, secure, and maintainable.

## Project Structure

- Use feature-based organization for larger apps (module per feature): `src/<feature>/*` (controller, service, module, dto, entity).
- Keep shared utilities in `src/common` or `src/shared` (pipes, guards, interceptors, filters).
- Keep infra concerns in `src/config`, `src/database`, `src/auth` when appropriate.

Example layout:

```
src/
  app.module.ts
  main.ts
  users/
    users.module.ts
    users.controller.ts
    users.service.ts
    dto/
    entities/
  auth/
  common/
    guards/
    pipes/
    filters/
  config/
  database/
```

## Modules, Controllers, Services

- One module per feature. Modules group controllers, services, and providers.
- Controllers should be thin: parse request, call service, return response.
- Services contain business logic and talk to repositories/ORM.
- Prefer constructor injection for dependencies (Nest DI).
- Export providers from module only when other modules need them.

Naming:
- Modules: `UsersModule`, `AuthModule`.
- Controllers: `UsersController` (route `/users`).
- Services: `UsersService`.

## DTOs and Validation

- Use DTO classes with `class-validator` and `class-transformer`.
- Keep DTOs focused: `CreateUserDto`, `UpdateUserDto`, `LoginDto`.
- Use `ValidationPipe` globally in `main.ts` with `{ whitelist: true, forbidNonWhitelisted: true }` in production.
- Transform request payloads to DTO instances with `transform: true` when needed.

Example DTO:
```ts
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  firstname: string;
}
```

## Entities and Database (TypeORM)

- Use TypeORM entities under `entities` folder (or `src/<feature>/entities`).
- Prefer `uuid` primary keys for distributed systems: `@PrimaryGeneratedColumn('uuid')`.
- Keep entity fields minimal and use explicit column options.
- Use DTOs for input and map to entities in services — do NOT accept entities directly from controllers.
- Use transactions for multi-row updates and money/points transfers.
- For migrations, use TypeORM migrations or a migrations tool — avoid `synchronize: true` in production.

## Repositories and Queries

- Prefer repository/manager via `@InjectRepository(Entity)`.
- Encapsulate complex queries in repository methods or in the service layer.
- Avoid raw SQL unless necessary; if used, sanitize inputs and prefer parameterized queries.

## Authentication and Authorization

- Use `@nestjs/jwt` and Passport strategies for JWT auth.
- Keep secrets in environment variables and `ConfigModule`.
- Implement `JwtStrategy` and a `JwtAuthGuard` to protect routes.
- For role-based guards, implement custom `RolesGuard` and `@Roles()` decorator.
- Never store plain passwords. Use `bcrypt`/`bcryptjs` and a secure salt rounds (e.g., 10+). Do not return password hashes in responses.

## Error Handling and Response Format

- Use exception classes from Nest (`BadRequestException`, `UnauthorizedException`, etc.).
- Centralize error formatting with an `ExceptionFilter` if you need a specific response schema.
- Keep success responses consistent: include `data` and optional `message`.
- Use appropriate HTTP status codes (201 for created, 400 for validation, 401 for auth, 403 for forbidden, 404 for not found).

## Logging and Monitoring

- Use `Logger` from `@nestjs/common` or a structured logger (Winston / Pino) for production.
- Log at appropriate levels: `debug` for dev, `info` for key events, `warn` for recoverable issues, `error` for failures.
- Do not log sensitive data (passwords, tokens).

## Swagger / API Documentation

- Use `@nestjs/swagger` and decorate controllers/DTOs with `@ApiTags`, `@ApiProperty`, etc.
- Document auth using `addBearerAuth()` in `main.ts` and secure appropriate endpoints in Swagger.

## Security Best Practices

- Use HTTPS in production; terminate TLS at load balancer or ingress.
- Validate and sanitize inputs.
- Use rate limiting and CORS policies tailored to your API.
- Limit payload sizes (body parser limits).
- Keep dependencies up to date and run `npm audit` regularly.

## Testing

- Write unit tests for services and integration tests for controllers using `@nestjs/testing`.
- Use test doubles (mocks) for external services and DB where appropriate.
- Keep tests fast — use an in-memory DB or test container for integration tests.

## Configuration and Environment

- Use `@nestjs/config` for environment variables and typed config factories.
- Do not hardcode secrets; use env vars and a secrets manager in production.
- Provide `.env.example` with required keys (no secrets).

## Code Quality and Tooling

- Use ESLint + Prettier with consistent config. Use Nest ESLint recommended rules as baseline.
- Enforce type-safety and `strict` mode in tsconfig.
- Add `lint` and `format` npm scripts and run them in CI.
- Use a consistent commit style (Conventional Commits) and consider Husky for hooks.

## Concurrency and Performance

- Avoid long-running synchronous work in controllers — offload to background jobs when needed.
- Use caching (Redis) for expensive reads.
- Use pagination for list endpoints.

## Miscellaneous

- Keep controllers idempotent where applicable.
- Document public APIs in Swagger and internal behavior in code comments.
- Prefer small focused PRs; include tests and update docs when adding features.

---

Follow this guide when creating and refactoring NestJS services. It aims to balance practicality with maintainability for typical production applications.