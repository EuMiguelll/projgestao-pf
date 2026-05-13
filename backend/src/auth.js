import { auth } from 'express-oauth2-jwt-bearer';

const {
  AUTH0_DOMAIN,
  AUTH0_AUDIENCE,
  AUTH0_ROLES_CLAIM = 'https://projgestao-pf/roles',
  AUTH0_EMAIL_CLAIM = 'https://projgestao-pf/email',
} = process.env;

if (!AUTH0_DOMAIN || !AUTH0_AUDIENCE) {
  throw new Error('AUTH0_DOMAIN and AUTH0_AUDIENCE are required');
}

export const checkJwt = auth({
  audience: AUTH0_AUDIENCE,
  issuerBaseURL: `https://${AUTH0_DOMAIN}/`,
  tokenSigningAlg: 'RS256',
});

function rolesFromAuth(req) {
  const payload = req.auth?.payload || {};
  const claim = payload[AUTH0_ROLES_CLAIM];
  if (Array.isArray(claim)) return claim;
  if (typeof claim === 'string') return [claim];
  return [];
}

export function requireRole(...allowed) {
  return (req, res, next) => {
    const roles = rolesFromAuth(req);
    const ok = roles.some((r) => allowed.includes(r));
    if (!ok) {
      return res.status(403).json({
        error: { code: 'FORBIDDEN', message: `Requires one of roles: ${allowed.join(', ')}` },
      });
    }
    req.userRoles = roles;
    next();
  };
}

export function adminEmail(req) {
  const payload = req.auth?.payload || {};
  return payload[AUTH0_EMAIL_CLAIM] || payload.email || null;
}
