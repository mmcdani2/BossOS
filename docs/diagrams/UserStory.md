```mermaid
erDiagram

    ORGANIZATION ||--o{ LOCATION : has
    ORGANIZATION ||--o{ USER : employs
    ORGANIZATION ||--o{ INVENTORY_ITEM : owns
    ORGANIZATION ||--o{ PRICEBOOK_ITEM : defines

    LOCATION ||--o{ JOB : schedules
    LOCATION ||--o{ INVENTORY_ITEM : stores

    USER ||--o{ JOB : assigned
    USER }o--o{ ROLE : has
    USER ||--o{ MESSAGE : sends

    JOB ||--o{ ESTIMATE : originates
    JOB ||--o{ INVOICE : generates
    JOB ||--o{ CHECKLIST : requires
    JOB ||--o{ MESSAGE : contains

    ESTIMATE ||--|| INVOICE : converts

    INVENTORY_ITEM ||--o{ JOB_USAGE : consumed_in
    JOB ||--o{ JOB_USAGE : tracks

    CUSTOMER_PORTAL ||--o{ USER : represents
    CUSTOMER_PORTAL ||--o{ JOB : views

    ORGANIZATION {
        uuid id
        string name
        string plan_tier
    }

    LOCATION {
        uuid id
        string name
        string address
    }

    USER {
        uuid id
        string name
        string email
        uuid role_id
    }

    ROLE {
        uuid id
        string name
        jsonb permissions
    }

    JOB {
        uuid id
        uuid location_id
        uuid tech_id
        string status
        timestamp start_time
        timestamp end_time
    }

    ESTIMATE {
        uuid id
        uuid job_id
        decimal total
        jsonb line_items
        string status
    }

    INVOICE {
        uuid id
        uuid job_id
        decimal total
        string status
    }

    INVENTORY_ITEM {
        uuid id
        string sku
        string description
        int quantity
        uuid location_id
        decimal unit_cost
    }

    JOB_USAGE {
        uuid id
        uuid job_id
        uuid inventory_item_id
        int quantity_used
    }

    PRICEBOOK_ITEM {
        uuid id
        string category
        string description
        decimal labor_rate
        decimal material_cost
    }

    CHECKLIST {
        uuid id
        uuid job_id
        jsonb items
        boolean completed
    }

    MESSAGE {
        uuid id
        uuid job_id
        uuid sender_id
        text content
        string channel
    }
