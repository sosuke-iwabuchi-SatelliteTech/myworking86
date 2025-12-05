# cache_locks (キャッシュロック)

キャッシュの原子的な操作（ロック）を管理します。

| 論理名 | 物理名 | 型 | Nullable | Key | 説明 |
| --- | --- | --- | --- | --- | --- |
| キー | key | VARCHAR(255) | No | PK | ロックキー |
| 所有者 | owner | VARCHAR(255) | No | | ロック所有者ID |
| 有効期限 | expiration | INTEGER | No | | Unix Timestamp |
