# GEMINI Project Context: 11comm Smart Community Frontend

This document provides instructional context about the `11comm` project for AI assistants.

## Project Overview

This is the frontend monorepo for the "11comm Smart Community" project. It is built using a modern JavaScript/TypeScript stack, managed with `pnpm` workspaces and orchestrated by `Turborepo`.

The primary application is `apps/admin`, a feature-rich administration dashboard based on the popular `vue-pure-admin` template.

### Core Technologies

*   **Monorepo:** pnpm Workspaces + Turborepo
*   **Framework:** Vue.js 3
*   **UI Framework:** Element Plus
*   **Styling:** Tailwind CSS, Sass/SCSS
*   **State Management:** Pinia
*   **Routing:** Vue Router
*   **Build Tool:** Vite
*   **Testing:** Vitest
*   **Documentation:** VitePress

### Architecture

The repository is structured as a monorepo:

*   `apps/`: Contains the main application packages.
    *   `apps/admin`: The primary Vue.js admin dashboard application.
*   `examples/`: Contains example code, which is excluded from the main workspace and build pipelines.
*   `scripts/`: Contains operational scripts for the repository (e.g., deployment).
*   `package.json`: The root configuration defining shared dependencies and monorepo-wide scripts.
*   `pnpm-workspace.yaml`: Defines the structure of the pnpm workspace, including only the `apps/*` directory.
*   `turbo.json`: Configures the build system, defining task dependencies and caching strategies.

## Building and Running

### Key Commands

All commands should be run from the root of the repository.

*   **Install Dependencies:**
    ```bash
    pnpm install
    ```

*   **Run Development Server:**
    To start the `admin` application in development mode with hot-reloading:
    ```bash
    pnpm dev
    ```
    This is an alias for `pnpm -F=@01s-11comm/admin dev`.

*   **Build for Production:**
    To create a production-ready build of the `admin` application:
    ```bash
    pnpm build
    ```
    This command uses Turborepo to efficiently build the necessary packages. The output will be in `apps/admin/dist`.

*   **Run Tests:**
    To run the unit and component tests using Vitest:
    ```bash
    pnpm test
    ```

*   **Deployment:**
    The project includes a custom deployment script.
    ```bash
    pnpm deploy
    ```

*   **Documentation:**
    The project uses VitePress for documentation.
    *   To run the documentation server locally: `pnpm -F=@01s-11comm/admin docs:dev`
    *   To build the static documentation site: `pnpm -F=@01s-11comm/admin docs:build`

## Development Conventions

*   **Code Style:** The project uses `Prettier` for code formatting and `ESLint` for linting. Run `pnpm format` to format the entire codebase.
*   **Commits:** The project likely follows the Conventional Commits specification, given the presence of `commitlint` and `cz-git`. Use `pnpm commit` to create a compliant commit message.
*   **Changesets:** The project uses `changeset` for versioning and changelog generation. To add a new changeset, run `pnpm changeset:add`.
