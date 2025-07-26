# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

This is a pnpm + Turbo monorepo for the 11comm智慧社区 (Smart Community) project.

### Build Commands
```bash
# Build all projects
pnpm build

# Build admin app specifically
pnpm build:admin
# or from root
pnpm -F @01s-11comm/admin build

# Build in staging mode
pnpm -F @01s-11comm/admin build:staging

# Build documentation
pnpm -F @01s-11comm/admin docs:build
```

### Development Commands
```bash
# Run admin app in development mode
pnpm -F @01s-11comm/admin dev
# or cd to apps/admin and run
cd apps/admin && pnpm dev
```

### Testing Commands
```bash
# Run tests with UI
pnpm test
# Admin-specific tests
pnpm -F @01s-11comm/admin test
```

### Linting and Formatting
```bash
# Lint and format admin app
pnpm -F @01s-11comm/admin lint

# Individual lint commands
pnpm -F @01s-11comm/admin lint:eslint
pnpm -F @01s-11comm/admin lint:prettier
pnpm -F @01s-11comm/admin lint:stylelint

# Format code
pnpm format
```

### Type Checking
```bash
# Type check admin app
pnpm -F @01s-11comm/admin typecheck
```

## Project Architecture

### Monorepo Structure
- `apps/admin/` - Main Vue3 admin application based on vue-pure-admin
- `apps/vue-pure-admin/` - Pure admin template (reference)
- `examples/` - Example applications (01s-origin, 10wms)
- Root level manages monorepo dependencies and shared configuration

### Admin App Architecture (`apps/admin/`)

**Tech Stack:**
- Vue 3 + TypeScript + Vite
- Element Plus (UI components)
- Plus Pro Components (form components)
- Pinia (state management)
- Vue Router with unplugin-vue-router (file-based routing)
- Tailwind CSS + SCSS
- Axios + @ruan-cat/utils for API requests

**Key Directories:**
- `src/api/` - API interface definitions organized by modules (c1-c7, j1-j8)
- `src/views/` - File-based routing pages
- `src/components/` - Reusable components (Re* prefix for custom components)
- `src/store/` - Pinia stores for state management
- `src/utils/` - Utility functions and HTTP configuration
- `src/router/` - Router configuration and modules
- `src/composables/` - Vue composables for shared logic

**Component Naming:**
- Custom components use "Re" prefix (ReDialog, ReDrawer, etc.)
- Components are organized by functionality in dedicated folders

**API Organization:**
- APIs are organized by business modules (c1-c7 for different areas, j1-j8 for different features)
- Uses @ruan-cat/utils for enhanced axios functionality
- Test files are co-located with API modules (.test.ts files)

**Routing:**
- File-based routing using unplugin-vue-router
- Route rank system for menu ordering (`src/router/rank/`)
- Dynamic route generation from file structure

**State Management:**
- Modular Pinia stores in `src/store/modules/`
- Includes user, app, permissions, multiTags, and custom stores

**Internationalization:**
- Vue i18n with YAML locale files in `locales/`
- Supports Chinese (zh-CN) and English (en)

### Key Technologies and Libraries

**Required Learning (per technical-doc.md):**
- lodash-es for utility functions
- Vue 3 composition API (ref, computed, watch, slots, props)
- VueUse for composables (especially useAxios)
- @ruan-cat/utils for enhanced axios wrapper
- Element Plus components (Form, Table, Dialog, Tree, etc.)
- Plus Pro Components for advanced forms
- unplugin-vue-router for file-based routing

**Architecture Patterns:**
- Monorepo with pnpm workspaces and Turbo
- File-based routing with definePage for route configuration
- Composable-driven development for shared logic
- Module-based API organization
- Component-driven UI development

## Development Workflow

1. Use pnpm for package management
2. Turbo handles build orchestration
3. File-based routing - create .vue files in src/views/ for new pages
4. Use definePage() macro for route configuration
5. API interfaces are organized by business modules
6. Follow existing component patterns (Re* prefix for custom components)
7. Use composables for shared logic
8. Co-locate test files with implementation files