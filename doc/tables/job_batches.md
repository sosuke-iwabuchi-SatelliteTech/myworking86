# job_batches (ジョブバッチ)

ジョブのバッチ処理の状態を管理します。

| 論理名 | 物理名 | 型 | Nullable | Key | 説明 |
| --- | --- | --- | --- | --- | --- |
| ID | id | VARCHAR(255) | No | PK | バッチID |
| 名前 | name | VARCHAR(255) | No | | バッチ名 |
| 総ジョブ数 | total_jobs | INTEGER | No | | |
| 待機ジョブ数 | pending_jobs | INTEGER | No | | |
| 失敗ジョブ数 | failed_jobs | INTEGER | No | | |
| 失敗ジョブID一覧 | failed_job_ids | LONGTEXT | No | | |
| オプション | options | MEDIUMTEXT | Yes | | |
| キャンセル日時 | cancelled_at | INTEGER | Yes | | Unix Timestamp |
| 作成日時 | created_at | INTEGER | No | | Unix Timestamp |
| 完了日時 | finished_at | INTEGER | Yes | | Unix Timestamp |
