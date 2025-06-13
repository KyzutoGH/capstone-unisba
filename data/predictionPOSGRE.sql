-- ENUM untuk prediction_status
CREATE TYPE prediction_status_enum AS ENUM ('success', 'at_risk', 'fail');

-- Tabel predictions
CREATE TABLE predictions (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  hours_studied REAL NOT NULL,
  attendance REAL NOT NULL,
  extracurricular_activities BOOLEAN NOT NULL,
  sleep_hours REAL NOT NULL,
  previous_scores REAL NOT NULL,
  motivation_level INTEGER NOT NULL,
  tutoring_sessions INTEGER NOT NULL,
  teacher_quality INTEGER NOT NULL,
  physical_activity INTEGER NOT NULL,
  learning_disabilities BOOLEAN NOT NULL,
  exam_score REAL,
  prediction_score REAL,
  prediction_status prediction_status_enum,
  intervention_recommendations TEXT,
  semester VARCHAR(255) NOT NULL,
  academic_year VARCHAR(255) NOT NULL,
  prediction_date TIMESTAMP,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE ON UPDATE CASCADE
);
