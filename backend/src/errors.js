export class HttpError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function notFound(_req, res) {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
}

export function errorHandler(err, req, res, _next) {
  if (res.headersSent) return;

  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  }

  // express-oauth2-jwt-bearer errors
  if (err.name === 'UnauthorizedError' || err.status === 401) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: err.message || 'Invalid or missing token' },
    });
  }

  // pg unique_violation
  if (err.code === '23505') {
    return res.status(409).json({
      error: { code: 'CONFLICT', message: 'Resource with this unique field already exists' },
    });
  }

  // pg invalid_text_representation (bad UUID, bad enum, etc.)
  if (err.code === '22P02') {
    return res.status(400).json({
      error: { code: 'BAD_REQUEST', message: 'Invalid input format' },
    });
  }

  console.error('[error]', req.method, req.originalUrl, err);
  res.status(500).json({ error: { code: 'INTERNAL', message: 'Internal server error' } });
}
