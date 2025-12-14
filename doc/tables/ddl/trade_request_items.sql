CREATE TABLE trade_request_items (
    id CHAR(36) NOT NULL,
    trade_request_id CHAR(36) NOT NULL,
    user_prize_id CHAR(36) NOT NULL,
    owner_id CHAR(36) NOT NULL,
    type VARCHAR(255) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_trade_request_items_trade_request_id FOREIGN KEY (trade_request_id) REFERENCES trade_requests (id) ON DELETE CASCADE,
    CONSTRAINT fk_trade_request_items_user_prize_id FOREIGN KEY (user_prize_id) REFERENCES user_prizes (id) ON DELETE CASCADE
);
