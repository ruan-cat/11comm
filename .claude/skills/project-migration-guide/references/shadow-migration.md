# Shadow Migration Strategy Reference

This reference documents the "Shadow Migration" strategy for database schema migration. This strategy ensures zero-downtime and safe transitions by "adding only" before "switching over".

## Workflow

The migration MUST follow this sequence:
**Duplicate → Verify → Use New → Switch Config → Refactor → Cleanup**

1.  **Duplicate**: Create the new schema file in `apps/type` mirroring the old one in `apps/admin`.
2.  **Verify**: Ensure the new schema is exported and types align.
3.  **Use New**: Start using the new schema in new code.
4.  **Switch Config**: Update `drizzle.config.ts` and `db/index.ts` to point to `apps/type` ONLY when all modules are ready.
5.  **Refactor**: Update old code to use the new schema.
6.  **Cleanup**: Delete old schema files.

## Detailed Scenarios

### Single Module Migration

1.  **Source**: `apps/admin/server/db/schemas/<module>.ts`
2.  **Target**: `apps/type/src/business/<domain>/<module>/schema.ts`
3.  **Action**: Copy `pgTable`, add Zod Schemas (`createInsertSchema`, etc.), inferred Types.
4.  **Export**: Add to `index.ts`.
5.  **Conflict**: Remove conflicting manual interfaces.

### Global Switch Phase

Triggered when **ALL** modules are migrated.

1.  **Switch DB Connection**: Update `apps/admin/server/db/index.ts` to import from `@01s-11comm/type`.
2.  **Update Config**: Point `drizzle.config.ts` to the new schema path.
3.  **Drift Check**: Run `drizzle-kit check`. MUST return "No changes detected".
    - If drift detected: Fix `apps/type` definitions to match DB.
    - Repeat until clean.

### Cleanup Phase

1.  **Delete**: Remove `apps/admin/server/db/schemas/`.
2.  **Search & Replace**: Replace all imports of old paths with `@01s-11comm/type`.
