CREATE TABLE trade_requests (
    id CHAR(36) NOT NULL,
    sender_id CHAR(36) NOT NULL,
    receiver_id CHAR(36),
    status VARCHAR(255) NOT NULL,
    message TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_trade_requests_sender_id FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE
);
CREATE INDEX trade_requests_status_index ON trade_requests (status);
