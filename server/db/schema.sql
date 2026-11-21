-- ỌMA Good Care schema. Safe to run more than once.

CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name     TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'patient'
                CHECK (role IN ('patient', 'staff', 'admin')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Emails are unique regardless of letter case.
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON users (lower(email));

CREATE TABLE IF NOT EXISTS departments (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  description TEXT,
  active      BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS bookings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  department_id INTEGER NOT NULL REFERENCES departments (id),
  booking_date  DATE NOT NULL,
  queue_number  INTEGER NOT NULL,
  status        TEXT NOT NULL DEFAULT 'waiting'
                CHECK (status IN ('waiting', 'called', 'done', 'cancelled', 'no_show')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- One queue number per department per day.
  UNIQUE (department_id, booking_date, queue_number)
);

CREATE INDEX IF NOT EXISTS bookings_patient_idx ON bookings (patient_id);
CREATE INDEX IF NOT EXISTS bookings_queue_idx ON bookings (department_id, booking_date, status);
