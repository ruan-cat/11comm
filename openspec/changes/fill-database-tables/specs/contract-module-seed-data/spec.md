## ADDED Requirements

### Requirement: Generate mock data for all module tables

The system SHALL generate mock data for all tables in the respective module with appropriate data volumes and valid foreign key relationships.

#### Scenario: Generate module data

- **WHEN** generate-seed-sql script is executed for the module
- **THEN** system SHALL create the specified number of records for each table

#### Scenario: Maintain foreign key integrity

- **WHEN** dependent table data is generated
- **THEN** system SHALL ensure all foreign keys reference existing records

### Requirement: Use IdMapRegistry for ID management

The system SHALL use IdMapRegistry to manage ID mappings for all tables in the module.

#### Scenario: Register primary keys

- **WHEN** table data is generated
- **THEN** system SHALL register each record's ID in IdMapRegistry

#### Scenario: Resolve foreign key references

- **WHEN** dependent tables are generated
- **THEN** system SHALL resolve foreign keys using IdMapRegistry.get()
