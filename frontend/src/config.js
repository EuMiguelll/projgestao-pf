function required(value, name) {
  if (!value) {
    const msg = `[config] Missing required env var ${name}. Did you set it before building?`;
    if (typeof window !== 'undefined') {
      console.error(msg);
    }
    return '';
  }
  return value;
}

export const config = {
  auth0: {
    domain: required(import.meta.env.VITE_AUTH0_DOMAIN, 'VITE_AUTH0_DOMAIN'),
    clientId: required(import.meta.env.VITE_AUTH0_CLIENT_ID, 'VITE_AUTH0_CLIENT_ID'),
    audience: required(import.meta.env.VITE_AUTH0_AUDIENCE, 'VITE_AUTH0_AUDIENCE'),
    rolesClaim: import.meta.env.VITE_AUTH0_ROLES_CLAIM || 'https://projgestao-pf/roles',
    emailClaim: import.meta.env.VITE_AUTH0_EMAIL_CLAIM || 'https://projgestao-pf/email',
  },
  apiUrl: required(import.meta.env.VITE_API_URL, 'VITE_API_URL'),
};
