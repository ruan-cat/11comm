## ADDED Requirements

### Requirement: Generate mock data for community module tables

The system SHALL generate mock data for all 6 tables in the community module (cm_communities, cm_notices, cm_handing_business, cm_house_decorations, cm_property_registers, cm_building_structures).

#### Scenario: Generate community basic data

- **WHEN** generate-seed-sql script is executed for community module
- **THEN** system SHALL create 2-3 community entries with complete information

#### Scenario: Generate community notices

- **WHEN** generate-seed-sql script is executed for community module
- **THEN** system SHALL create 10-20 notice entries linked to valid communities

#### Scenario: Generate building structures

- **WHEN** generate-seed-sql script is executed for community module
- **THEN** system SHALL create building structure data linked to valid communities

### Requirement: Maintain community data hierarchy

The system SHALL ensure community-related data follows the correct hierarchy (community → building → unit).

#### Scenario: Buildings reference valid communities

- **WHEN** building structure data is generated
- **THEN** each building SHALL reference an existing community via foreign key

#### Scenario: Property registers reference valid communities

- **WHEN** property register data is generated
- **THEN** each register SHALL reference an existing community via foreign key

### Requirement: Use IdMapRegistry for community module

The system SHALL use IdMapRegistry to manage ID mappings for community module tables.

#### Scenario: Register community IDs

- **WHEN** community data is generated
- **THEN** system SHALL register each community ID in IdMapRegistry

#### Scenario: Resolve community references

- **WHEN** dependent tables are generated
- **THEN** system SHALL resolve community foreign keys using IdMapRegistry.get()
