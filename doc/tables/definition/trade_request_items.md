# trade_request_items

トレード対象のアイテムを管理するテーブル

| Column | Type | Nullable | Description |
|---|---|---|---|
| id | CHAR(36) | NO | プライマリキー (UUID) |
| trade_request_id | CHAR(36) | NO | トレードリクエストID |
| user_prize_id | CHAR(36) | NO | ユーザー所持景品ID |
| owner_id | CHAR(36) | NO | アイテムの所有者ID (申請時点) |
| type | VARCHAR(255) | NO | アイテムタイプ (offer, request) |
| created_at | TIMESTAMP | YES | 作成日時 |
| updated_at | TIMESTAMP | YES | 更新日時 |

## Indexes
- PRIMARY: id
- FOREIGN: trade_request_id -> trade_requests(id)
- FOREIGN: user_prize_id -> user_prizes(id)
