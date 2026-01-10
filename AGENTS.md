# Repository Guidelines

## Project Structure & Module Organization

- Backend Kotlin code lives in `src/main/kotlin/com/planitsquare/schemr`, with Spring Boot configs in `src/main/resources`.
- Frontend React/TypeScript lives in `src/main/webapp`, including `app/` for UI code and `content/` for assets.
- Database migrations and seed data are in `src/main/resources/config/liquibase`.
- Tests are split into `src/test/kotlin` for backend and `*.spec.ts/tsx` under `src/main/webapp/app` for frontend.
- Docker/dev service definitions are in `src/main/docker`.

## Build, Test, and Development Commands

- `./gradlew -x webapp -x webapp_test`: run the backend locally without building the webapp.
- `npm start`: run the webpack dev server for the frontend.
- `./gradlew -Pprod clean bootJar`: build a production jar.
- `npm run webapp:build:prod`: build optimized frontend assets.
- `./gradlew test integrationTest jacocoTestReport`: run backend unit/integration tests with coverage report.
- `npm test`: run Jest frontend tests.

## Coding Style & Naming Conventions

- Indentation: 4 spaces by default; 2 spaces for TS/TSX/JS/JSON/SCSS/HTML/YAML (per `.editorconfig`).
- Kotlin/Java style is enforced via Checkstyle, Detekt, and ktlint (see `checkstyle.xml` and `detekt-config.yml`).
- Frontend style uses ESLint + Prettier (`.eslintrc.json`, `.prettierrc`), with formatting enforced by lint-staged.
- Test naming: backend tests typically end with `*Test`/`*IT`; frontend tests use `*.spec.ts/tsx`.

## Testing Guidelines

- Backend tests run through Gradle (`test`, `integrationTest`); keep coverage via `jacocoTestReport`.
- Frontend tests use Jest with config in `jest.conf.js`.
- Prefer colocated UI tests near the feature (e.g., `src/main/webapp/app/entities/.../*.spec.ts`).

## Commit & Pull Request Guidelines

- Commit messages follow Conventional Commits with scopes (examples: `feat(sql): ...`, `fix(routes): ...`).
- PRs should describe the change, list impacted areas (backend/webapp/db), and include screenshots for UI changes.
- Link related issues or tickets when applicable.

## Configuration & Security Tips

- Runtime configuration lives in `src/main/resources/config` (e.g., `application-dev.yml`, `application-prod.yml`).
- Local services can be started via Docker Compose files in `src/main/docker` (e.g., `postgresql.yml`).
