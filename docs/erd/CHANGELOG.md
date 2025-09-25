# BossOS ERD Changelog  

This file tracks all schema/ERD changes.  
- **MAJOR** = Breaking change (removes/renames tables or columns, changes data types in a breaking way).  
- **MINOR** = Additive or non-breaking change (new table, new column, new relation).  
- Each entry should link to the migration ID (or PR) that introduced it.  

---

## [v1.0.0] – 2025-09-25  
**Initial schema draft (MVP nucleus)**  
- Added table: `org` (organization-level settings).  
- Added table: `profile` (user profiles linked to org).  
- Added table: `customer` (customer records linked to org).  
- Added table: `address` (addresses linked to customers).  
- Added table: `job` (jobs linked to customers + addresses).  
- Defined primary keys and foreign keys across Org/Identity, Customers, and Jobs.  
- Published first master ERD (`bossos_master_v1.0.svg`).  

---

### Guidelines for Adding Entries
1. Bump version (semantic).  
   - `MAJOR.MINOR.PATCH` (PATCH optional, usually not tracked unless for typos/doc fixes).  
2. Date stamp the entry.  
3. Summarize **what changed** (tables/columns/relations).  
4. Include migration ID or PR link.  
5. Export and commit updated ERD (`.svg`, `.pdf`).  
