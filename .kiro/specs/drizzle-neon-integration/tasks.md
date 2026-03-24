# Implementation Plan

## 1. Install Dependencies and Configure Environment

- [ ] 1.1 Install Drizzle ORM and Neon dependencies
  - Add `drizzle-orm` and `@neondatabase/serverless` to production dependencies
  - Add `drizzle-kit` to development dependencies
  - Run `pnpm install` to install packages
  - _Requirements: 2.1, 2.3_

- [ ] 1.2 Configure environment variables
  - Create `.env.example` with `DATABASE_URL` template
  - Update `.gitignore` to exclude `.env` files
  - Add `DATABASE_URL` to actual `.env` file (user provides Neon connection string)
  - _Requirements: 6.1, 6.3_

- [ ] 1.3 Create Drizzle configuration file
  - Create `apps/admin/drizzle.config.ts` with schema and migration paths
  - Configure PostgreSQL dialect and Neon connection
  - _Requirements: 2.3, 2.4_

## 2. Create Database Schema and Client

- [ ] 2.1 Create database client module
  - Create `apps/admin/server/database/client.ts`
  - Implement Neon connection with environment variable validation
  - Export typed Drizzle instance
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 2.2 Write property test for database connection
  - **Property 1: Database Connection Establishment**
  - Test that valid connection strings establish connections successfully
  - Test that invalid configurations throw descriptive errors
  - **Validates: Requirements 1.1, 1.2, 1.3**

- [ ] 2.3 Create ConfigCenter schema definition
  - Create `apps/admin/server/database/schema/config-center.ts`
  - Define table schema matching `ConfigCenterListItem` interface
  - Export table and inferred types
  - _Requirements: 2.1, 3.1_

- [ ] 2.4 Write property test for schema-type alignment
  - **Property 2: Schema-Type Alignment**
  - Verify all TypeScript interface fields have corresponding schema columns
  - **Validates: Requirements 2.1, 3.1**

- [ ] 2.5 Create schema index file
  - Create `apps/admin/server/database/schema/index.ts`
  - Export all schema definitions
  - _Requirements: 2.1_

## 3. Implement Database Query Utilities

- [ ] 3.1 Create database query helper module
  - Create `apps/admin/server/utils/db-query.ts`
  - Implement `buildFilters` function for dynamic WHERE clause construction
  - Implement pagination helper functions
  - _Requirements: 4.1, 4.5_

- [ ] 3.2 Write property test for filter translation
  - **Property 6: Filter Translation Correctness**
  - Test string fields use fuzzy matching (LIKE)
  - Test other fields use exact matching (=)
  - **Validates: Requirements 4.5**

- [ ] 3.3 Write property test for pagination
  - **Property 5: Pagination Correctness**
  - Test returned results respect pageSize limit
  - Test total count reflects actual matching records
  - **Validates: Requirements 4.1**

## 4. Checkpoint - Verify Database Infrastructure

- [ ] 4. Checkpoint - Make sure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## 5. Generate and Apply Database Migrations

- [ ] 5.1 Generate initial migration
  - Run `npx drizzle-kit generate` to create migration files
  - Review generated SQL in `server/database/migrations/`
  - _Requirements: 2.3_

- [ ] 5.2 Apply migration to Neon database
  - Run `npx drizzle-kit push` to apply schema to database
  - Verify table creation in Neon console
  - _Requirements: 2.4_

- [ ] 5.3 Create database seed script
  - Create `apps/admin/server/database/seed.ts`
  - Import existing mock data from `mock-data.ts` files
  - Insert mock data into database tables
  - _Requirements: 3.2_

## 6. Refactor API Handlers to Use Database

- [ ] 6.1 Refactor ConfigCenter list API
  - Update `apps/admin/server/api/dev-team/config-manage/center/list.post.ts`
  - Replace mock data import with database query
  - Use `buildFilters` for dynamic filtering
  - Maintain existing response format
  - _Requirements: 4.1, 4.5, 3.3_

- [ ] 6.2 Write property test for query result format
  - **Property 4: Query Result Format Consistency**
  - Verify database query results match mock data structure
  - **Validates: Requirements 3.3**

- [ ] 6.3 Write property test for serialization round trip
  - **Property 3: Serialization Round Trip**
  - Test JSON serialization/deserialization preserves all fields
  - **Validates: Requirements 2.5, 2.6**

- [ ] 6.4 Add create API handler for ConfigCenter
  - Create `apps/admin/server/api/dev-team/config-manage/center/create.post.ts`
  - Implement database insert operation
  - Return created record
  - _Requirements: 4.2_

- [ ] 6.5 Add update API handler for ConfigCenter
  - Create `apps/admin/server/api/dev-team/config-manage/center/update.post.ts`
  - Implement database update operation
  - Return updated record
  - _Requirements: 4.3_

- [ ] 6.6 Add delete API handler for ConfigCenter
  - Create `apps/admin/server/api/dev-team/config-manage/center/delete.post.ts`
  - Implement database delete operation
  - Return success status
  - _Requirements: 4.4_

- [ ] 6.7 Write property test for CRUD operations
  - **Property 7: CRUD Operation Integrity**
  - Test create makes record retrievable
  - Test update persists changes
  - Test delete removes record
  - **Validates: Requirements 4.2, 4.3, 4.4**

## 7. Checkpoint - Verify API Functionality

- [ ] 7. Checkpoint - Make sure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## 8. Configure Neon MCP

- [ ] 8.1 Create MCP configuration file
  - Create `.kiro/settings/mcp.json` if not exists
  - Add Neon MCP server configuration
  - Configure environment variable for NEON_API_KEY
  - _Requirements: 5.1_

- [ ] 8.2 Document MCP usage
  - Add instructions for obtaining Neon API key
  - Document available MCP capabilities (schema inspection, SQL execution)
  - _Requirements: 5.2, 5.3_

## 9. Add npm Scripts for Database Operations

- [ ] 9.1 Add database scripts to package.json
  - Add `db:generate` script for migration generation
  - Add `db:push` script for applying migrations
  - Add `db:seed` script for seeding data
  - Add `db:studio` script for Drizzle Studio
  - _Requirements: 2.3, 2.4, 3.2_

## 10. Final Checkpoint - Complete Integration Verification

- [ ] 10. Final Checkpoint - Make sure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
