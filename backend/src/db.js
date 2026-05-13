import pg from 'pg';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
});

pool.on('error', (err) => {
  console.error('Unexpected idle pg client error', err);
});

const INIT_SQL = `
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  CREATE TYPE course_status AS ENUM ('DISPONIVEL', 'CANCELADO');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS courses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            VARCHAR(32)  NOT NULL UNIQUE,
  name            VARCHAR(200) NOT NULL,
  instructor_name VARCHAR(200) NOT NULL,
  registered_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  status          course_status NOT NULL DEFAULT 'DISPONIVEL',
  admin_email     VARCHAR(255) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_registered_at ON courses(registered_at DESC);
`;

export async function initSchema({ retries = 20, delayMs = 1500 } = {}) {
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await pool.query(INIT_SQL);
      console.log('[db] schema ready');
      return;
    } catch (err) {
      lastErr = err;
      console.warn(`[db] init attempt ${attempt}/${retries} failed: ${err.code || err.message}`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
}
