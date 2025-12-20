CREATE TABLE sticker_book_items (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    user_prize_id UUID NOT NULL,
    position_x INTEGER NOT NULL DEFAULT 0,
    position_y INTEGER NOT NULL DEFAULT 0,
    scale DECIMAL(5, 2) NOT NULL DEFAULT 1.00,
    rotation DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    CONSTRAINT sticker_book_items_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT sticker_book_items_user_prize_id_foreign FOREIGN KEY (user_prize_id) REFERENCES user_prizes (id) ON DELETE CASCADE,
    CONSTRAINT sticker_book_items_user_prize_id_unique UNIQUE (user_prize_id)
);

CREATE INDEX sticker_book_items_user_id_index ON sticker_book_items (user_id);
