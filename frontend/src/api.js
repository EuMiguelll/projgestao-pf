import { useCallback, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { config } from './config.js';

export class ApiError extends Error {
  constructor(status, code, message, payload) {
    super(message);
    this.status = status;
    this.code = code;
    this.payload = payload;
  }
}

async function parseError(res) {
  let body = null;
  try {
    body = await res.json();
  } catch {
    // ignore
  }
  const code = body?.error?.code || `HTTP_${res.status}`;
  const message =
    body?.error?.message ||
    (res.status === 401
      ? 'Sessão expirada. Faça login novamente.'
      : res.status === 403
      ? 'Você não tem permissão para esta ação.'
      : `Erro ${res.status}`);
  return new ApiError(res.status, code, message, body);
}

export function useApi() {
  const { getAccessTokenSilently } = useAuth0();

  const request = useCallback(
    async (path, { method = 'GET', body } = {}) => {
      const token = await getAccessTokenSilently({
        authorizationParams: { audience: config.auth0.audience },
      });
      const res = await fetch(`${config.apiUrl}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) throw await parseError(res);
      if (res.status === 204) return null;
      return res.json();
    },
    [getAccessTokenSilently],
  );

  return useMemo(
    () => ({
      listCourses: () => request('/courses'),
      createCourse: (data) => request('/courses', { method: 'POST', body: data }),
      deleteCourse: (id) => request(`/courses/${id}`, { method: 'DELETE' }),
    }),
    [request],
  );
}
