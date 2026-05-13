import { Router } from 'express';
import { pool } from '../db.js';
import { checkJwt, requireRole, adminEmail } from '../auth.js';
import { HttpError } from '../errors.js';

const router = Router();

const STATUSES = new Set(['DISPONIVEL', 'CANCELADO']);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function mapRow(row) {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    instructor_name: row.instructor_name,
    registered_at: row.registered_at,
    status: row.status,
    admin_email: row.admin_email,
  };
}

function asString(value, field, { min = 1, max = Infinity } = {}) {
  if (typeof value !== 'string') {
    throw new HttpError(400, 'BAD_REQUEST', `Field "${field}" must be a string`);
  }
  const trimmed = value.trim();
  if (trimmed.length < min) {
    throw new HttpError(400, 'BAD_REQUEST', `Field "${field}" is required`);
  }
  if (trimmed.length > max) {
    throw new HttpError(400, 'BAD_REQUEST', `Field "${field}" must be at most ${max} chars`);
  }
  return trimmed;
}

// GET /courses - ADMIN or USER
router.get('/', checkJwt, requireRole('ADMIN', 'USER'), async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, code, name, instructor_name, registered_at, status, admin_email
       FROM courses
       ORDER BY registered_at DESC`,
    );
    res.json(rows.map(mapRow));
  } catch (err) {
    next(err);
  }
});

// POST /courses - ADMIN
router.post('/', checkJwt, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const body = req.body || {};
    const code = asString(body.code, 'code', { max: 32 }).toUpperCase();
    const name = asString(body.name, 'name', { max: 200 });
    const instructor_name = asString(body.instructor_name, 'instructor_name', { max: 200 });

    let status = 'DISPONIVEL';
    if (body.status !== undefined && body.status !== null && body.status !== '') {
      if (typeof body.status !== 'string' || !STATUSES.has(body.status)) {
        throw new HttpError(400, 'BAD_REQUEST', `Field "status" must be one of: DISPONIVEL, CANCELADO`);
      }
      status = body.status;
    }

    const email = adminEmail(req);
    if (!email) {
      throw new HttpError(
        400,
        'MISSING_EMAIL_CLAIM',
        'Admin email not present in access token. Configure the Auth0 Action to include the email claim.',
      );
    }

    const { rows } = await pool.query(
      `INSERT INTO courses (code, name, instructor_name, status, admin_email)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, code, name, instructor_name, registered_at, status, admin_email`,
      [code, name, instructor_name, status, email],
    );

    res.status(201).json(mapRow(rows[0]));
  } catch (err) {
    next(err);
  }
});

// DELETE /courses/:id - ADMIN
router.delete('/:id', checkJwt, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!UUID_RE.test(id)) {
      throw new HttpError(400, 'BAD_REQUEST', 'Invalid id format (UUID expected)');
    }
    const result = await pool.query('DELETE FROM courses WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new HttpError(404, 'NOT_FOUND', 'Course not found');
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
