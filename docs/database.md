# Database ER Diagram (Mermaid)

This file contains an ER diagram (Mermaid format) generated from the TypeORM entities in this project (`User`, `Transfer`).

Render with Mermaid (e.g., VS Code Mermaid preview or mermaid.live).

```mermaid
erDiagram
  USERS {
    uuid id PK
    string email
    string password
    string firstname
    string lastname
    string phone
    date birthday
    int points
  }

  POINT_TRANSFERS {
    uuid id PK
    uuid from_user_id FK
    uuid to_user_id FK
    int amount
    datetime createdAt
  }

  %% Relations
  USERS ||--o{ POINT_TRANSFERS : "transfers_from"
  USERS ||--o{ POINT_TRANSFERS : "transfers_to"
```

Notes
- `USERS` corresponds to the `users` table from `src/users/user.entity.ts`.
- `POINT_TRANSFERS` corresponds to the `point_transfers` table from `src/transfer/transfer.entity.ts`.
- The `from_user_id` and `to_user_id` columns are foreign keys referencing `USERS.id`.
- Use this diagram as a quick reference for database relationships. For production use, generate canonical schema from migrations or the database itself.
