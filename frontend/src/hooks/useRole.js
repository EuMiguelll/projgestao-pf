import { useAuth0 } from '@auth0/auth0-react';
import { config } from '../config.js';

export function useRole() {
  const { user } = useAuth0();
  const raw = user?.[config.auth0.rolesClaim];
  const roles = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return {
    roles,
    isAdmin: roles.includes('ADMIN'),
    isUser: roles.includes('USER'),
    primaryRole: roles.includes('ADMIN') ? 'ADMIN' : roles.includes('USER') ? 'USER' : null,
  };
}
