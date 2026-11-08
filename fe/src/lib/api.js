const BASE = `${import.meta.env.VITE_API_URL || ''}/api`;

async function request(method, path, body, signal) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(json.error?.message || 'Terjadi kesalahan.');
    err.status = res.status;
    err.code = json.error?.code;
    throw err;
  }
  return json.data;
}

export const api = {
  get: (path, signal) => request('GET', path, null, signal),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path) => request('DELETE', path),
};
