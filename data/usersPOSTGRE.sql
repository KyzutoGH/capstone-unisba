-- ENUM untuk role
CREATE TYPE user_role AS ENUM ('admin', 'teacher');

-- Tabel users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'teacher',
  profile_picture VARCHAR(255),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- Data awal
INSERT INTO users (id, name, email, password, role, profile_picture, active, created_at, updated_at) VALUES
(1, 'Test User', 'test@example.com', '$2b$10$y1sIf0YOyS/dzhVCCkPHAu7B2JXMYDEVd1kLBSkE2MwagbefWmFH.', 'admin', NULL, TRUE, '2025-05-22 07:15:20', '2025-05-22 07:15:20'),
(2, 'JIHAN KHANSA', 'ji@gmail.com', '$2b$10$fUneMcTeAFKTHNxQ2Mx5AufiwqevnVG3h/JvmUfPOQDLSJfX9XHMG', 'teacher', NULL, TRUE, '2025-05-22 09:14:28', '2025-05-22 09:14:28'),
(3, 'Test User', 'testuser@example.com', '$2b$10$ZA8UwJCfgtqljRsHWeoYreo0lqwEBfm7zAx/xCSPjgJxqeZ7YQX/e', 'teacher', NULL, TRUE, '2025-05-25 11:26:51', '2025-05-25 11:26:51');
