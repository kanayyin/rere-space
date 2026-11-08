import { useState } from 'react';

export function useAction(fn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function run(...args) {
    setLoading(true);
    setError(null);
    try {
      const data = await fn(...args);
      return { ok: true, data };
    } catch (err) {
      setError(err);
      return { ok: false, error: err };
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, run, clearError: () => setError(null) };
}
