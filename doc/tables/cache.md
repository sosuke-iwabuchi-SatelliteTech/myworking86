# cache (キャッシュ)

キャッシュデータをデータベースに保存する場合に使用します。

| 論理名 | 物理名 | 型 | Nullable | Key | 説明 |
| --- | --- | --- | --- | --- | --- |
| キー | key | VARCHAR(255) | No | PK | キャッシュキー |
| 値 | value | MEDIUMTEXT | No | | キャッシュデータ |
| 有効期限 | expiration | INTEGER | No | | Unix Timestamp |
