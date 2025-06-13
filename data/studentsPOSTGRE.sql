-- ENUM untuk gender
CREATE TYPE gender_enum AS ENUM ('male', 'female');

-- Tabel students
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  student_id VARCHAR(255) NOT NULL UNIQUE,
  gender gender_enum NOT NULL,
  date_of_birth DATE NOT NULL,
  grade VARCHAR(255) NOT NULL,
  class VARCHAR(255) NOT NULL,
  photo VARCHAR(255),
  user_id INTEGER NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Data awal
INSERT INTO students (id, name, student_id, gender, date_of_birth, grade, class, photo, user_id, active, created_at, updated_at) VALUES
(2, 'alif', '12333', 'male', '2025-05-20', 'XII', 'C', NULL, 2, TRUE, '2025-05-23 09:02:17', '2025-05-23 09:02:17');
