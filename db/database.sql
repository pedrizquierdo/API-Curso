Creación de tabla usuarios

CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, password) VALUES
('Test User', 'test@example.com', 'password123'),
('Jane Doe', 'jane@example.com', 'password456'),
('John Smith', 'john@example.com', 'password789');

CREATE INDEX idx_email ON users(email);

SELECT name, email FROM users;

SELECT name, email FROM users WHERE is_visible = TRUE;