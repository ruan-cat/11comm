## ADDED Requirements

### Requirement: Generate mock data for dev module tables

The system SHALL generate mock data for all 9 tables in the dev module (dt_dictionaries, dt_cache_configs, dt_config_types, dt_configs, dt_config_items, dt_menu_groups, dt_menu_catalogs, dt_menu_items, dt_dictionary_items).

#### Scenario: Generate dictionary data

- **WHEN** generate-seed-sql script is executed for dev module
- **THEN** system SHALL create 20-30 dictionary entries with valid types and values

#### Scenario: Generate cache config data

- **WHEN** generate-seed-sql script is executed for dev module
- **THEN** system SHALL create 10-15 cache configuration entries with valid keys and TTL values

#### Scenario: Generate menu structure data

- **WHEN** generate-seed-sql script is executed for dev module
- **THEN** system SHALL create a complete menu hierarchy with groups, catalogs, and items

### Requirement: Maintain data consistency in dev module

The system SHALL ensure all foreign key relationships are valid within the dev module.

#### Scenario: Dictionary items reference valid dictionaries

- **WHEN** dictionary items are generated
- **THEN** each item SHALL reference an existing dictionary via foreign key

#### Scenario: Config items reference valid configs

- **WHEN** config items are generated
- **THEN** each item SHALL reference an existing config via foreign key

### Requirement: Use IdMapRegistry for ID management

The system SHALL use IdMapRegistry to manage ID mappings for dev module tables.

#### Scenario: Register dictionary IDs

- **WHEN** dictionary data is generated
- **THEN** system SHALL register each dictionary ID in IdMapRegistry

#### Scenario: Resolve foreign key references

- **WHEN** dependent tables are generated
- **THEN** system SHALL resolve foreign keys using IdMapRegistry.get()
