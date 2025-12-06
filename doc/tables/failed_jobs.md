# failed_jobs (失敗したジョブ)

失敗したキュージョブの情報を記録します。

| 論理名 | 物理名 | 型 | Nullable | Key | 説明 |
| --- | --- | --- | --- | --- | --- |
| ID | id | BIGINT | No | PK | ID (Auto Increment) |
| UUID | uuid | VARCHAR(255) | No | UK | ユニークID |
| 接続 | connection | TEXT | No | | |
| キュー | queue | TEXT | No | | |
| ペイロード | payload | LONGTEXT | No | | |
| 例外 | exception | LONGTEXT | No | | エラー詳細 |
| 失敗日時 | failed_at | TIMESTAMP | No | | |
