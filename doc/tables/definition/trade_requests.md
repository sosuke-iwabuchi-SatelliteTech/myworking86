# trade_requests

トレード申請を管理するテーブル

| Column | Type | Nullable | Description |
|---|---|---|---|
| id | CHAR(36) | NO | プライマリキー (UUID) |
| sender_id | CHAR(36) | NO | 申請者のユーザーID |
| receiver_id | CHAR(36) | YES | 受信者のユーザーID (NULL可) |
| status | VARCHAR(255) | NO | ステータス (pending, accepted, rejected, cancelled, completed) |
| message | TEXT | YES | 申請メッセージ |
| created_at | TIMESTAMP | YES | 作成日時 |
| updated_at | TIMESTAMP | YES | 更新日時 |

## Indexes
- PRIMARY: id
- INDEX: status
- FOREIGN: sender_id -> users(id)
