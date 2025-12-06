# jobs (ジョブ)

Laravelのキューシステムで使用されるジョブ情報を管理します。

| 論理名 | 物理名 | 型 | Nullable | Key | 説明 |
| --- | --- | --- | --- | --- | --- |
| ID | id | BIGINT | No | PK | ID (Auto Increment) |
| キュー名 | queue | VARCHAR(255) | No | IDX | |
| ペイロード | payload | LONGTEXT | No | | ジョブデータ |
| 試行回数 | attempts | TINYINT | No | | |
| 予約日時 | reserved_at | INTEGER | Yes | | Unix Timestamp |
| 利用可能日時 | available_at | INTEGER | No | | Unix Timestamp |
| 作成日時 | created_at | INTEGER | No | | Unix Timestamp |
