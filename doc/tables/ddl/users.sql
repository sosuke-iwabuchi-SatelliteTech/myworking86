CREATE TABLE users (
    id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    email_verified_at TIMESTAMP,
    password VARCHAR(255),
    role VARCHAR(255) NOT NULL DEFAULT 'user',
    remember_token VARCHAR(100),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    two_factor_secret TEXT,
    two_factor_recovery_codes TEXT,
    two_factor_confirmed_at TIMESTAMP,
    grade INTEGER,
    last_login_at TIMESTAMP,
    PRIMARY KEY (id)
);
